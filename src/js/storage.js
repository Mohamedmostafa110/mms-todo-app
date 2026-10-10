export const STORAGE_KEY = 'mms-todo-app:notes:v2';

/** Returns the saved notes array, or null when nothing (valid) has been saved yet. */
export function loadNotes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/** Returns true when the notes were written successfully. */
export function saveNotes(notes) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    return true;
  } catch {
    return false;
  }
}
