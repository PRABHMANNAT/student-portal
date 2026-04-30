import { useEffect, useState } from 'react';

export function useHighlight(initialValue) {
  const [highlightedId, setHighlightedId] = useState(initialValue);

  useEffect(() => {
    setHighlightedId(initialValue);
  }, [initialValue]);

  return {
    highlightedId,
    setHighlightedId
  };
}

