const overlay = document.querySelector('.opening-sequence');
const message = document.querySelector('[data-loading-message]');
const step = document.querySelector('[data-loading-step]');
const progress = document.querySelector('[data-loading-progress]');
const main = document.querySelector('main');

if (overlay && message && step && progress) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const minimumDuration = reduceMotion ? 100 : 1800;
  let completed = false;

  overlay.classList.add('is-managed');
  document.body.classList.add('is-loading');
  main?.setAttribute('aria-busy', 'true');

  const delay = (ms) => new Promise((resolve) => window.setTimeout(resolve, reduceMotion ? 0 : ms));

  const updateStage = async (stageNumber, stageMessage, percentage) => {
    if (completed) return;
    message.textContent = stageMessage;
    step.textContent = `0${stageNumber} / 03`;
    progress.style.setProperty('--loading-progress', `${percentage}%`);
    await delay(220);
  };

  const runAsyncLoading = async () => {
    const startedAt = performance.now();

    try {
      await updateStage(1, 'INITIALIZING FORDHAM & BGSU ORBIT', 35);
      await delay(300);

      await updateStage(2, 'BGSU COMPUTER SCIENCE SHIELDS ACTIVE', 75);
      
      const catalogReadyPromise = new Promise((resolve) => {
        if (window.__catalogReady) {
          resolve();
          return;
        }
        window.addEventListener('catalog:ready', resolve, { once: true });
        window.setTimeout(resolve, 3500);
      });

      await catalogReadyPromise;

      // 100% fully loaded checkpoint
      message.textContent = 'READY TO EXPLORE';
      step.textContent = '03 / 03';
      progress.style.setProperty('--loading-progress', '100%');
      
      // Hold at 100% visibly before continuing
      await delay(700);

      const elapsed = performance.now() - startedAt;
      const remaining = Math.max(0, minimumDuration - elapsed);
      if (remaining > 0) {
        await delay(remaining);
      }
    } catch (err) {
      console.error('Async loading sequence error:', err);
    } finally {
      if (!completed) {
        completed = true;
        message.textContent = 'READY TO EXPLORE';
        step.textContent = '03 / 03';
        progress.style.setProperty('--loading-progress', '100%');
        
        // Final stabilization delay at 100% before overlay exit
        await delay(400);

        main?.removeAttribute('aria-busy');
        document.body.classList.remove('is-loading');
        overlay.classList.add('is-complete');
        await delay(reduceMotion ? 0 : 600);
        overlay.hidden = true;
      }
    }
  };

  runAsyncLoading();
}
