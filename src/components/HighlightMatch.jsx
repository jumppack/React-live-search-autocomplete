// ─────────────────────────────────────────────
// HighlightMatch Component
// ─────────────────────────────────────────────
// A tiny utility component that takes a text string and a query,
// splits the text at matching positions, and wraps the matching
// parts in a <mark> tag. This is a very common interview requirement.
// 
// We use useMemo here to avoid re-running the regex on every render.
// Since this component can render 8 times per search (once per result),
// this small memoization adds up.

import { useMemo } from 'react';

export function HighlightMatch({ text, query }) {
  // useMemo runs the function only when `text` or `query` changes.
  // It returns the CACHED result on subsequent renders.
  const parts = useMemo(() => {
    if (!query.trim()) return [{ text, highlight: false }];

    // Escape any special regex characters in the query
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    const segments = text.split(regex);

    return segments.map((segment) => ({
      text: segment,
      highlight: regex.test(segment),
    }));
  }, [text, query]);

  return (
    <>
      {parts.map((part, i) =>
        part.highlight ? (
          <mark key={i} className="highlight">{part.text}</mark>
        ) : (
          <span key={i}>{part.text}</span>
        )
      )}
    </>
  );
}
