const svg = (inner) =>
  `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${inner}</svg>`;

export const icons = {
  search: svg('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>'),
  menu: svg('<path d="M3 7h13M3 12h18M3 17h13"/>'),
  close: svg('<path d="M5 5l14 14M19 5 5 19"/>'),
  plus: svg('<path d="M12 4v16M4 12h16"/>'),
  chevronLeft: svg('<path d="m15 6-6 6 6 6"/>'),
};
