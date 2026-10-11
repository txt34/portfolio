export function initPageTabs() {
  const tabButtons = document.querySelectorAll('[data-tab-target]');
  if (tabButtons.length === 0) return;

  const discoverSec = document.getElementById('discover');
  const aboutSec = document.getElementById('about');
  const marqueeSec = document.getElementById('marquee');
  const protectionSec = document.getElementById('protection-app');
  const collectionsSec = document.getElementById('collections');
  const mascotSec = document.getElementById('mascots');
  const consoleSec = document.querySelector('.cursor-console');

  const tabMap = {
    'tab-overview': [discoverSec, aboutSec],
    'tab-feed': [marqueeSec],
    'tab-security': [protectionSec],
    'tab-projects': [collectionsSec],
    'tab-console': [consoleSec, mascotSec]
  };

  const allSections = [discoverSec, aboutSec, marqueeSec, protectionSec, collectionsSec, mascotSec, consoleSec].filter(Boolean);

  function activateTab(targetTab) {
    tabButtons.forEach(b => {
      const isMatch = b.getAttribute('data-tab-target') === targetTab;
      b.classList.toggle('active', isMatch);
    });

    const activeSections = tabMap[targetTab] || allSections;

    allSections.forEach(sec => {
      if (activeSections.includes(sec)) {
        sec.style.display = '';
        sec.style.opacity = '1';
        sec.style.visibility = 'visible';
      } else {
        sec.style.display = 'none';
        sec.style.opacity = '0';
        sec.style.visibility = 'hidden';
      }
    });

    try {
      window.sessionStorage.setItem('active_tab', targetTab);
    } catch {}

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  tabButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetTab = btn.getAttribute('data-tab-target');
      activateTab(targetTab);
    });
  });

  let initialTab = 'tab-overview';
  try {
    const stored = window.sessionStorage.getItem('active_tab');
    if (stored && tabMap[stored]) initialTab = stored;
  } catch {}
  activateTab(initialTab);
}
