import { useCallback, useMemo, useState, type ReactNode } from "react";
import { READ_STORIES_STORAGE_KEY, ReadStoriesContext } from "../lib/readStoriesContext";

// Caps how many ids we persist so a long-lived tab doesn't grow this
// forever — old reads just age out in FIFO order.
const MAX_TRACKED = 2000;

function readStoredIds(): Set<number> {
  try {
    const parsed = JSON.parse(localStorage.getItem(READ_STORIES_STORAGE_KEY) ?? "[]");
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch {
    return new Set();
  }
}

export function ReadStoriesProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<Set<number>>(readStoredIds);

  const isRead = useCallback((id: number) => ids.has(id), [ids]);

  const markRead = useCallback((id: number) => {
    setIds((prev) => {
      if (prev.has(id)) return prev;
      const merged = [...prev, id];
      const trimmed = merged.length > MAX_TRACKED ? merged.slice(merged.length - MAX_TRACKED) : merged;
      localStorage.setItem(READ_STORIES_STORAGE_KEY, JSON.stringify(trimmed));
      return new Set(trimmed);
    });
  }, []);

  const value = useMemo(() => ({ isRead, markRead }), [isRead, markRead]);

  return <ReadStoriesContext.Provider value={value}>{children}</ReadStoriesContext.Provider>;
}
