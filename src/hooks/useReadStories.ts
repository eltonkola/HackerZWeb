import { useContext } from "react";
import { ReadStoriesContext } from "../lib/readStoriesContext";

export function useReadStories() {
  const ctx = useContext(ReadStoriesContext);
  if (!ctx) throw new Error("useReadStories must be used within a ReadStoriesProvider");
  return ctx;
}
