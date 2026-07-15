import { useContext } from "react";
import { ReaderButtonsContext, type ReaderButtonSettings } from "../lib/readerButtonsContext";

export function useReaderButtons(): ReaderButtonSettings {
  const ctx = useContext(ReaderButtonsContext);
  if (!ctx) throw new Error("useReaderButtons must be used within a ReaderButtonsProvider");
  return ctx;
}
