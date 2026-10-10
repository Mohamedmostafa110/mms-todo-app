<div align="center">

# Almdrasa Notes

A responsive notes app: add, pin, search and delete notes - everything is stored in your browser.

**[🔗 Live Demo](https://mms-todo-app.vercel.app/)** &nbsp;·&nbsp; **[Repository](https://github.com/Mohamedmostafa110/mms-todo-app)**

<!-- Add a screenshot once the app is deployed, e.g.:
![Desktop view](docs/screenshot-desktop.png)
-->

</div>

---

## About

Almdrasa Notes is my final project for the **Almdrasa JavaScript Diploma**. The goal was to turn a Figma design into a fully working, responsive notes app using plain JavaScript modules, Sass and Vite - no UI frameworks.

## Features

- **Responsive layout** - a three-column layout on desktop (sidebar, notes list, note view) and a phone layout with a slide-in menu and a toggleable search bar.
- **Add notes** - the form is on the home screen: an optional *Title* and a required *Your Note* field, with an inline validation message.
- **Pinned notes** - pin or unpin any note with the **Pin / Unpin** button on its card (or use **Add Pinned Note**). Pinned notes go to the *Pinned* section, everything else to *Notes*; newest first in both.
- **Delete notes** - with an **Undo** option right after deleting.
- **Live search** - filters by title and note text as you type.
- **Persistent storage** - notes are saved in `localStorage`, so they survive page reloads and are synced between open tabs.
- **Collapsible notes list** on desktop (the round `<` button on the list edge).
- **Safe rendering** - note text is HTML-escaped, and plain URLs inside a note become links.

## Tech stack

| | |
| --- | --- |
| Bundler | [Vite](https://vite.dev) |
| Language | JavaScript (ES modules), no framework |
| Styles | [Sass](https://sass-lang.com) (`@use` partials, variables, nesting) |
| Storage | `localStorage` |
| Routing | Tiny hash router (`#/`, `#/note/<id>`, `#/add`) |

## Getting started

Requirements: [Node.js](https://nodejs.org) 18 or newer.

```bash
# 1. Clone the repo
git clone https://github.com/Mohamedmostafa110/mms-todo-app.git
cd mms-todo-app

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Other scripts:

```bash
npm run build     # production build in ./dist
npm run preview   # serve the production build locally
```

## Project structure

```
mms-todo-app/
├── index.html            # App shell (sidebar, mobile top bar, list + content areas)
├── public/               # Static files (favicon)
├── vite.config.js
└── src/
    ├── main.js           # Entry point: rendering, events, mobile menu/search
    ├── js/
    │   ├── notes.js      # Notes state: add / delete / restore / group / search
    │   ├── storage.js    # localStorage read & write
    │   ├── router.js     # Hash router
    │   ├── views.js      # HTML templates (list, note, form, empty states)
    │   ├── validation.js # Form validation
    │   ├── format.js     # Dates, HTML escaping, ids
    │   ├── toast.js      # "Note deleted - Undo" message
    │   └── icons.js      # Inline SVG icons
    └── styles/
        ├── main.scss
        ├── _variables.scss   # Colours, fonts, breakpoints
        ├── _base.scss
        ├── _layout.scss      # Page structure & responsive rules
        └── _components.scss  # Cards, form, buttons, FAB, toast...
```

## Deployment (GitHub Pages)

A workflow is included in `.github/workflows/deploy.yml`.

1. Push the project to the `main` branch.
2. (GitHub Pages option) In the repository go to **Settings → Pages** and set **Source** to **GitHub Actions**.
3. Every push to `main` builds and publishes the app. The link will look like  
   `https://mohamedmostafa110.github.io/mms-todo-app/`.

The live demo is hosted on Vercel: **https://mms-todo-app.vercel.app/**. The app also works on Netlify or GitHub Pages (build command `npm run build`, output directory `dist`).

## Test IDs

Key elements carry `data-testid` attributes for automated testing: `note-title`, `note-text`, `add-note`, `note`, `pin-note`, `delete-note`, `pinned-notes`, `other-notes`.

## Design

The UI follows the project's Figma design (desktop and phone): the coral accent `#ec7160`, light grey surfaces `#f6f6f6`, red *Delete* actions, the **Inter** typeface for text and **Federo** for the logo.

## Author

**Mohamed Mostafa** - [@Mohamedmostafa110](https://github.com/Mohamedmostafa110)
