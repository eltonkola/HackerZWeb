import type { ReactNode } from "react";
import { useLocalStorageState } from "../hooks/useLocalStorageState";
import {
  ARCHIVE_BUTTON_STORAGE_KEY,
  READ_BUTTON_STORAGE_KEY,
  ReaderButtonsContext,
} from "../lib/readerButtonsContext";

function parseBoolean(raw: string): boolean | undefined {
  return raw === "true" || raw === "false" ? raw === "true" : undefined;
}

/**
 * Off by default to keep the comments screen fast and simple — enabling
 * either flag is what lets `ItemView` render the Read/Archive buttons and
 * (for Archive) run the Wayback availability check at all.
 */
export function ReaderButtonsProvider({ children }: { children: ReactNode }) {
  const [showReadButton, setShowReadButton] = useLocalStorageState(
    READ_BUTTON_STORAGE_KEY,
    false,
    parseBoolean,
  );
  const [showArchiveButton, setShowArchiveButton] = useLocalStorageState(
    ARCHIVE_BUTTON_STORAGE_KEY,
    false,
    parseBoolean,
  );

  return (
    <ReaderButtonsContext.Provider
      value={{ showReadButton, setShowReadButton, showArchiveButton, setShowArchiveButton }}
    >
      {children}
    </ReaderButtonsContext.Provider>
  );
}
