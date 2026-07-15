import type { HNItem } from "./hn";

const SEARCH_API = "https://hn.algolia.com/api/v1/search";

interface AlgoliaHit {
  objectID: string;
  title: string | null;
  url: string | null;
  author: string;
  points: number | null;
  num_comments: number | null;
  created_at_i: number;
}

interface AlgoliaResponse {
  hits: AlgoliaHit[];
}

export async function searchStories(query: string): Promise<HNItem[]> {
  const res = await fetch(`${SEARCH_API}?query=${encodeURIComponent(query)}&tags=story`);
  if (!res.ok) throw new Error("Search failed");
  const data: AlgoliaResponse = await res.json();
  return data.hits.map((hit) => ({
    id: Number(hit.objectID),
    title: hit.title ?? "(untitled)",
    url: hit.url ?? undefined,
    score: hit.points ?? 0,
    by: hit.author,
    time: hit.created_at_i,
    descendants: hit.num_comments ?? 0,
    type: "story",
  }));
}
