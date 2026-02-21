import { useReducer, useRef, useCallback, useEffect } from 'react';

// ─────────────────────────────────────────────
// 1. STATE SHAPE & REDUCER
// ─────────────────────────────────────────────
// Instead of many useState calls, we use ONE useReducer.
// This is the recommended pattern for complex state that
// transitions between a set of known "phases" (like a fetch cycle).

const initialState = {
  status: 'idle',   // 'idle' | 'loading' | 'success' | 'error'
  query: '',
  results: [],
  error: null,
};

// A "reducer" is a pure function: (currentState, action) => newState
// It makes state transitions explicit and predictable.
function searchReducer(state, action) {
  switch (action.type) {
    case 'SET_QUERY':
      return { ...state, query: action.payload };

    case 'FETCH_START':
      return { ...state, status: 'loading', error: null };

    case 'FETCH_SUCCESS':
      return { ...state, status: 'success', results: action.payload };

    case 'FETCH_ERROR':
      return { ...state, status: 'error', results: [], error: action.payload };

    case 'CLEAR':
      return { ...initialState };

    default:
      return state;
  }
}

// ─────────────────────────────────────────────
// 2. THE CUSTOM HOOK
// ─────────────────────────────────────────────
// A "custom hook" is just a regular JavaScript function that uses
// other React hooks inside it. By convention its name starts with "use".
// Extracting logic into a custom hook means your component code stays
// clean — it just calls useSearch() and gets back what it needs.

export function useSearch({ fetchFn, delay = 400 }) {
  const [state, dispatch] = useReducer(searchReducer, initialState);

  // useRef is perfect for the debounce timer.
  // Unlike useState, CHANGING a ref does NOT trigger a re-render.
  // We don't want the component to re-render just because we set a timer.
  const debounceTimer = useRef(null);

  // useCallback memoizes a function so it keeps the same reference
  // between renders unless its dependencies change.
  // This is important when passing callbacks to child components,
  // as it prevents unnecessary re-renders of those children.
  const search = useCallback((rawQuery) => {
    const query = rawQuery.trim();
    dispatch({ type: 'SET_QUERY', payload: rawQuery });

    // If the user clears the input, reset immediately
    if (!query) {
      clearTimeout(debounceTimer.current);
      dispatch({ type: 'CLEAR' });
      return;
    }

    // ── DEBOUNCING ──
    // Clear any existing pending timer before setting a new one.
    // This means the API call only fires `delay`ms AFTER the user
    // stops typing, not on every single keystroke.
    clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(async () => {
      dispatch({ type: 'FETCH_START' });
      try {
        const results = await fetchFn(query);
        dispatch({ type: 'FETCH_SUCCESS', payload: results });
      } catch (err) {
        dispatch({ type: 'FETCH_ERROR', payload: err.message });
      }
    }, delay);
  }, [fetchFn, delay]);

  const clear = useCallback(() => {
    clearTimeout(debounceTimer.current);
    dispatch({ type: 'CLEAR' });
  }, []);

  // Cleanup: if the component unmounts while a timer is pending,
  // cancel it to avoid calling dispatch on an unmounted component.
  useEffect(() => {
    return () => clearTimeout(debounceTimer.current);
  }, []);

  return { ...state, search, clear };
}
