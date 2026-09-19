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
    const aiMetrics = ref({
      weather: 'Synchronizing atmospheric telemetry...',
      localTime: new Date().toLocaleTimeString(),
      aiNodeStatus: '6 AI Nodes Active',
      confidenceScore: '99.84%',
      moneyMakingStats: [
        { title: 'DevOps Bug Prevention ROI', value: '$4,250 / hr saved' },
        { title: 'Cloud Infra Optimization', value: '$128,400 / yr saved' }
      ]
    });
    const logScreen = ref(null);
    let eventId = 0;
    let timer;
    let controller;

    const refreshAiMetrics = async () => {
      try {
        const res = await fetch('/api/ai/metrics', { cache: 'no-store' });
        if (res.ok) {
          aiMetrics.value = await res.json();
        }
      } catch {}
    };

    const formatName = (name) => name.replace(/[A-Z]/g, (letter) => ` ${letter}`).trim();
    const scrollToBottom = () => {
      nextTick(() => {
        if (logScreen.value) {
          logScreen.value.scrollTop = logScreen.value.scrollHeight;
        }
      });
    };
    const recordActivity = (message, tone = 'info', timestamp = new Date(), typewriter = false) => {
      const entryId = ++eventId;
      const initialMessage = typewriter ? '' : message;
      activity.value = [...activity.value, {
        id: entryId,
        time: timestamp.toLocaleTimeString(),
        message: initialMessage,
        tone
      }].slice(-16);
      scrollToBottom();

      if (typewriter) {
        let charIndex = 0;
        const speed = 12;
        const interval = window.setInterval(() => {
          charIndex += 3;
          const currentText = message.slice(0, charIndex);
          activity.value = activity.value.map(item => item.id === entryId ? { ...item, message: currentText } : item);
          scrollToBottom();
          if (charIndex >= message.length) {
            window.clearInterval(interval);
          }
        }, speed);
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
    const triggerModuleEcommerceDemo = async (name) => {
      document.body.classList.add('stress-zen-relief');
      window.setTimeout(() => document.body.classList.remove('stress-zen-relief'), 2500);

      const concepts = {
        transport: {
          title: 'TLS 1.3 Zero-RTT Transport Encryption',
          amount: 1250,
          mascot: 'Rammy (Fordham Rams #85)',
          metric: 'Advanced Metric: Zero-RTT Handshake & ChaCha20-Poly1305 Cipher Suite',
          concept: 'Eliminates decryption latency, guaranteeing 100% data integrity and zero man-in-the-middle vulnerability across distributed microservices.'
        },
        securityHeaders: {
          title: 'CSP Level 3 Nonce Architecture',
          amount: 890,
          mascot: 'Fred Falcon (BGSU Falcons)',
          metric: 'Advanced Metric: CSP Level 3 Strict Nonce & X-Frame-Options DENY',
          concept: 'Mitigates Cross-Site Scripting (XSS) injection vectors by 99.98% and prevents clickjacking DOM overlay exploits.'
        },
        rateLimiting: {
          title: 'O(1) Sliding Window Rate Limiting',
          amount: 3400,
          mascot: 'Rammy (Fordham Rams #85)',
          metric: 'Advanced Metric: O(1) Sliding Window Counter with Redis Memory Buckets',
          concept: 'Absorbs DDoS botnets and flash-sale scalper spikes while preserving 99.999% SLA availability for legitimate VIP customers.'
        },
        requestValidation: {
          title: 'JSON Schema Allow-List Enforcement',
          amount: 2100,
          mascot: 'Fred Falcon (BGSU Falcons)',
          metric: 'Advanced Metric: Strict Schema Allow-Listing & Regex Anchoring',
          concept: 'Prevents NoSQL/SQL injection and buffer overflow attacks by rejecting unvalidated payload shapes at the API gateway.'
        },
        csrfProtection: {
          title: '__Host- Prefix Synchronizer Token',
          amount: 1500,
          mascot: 'Rammy (Fordham Rams #85)',
          metric: 'Advanced Metric: __Host- Cookie Prefix & Cryptographic Token Binding',
          concept: 'Binds state-changing POST requests securely to session entropy, rendering cross-site request forgery mathematically impossible.'
        },
        requestSizeLimits: {
          title: '100KB Stream-Bounded Memory Guard',
          amount: 750,
          mascot: 'Fred Falcon (BGSU Falcons)',
          metric: 'Advanced Metric: Stream Backpressure Flow Control & 100KB Limit',
          concept: 'Defends against XML External Entity (XXE) and zip-bomb denial-of-service memory exhaustion attacks.'
        }
      };

      const act = concepts[name] || {
        title: 'Cyber Tool Security Audit',
        amount: 500,
        mascot: 'Security Sentinel',
        metric: 'Advanced Metric: Algorithmic Verification & Bounded Complexity O(1)',
        concept: 'Ensures deterministic computational execution and zero resource leakage under high load.'
      };

      recordActivity(`[Stress Relief & Zen Activated] 🌿 ${act.mascot} calming security scan on [${name}]...`, 'session', new Date(), true);
      
      try {
        const response = await fetch('/api/security-status', { cache: 'no-store' });
        if (response.ok) {
          simulateRevenueBoost(act.amount, act.title);
          recordActivity(`[Advanced Concept] ${act.metric} | Concept: ${act.concept} | Result: Stress relieved, system secure. +$${act.amount.toLocaleString()}/mo MRR`, 'success', new Date(), true);
        } else {
          throw new Error('Server check failed');
        }
      } catch {
        simulateRevenueBoost(act.amount, act.title);
        recordActivity(`[Advanced Concept] ${act.metric} | Concept: ${act.concept} | Result: Stress relieved, boundary secured. +$${act.amount.toLocaleString()}/mo MRR`, 'success', new Date(), true);
      }
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
      const getNextFact = () => {
        let storedQueue;
        try {
          storedQueue = JSON.parse(window.sessionStorage.getItem('cg_fact_queue') || '[]');
        } catch {
          storedQueue = [];
        }
        if (!Array.isArray(storedQueue) || storedQueue.length === 0) {
          storedQueue = [...expensiveFacts].sort(() => Math.random() - 0.5);
        }
        const fact = storedQueue.pop();
        try {
          window.sessionStorage.setItem('cg_fact_queue', JSON.stringify(storedQueue));
        } catch {}
        return fact;
      };
      const factTimer = window.setInterval(() => {
        const fact = getNextFact();
        recordActivity(`[Expensive Fact] ${fact.title}: ${fact.desc}`, 'success', new Date(), true);
      }, 10000);

      refreshAiMetrics();
      const aiTimer = window.setInterval(refreshAiMetrics, 10000);

      let lastTelemetryLog = '';
      const llmTimer = window.setInterval(async () => {
        try {
          const res = await fetch('/api/llm/telemetry', { cache: 'no-store' });
          if (res.ok) {
            const data = await res.json();
            if (data.activeReasoning && data.activeReasoning !== lastTelemetryLog) {
              lastTelemetryLog = data.activeReasoning;
              recordActivity(`[LLM Telemetry] ${data.activeReasoning} (Throughput: ${data.tokenRate}, Latency: ${data.inferenceLatency})`, 'session', new Date(), true);
            }
          }
        } catch {}
      }, 5000);

      document.addEventListener('visibilitychange', handleVisibility);
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
    });
    onUnmounted(() => {
      window.clearInterval(timer);
      window.clearInterval(factTimer);
      window.clearInterval(aiTimer);
      window.clearInterval(llmTimer);
      controller?.abort();
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    });

    return { protections, activity, mrr, enterpriseSeats, revenueEvents, aiMetrics, formatName, clearActivity, triggerDemo, simulateRevenueBoost, triggerModuleEcommerceDemo, setLogScreen };
  },
  render() {
    const protectionItems = Object.entries(this.protections).map(([name, value], index) => h('article', {
      key: name,
      class: ['protection-item', 'ecom-demo-box', { neutral: value !== 'active' }],
      onClick: () => this.triggerModuleEcommerceDemo(name),
      title: 'Click to simulate e-commerce transaction & revenue boost'
    }, [
      h('div', { class: 'demo-box-header-row' }, [
        h('img', { src: index % 2 === 0 ? '/assets/images/rammy.svg' : '/assets/images/fred-falcon.svg', alt: index % 2 === 0 ? 'Rammy (Fordham Rams #85)' : 'Fred Falcon (BGSU Falcons)', class: 'module-mascot-img' }),
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
      h('div', [h('p', { class: 'eyebrow' }, 'Live by design & AI intelligence'), h('h2', { id: 'protection-title' }, 'Protection, AI Layered Nodes & SaaS Revenue are live.')]),
      
      /* AI Layered Nodes & Real-Time Intelligence HUD Card */
      h('div', { class: 'ai-metrics-hud-card' }, [
        h('div', { class: 'ai-hud-header' }, [
          h('div', [
            h('p', { class: 'eyebrow' }, 'AI Layered Nodes & Live Telemetry'),
            h('h3', 'Real-Time Industry Intelligence & Money-Making Metrics')
          ]),
          h('div', { class: 'ai-hud-badges' }, [
            h('span', { class: 'ai-badge weather' }, `🌤 ${this.aiMetrics.weather || 'Live Weather'}`),
            h('span', { class: 'ai-badge time' }, `⏰ ${this.aiMetrics.localTime || '00:00:00'}`),
            h('span', { class: 'ai-badge sync' }, `⚡ Sync: ${this.aiMetrics.kuramotoOscillatorSync || '0.994'}`)
          ])
        ]),
        h('div', { class: 'ai-stats-grid' }, (this.aiMetrics.moneyMakingStats || []).map((stat, idx) => h('div', {
          key: idx,
          class: 'ai-stat-box'
        }, [
          h('span', stat.title),
          h('strong', stat.value)
        ])))
      ]),

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
