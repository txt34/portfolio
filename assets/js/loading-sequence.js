const overlay = document.querySelector('.opening-sequence');
const message = document.querySelector('[data-loading-message]');
const step = document.querySelector('[data-loading-step]');
const progress = document.querySelector('[data-loading-progress]');
const main = document.querySelector('main');

if (overlay && message && step && progress) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const startedAt = performance.now();
  const minimumDuration = reduceMotion ? 100 : 1250;
  let contentReady = false;
  let completed = false;

  overlay.classList.add('is-managed');
  document.body.classList.add('is-loading');
  main?.setAttribute('aria-busy', 'true');

  const updateStage = (stageNumber, stageMessage, percentage) => {
    if (completed) return;
    message.textContent = stageMessage;
    step.textContent = `0${stageNumber} / 03`;
    progress.style.setProperty('--loading-progress', `${percentage}%`);
  };

  const complete = () => {
    if (completed) return;
    completed = true;
    updateStage(3, 'Ready to explore', 100);
    message.textContent = 'Ready to explore';
    step.textContent = '03 / 03';
    progress.style.setProperty('--loading-progress', '100%');
    main?.removeAttribute('aria-busy');
    document.body.classList.remove('is-loading');
    overlay.classList.add('is-complete');
    window.setTimeout(() => { overlay.hidden = true; }, reduceMotion ? 0 : 500);
  };

  const completeWhenReady = () => {
    if (!contentReady || completed) return;
    const remaining = Math.max(0, minimumDuration - (performance.now() - startedAt));
    window.setTimeout(complete, remaining);
  };

  const scheduleStage = (delay, stageNumber, stageMessage, percentage) => {
    window.setTimeout(() => {
      if (!contentReady) updateStage(stageNumber, stageMessage, percentage);
    }, reduceMotion ? 0 : delay);
  };

  scheduleStage(380, 2, 'Bringing the collection into view', 58);
  scheduleStage(820, 3, 'Checking the final details', 84);

  const fallbackTimer = window.setTimeout(() => {
    contentReady = true;
    completeWhenReady();
  }, 6000);

  window.addEventListener('catalog:ready', () => {
    window.clearTimeout(fallbackTimer);
    contentReady = true;
    completeWhenReady();
  }, { once: true });
}
