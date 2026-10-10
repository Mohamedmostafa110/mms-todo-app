import './styles/main.scss';
import { icons } from './js/icons.js';
import { parseRoute, navigate } from './js/router.js';
import {
  initNotes,
  reloadNotes,
  subscribe,
  setSaveErrorHandler,
  getNote,
  getGroupedNotes,
  addNote,
  deleteNote,
  restoreNote,
  togglePin,
} from './js/notes.js';
import { STORAGE_KEY } from './js/storage.js';
import { validateNote } from './js/validation.js';
import { displayTitle } from './js/format.js';
import { createToast } from './js/toast.js';
import {
  renderNoteList,
  renderNoteDetail,
  renderNoteForm,
  renderNotFound,
} from './js/views.js';

const $ = (selector) => document.querySelector(selector);

const app = $('#app');
const page = $('#page');
const listEl = $('#noteList');
const contentEl = $('#content');
const searchInputs = [$('#searchSidebar'), $('#searchMobile')];
const menuOpenBtn = $('#menuOpen');
const searchToggleBtn = $('#searchToggle');
const collapseBtn = $('#collapseBtn');

const isMobile = window.matchMedia('(max-width: 899px)');
const toast = createToast($('#toast'));

let query = '';
let renderedContentKey = '';
let warnedAboutStorage = false;

/* ---------- Icons ---------- */
document.querySelectorAll('[data-icon]').forEach((el) => {
  el.innerHTML = icons[el.dataset.icon] ?? '';
});

/* ---------- Rendering ---------- */
function getActiveNote(route) {
  return route.name === 'note' ? getNote(route.id) : null;
}

function renderList(route, activeNote) {
  const scrollTop = listEl.scrollTop;
  listEl.innerHTML = renderNoteList({
    ...getGroupedNotes(query),
    selectedId: activeNote?.id,
    query: query.trim(),
  });
  listEl.scrollTop = scrollTop;
}

function renderContent(route, activeNote) {
  const isForm = route.name !== 'note';
  const key = isForm ? 'form' : `note:${route.id}:${activeNote?.id ?? ''}`;
  const changed = key !== renderedContentKey;

  // Never re-render the form while somebody is typing in it.
  if (isForm) {
    if (changed) contentEl.innerHTML = renderNoteForm();
  } else {
    contentEl.innerHTML = activeNote ? renderNoteDetail(activeNote) : renderNotFound();
  }

  if (changed) {
    renderedContentKey = key;
    contentEl.scrollTop = 0;
    window.scrollTo(0, 0);
  }

  document.title = activeNote ? `${displayTitle(activeNote)} · Almdrasa Notes` : 'Almdrasa Notes';
}

function render() {
  const route = parseRoute();
  const activeNote = getActiveNote(route);

  app.dataset.view = route.name;
  document.querySelectorAll('[data-nav]').forEach((link) => {
    const isActive = link.dataset.nav === 'add' ? route.name === 'add' : route.name !== 'add';
    if (isActive) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });

  renderList(route, activeNote);
  renderContent(route, activeNote);
}

/* ---------- Mobile menu & search ---------- */
function setMenu(open) {
  app.classList.toggle('menu-open', open);
  menuOpenBtn.setAttribute('aria-expanded', String(open));
}

function setSearchOpen(open) {
  app.classList.toggle('search-open', open);
  searchToggleBtn.setAttribute('aria-expanded', String(open));
  if (open) $('#searchMobile').focus();
  else setQuery('', null);
}

menuOpenBtn.addEventListener('click', () => setMenu(true));
$('#menuClose').addEventListener('click', () => setMenu(false));
$('#drawer').addEventListener('click', (event) => {
  if (event.target.closest('a')) setMenu(false);
});

// While the menu is open the page is pushed aside; tapping it closes the menu.
page.addEventListener(
  'click',
  () => {
    if (!app.classList.contains('menu-open')) return;
    setMenu(false);
  },
  true,
);

