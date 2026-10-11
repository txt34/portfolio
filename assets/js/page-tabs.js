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

    window.requestAnimationFrame(() => {
      allSections.forEach(sec => {
        if (activeSections.includes(sec)) {
          sec.style.display = '';
          sec.style.opacity = '1';
          sec.style.visibility = 'visible';
          sec.style.pointerEvents = 'auto';
        } else {
          sec.style.opacity = '0';
          sec.style.visibility = 'hidden';
          sec.style.pointerEvents = 'none';
          window.setTimeout(() => {
            if (sec.style.opacity === '0') {
              sec.style.display = 'none';
            }
          }, 250);
        }
      });
    });

    try {
      window.sessionStorage.setItem('active_tab', targetTab);
    } catch {}
  }

  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;
    const href = anchor.getAttribute('href');
    if (!href || href === '#') return;

    const targetEl = document.querySelector(href);
    if (!targetEl) return;

    for (const [tabKey, sections] of Object.entries(tabMap)) {
      if (sections.includes(targetEl) || sections.some(s => s?.contains(targetEl))) {
        e.preventDefault();
        activateTab(tabKey);
        targetEl.scrollIntoView({ behavior: 'smooth' });
        window.history.pushState(null, '', href);
        break;
      }
    }
  });

  tabButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetTab = btn.getAttribute('data-tab-target');
      activateTab(targetTab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  let initialTab = 'tab-overview';
  try {
    const stored = window.sessionStorage.getItem('active_tab');
    if (stored && tabMap[stored]) initialTab = stored;
  } catch {}

  if (window.location.hash) {
    const hashEl = document.querySelector(window.location.hash);
    if (hashEl) {
      for (const [tabKey, sections] of Object.entries(tabMap)) {
        if (sections.includes(hashEl) || sections.some(s => s?.contains(hashEl))) {
          initialTab = tabKey;
          break;
        }
      }
    }
  }

  activateTab(initialTab);
}
