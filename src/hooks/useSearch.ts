import { useEffect, useRef, useState } from "react";
import { searchStories } from "../lib/algolia";
import type { HNItem } from "../lib/hn";

const DEBOUNCE_MS = 250;

export function useSearch(query: string) {
  const [results, setResults] = useState<HNItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestId = useRef(0);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    const currentRequest = ++requestId.current;
    setIsLoading(true);
    setError(null);

    const timeout = setTimeout(() => {
      searchStories(trimmed)
        .then((hits) => {
          if (requestId.current !== currentRequest) return;
          setResults(hits);
          setIsLoading(false);
        })
        .catch((err) => {
          if (requestId.current !== currentRequest) return;
          setError(err instanceof Error ? err.message : "Search failed");
          setIsLoading(false);
        });
    }, DEBOUNCE_MS);

    return () => clearTimeout(timeout);
  }, [query]);

  return { results, isLoading, error };
}
