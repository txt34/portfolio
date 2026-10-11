export function initPageTabs() {
  const tabButtons = document.querySelectorAll('[data-tab-target]');
  if (tabButtons.length === 0) return;

  const discoverSec = document.getElementById('discover');
  const marqueeSec = document.getElementById('marquee');
  const aboutSec = document.getElementById('about');
  const collectionsSec = document.getElementById('collections');
  const protectionSec = document.getElementById('protection-app');
  const mascotSec = document.getElementById('mascots');
  const consoleSec = document.querySelector('.cursor-console');

  const tabMap = {
    'tab-overview': [discoverSec, marqueeSec, aboutSec],
    'tab-projects': [collectionsSec],
    'tab-security': [protectionSec],
    'tab-celestial': [mascotSec],
    'tab-console': [consoleSec]
  };

  const allSections = [discoverSec, marqueeSec, aboutSec, collectionsSec, protectionSec, mascotSec, consoleSec].filter(Boolean);

  tabButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetTab = btn.getAttribute('data-tab-target');

      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const visibleSections = tabMap[targetTab] || allSections;

      allSections.forEach(sec => {
        if (visibleSections.includes(sec)) {
          sec.style.display = '';
          sec.style.opacity = '1';
        } else {
          sec.style.display = 'none';
        }
      });

      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}
