/**
 * Tiny hash router.
 *   #/            -> home (list + first note on desktop)
 *   #/note/<id>   -> a single note
 *   #/add         -> the "Add Note" form
 */
export function parseRoute(hash = window.location.hash) {
  const [, section, id] = hash.replace(/^#/, '').split('/');
  if (section === 'add') return { name: 'add' };
  if (section === 'note' && id) return { name: 'note', id: decodeURIComponent(id) };
  return { name: 'home' };
}

export const navigate = (hash) => {
  window.location.hash = hash;
};
