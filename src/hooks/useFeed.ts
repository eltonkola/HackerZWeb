import { useCallback, useEffect, useRef, useState } from "react";
import { type FeedKey, type HNItem, fetchItems, fetchStoryIds } from "../lib/hn";

const PAGE_SIZE = 18;

interface FeedState {
  ids: number[];
  items: HNItem[];
  loadedCount: number;
  isLoadingMore: boolean;
}

const cache = new Map<FeedKey, FeedState>();

export function useFeed(feed: FeedKey) {
  const [items, setItems] = useState<HNItem[]>(cache.get(feed)?.items ?? []);
  const [isInitialLoading, setIsInitialLoading] = useState(!cache.has(feed));
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestId = useRef(0);

  useEffect(() => {
    const currentRequest = ++requestId.current;
    // A loadMore from the previous feed may still be in flight; its own
    // requestId guard will no-op its results, but isLoadingMore is this same
    // hook instance's state, so reset it here or it'd stay stuck `true`.
    setIsLoadingMore(false);
    const cached = cache.get(feed);
    if (cached) {
      setItems(cached.items);
      setIsInitialLoading(false);
      setError(null);
      return;
    }

    setIsInitialLoading(true);
    setError(null);
    fetchStoryIds(feed)
      .then(async (ids) => {
        const firstPageIds = ids.slice(0, PAGE_SIZE);
        const firstPageItems = await fetchItems(firstPageIds);
        if (requestId.current !== currentRequest) return;
        cache.set(feed, {
          ids,
          items: firstPageItems,
          loadedCount: PAGE_SIZE,
          isLoadingMore: false,
        });
        setItems(firstPageItems);
        setIsInitialLoading(false);
      })
      .catch((err) => {
        if (requestId.current !== currentRequest) return;
        setError(err instanceof Error ? err.message : "Something went wrong");
        setIsInitialLoading(false);
      });
  }, [feed]);

  const hasMore = (cache.get(feed)?.ids.length ?? 0) > items.length;

  const loadMore = useCallback(async () => {
    const state = cache.get(feed);
    if (!state || isLoadingMore) return;
    // Guard against the feed changing (and requestId.current advancing) while
    // this fetch is in flight — without it, switching feeds mid-loadMore
    // would still land this stale page's items into the now-current feed.
    const currentRequest = requestId.current;
    setIsLoadingMore(true);
    const nextIds = state.ids.slice(state.loadedCount, state.loadedCount + PAGE_SIZE);
    const nextItems = await fetchItems(nextIds);
    if (requestId.current !== currentRequest) return;
    const merged = [...state.items, ...nextItems];
    cache.set(feed, {
      ...state,
      items: merged,
      loadedCount: state.loadedCount + PAGE_SIZE,
    });
    setItems(merged);
    setIsLoadingMore(false);
  }, [feed, isLoadingMore]);

  return { items, isInitialLoading, isLoadingMore, hasMore, error, loadMore };
}
