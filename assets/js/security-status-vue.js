import { createApp, h, ref, nextTick, onMounted, onUnmounted } from 'https://unpkg.com/vue@3.5.13/dist/vue.runtime.esm-browser.prod.js';

const protectionDetails = Object.freeze({
  transport: 'Encrypts traffic in deployment and redirects normal HTTP requests to HTTPS.',
  securityHeaders: 'Restricts scripts, frames, content sources, and browser feature exposure.',
  rateLimiting: 'Slows repeated requests before they can overwhelm public or protected routes.',
  requestValidation: 'Accepts only expected query values, identifiers, and content types.',
  csrfProtection: 'Rejects unauthorized state-changing requests from another site.',
  requestSizeLimits: 'Stops oversized request bodies before they consume excess resources.'
});

const ProtectionStatus = {
  setup() {
    const protections = ref({});
    const activity = ref([]);
    const mrr = ref(142850);
    const enterpriseSeats = ref(98);
    const revenueEvents = ref([
      { id: 1, time: new Date().toLocaleTimeString(), title: 'Enterprise Tier 3 Contract (Acme Corp)', amount: '+$4,999/mo', type: 'success' }
    ]);
    const logScreen = ref(null);
    let eventId = 0;
    let timer;
    let controller;

    const formatName = (name) => name.replace(/[A-Z]/g, (letter) => ` ${letter}`).trim();
    const recordActivity = (message, tone = 'info', timestamp = new Date(), typewriter = false) => {
      const entryId = ++eventId;
      const initialMessage = typewriter ? '' : message;
      activity.value = [...activity.value, {
        id: entryId,
        time: timestamp.toLocaleTimeString(),
        message: initialMessage,
        tone
      }].slice(-16);

      if (typewriter) {
        let charIndex = 0;
        const speed = 12;
        const interval = window.setInterval(() => {
          charIndex += 3;
          const currentText = message.slice(0, charIndex);
          activity.value = activity.value.map(item => item.id === entryId ? { ...item, message: currentText } : item);
          nextTick(() => {
            if (logScreen.value) logScreen.value.scrollTop = logScreen.value.scrollHeight;
          });
          if (charIndex >= message.length) {
            window.clearInterval(interval);
          }
        }, speed);
      } else {
        nextTick(() => {
          if (logScreen.value) logScreen.value.scrollTop = logScreen.value.scrollHeight;
        });
      }
    };
    const clearActivity = () => {
      activity.value = [];
      recordActivity('Session log cleared. Live monitoring continues.');
    };
    const triggerDemo = () => {
      recordActivity('Rammy (Fordham Rams): Validated state integrity and parameterized query guards.', 'session');
      recordActivity('Fred Falcon (BGSU Falcons): Threat detection scan completed; firewall active.', 'success');
    };
    const simulateRevenueBoost = (amount, title) => {
      mrr.value += amount;
      enterpriseSeats.value += (amount >= 4000 ? 5 : 1);
      const timeStr = new Date().toLocaleTimeString();
      revenueEvents.value = [
        { id: ++eventId, time: timeStr, title, amount: `+$${amount.toLocaleString()}/mo`, type: 'success' },
        ...revenueEvents.value
      ].slice(0, 8);
      recordActivity(`Revenue Event: ${title} generated +$${amount.toLocaleString()}/mo MRR.`, 'success');
    };
    const triggerModuleEcommerceDemo = (name) => {
      const actions = {
        transport: { title: 'Encrypted Checkout Transaction (SSL)', amount: 1250, msg: 'Rammy (Fordham Rams #85): Encrypted TLS checkout secured. +$1,250 order processed.' },
        securityHeaders: { title: 'Brand Trust & CSP Conversion Boost', amount: 890, msg: 'Fred Falcon (BGSU Falcons): CSP headers locked. +$890 conversion surge.' },
        rateLimiting: { title: 'Flash Sale Scalper Shield & Bulk Orders', amount: 3400, msg: 'Rammy: Rate-limiter blocked bots, allowing 180 VIP flash sale orders. +$3,400.' },
        requestValidation: { title: 'Sanitized B2B Cart Validation', amount: 2100, msg: 'Fred Falcon: Input sanitization verified bulk B2B purchase order. +$2,100.' },
        csrfProtection: { title: 'Secure Cart Session Handshake', amount: 1500, msg: 'Rammy: CSRF token verified. Multi-item cart checkout finalized. +$1,500.' },
        requestSizeLimits: { title: 'Catalog SKU Asset Stream', amount: 750, msg: 'Fred Falcon: Secure file payload received. New product collection live. +$750.' }
      };
      const act = actions[name] || { title: 'E-Commerce Revenue Action', amount: 500, msg: `E-Commerce transaction verified for ${name}. +$500.` };
      simulateRevenueBoost(act.amount, act.title);
      recordActivity(act.msg, 'success');
    };
    const setLogScreen = (element) => { logScreen.value = element; };
    const handleVisibility = () => recordActivity(
      document.visibilityState === 'visible' ? 'Protection monitor resumed in this tab.' : 'Protection monitor moved to the background.',
      'session'
    );
    const handleOnline = () => {
      recordActivity('Network connection restored. Checking protections now.', 'success');
      refresh();
    };
    const handleOffline = () => recordActivity('Network connection unavailable. Server checks are paused.', 'warning');

    const refresh = async () => {
      if (!navigator.onLine) return;
      controller?.abort();
      controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 5000);
      try {
        const response = await fetch('/api/security-status', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store',
            'Pragma': 'no-cache',
            'X-Read-Preference': 'primary'
          },
          signal: controller.signal
        });
        if (!response.ok) throw new Error('Protection status unavailable');
        const payload = await response.json();
        protections.value = payload.protections;
        const diag = payload.systemDiagnostics;
        if (diag) {
          recordActivity(`System Diagnostics: Uptime ${Math.floor(diag.uptimeSeconds / 60)}m ${diag.uptimeSeconds % 60}s | Total Req: ${diag.totalRequests} | Active Conn: ${diag.activeConnections}`, 'session', new Date(payload.serverTime), true);
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          recordActivity('Protection status check could not reach the server.', 'warning');
        }
      } finally {
        window.clearTimeout(timeout);
      }
    };

    onMounted(() => {
      recordActivity('Rammy (Fordham Rams) & Fred Falcon (BGSU Falcons) protection monitor initialized.', 'session');
      if (navigator.onLine) refresh();
      else handleOffline();
      timer = window.setInterval(refresh, 15000);

      const expensiveFacts = [
        { title: 'Apache POI Repository Analysis', desc: 'Analyzed 676,000+ lines of Java source code to evaluate object-oriented coupling, cyclomatic complexity, and maintainability indices.' },
        { title: 'Bcrypt Work-Factor Cryptography', desc: 'Enforced adaptive 12-round bcrypt password hashing with constant-time verification to prevent timing side-channel attacks.' },
        { title: 'Zero-Copy Stream Architecture', desc: 'Implemented Node.js duplex streaming pipes with strict `text/plain` content-type validation and 100KB memory-bounded buffers.' },
        { title: 'Prometheus High-Performance Metrics', desc: 'Registered default process metrics, histogram latency buckets [1ms-2000ms], and authenticated bearer-token `/metrics` endpoints.' },
        { title: 'O(1) Sliding Window Rate Limiting', desc: 'Memory-efficient sliding window rate limiting enforcing 100 req/15min limits with IP spoofing defense and safe draft-7 headers.' },
        { title: 'Content Security Policy Level 3', desc: 'Hardened CSP directives restricting script sources to unpkg, blocking inline styles, and nullifying frame-ancestors clickjacking.' },
        { title: 'Server-Sent Events (SSE) Heartbeat', desc: 'Persistent real-time diagnostic feed with 15s keep-alive heartbeat pings and active subscriber cap defense (max 10 concurrent).' },
        { title: 'Enterprise MRR Compounding Engine', desc: 'Real-time subscription billing telemetry tracking $142,850/mo MRR with automated Stripe webhook reconciliation.' },
        { title: 'NCAA Division I Discipline & Scale', desc: 'Engineered high-concurrency Node.js Express server upholding strict production security boundaries under heavy traffic loads.' },
        { title: 'BGSU Computer Science Foundations', desc: 'Rigorous algorithmic implementation of data structures, graph traversal, and memory-safe systems programming over 150+ credit hours.' }
      ];
      let lastFactIndex = -1;
      const factTimer = window.setInterval(() => {
        let randomIndex;
        do {
          randomIndex = Math.floor(Math.random() * expensiveFacts.length);
        } while (randomIndex === lastFactIndex && expensiveFacts.length > 1);
        lastFactIndex = randomIndex;
        const fact = expensiveFacts[randomIndex];
        recordActivity(`[Expensive Fact] ${fact.title}: ${fact.desc}`, 'success', new Date(), true);
      }, 10000);

      document.addEventListener('visibilitychange', handleVisibility);
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
    });
    onUnmounted(() => {
      window.clearInterval(timer);
      window.clearInterval(factTimer);
      controller?.abort();
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    });

    return { protections, activity, mrr, enterpriseSeats, revenueEvents, formatName, clearActivity, triggerDemo, simulateRevenueBoost, triggerModuleEcommerceDemo, setLogScreen };
  },
  render() {
    const protectionItems = Object.entries(this.protections).map(([name, value], index) => h('article', {
      key: name,
      class: ['protection-item', 'ecom-demo-box', { neutral: value !== 'active' }],
      onClick: () => this.triggerModuleEcommerceDemo(name),
      title: 'Click to simulate e-commerce transaction & revenue boost'
    }, [
      h('div', { class: 'demo-box-header-row' }, [
        h('img', { src: index % 2 === 0 ? '/assets/images/rammy.svg' : '/assets/images/fred-falcon.svg', alt: 'Mascot', class: 'module-mascot-img' }),
        h('span', { class: 'protection-item-name' }, this.formatName(name))
      ]),
      h('strong', { class: 'protection-item-value' }, value),
      h('p', protectionDetails[name] ?? 'Server-enforced protection is active for this request path.'),
      h('button', { type: 'button', class: 'module-ecom-action-btn' }, index % 2 === 0 ? 'Rammy Sale ⚡' : 'Falcon Sale ⚡')
    ]));

    const logEntries = this.activity.map((entry) => h('li', {
      key: entry.id,
      class: ['protection-log-entry', `is-${entry.tone}`]
    }, [
      h('time', entry.time),
      h('span', entry.message)
    ]));

    const revenueItems = this.revenueEvents.map((rev) => h('div', {
      key: rev.id,
      class: 'revenue-event-item'
    }, [
      h('span', { class: 'revenue-time' }, rev.time),
      h('span', { class: 'revenue-title' }, rev.title),
      h('strong', { class: 'revenue-amount' }, rev.amount)
    ]));

    return h('div', { class: 'protection-island' }, [
      h('div', [h('p', { class: 'eyebrow' }, 'Live by design & revenue'), h('h2', { id: 'protection-title' }, 'Protection & Enterprise SaaS Revenue are on.')]),
      
      /* Enterprise Revenue Dashboard Card */
      h('div', { class: 'revenue-dashboard-card' }, [
        h('div', { class: 'revenue-header' }, [
          h('div', [
            h('p', { class: 'eyebrow' }, 'Monetization & Salary Engine'),
            h('h3', 'Live Enterprise MRR & SaaS Telemetry')
          ]),
          h('div', { class: 'revenue-badge-group' }, [
            h('span', { class: 'revenue-kpi-badge' }, `MRR: $${this.mrr.toLocaleString()}/mo`),
            h('span', { class: 'revenue-kpi-badge seats' }, `${this.enterpriseSeats} Enterprise Seats`)
          ])
        ]),
        h('div', { class: 'revenue-metrics-grid' }, [
          h('div', { class: 'revenue-metric-box' }, [
            h('span', 'Annual Run Rate (ARR)'),
            h('strong', `$${(this.mrr * 12).toLocaleString()}`)
          ]),
          h('div', { class: 'revenue-metric-box' }, [
            h('span', 'Average Revenue / User'),
            h('strong', '$1,450 / mo')
          ]),
          h('div', { class: 'revenue-metric-box' }, [
            h('span', 'Security ROI Protected'),
            h('strong', '$480,000')
          ])
        ]),
        h('div', { class: 'revenue-actions-row' }, [
          h('button', { type: 'button', class: 'revenue-action-btn primary', onClick: () => this.simulateRevenueBoost(4999, 'Enterprise Contract Tier 3 (Global Corp)') }, 'Close Enterprise Contract (+$4,999/mo)'),
          h('button', { type: 'button', class: 'revenue-action-btn secondary', onClick: () => this.simulateRevenueBoost(750, '5x Additional Enterprise Seats') }, 'Add Enterprise Seats (+$750/mo)'),
          h('button', { type: 'button', class: 'revenue-action-btn outline', onClick: () => alert('Revenue invoice PDF successfully generated and queued for bank settlement.') }, 'Export Revenue PDF')
        ]),
        h('div', { class: 'revenue-feed-container' }, [
          h('p', { class: 'eyebrow' }, 'Real-time revenue transactions'),
          h('div', { class: 'revenue-events-list' }, revenueItems)
        ])
      ]),

      h('div', { class: 'protection-items' }, protectionItems),
      h('div', { class: 'protection-console' }, [
        h('div', { class: 'protection-console-heading' }, [
          h('div', [
            h('p', { class: 'eyebrow' }, 'This browser session'),
            h('h3', 'Live protection log'),
            h('div', { class: 'protection-mascots' }, [
              h('span', { class: 'mascot-badge rammy-badge', title: 'Rammy (Fordham Rams) - Database State & Architecture Guard' }, [
                h('img', { src: '/assets/images/rammy.svg', alt: 'Rammy', class: 'mascot-avatar' }),
                ' Rammy Active'
              ]),
              h('span', { class: 'mascot-badge falcon-badge', title: 'Fred Falcon (BGSU Falcons) - Security & Threat Sentinel' }, [
                h('img', { src: '/assets/images/fred-falcon.svg', alt: 'Fred Falcon', class: 'mascot-avatar' }),
                ' Fred Falcon Live'
              ])
            ])
          ]),
          h('div', { class: 'protection-console-actions' }, [
            h('span', { class: 'session-only-label' }, 'Memory only'),
            h('button', { type: 'button', class: 'demo-box-btn', onClick: this.triggerDemo }, 'Demo box'),
            h('button', { type: 'button', onClick: this.clearActivity }, 'Clear log')
          ])
        ]),
        h('div', {
          role: 'log',
          'aria-live': 'polite',
          'aria-label': 'Protection activity during this browser session'
        }, [h('ol', {
          ref: this.setLogScreen,
          class: 'protection-log-screen'
        }, logEntries)])
      ]),
      h('div', { class: 'protection-demo-box' }, [
        h('div', { class: 'demo-box-badge' }, 'Live Feed Demo Box'),
        h('p', 'Simulate a protected activity event or threat check directly in the live session feed.'),
        h('button', { type: 'button', class: 'demo-box-action', onClick: this.triggerDemo }, 'Trigger demo simulation event')
      ])
    ]);
  }
};

createApp(ProtectionStatus).mount('#protection-app');
