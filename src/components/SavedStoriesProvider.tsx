import { useCallback, useMemo, useState, type ReactNode } from "react";
import type { HNItem } from "../lib/hn";
import { SAVED_STORIES_STORAGE_KEY, SavedStoriesContext } from "../lib/savedStoriesContext";

function readStoredItems(): HNItem[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(SAVED_STORIES_STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function SavedStoriesProvider({ children }: { children: ReactNode }) {
  const [savedItems, setSavedItems] = useState<HNItem[]>(readStoredItems);

  const isSaved = useCallback((id: number) => savedItems.some((item) => item.id === id), [savedItems]);

  // Snapshotting the item at save time (rather than re-fetching by id later)
  // keeps the Saved view instant and offline-friendly; score/comment counts
  // there are "as of when you saved it", which is fine for a reading list.
  const toggleSaved = useCallback((item: HNItem) => {
    setSavedItems((prev) => {
      const next = prev.some((saved) => saved.id === item.id)
        ? prev.filter((saved) => saved.id !== item.id)
        : [item, ...prev];
      localStorage.setItem(SAVED_STORIES_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const value = useMemo(() => ({ savedItems, isSaved, toggleSaved }), [savedItems, isSaved, toggleSaved]);

  return <SavedStoriesContext.Provider value={value}>{children}</SavedStoriesContext.Provider>;
}