searchToggleBtn.addEventListener('click', () => setSearchOpen(!app.classList.contains('search-open')));

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  setMenu(false);
  if (app.classList.contains('search-open')) setSearchOpen(false);
});

/* ---------- Desktop: collapse the notes list ---------- */
collapseBtn.addEventListener('click', () => {
  const collapsed = app.classList.toggle('list-collapsed');
  collapseBtn.setAttribute('aria-expanded', String(!collapsed));
  collapseBtn.setAttribute('aria-label', collapsed ? 'Expand notes list' : 'Collapse notes list');
});

/* ---------- Search ---------- */
function setQuery(value, source) {
  query = value;
  searchInputs.forEach((input) => {
    if (input !== source && input.value !== value) input.value = value;
  });

  const route = parseRoute();
  const listHidden = route.name === 'add' || (route.name === 'note' && isMobile.matches);
  if (value && listHidden) navigate('#/');
  else render();
}

searchInputs.forEach((input) => input.addEventListener('input', () => setQuery(input.value, input)));

/* ---------- Notes list: open & delete ---------- */
listEl.addEventListener('click', (event) => {
  const pinBtn = event.target.closest('[data-pin]');
  if (pinBtn) {
    togglePin(pinBtn.dataset.pin);
    return;
  }
  const deleteBtn = event.target.closest('[data-delete]');
  if (deleteBtn) {
    handleDelete(deleteBtn.dataset.delete);
    return;
  }
  const card = event.target.closest('[data-id]');
  if (card && !event.target.closest('a')) navigate(`#/note/${encodeURIComponent(card.dataset.id)}`);
});

function handleDelete(id) {
  const removed = deleteNote(id);
  if (!removed) return;

  const route = parseRoute();
  if (route.name === 'note' && route.id === id) navigate('#/');

  toast.show('Note deleted', { actionLabel: 'Undo', onAction: () => restoreNote(removed) });
}

/* ---------- Add note form ---------- */
function showFieldError(form, name, message) {
  const wrapper = form.querySelector(`[data-field="${name}"]`);
  const error = wrapper?.querySelector('.field__error');
  if (!wrapper || !error) return;
  wrapper.classList.toggle('is-invalid', Boolean(message));
  wrapper.querySelector('.field__control').setAttribute('aria-invalid', String(Boolean(message)));
  error.textContent = message ?? '';
  error.hidden = !message;
}

contentEl.addEventListener('submit', (event) => {
  const form = event.target.closest('#noteForm');
  if (!form) return;
  event.preventDefault();

  const data = new FormData(form);
  const values = {
    title: String(data.get('title')).trim(),
    body: String(data.get('body')).trim(),
  };

  const errors = validateNote(values);
  showFieldError(form, 'body', errors.body);
  if (errors.body) {
    form.elements.body.focus();
    return;
  }

  addNote({ ...values, pinned: event.submitter?.dataset.pinned === 'true' });
  form.reset();
  setQuery('', null);
  // Phones show the list below the form on the home screen.
  if (parseRoute().name === 'add') navigate('#/');
  form.elements.title.focus({ preventScroll: true });
  toast.show(values.title ? `"${values.title}" added` : 'Note added', { duration: 2500 });
});

contentEl.addEventListener('input', (event) => {
  const form = event.target.closest('#noteForm');
  if (form && event.target.name === 'body') showFieldError(form, 'body', null);
});

/* ---------- Boot ---------- */
setSaveErrorHandler(() => {
  if (warnedAboutStorage) return;
  warnedAboutStorage = true;
  toast.show("Couldn't save to this browser's storage. Your notes will be lost when you close the page.", { duration: 9000 });
});

initNotes();
subscribe(render);
window.addEventListener('hashchange', () => {
  setMenu(false);
  render();
});
// Keep several open tabs in sync.
window.addEventListener('storage', (event) => {
  if (event.key === null || event.key === STORAGE_KEY) reloadNotes();
});
render();
