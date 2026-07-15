import { createContext } from "react";

export interface ReadStoriesApi {
  isRead: (id: number) => boolean;
  markRead: (id: number) => void;
}

export const READ_STORIES_STORAGE_KEY = "hn-tablet-read-stories";

export const ReadStoriesContext = createContext<ReadStoriesApi | null>(null);
