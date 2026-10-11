export function initCommercialDeck() {
  const deck = document.querySelector('[data-commercial-deck]');
  if (!deck) return;

  const slides = deck.querySelectorAll('.commercial-slide');
  const dots = deck.querySelectorAll('.commercial-dots .dot');
  const prevBtn = deck.querySelector('[data-commercial-prev]');
  const nextBtn = deck.querySelector('[data-commercial-next]');
  const toggleBtn = deck.querySelector('[data-commercial-toggle]');
  const render4kBtn = deck.querySelector('[data-render-4k]');

  if (slides.length === 0) return;

  let currentSlide = 0;
  let isPlaying = true;
  let slideInterval = window.setInterval(nextSlide, 5000);

  function showSlide(index) {
    slides.forEach((s, i) => s.classList.toggle('active', i === index));
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
    currentSlide = index;
  }

  function nextSlide() {
    showSlide((currentSlide + 1) % slides.length);
  }

  function prevSlide() {
    showSlide((currentSlide - 1 + slides.length) % slides.length);
  }

  function resetTimer() {
    window.clearInterval(slideInterval);
    if (isPlaying) {
      slideInterval = window.setInterval(nextSlide, 5000);
    }
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      prevSlide();
      resetTimer();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      nextSlide();
      resetTimer();
    });
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      isPlaying = !isPlaying;
      toggleBtn.textContent = isPlaying ? '❚❚' : '▶';
      if (isPlaying) {
        slideInterval = window.setInterval(nextSlide, 5000);
      } else {
        window.clearInterval(slideInterval);
      }
    });
  }

  if (render4kBtn) {
    render4kBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (typeof window.renderCelestial4KFrame === 'function') {
        window.renderCelestial4KFrame();
      } else {
        alert('4K celestial render engine is initializing...');
      }
    });
  }

  dots.forEach((dot, index) => {
    dot.addEventListener('click', (e) => {
      e.preventDefault();
      showSlide(index);
      resetTimer();
    });
  });
}
