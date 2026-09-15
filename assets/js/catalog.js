const state = {
  category: '',
  search: '',
  saved: new Set(JSON.parse(localStorage.getItem('common-ground-saved') || '[]')),
  products: []
};

const productGrid = document.querySelector('[data-product-grid]');
const categories = document.querySelector('[data-categories]');
const emptyState = document.querySelector('[data-empty]');
const savedCount = document.querySelector('[data-saved-count]');
const searchInput = document.querySelector('[data-search]');
const dialog = document.querySelector('[data-dialog]');
const dialogImage = document.querySelector('[data-dialog-image]');
const dialogTitle = document.querySelector('[data-dialog-title]');
const dialogMaker = document.querySelector('[data-dialog-maker]');
const dialogDescription = document.querySelector('[data-dialog-description]');
const dialogPrice = document.querySelector('[data-dialog-price]');
const dialogRating = document.querySelector('[data-dialog-rating]');
const dialogSave = document.querySelector('[data-dialog-save]');
const siteStatuses = document.querySelectorAll('[data-site-status]');
const cursorConsole = document.querySelector('.cursor-console');
const cursorPulse = document.querySelector('[data-cursor-pulse]');
const cursorState = document.querySelector('[data-cursor-state]');
const cursorBenefit = document.querySelector('[data-cursor-benefit]');
const cursorLog = document.querySelector('[data-cursor-log]');
const cursorClear = document.querySelector('[data-cursor-clear]');
const cursorLiveBox = document.querySelector('.cursor-console-live');
const cursorTracker = document.querySelector('[data-cursor-tracker]');
const cursorFloatFeed = document.querySelector('[data-cursor-float-feed]');
const tooltip = document.querySelector('[data-tooltip-popover]');
const signInDialog = document.querySelector('[data-sign-in-dialog]');
const signInForm = document.querySelector('[data-sign-in-form]');
const signInMessage = document.querySelector('[data-sign-in-message]');
const signInOpenButton = document.querySelector('[data-sign-in-open]');
const signInCloseButton = document.querySelector('[data-sign-in-close]');
let dialogProduct;
let searchTimer;
let catalogRequestController;
let cursorFrame;
let lastCursorZone = '';
const cursorBenefits = {
  header: 'Navigation stays close so you can move between sections quickly.',
  protection: 'Protection details remain visible while you browse.',
  catalog: 'Product controls stay large and easy to reach.',
  manifesto: 'The page gives you a quiet pause before the next decision.',
  console: 'The local interaction panel keeps feedback visible without storing personal movement data.'
};

const createBenefitEntry = (message) => makeElement('span', 'cursor-log-entry', `${new Date().toLocaleTimeString()} · ${message}`);

const loadSiteStatus = async () => {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 3000);
  try {
    const response = await fetch('/healthz', { cache: 'no-store', signal: controller.signal });
    const payload = await response.json();
    siteStatuses.forEach((siteStatus) => {
      siteStatus.classList.toggle('offline', !response.ok || payload.status !== 'ok');
      siteStatus.querySelector('span:last-child').textContent = response.ok && payload.status === 'ok' ? 'Site online' : 'Site starting';
    });
  } catch {
    siteStatuses.forEach((siteStatus) => {
      siteStatus.classList.add('offline');
      siteStatus.querySelector('span:last-child').textContent = 'Site offline';
    });
  } finally {
    window.clearTimeout(timeout);
  }
};

const getCursorZone = (target) => {
  if (target.closest('.site-header')) return 'header';
  if (target.closest('.protection-feed')) return 'protection';
  if (target.closest('.catalog-section')) return 'catalog';
  if (target.closest('.manifesto')) return 'manifesto';
  if (target.closest('.cursor-console')) return 'console';
  return '';
};

const logCursorBenefit = (zone) => {
  if (!zone || zone === lastCursorZone) return;
  lastCursorZone = zone;
  cursorState.textContent = `Browsing ${zone}`;
  cursorBenefit.textContent = cursorBenefits[zone];
  cursorPulse.classList.add('active');
  window.setTimeout(() => cursorPulse.classList.remove('active'), 450);
  const entry = createBenefitEntry(cursorBenefits[zone]);
  cursorLog.prepend(entry);
  while (cursorLog.children.length > 3) cursorLog.lastElementChild.remove();
};

const logClickBenefit = (target) => {
  const zone = getCursorZone(target);
  if (zone) {
    lastCursorZone = '';
    logCursorBenefit(zone);
  }
};

const showTooltip = (target) => {
  const text = target?.dataset?.tooltip;
  if (!text) return;
  tooltip.textContent = text;
  tooltip.hidden = false;
  const bounds = target.getBoundingClientRect();
  const left = Math.min(Math.max(8, bounds.left + (bounds.width / 2) - 120), window.innerWidth - 248);
  tooltip.style.left = `${left}px`;
  tooltip.style.top = `${Math.min(window.innerHeight - 48, bounds.bottom + 10)}px`;
};

