import { createContext } from "react";
import type { HNItem } from "./hn";

export interface SavedStoriesApi {
  savedItems: HNItem[];
  isSaved: (id: number) => boolean;
  toggleSaved: (item: HNItem) => void;
}

export const SAVED_STORIES_STORAGE_KEY = "hn-tablet-saved-stories";

export const SavedStoriesContext = createContext<SavedStoriesApi | null>(null);
