const assert=require('node:assert/strict');
const fs=require('fs');
const {calculate,init}=require('../js/widget.js');
const base={destination:'lisbon',days:'5',people:'2',level:'standard',excursions:false};
const results=[];
function check(name,input,expected){const r=calculate(input);if(typeof expected==='number'){assert.equal(r.ok,true);assert.equal(r.total,expected);}else{assert.equal(r.ok,false);assert.ok(r.errors[expected]);}results.push({name,input,actual:r,pass:true});}
check('Базовий розрахунок Лісабон',base,750);
check('Екскурсії для двох',{...base,excursions:true},840);
check('Один день без ночівлі',{...base,days:'1'},130);
check('Непарна кількість людей',{...base,people:'3'},1335);
check('Комфортний рівень',{...base,level:'comfort'},890);
check('Мараккеш',{...base,destination:'marrakech'},640);
for(const [name,v] of [['Порожнє поле',''],['Нуль','0'],['Від’ємне','-5'],['Дріб','2.5'],['Текст','abc'],['Спецсимволи','$%^'],['Завелике','999999999999999999'],['Infinity',Infinity],['NaN',NaN],['Експонента','1e2']])check(name,{...base,days:v},'days');
check('Порожня кількість людей',{...base,people:''},'people');
check('Понад 10 осіб',{...base,people:'11'},'people');
check('Невідоме місто',{...base,destination:'unknown'},'destination');
check('Небезпечний ключ',{...base,destination:'__proto__'},'destination');
check('Невідомий рівень',{...base,level:'invalid'},'level');
check('Некоректний прапорець',{...base,excursions:'yes'},'excursions');
assert.equal(calculate(null).ok,false);assert.equal(init(null),false);assert.equal(init({querySelector:()=>null}),false);
results.push({name:'Відсутні DOM-елементи',pass:true});
let count=0;
for(const destination of ['kyoto','lisbon','bali','dolomites','reykjavik','marrakech'])for(const level of ['budget','standard','comfort'])for(let days=1;days<=30;days++)for(let people=1;people<=10;people++)for(const excursions of [false,true]){let r=calculate({destination,level,days,people,excursions});assert.equal(r.ok,true);assert.ok(Number.isFinite(r.total)&&r.total>0);assert.equal(r.total,r.accommodation+r.food+r.transport+r.excursions);count++;}
for(let i=0;i<1000;i++)assert.equal(calculate(base).total,750);

console.log('PASS:',results.length,'test cases;',count,'valid combinations; 1000 repeat calculations.');
