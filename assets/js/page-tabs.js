export function initBytePieceFeature() {
  const bytes = [
    { title: 'Zero-Copy Stream Duplexing', code: 'const stream = fs.createReadStream(path);\nstream.pipe(res);', desc: 'Bypasses userspace memory buffers to stream large assets at maximum hardware throughput.' },
    { title: 'Adaptive 12-Round Bcrypt', code: 'const hash = await bcrypt.hash(pass, 12);\nconst match = await bcrypt.compare(pass, hash);', desc: 'Enforces constant-time cryptographic verification against timing side-channel attacks.' },
    { title: 'O(1) Sliding Window Rate Limit', code: 'if (store.hits[ip] > max) return res.status(429).send();', desc: 'Absorbs DDoS botnets while maintaining 99.999% SLA availability for VIP traffic.' },
    { title: 'CSP Nonce Architecture', code: "res.setHeader('Content-Security-Policy', `script-src 'nonce-${nonce}'`);", desc: 'Nullifies XSS injection vectors by requiring cryptographic nonces for script execution.' }
  ];

  const titleEl = document.querySelector('[data-byte-title]');
  const codeEl = document.querySelector('[data-byte-code]');
  const descEl = document.querySelector('[data-byte-desc]');
  const nextBtn = document.querySelector('[data-byte-next]');

  if (!titleEl || !codeEl || !descEl || !nextBtn) return;

  let idx = 0;
  const renderByte = () => {
    const b = bytes[idx];
    titleEl.textContent = b.title;
    codeEl.textContent = b.code;
    descEl.textContent = b.desc;
    idx = (idx + 1) % bytes.length;
  };

  renderByte();
  nextBtn.addEventListener('click', (e) => {
    e.preventDefault();
    renderByte();
  });
}

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
  initBytePieceFeature();
}
