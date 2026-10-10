import { loadNotes, saveNotes } from './storage.js';
import { createId } from './format.js';

let notes = [];
let onSaveError = () => {};
const listeners = new Set();

const emit = () => listeners.forEach((listener) => listener());
const byNewest = (a, b) => new Date(b.createdAt) - new Date(a.createdAt);

function persist() {
  if (!saveNotes(notes)) onSaveError();
}

/** Loads the notes saved in localStorage (starts empty on the very first visit). */
export function initNotes() {
  notes = loadNotes() ?? [];
}

export function reloadNotes() {
  notes = loadNotes() ?? [];
  emit();
}

export const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const setSaveErrorHandler = (handler) => {
  onSaveError = handler;
};

const matches = (note, query) => {
  if (!query) return true;
  const needle = query.trim().toLowerCase();
  return [note.title, note.author, note.body].some((field) => (field ?? '').toLowerCase().includes(needle));
};

/** Notes grouped by priority: pinned first, then the rest. Newest first inside each group. */
export function getGroupedNotes(query = '') {
  const visible = notes.filter((note) => matches(note, query)).sort(byNewest);
  return {
    pinned: visible.filter((note) => note.pinned),
    regular: visible.filter((note) => !note.pinned),
  };
}

export const getNote = (id) => notes.find((note) => note.id === id) ?? null;

export function addNote({ title = '', body, pinned = false }) {
  const note = { id: createId(), title, body, pinned, createdAt: new Date().toISOString() };
  notes = [note, ...notes];
  persist();
  emit();
  return note;
}

/** Removes a note and returns it (so the UI can offer "Undo"). */
export function deleteNote(id) {
  const note = getNote(id);
  if (!note) return null;
  notes = notes.filter((item) => item.id !== id);
  persist();
  emit();
  return note;
}

export function restoreNote(note) {
  if (getNote(note.id)) return;
  notes = [note, ...notes];
  persist();
  emit();
}

export function togglePin(id) {
  const note = getNote(id);
  if (!note) return;
  notes = notes.map((item) => (item.id === id ? { ...item, pinned: !item.pinned } : item));
  persist();
  emit();
}
