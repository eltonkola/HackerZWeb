import { createContext } from "react";

export interface ReaderButtonSettings {
  showReadButton: boolean;
  setShowReadButton: (value: boolean) => void;
  showArchiveButton: boolean;
  setShowArchiveButton: (value: boolean) => void;
}

export const READ_BUTTON_STORAGE_KEY = "hn-tablet-show-read-button";
export const ARCHIVE_BUTTON_STORAGE_KEY = "hn-tablet-show-archive-button";

export const ReaderButtonsContext = createContext<ReaderButtonSettings | null>(null);
