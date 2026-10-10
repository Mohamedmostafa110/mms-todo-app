import { displayTitle, escapeHtml, formatDate, toParagraphs } from './format.js';
import { LIMITS } from './validation.js';

const noteCard = (note, selectedId) => {
  const id = escapeHtml(note.id);
  const title = escapeHtml(displayTitle(note));
  return `
  <article class="note-card${note.id === selectedId ? ' is-selected' : ''}" data-id="${id}" data-testid="note">
    <h3 class="note-card__title"><a href="#/note/${encodeURIComponent(note.id)}">${title}</a></h3>
    <p class="note-card__excerpt">${escapeHtml(note.body)}</p>
    <footer class="note-card__footer">
      <time datetime="${escapeHtml(note.createdAt)}">${formatDate(note.createdAt)}</time>
      <span class="note-card__actions">
        <button class="note-card__action note-card__action--pin" type="button" data-pin="${id}" data-testid="pin-note" aria-pressed="${note.pinned}" aria-label="${note.pinned ? 'Unpin' : 'Pin'} note: ${title}">${note.pinned ? 'Unpin' : 'Pin'}</button>
        <button class="note-card__action note-card__action--delete" type="button" data-delete="${id}" data-testid="delete-note" aria-label="Delete note: ${title}">Delete</button>
      </span>
    </footer>
  </article>`;
};

/** Both sections are always in the page; an empty one is simply hidden. */
export function renderNoteList({ pinned, regular, selectedId, query }) {
  const empty =
    !pinned.length && !regular.length
      ? query
        ? `<p class="empty-list">No notes match &ldquo;${escapeHtml(query)}&rdquo;.</p>`
        : `<p class="empty-list">No notes yet. Write your first note in the form.</p>`
      : '';

  return `
    <section class="note-group note-group--pinned" data-testid="pinned-notes" aria-label="Pinned notes"${pinned.length ? '' : ' hidden'}>
      <h2 class="group-label group-label--pinned">Pinned</h2>
      ${pinned.map((note) => noteCard(note, selectedId)).join('')}
    </section>
    <section class="note-group note-group--other" data-testid="other-notes" aria-label="Notes"${regular.length ? '' : ' hidden'}>
      <h2 class="group-label group-label--notes">Notes</h2>
      ${regular.map((note) => noteCard(note, selectedId)).join('')}
    </section>
    ${empty}`;
}

export const renderNoteDetail = (note) => `
  <article class="note-detail">
    <h1 class="note-detail__title">${escapeHtml(displayTitle(note))}</h1>
    <p class="note-detail__meta"><time datetime="${escapeHtml(note.createdAt)}">${formatDate(note.createdAt)}</time>${note.author ? ` / By ${escapeHtml(note.author)}` : ''}</p>
    <div class="note-detail__body">${toParagraphs(note.body)}</div>
  </article>`;

export const renderNotFound = () => `
  <div class="empty-state">
    <h1 class="empty-state__title">Note not found</h1>
    <p>This note doesn't exist any more. It may have been deleted.</p>
    <a class="button" href="#/">Back to notes</a>
  </div>`;

export const renderNoteForm = () => `
  <form class="note-form" id="noteForm" novalidate>
    <h1 class="note-form__title">Add Note</h1>
    <div class="field" data-field="title">
      <label class="field__label" for="note-title">Title</label>
      <input class="field__control" id="note-title" name="title" data-testid="note-title" type="text" maxlength="${LIMITS.title}" autocomplete="off" />
    </div>
    <div class="field" data-field="body">
      <label class="field__label" for="note-body">Your Note*</label>
      <textarea class="field__control field__control--area" id="note-body" name="body" data-testid="note-text" required aria-describedby="note-body-error"></textarea>
      <p class="field__error" id="note-body-error" hidden></p>
    </div>
    <div class="note-form__actions">
      <button class="button" type="submit" data-testid="add-note" data-pinned="false">Add Note</button>
      <button class="button" type="submit" data-testid="add-pinned-note" data-pinned="true">Add Pinned Note</button>
    </div>
  </form>`;
