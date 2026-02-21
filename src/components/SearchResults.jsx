import { useRef, useCallback, useEffect } from 'react';
import { HighlightMatch } from './HighlightMatch';
import './SearchResults.css';

// ─────────────────────────────────────────────
// SearchResults Component
// ─────────────────────────────────────────────
// Props:
//   results       - array of result objects
//   query         - the search query (for highlighting)
//   onSelect      - called when a result is clicked/selected
//   onClose       - called when focus leaves the list  
//   activeIndex   - which item is keyboard-focused (-1 = none)
//   setActiveIndex - to update focused item from parent

export function SearchResults({ results, query, onSelect, onClose, activeIndex, setActiveIndex }) {

  // An array of refs — one per result item.
  // This lets us call .focus() or .scrollIntoView() on any item.
  const itemRefs = useRef([]);

  // When the activeIndex changes (via keyboard), scroll that item into
  // view smoothly and actually focus it for screen readers.
  useEffect(() => {
    if (activeIndex >= 0 && itemRefs.current[activeIndex]) {
      itemRefs.current[activeIndex].scrollIntoView({ block: 'nearest' });
      itemRefs.current[activeIndex].focus();
    }
  }, [activeIndex]);

  const handleKeyDown = useCallback((e, index) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((prev) => Math.min(prev + 1, results.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((prev) => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        if (results[index]) onSelect(results[index]);
        break;
      case 'Escape':
        onClose();
        break;
      default:
        break;
    }
  }, [results, onSelect, onClose, setActiveIndex]);

  if (!results.length) return null;

  return (
    <ul className="search-results" role="listbox" aria-label="Search results">
      {results.map((result, index) => (
        <li
          key={result.id}
          role="option"
          aria-selected={activeIndex === index}
          className={`search-result-item ${activeIndex === index ? 'active' : ''}`}
          // Store a ref to each li element in our array
          ref={(el) => (itemRefs.current[index] = el)}
          tabIndex={-1}  // allows focus without being in tab order
          onClick={() => onSelect(result)}
          onKeyDown={(e) => handleKeyDown(e, index)}
        >
          {result.coverUrl && (
            <img
              src={result.coverUrl}
              alt={`Cover for ${result.title}`}
              className="result-cover"
            />
          )}
          <div className="result-text">
            <span className="result-title">
              <HighlightMatch text={result.title} query={query} />
            </span>
            <span className="result-meta">{result.author} · {result.year}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
