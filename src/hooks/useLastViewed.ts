import { useState } from "react";

const STORAGE_KEY = "hn-tablet-last-viewed";
const MAX_TRACKED = 500;

function readMap(): Record<string, number> {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeMap(map: Record<string, number>) {
  const entries = Object.entries(map);
  const trimmed =
    entries.length > MAX_TRACKED
      ? Object.fromEntries(entries.sort((a, b) => a[1] - b[1]).slice(entries.length - MAX_TRACKED))
      : map;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
}

/**
 * Returns when this story was last viewed *before now* (or null if never),
 * then immediately records this visit for next time. Captured once via
 * useState's initializer — ItemView is remounted (via `key={id}`) on every
 * story change, so this naturally re-runs per visit without going stale
 * while the user is still reading.
 */
export function useLastViewed(id: number): number | null {
  const [previousVisitAt] = useState<number | null>(() => {
    const map = readMap();
    const previous = map[id] ?? null;
    map[id] = Math.floor(Date.now() / 1000);
    writeMap(map);
    return previous;
  });

  return previousVisitAt;
}
