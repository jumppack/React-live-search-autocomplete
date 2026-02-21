import { useState, useRef, useCallback, useEffect } from 'react';
import { useSearch } from './hooks/useSearch';
import { searchBooks } from './api/searchApi';
import { SearchInput } from './components/SearchInput';
import { SearchResults } from './components/SearchResults';
import './App.css';

// ─────────────────────────────────────────────
// App Component — the "Orchestrator"
// ─────────────────────────────────────────────
// This component's job is to:
//  1. Own the "is the dropdown open?" state
//  2. Connect SearchInput and SearchResults to the useSearch hook
//  3. Handle the "click outside to close" behavior
//  4. Handle keyboard focus flow between input and results

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  // useSearch is our custom hook — all the heavy logic lives there.
  // We just pass it the async fetch function and a debounce delay.
  const { query, results, status, search, clear } = useSearch({
    fetchFn: searchBooks,
    delay: 400,
  });

  // ── CLICK OUTSIDE ──
  // We attach a ref to the outer wrapper div. When a click event fires
  // anywhere in the document, we check if the click was INSIDE our wrapper.
  // If not, we close the dropdown.
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    };

    // We listen on the document, in the "capture" phase so we catch it first
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup: always remove event listeners when the effect re-runs
    // or when the component unmounts, to prevent memory leaks.
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = useCallback((value) => {
    search(value);
    setIsOpen(true);
    setActiveIndex(-1);
  }, [search]);

  const handleClear = useCallback(() => {
    clear();
    setIsOpen(false);
    setActiveIndex(-1);
  }, [clear]);

  // ── KEYBOARD NAVIGATION: HANDOFF FROM INPUT → DROPDOWN ──
  //
  // At that moment activeIndex is -1 (nothing selected yet).
  // Pressing ↓ should move the highlight to the very FIRST result,
  // so we jump straight to index 0 — the top of the list.
  //
  // From there, further ↓/↑ key presses are handled INSIDE
  // <SearchResults>, which increments/decrements activeIndex through
  // the rest of the list. This function only handles the one-time
  // "hand-off" from the input to the list.
  //
  // The guard `if (results.length > 0)` prevents trying to highlight
  // an item when the results array is empty — nothing to highlight.
  const handleArrowDown = useCallback(() => {
    if (results.length > 0) {
      setActiveIndex(0); // jump to the first dropdown result
    }
  }, [results]);

  const handleSelect = useCallback((result) => {
    // In a real app: navigate to item, fill a form, etc.
    // For now: fill the input and close the dropdown.
    search(result.title);
    setIsOpen(false);
    setActiveIndex(-1);
  }, [search]);

  const showDropdown = isOpen && query.trim().length > 0;

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>📚 Book Search</h1>
        <p className="app-subtitle">
        	Live Search with Autocomplete
        </p>
      </header>

      <main className="search-wrapper" ref={wrapperRef}>
        <SearchInput
          value={query}
          onChange={handleChange}
          onClear={handleClear}
          onArrowDown={handleArrowDown}
          isLoading={status === 'loading'}
          placeholder="Search for a book title..."
        />

        {showDropdown && (
          <div className="dropdown-container">
            {status === 'loading' && (
              <div className="dropdown-message">Searching...</div>
            )}

            {status === 'error' && (
              <div className="dropdown-message error">
                ⚠️ Failed to fetch results. Check your connection.
              </div>
            )}

            {status === 'success' && results.length === 0 && (
              <div className="dropdown-message">
                No results for "{query}"
              </div>
            )}

            {status === 'success' && results.length > 0 && (
              <SearchResults
                results={results}
                query={query}
                onSelect={handleSelect}
                onClose={handleClear}
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
              />
            )}
          </div>
        )}
      </main>

      <footer className="hooks-used">
        <strong>Hooks used in this project:</strong>
        <div className="hooks-list">
          <span>useState</span>
          <span>useEffect</span>
          <span>useRef</span>
          <span>useCallback</span>
          <span>useMemo</span>
          <span>useReducer</span>
          <span>Custom Hook</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
