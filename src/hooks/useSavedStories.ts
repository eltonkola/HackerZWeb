import { useContext } from "react";
import { SavedStoriesContext } from "../lib/savedStoriesContext";

export function useSavedStories() {
  const ctx = useContext(SavedStoriesContext);
  if (!ctx) throw new Error("useSavedStories must be used within a SavedStoriesProvider");
  return ctx;
}
