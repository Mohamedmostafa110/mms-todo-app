export const LIMITS = { title: 120 };

/** Only the note text is required - the title is optional. */
export function validateNote({ body }) {
  const errors = {};
  if (!body) errors.body = 'Please write your note.';
  return errors;
}
