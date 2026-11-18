/* WanderMatch trip estimate. Tariffs are educational examples, not live offers. */
(function () {
  'use strict';
  const tariffs = Object.freeze({
    kyoto: { name: 'Кіото', room: 90, food: 35, transport: 70 },
    lisbon: { name: 'Лісабон', room: 70, food: 25, transport: 40 },
    bali: { name: 'Балі', room: 50, food: 20, transport: 50 },
    dolomites: { name: 'Доломіти', room: 100, food: 35, transport: 80 },
    reykjavik: { name: 'Рейк’явік', room: 120, food: 45, transport: 90 },
    marrakech: { name: 'Мараккеш', room: 60, food: 20, transport: 40 },
  });
  const levels = Object.freeze({ budget: 1, standard: 1.5, comfort: 2 });

  function integer(value, min, max, label) {
    const raw = String(value ?? '').trim();
    if (!raw) return { error: `Вкажи ${label}.` };
    const number = Number(raw);
    if (!Number.isFinite(number) || !/^\d+$/.test(raw) || !Number.isInteger(number)) {
      return { error: `Введи ціле число від ${min} до ${max}.` };
    }
    if (number < min || number > max) return { error: `Допустиме значення: від ${min} до ${max}.` };
    return { value: number };
  }

  // Pure function: validate first, calculate only known and finite values.
  function calculate(input = {}) {
    if (!input || typeof input !== 'object') input = {};
    const errors = {};
    const days = integer(input.days, 1, 30, 'кількість днів');
    const people = integer(input.people, 1, 10, 'кількість мандрівників');
    if (days.error) errors.days = days.error;
    if (people.error) errors.people = people.error;
    if (!Object.hasOwn(tariffs, input.destination)) errors.destination = 'Обери напрямок зі списку.';
    if (!Object.hasOwn(levels, input.level)) errors.level = 'Обери рівень проживання зі списку.';
    if (typeof input.excursions !== 'boolean') errors.excursions = 'Перевір вибір екскурсій.';
    if (Object.keys(errors).length) return { ok: false, errors };
    const rate = tariffs[input.destination];
    const nights = days.value - 1;
    const rooms = Math.ceil(people.value / 2);
    const accommodation = nights * rooms * rate.room * levels[input.level];
    const food = days.value * people.value * rate.food;
    const transport = people.value * rate.transport;
    const excursions = input.excursions ? people.value * 45 : 0;
    const total = accommodation + food + transport + excursions;
    if (!Number.isFinite(total) || total <= 0) return { ok: false, errors: { days: 'Перевір параметри подорожі.' } };
    return { ok: true, destination: rate.name, nights, rooms, people: people.value,
      accommodation, food, transport, excursions, total, perPerson: total / people.value };
  }

  const initialized = new WeakSet();
  function init(root) {
    if (!root || initialized.has(root)) return false;
    const form = root.querySelector('form');
    const names = ['destination', 'days', 'people', 'level', 'excursions'];
    const fields = Object.fromEntries(names.map(name => [name, root.querySelector(`[name="${name}"]`)]));
    const outputs = ['total', 'perPerson', 'accommodation', 'food', 'transport', 'excursions', 'summary'];
    const slots = Object.fromEntries(outputs.map(name => [name, root.querySelector(`[data-result="${name}"]`)]));
    const status = root.querySelector('[data-widget-status]');
    const errors = Object.fromEntries(names.map(name => [name, root.querySelector(`[data-error="${name}"]`)]));
    // An incomplete widget must not break the navigation, forms or other widgets.
    if (!form || !status || [...Object.values(fields), ...Object.values(slots), ...Object.values(errors)].some(el => !el)) {
      if (status) status.textContent = 'Калькулятор тимчасово недоступний. Онови сторінку.';
      return false;
    }
    initialized.add(root);
    const money = new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'EUR', maximumFractionDigits: 2 });
    function update() {
      const input = Object.fromEntries(names.map(name => [name, name === 'excursions' ? fields[name].checked : fields[name].value]));
      const result = calculate(input);
      for (const name of names) {
        const message = result.errors?.[name] || '';
        errors[name].textContent = message;
        fields[name].setAttribute('aria-invalid', String(Boolean(message)));
        fields[name].classList.toggle('border-red-600', Boolean(message));
      }
      if (!result.ok) {
        for (const name of outputs) slots[name].textContent = name === 'summary' ? 'Виправ позначені поля для розрахунку.' : '—';
        status.textContent = 'Розрахунок призупинено: перевір позначені поля.';
        return;
      }
      for (const name of outputs.filter(name => name !== 'summary')) slots[name].textContent = money.format(result[name]);
      slots.summary.textContent = `${result.destination} · ${input.days} дн. · ${result.nights} ноч. · ${result.people} ос. · ${result.rooms} номер(и)`;
      status.textContent = 'Орієнтовну вартість оновлено.';
    }
    form.addEventListener('input', update);
    form.addEventListener('change', update);
    form.addEventListener('submit', event => event.preventDefault());
    // Reset means a fresh, empty estimate rather than the demo defaults.
    form.addEventListener('reset', event => {
      event.preventDefault();
      for (const name of names) {
        if (name === 'excursions') fields[name].checked = false;
        else fields[name].value = '';
        fields[name].setAttribute('aria-invalid', 'false');
        fields[name].classList.toggle('border-red-600', false);
        errors[name].textContent = '';
      }
      for (const name of outputs) slots[name].textContent = name === 'summary'
        ? 'Обери параметри для нового розрахунку.' : '—';
      status.textContent = 'Параметри очищено. Заповни поля для розрахунку.';
    });
    update();
    return true;
  }
  if (typeof module === 'object' && module.exports) module.exports = { calculate, init };
  if (typeof document !== 'undefined') {
    const boot = () => document.querySelectorAll('[data-trip-widget]').forEach(init);
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
    else boot();
  }
})();
