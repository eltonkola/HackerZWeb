import type { FeedKey } from "./lib/hn";

export const PATH_BY_FEED: Record<FeedKey, string> = {
  top: "/news",
  new: "/newest",
  best: "/best",
  ask: "/ask",
  show: "/show",
  job: "/jobs",
};

export const FEED_BY_PATH: Record<string, FeedKey> = {
  "/": "top",
  "/news": "top",
  "/news2": "top",
  "/front": "top",
  "/newest": "new",
  "/best": "best",
  "/ask": "ask",
  "/askstories": "ask",
  "/show": "show",
  "/shownew": "show",
  "/jobs": "job",
};

export const FEED_LABEL: Record<FeedKey, string> = {
  top: "Top Stories",
  new: "New",
  best: "Best",
  ask: "Ask HN",
  show: "Show HN",
  job: "Jobs",
};

export const SAVED_PATH = "/saved";

export type Route = { type: "feed"; feed: FeedKey } | { type: "item"; id: number } | { type: "saved" };

export function itemPath(id: number): string {
  return `/item?id=${id}`;
}

/** Reads the route the extension should render for the current URL, or null to leave the native page alone. */
export function routeFromLocation(location: Pick<Location, "pathname" | "search">): Route | null {
  if (location.pathname === "/item") {
    const id = Number(new URLSearchParams(location.search).get("id"));
    return Number.isInteger(id) && id > 0 ? { type: "item", id } : null;
  }
  if (location.pathname === SAVED_PATH) return { type: "saved" };
  const feed = FEED_BY_PATH[location.pathname];
  return feed ? { type: "feed", feed } : null;
}
