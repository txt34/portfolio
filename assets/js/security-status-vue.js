import { createApp, h, ref, computed, onMounted, onUnmounted } from 'https://unpkg.com/vue@3.5.13/dist/vue.runtime.esm-browser.prod.js';

const ProtectionStatus = {
  setup() {
    const status = ref('starting');
    const serverTime = ref('');
    const protections = ref({});
    let timer;
    let controller;

    const summary = computed(() => status.value === 'active' ? 'All core protections active' : 'Protection status starting');
    const updatedLabel = computed(() => serverTime.value ? `Updated ${new Date(serverTime.value).toLocaleTimeString()}` : 'Waiting for server');
    const formatName = (name) => name.replace(/[A-Z]/g, (letter) => ` ${letter}`).trim();

    const refresh = async () => {
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
      } catch (error) {
        if (error.name !== 'AbortError') status.value = 'unavailable';
      } finally {
        window.clearTimeout(timeout);
      }
    };

    onMounted(() => {
      refresh();
      timer = window.setInterval(refresh, 15000);
    });
    onUnmounted(() => {
      window.clearInterval(timer);
      controller?.abort();
    });

    return { status, protections, summary, updatedLabel, formatName };
  },
  render() {
    const protectionItems = Object.entries(this.protections).map(([name, value]) => h('span', {
      key: name,
      class: ['protection-item', { neutral: value !== 'active' }]
    }, `${this.formatName(name)} · ${value}`));

    return h('div', { class: 'protection-island' }, [
      h('div', [h('p', { class: 'eyebrow' }, 'Live by design'), h('h2', { id: 'protection-title' }, 'Protection is on.')]),
      h('div', { class: 'protection-status' }, [
        h('span', { class: ['status-dot', { inactive: this.status !== 'active' }], 'aria-hidden': 'true' }),
        h('span', { 'aria-live': 'polite' }, this.summary),
        h('time', this.updatedLabel)
      ]),
      h('div', { class: 'protection-items', 'aria-live': 'polite' }, protectionItems)
    ]);
  }
};

createApp(ProtectionStatus).mount('#protection-app');
