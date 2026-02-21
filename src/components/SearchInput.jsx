import { useRef, useCallback } from 'react';
import './SearchInput.css';

// ─────────────────────────────────────────────
// SearchInput Component
// ─────────────────────────────────────────────
// Props:
//   value         - the controlled input value
//   onChange      - called with the raw string as user types
//   onClear       - called when X is clicked or Escape pressed
//   onArrowDown   - called when user presses ArrowDown (focus moves to results list)
//   isLoading     - boolean to show spinner
//   placeholder   - input placeholder text

export function SearchInput({ value, onChange, onClear, onArrowDown, isLoading, placeholder = 'Search...' }) {

  // useRef gives us a direct handle to the DOM input element —
  // useful for focus management without triggering re-renders.
  const inputRef = useRef(null);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      onClear();
      inputRef.current?.blur();
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault(); // prevent page scroll
      onArrowDown();
    }
  }, [onClear, onArrowDown]);

  const handleClear = useCallback(() => {
    onClear();
    inputRef.current?.focus(); // return focus to input after clearing
  }, [onClear]);

  return (
    <div className="search-input-wrapper">
      <span className="search-icon" aria-hidden="true">🔍</span>
      <input
        ref={inputRef}
        type="text"
        className="search-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoComplete="off"
        aria-label="Search"
        aria-autocomplete="list"
        aria-haspopup="listbox"
      />
      {/* Show spinner while loading, X button when there is text */}
      {isLoading && <span className="search-spinner" aria-label="Loading" />}
      {!isLoading && value && (
        <button
          className="search-clear-btn"
          onClick={handleClear}
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  );
}
