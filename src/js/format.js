const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

/** "2021-02-08T10:00:00Z" -> "Feb 8, 2021" */
export const formatDate = (iso) => dateFormatter.format(new Date(iso));

const HTML_ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, (ch) => HTML_ESCAPES[ch]);

/** Turns plain URLs inside already-escaped text into accent coloured links. */
const linkify = (escaped) =>
  escaped.replace(
    /\bhttps?:\/\/[^\s<]+/g,
    (url) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`,
  );

/** Splits a note body on line breaks and returns safe <p> elements. */
export const toParagraphs = (text = '') =>
  text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => `<p>${linkify(escapeHtml(line))}</p>`)
    .join('');

export const createId = () =>
  globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

/** Title is optional, so fall back to the start of the note text. */
export const displayTitle = (note) => {
  const title = (note.title ?? '').trim();
  if (title) return title;
  const text = (note.body ?? '').replace(/\s+/g, ' ').trim();
  return text.length > 48 ? `${text.slice(0, 48).trim()}…` : text || 'Untitled note';
};
