# React Live Search Autocomplete

A **live search autocomplete** built with React and Vite. Searches the [Open Library API](https://openlibrary.org) in real time as you type, with a rich dropdown showing book covers, authors, and highlighted matches — all keyboard navigable.

Built as a React hooks deep-dive, intentionally using **7 different hooks** to demonstrate each one in a real context.

---

## ✨ Features

### 🔍 Live Search with Debounce
API calls are debounced (400ms delay) so the network isn't hit on every keystroke — only when the user pauses typing.

### 💡 Match Highlighting
The typed query is highlighted in bold within each result using a regex split. The matching portion is wrapped in a semantic `<mark>` tag.

### ⌨️ Full Keyboard Navigation
| Key | Action |
|-----|--------|
| `↓` from input | Moves focus to the first result |
| `↓` / `↑` in list | Navigate up and down |
| `Enter` | Selects the focused result |
| `Escape` | Closes the dropdown, returns focus to input |

### 🖱️ Click Outside to Close
A `mousedown` listener on `document` detects clicks outside the search component and closes the dropdown automatically.

### ♿ Accessible
- `aria-autocomplete`, `aria-haspopup`, `aria-selected` on the input and list items
- `aria-live="polite"` on the results container
- Screen reader compatible keyboard flow

---

## 🗂️ Project Structure

```
src/
├── api/
│   └── searchApi.js         # fetch wrapper for Open Library API
├── hooks/
│   └── useSearch.js         # custom hook: debounce + fetch + state management
├── components/
│   ├── SearchInput.jsx      # controlled input with keyboard handlers
│   ├── SearchInput.css
│   ├── SearchResults.jsx    # dropdown list with keyboard navigation + scroll
│   ├── SearchResults.css
│   └── HighlightMatch.jsx   # splits text and wraps matches in <mark>
├── App.jsx                  # orchestrator: owns isOpen, activeIndex, wires everything up
├── App.css
├── index.css
└── main.jsx
```

---

## 🪝 Hooks Used

| Hook | Where | Why |
|------|-------|-----|
| `useState` | `App.jsx`, `useSearch.js` | `isOpen`, `activeIndex`, `query`, `results`, `status` |
| `useEffect` | `App.jsx`, `useSearch.js` | click-outside listener, debounced fetch trigger |
| `useRef` | `SearchInput.jsx`, `SearchResults.jsx` | input focus management, `itemRefs[]` for scroll/focus |
| `useCallback` | `App.jsx`, `SearchInput.jsx`, `SearchResults.jsx` | memoize handlers passed as props |
| `useMemo` | `HighlightMatch.jsx` | cache regex split result across renders |
| `useReducer` | `useSearch.js` | manage `{ query, results, status }` as one atomic state |
| **Custom Hook** | `useSearch.js` | encapsulates all search logic (debounce + fetch + reducer) |

---

## 🚀 Getting Started

```bash
npm install
npm run dev
# → http://localhost:5173
```

---

## 🛠️ Tech Stack

| Tool | Purpose |
|------|---------|
| [React 19](https://react.dev) | UI + hooks |
| [Vite 7](https://vitejs.dev) | Dev server & bundler |
| Vanilla CSS | Component-scoped styles |
| [Open Library API](https://openlibrary.org/dev/docs/api) | Free book search, no API key required |
