import { useEffect, useState } from "react";
import { type CommentNode, type HNItem, fetchCommentTree, fetchItem } from "../lib/hn";

interface ThreadState {
  story: HNItem | null;
  roots: CommentNode[];
  fetchedCount: number;
  truncated: boolean;
  isLoading: boolean;
  error: string | null;
}

const INITIAL_STATE: ThreadState = {
  story: null,
  roots: [],
  fetchedCount: 0,
  truncated: false,
  isLoading: true,
  error: null,
};

export function useItemThread(id: number) {
  const [state, setState] = useState<ThreadState>(INITIAL_STATE);

  useEffect(() => {
    let cancelled = false;
    setState(INITIAL_STATE);

    fetchItem(id)
      .then(async (story) => {
        if (!story) throw new Error("This story couldn't be found.");
        if (cancelled) return;
        setState((s) => ({ ...s, story }));

        const { roots, fetchedCount, truncated } = await fetchCommentTree(story.kids ?? []);
        if (cancelled) return;
        setState((s) => ({ ...s, roots, fetchedCount, truncated, isLoading: false }));
      })
      .catch((err) => {
        if (cancelled) return;
        setState((s) => ({
          ...s,
          isLoading: false,
          error: err instanceof Error ? err.message : "Failed to load this story.",
        }));
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  return state;
}