const hideTooltip = () => { tooltip.hidden = true; };

const basicAuthorization = (username, password) => {
  const bytes = new TextEncoder().encode(`${username}:${password}`);
  return `Basic ${btoa(String.fromCharCode(...bytes))}`;
};

const openSignIn = () => {
  signInMessage.classList.remove('success');
  signInMessage.textContent = '';
  if (typeof signInDialog.showModal === 'function') signInDialog.showModal();
  signInDialog.querySelector('[name="username"]').focus();
};

document.addEventListener('pointerover', (event) => showTooltip(event.target.closest?.('[data-tooltip]')));
document.addEventListener('pointerout', (event) => {
  if (!event.relatedTarget?.closest?.('[data-tooltip]')) hideTooltip();
});
document.addEventListener('focusin', (event) => showTooltip(event.target.closest?.('[data-tooltip]')));
document.addEventListener('focusout', hideTooltip);
document.addEventListener('click', (event) => logClickBenefit(event.target));
cursorClear.addEventListener('click', () => {
  cursorLog.replaceChildren();
  cursorState.textContent = 'Local log cleared';
  cursorBenefit.textContent = 'No interaction history is stored on this page.';
  lastCursorZone = '';
});

document.addEventListener('pointermove', (event) => {
  if (cursorLiveBox && cursorLiveBox.matches(':hover')) {
    const bounds = cursorLiveBox.getBoundingClientRect();
    cursorTracker.style.transform = `translate(${event.clientX - bounds.left - 7}px, ${event.clientY - bounds.top - 7}px)`;
    cursorTracker.classList.add('tracking');
    cursorFloatFeed.style.transform = `translate(${Math.min(Math.max(14, event.clientX - bounds.left + 16), bounds.width - 130)}px, ${Math.min(Math.max(14, event.clientY - bounds.top - 34), bounds.height - 34)}px)`;
    cursorFloatFeed.textContent = 'benefit / live';
    cursorFloatFeed.classList.add('tracking');
    cursorState.textContent = 'Cursor active';
    cursorBenefit.textContent = cursorBenefits.console;
  } else {
    cursorTracker.classList.remove('tracking');
    cursorFloatFeed.classList.remove('tracking');
  }
  if (cursorFrame) return;
  cursorFrame = window.requestAnimationFrame(() => {
    logCursorBenefit(getCursorZone(event.target));
    cursorFrame = undefined;
  });
}, { passive: true });

cursorLiveBox.addEventListener('pointerleave', () => {
  cursorTracker.classList.remove('tracking');
  cursorFloatFeed.classList.remove('tracking');
  cursorState.textContent = 'Waiting for movement';
});

const saveState = () => {
  localStorage.setItem('common-ground-saved', JSON.stringify([...state.saved]));
  savedCount.textContent = String(state.saved.size);
};

const makeElement = (tagName, className, text) => {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
};

const updateDialogSave = () => {
  if (!dialogProduct) return;
  dialogSave.textContent = state.saved.has(dialogProduct.id) ? '♥ Saved product' : '♡ Save product';
};

const toggleSaved = (productId) => {
  if (state.saved.has(productId)) state.saved.delete(productId);
  else state.saved.add(productId);
  saveState();
  renderProducts(state.products);
  updateDialogSave();
};

const openProduct = (product) => {
  dialogProduct = product;
  dialogImage.src = product.image;
  dialogImage.alt = `${product.name} by ${product.maker}`;
  dialogTitle.textContent = product.name;
  dialogMaker.textContent = product.maker;
  dialogDescription.textContent = product.description;
  dialogPrice.textContent = product.price;
  dialogRating.textContent = `★ ${product.rating}`;
  updateDialogSave();
  if (typeof dialog.showModal === 'function') dialog.showModal();
};

const renderCategories = (availableCategories) => {
  categories.replaceChildren();
  ['All', ...availableCategories].forEach((categoryName) => {
    const selected = (state.category === '' && categoryName === 'All') || state.category === categoryName;
    const button = makeElement('button', `filter${selected ? ' selected' : ''}`, categoryName);
    button.type = 'button';
    button.dataset.tooltip = `Filter products by ${categoryName}`;
    button.addEventListener('click', () => {
      state.category = categoryName === 'All' ? '' : categoryName;
      loadProducts();
    });
    categories.append(button);
  });
};

