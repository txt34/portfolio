import { createApp, h, ref, computed, nextTick, onMounted, onUnmounted } from 'https://unpkg.com/vue@3.5.13/dist/vue.runtime.esm-browser.prod.js';

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
    const status = ref('starting');
    const serverTime = ref('');
    const protections = ref({});
    const activity = ref([]);
    const logScreen = ref(null);
    let eventId = 0;
    let timer;
    let controller;

    const summary = computed(() => status.value === 'active' ? 'All core protections active' : 'Protection status starting');
    const updatedLabel = computed(() => serverTime.value ? `Updated ${new Date(serverTime.value).toLocaleTimeString()}` : 'Waiting for server');
    const formatName = (name) => name.replace(/[A-Z]/g, (letter) => ` ${letter}`).trim();
    const recordActivity = (message, tone = 'info', timestamp = new Date()) => {
      activity.value = [...activity.value, {
        id: ++eventId,
        time: timestamp.toLocaleTimeString(),
        message,
        tone
      }].slice(-12);
      nextTick(() => {
        if (logScreen.value) logScreen.value.scrollTop = logScreen.value.scrollHeight;
      });
    };
    const clearActivity = () => {
      activity.value = [];
      recordActivity('Session log cleared. Live monitoring continues.');
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
        const response = await fetch('/api/security-status', { cache: 'no-store', signal: controller.signal });
        if (!response.ok) throw new Error('Protection status unavailable');
        const payload = await response.json();
        status.value = payload.status;
        serverTime.value = payload.serverTime;
        protections.value = payload.protections;
        const activeCount = Object.values(payload.protections).filter((value) => value === 'active').length;
        recordActivity(`Server check complete · ${activeCount}/${Object.keys(payload.protections).length} controls active`, activeCount === Object.keys(payload.protections).length ? 'success' : 'warning', new Date(payload.serverTime));
      } catch (error) {
        if (error.name !== 'AbortError') {
          status.value = 'unavailable';
          recordActivity('Protection status check could not reach the server.', 'warning');
        }
      } finally {
        window.clearTimeout(timeout);
      }
    };

    onMounted(() => {
      recordActivity('Session protection monitor started.', 'session');
      if (navigator.onLine) refresh();
      else handleOffline();
      timer = window.setInterval(refresh, 15000);
      document.addEventListener('visibilitychange', handleVisibility);
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
    });
    onUnmounted(() => {
      window.clearInterval(timer);
      controller?.abort();
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    });

    return { status, protections, activity, summary, updatedLabel, formatName, clearActivity, setLogScreen };
  },
  render() {
    const protectionItems = Object.entries(this.protections).map(([name, value]) => h('article', {
      key: name,
      class: ['protection-item', { neutral: value !== 'active' }]
    }, [
      h('span', { class: 'protection-item-name' }, this.formatName(name)),
      h('strong', { class: 'protection-item-value' }, value),
      h('p', protectionDetails[name] ?? 'Server-enforced protection is active for this request path.')
    ]));

    const logEntries = this.activity.map((entry) => h('li', {
      key: entry.id,
      class: ['protection-log-entry', `is-${entry.tone}`]
    }, [
      h('time', entry.time),
      h('span', entry.message)
    ]));

    return h('div', { class: 'protection-island' }, [
      h('div', [h('p', { class: 'eyebrow' }, 'Live by design'), h('h2', { id: 'protection-title' }, 'Protection is on.')]),
      h('div', { class: 'protection-status' }, [
        h('span', { class: ['status-dot', { inactive: this.status !== 'active' }], 'aria-hidden': 'true' }),
        h('span', { 'aria-live': 'polite' }, this.summary),
        h('time', this.updatedLabel)
      ]),
      h('div', { class: 'protection-items' }, protectionItems),
      h('div', { class: 'protection-console' }, [
        h('div', { class: 'protection-console-heading' }, [
          h('div', [h('p', { class: 'eyebrow' }, 'This browser session'), h('h3', 'Live protection log')]),
          h('div', { class: 'protection-console-actions' }, [
            h('span', { class: 'session-only-label' }, 'Memory only'),
            h('button', { type: 'button', onClick: this.clearActivity }, 'Clear log')
          ])
        ]),
        h('ol', {
          ref: this.setLogScreen,
          class: 'protection-log-screen',
          role: 'log',
          'aria-live': 'polite',
          'aria-label': 'Protection activity during this browser session'
        }, logEntries)
      ])
    ]);
  }
};

createApp(ProtectionStatus).mount('#protection-app');
