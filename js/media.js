// CDN libraries are loaded before this file; initialize after the HTML is ready.
document.addEventListener('DOMContentLoaded', () => {
  const root = document.querySelector('.reviews-swiper');
  const pause = document.querySelector('.reviews-pause');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (root && typeof Swiper !== 'undefined') {
    const slider = new Swiper(root, {
      loop: true,
      slidesPerView: 1,
      spaceBetween: 24,
      speed: reducedMotion.matches ? 0 : 500,
      autoplay: reducedMotion.matches ? false : {
        delay: 3500, disableOnInteraction: false, pauseOnMouseEnter: true,
      },
      pagination: { el: '.reviews-pagination', clickable: true },
      navigation: { prevEl: '.reviews-prev', nextEl: '.reviews-next' },
      keyboard: { enabled: true, onlyInViewport: true },
      a11y: {
        prevSlideMessage: 'Попередній відгук', nextSlideMessage: 'Наступний відгук',
        paginationBulletMessage: 'Перейти до відгуку {{index}}',
      },
      breakpoints: { 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } },
    });
    let stopped = reducedMotion.matches;
    const updateButton = () => {
      pause.textContent = stopped ? 'Продовжити' : 'Призупинити';
      pause.setAttribute('aria-pressed', String(stopped));
    };
    pause.addEventListener('click', () => {
      stopped = !stopped;
      if (stopped) slider.autoplay.stop();
      else { slider.params.autoplay = { delay: 3500, disableOnInteraction: false, pauseOnMouseEnter: true }; slider.autoplay.start(); }
      updateButton();
    });
    // Allow keyboard users to read without automatic slide changes.
    root.addEventListener('focusin', () => slider.autoplay.stop());
    root.addEventListener('focusout', () => { if (!stopped) slider.autoplay.start(); });
    updateButton();
  } else if (pause) {
    document.querySelector('.media-controls').hidden = true;
  }
  if (typeof Fancybox !== 'undefined') {
    Fancybox.bind('[data-fancybox="destinations"]', {
      Carousel: { transition: 'fade' },
      Images: { Panzoom: { maxScale: 3 } },
      Thumbs: { autoStart: false },
      Toolbar: { display: { left: ['infobar'], middle: [], right: ['zoomIn', 'zoomOut', 'toggle1to1', 'close'] } },
      l10n: { CLOSE: 'Закрити', NEXT: 'Наступне фото', PREV: 'Попереднє фото' },
    });
  }
});
