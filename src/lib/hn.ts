export type FeedKey = "top" | "new" | "best" | "ask" | "show" | "job";

export interface HNItem {
  id: number;
  title: string;
  url?: string;
  score?: number;
  by?: string;
  time: number;
  descendants?: number;
  type: string;
  text?: string;
  kids?: number[];
  dead?: boolean;
  deleted?: boolean;
}

export interface CommentNode {
  item: HNItem;
  children: CommentNode[];
}

export interface CommentTree {
  roots: CommentNode[];
  fetchedCount: number;
  truncated: boolean;
}

const API_ROOT = "https://hacker-news.firebaseio.com/v0";

const FEED_ENDPOINTS: Record<FeedKey, string> = {
  top: "topstories",
  new: "newstories",
  best: "beststories",
  ask: "askstories",
  show: "showstories",
  job: "jobstories",
};

export async function fetchStoryIds(feed: FeedKey): Promise<number[]> {
  const res = await fetch(`${API_ROOT}/${FEED_ENDPOINTS[feed]}.json`);
  if (!res.ok) throw new Error(`Failed to load ${feed} stories`);
  return res.json();
}

export async function fetchItem(id: number): Promise<HNItem | null> {
  const res = await fetch(`${API_ROOT}/item/${id}.json`);
  if (!res.ok) return null;
  return res.json();
}

export async function fetchItems(ids: number[]): Promise<HNItem[]> {
  const items = await Promise.all(ids.map((id) => fetchItem(id)));
  return items.filter(
    (item): item is HNItem => item !== null && !item.deleted && !item.dead,
  );
}

const MAX_THREAD_COMMENTS = 200;

export async function fetchCommentTree(
  rootIds: number[],
  maxComments: number = MAX_THREAD_COMMENTS,
): Promise<CommentTree> {
  let fetchedCount = 0;
  let truncated = false;

  async function fetchLevel(ids: number[]): Promise<CommentNode[]> {
    if (ids.length === 0) return [];
    if (fetchedCount >= maxComments) {
      truncated = true;
      return [];
    }
    const allowed = ids.slice(0, maxComments - fetchedCount);
    if (allowed.length < ids.length) truncated = true;
    // Reserve the budget synchronously, before the `await` below — sibling
    // branches recurse concurrently, and incrementing only after the fetch
    // resolves let them all read the same stale `fetchedCount` and blow
    // past `maxComments`.
    fetchedCount += allowed.length;

    // Deliberately not using `fetchItems` here: it drops dead/deleted
    // comments, but a dead/deleted comment can still have live, visible
    // replies in its `kids` — we need the item (to find those kids) even
    // when we won't render its own content.
    const items = (await Promise.all(allowed.map((id) => fetchItem(id)))).filter(
      (item): item is HNItem => item !== null,
    );

    return Promise.all(
      items.map(async (item) => ({
        item,
        children: await fetchLevel(item.kids ?? []),
      })),
    );
  }

  const roots = await fetchLevel(rootIds);
  return { roots, fetchedCount, truncated };
}

export function getDomain(url?: string): string | null {
  if (!url) return null;
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

export function faviconUrl(domain: string): string {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
}

export function itemUrl(id: number): string {
  return `https://news.ycombinator.com/item?id=${id}`;
}

export function timeAgo(unixSeconds: number): string {
  const seconds = Math.max(1, Math.floor(Date.now() / 1000 - unixSeconds));
  const units: [number, string][] = [
    [31536000, "y"],
    [2592000, "mo"],
    [86400, "d"],
    [3600, "h"],
    [60, "m"],
  ];
  for (const [unitSeconds, label] of units) {
    const value = Math.floor(seconds / unitSeconds);
    if (value >= 1) return `${value}${label} ago`;
  }
  return "just now";
}