const renderProducts = (productList) => {
  productGrid.replaceChildren();
  emptyState.hidden = productList.length !== 0;
  productList.forEach((product) => {
    const card = makeElement('article', 'product-card');
    const image = makeElement('div', 'product-image');
    const imageElement = document.createElement('img');
    imageElement.src = product.image;
    imageElement.alt = `${product.name} by ${product.maker}`;
    imageElement.loading = 'lazy';
    imageElement.decoding = 'async';
    const imageButton = makeElement('button', `save-product${state.saved.has(product.id) ? ' saved' : ''}`, state.saved.has(product.id) ? '♥' : '♡');
    imageButton.type = 'button';
    imageButton.dataset.tooltip = state.saved.has(product.id) ? 'Remove this product from saved items' : 'Save this product in this browser';
    imageButton.setAttribute('aria-label', state.saved.has(product.id) ? `Remove ${product.name} from saved products` : `Save ${product.name}`);
    imageButton.addEventListener('click', (event) => { event.stopPropagation(); toggleSaved(product.id); });
    image.append(imageElement, imageButton);
    if (product.badge) image.append(makeElement('span', 'product-badge', product.badge));

    const info = makeElement('div', 'product-info');
    info.append(makeElement('div', 'product-maker', product.maker));
    const name = makeElement('button', 'product-name product-open', product.name);
    name.type = 'button';
    name.dataset.tooltip = `Open details for ${product.name}`;
    name.setAttribute('aria-label', `View details for ${product.name}`);
    name.addEventListener('click', () => openProduct(product));
    const footer = makeElement('div', 'product-footer');
    footer.append(makeElement('span', 'product-price', product.price), makeElement('span', '', `★ ${product.rating}`));
    info.append(name, footer);
    card.append(image, info);
    productGrid.append(card);
  });
};

const loadProducts = async () => {
  const parameters = new URLSearchParams();
  if (state.search) parameters.set('search', state.search);
  if (state.category) parameters.set('category', state.category);
  catalogRequestController?.abort();
  catalogRequestController = new AbortController();
  const timeout = window.setTimeout(() => catalogRequestController.abort(), 5000);
  try {
    const response = await fetch(`/api/products?${parameters}`, { cache: 'no-store', signal: catalogRequestController.signal });
    if (!response.ok) throw new Error('Catalog request failed');
    const payload = await response.json();
    state.products = payload.products;
    renderCategories(payload.categories);
    renderProducts(payload.products);
  } catch (error) {
    if (error.name !== 'AbortError') productGrid.replaceChildren(makeElement('p', 'empty-state', 'The collection is taking a moment to load.'));
  } finally {
    window.clearTimeout(timeout);
  }
};

searchInput.addEventListener('input', () => {
  state.search = searchInput.value.trim();
  cursorState.textContent = 'Search protected';
  cursorBenefit.textContent = 'Search updates this view, but typed text is never added to the live log.';
  cursorLog.prepend(createBenefitEntry('Search refreshed privately; typed text was not stored.'));
  while (cursorLog.children.length > 3) cursorLog.lastElementChild.remove();
  window.clearTimeout(searchTimer);
  searchTimer = window.setTimeout(loadProducts, 180);
});
dialogSave.addEventListener('click', () => toggleSaved(dialogProduct.id));
document.querySelector('[data-dialog-close]').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
signInOpenButton.addEventListener('click', openSignIn);
signInCloseButton.addEventListener('click', () => signInDialog.close());
signInDialog.addEventListener('click', (event) => { if (event.target === signInDialog) signInDialog.close(); });
signInForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const fields = new FormData(signInForm);
  const username = String(fields.get('username') ?? '').trim();
  const password = String(fields.get('password') ?? '');
  const submit = signInForm.querySelector('button[type="submit"]');
  if (!username || !password) return;
  if (window.location.protocol !== 'https:') {
    signInMessage.classList.remove('success');
    signInMessage.textContent = 'Sign in is available only over a secure HTTPS connection.';
    signInForm.elements.password.value = '';
    return;
  }

  submit.disabled = true;
  signInMessage.classList.remove('success');
  signInMessage.textContent = 'Verifying access…';
  try {
    const response = await fetch('/api/protected', {
      cache: 'no-store',
      headers: { Authorization: basicAuthorization(username, password) }
    });
    if (!response.ok) throw new Error('Access verification failed');
    const payload = await response.json();
    signInMessage.classList.add('success');
    signInMessage.textContent = `Last access check verified ${payload.username}.`;
    signInOpenButton.innerHTML = '<span class="sign-in-button-mark" aria-hidden="true"></span>Check verified';
    signInOpenButton.dataset.tooltip = 'Your most recent access check was verified; credentials are not retained';
    signInForm.reset();
  } catch {
    signInMessage.classList.remove('success');
    signInMessage.textContent = 'We could not verify those credentials. Please try again.';
  } finally {
    signInForm.elements.password.value = '';
    submit.disabled = false;
  }
});
window.addEventListener('pagehide', () => cursorLog.replaceChildren());
saveState();
loadProducts();
loadSiteStatus();
window.setInterval(loadSiteStatus, 15000);
