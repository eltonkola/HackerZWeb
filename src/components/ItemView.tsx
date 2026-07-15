import { useEffect, useState } from "react";
import { useItemThread } from "../hooks/useItemThread";
import { useLastViewed } from "../hooks/useLastViewed";
import { useReaderButtons } from "../hooks/useReaderButtons";
import { useReadStories } from "../hooks/useReadStories";
import { useSavedStories } from "../hooks/useSavedStories";
import { useWaybackAvailability } from "../hooks/useWaybackAvailability";
import { getDomain, itemUrl, timeAgo } from "../lib/hn";
import { sanitizeCommentHtml } from "../lib/sanitize";
import { SiteIcon } from "./SiteIcon";
import { ArticleReaderDialog } from "./ArticleReaderDialog";
import { CommentThread } from "./CommentThread";
import { SkeletonRow } from "./SkeletonRow";
import { ArchiveIcon, BackArrowIcon, BookmarkIcon, BookOpenIcon, ExternalLinkIcon } from "./icons";

type ReaderMode = "live" | "archive" | null;

export function ItemView({
  id,
  onBack,
  onTitleChange,
}: {
  id: number;
  onBack: () => void;
  onTitleChange?: (title: string) => void;
}) {
  const { story, roots, fetchedCount, truncated, isLoading, error } = useItemThread(id);
  const domain = story ? getDomain(story.url) : null;
  const [readerMode, setReaderMode] = useState<ReaderMode>(null);
  const { showReadButton, showArchiveButton } = useReaderButtons();
  const { markRead } = useReadStories();
  const { isSaved, toggleSaved } = useSavedStories();
  const previousVisitAt = useLastViewed(id);

  useEffect(() => {
    if (story) onTitleChange?.(story.title);
  }, [story, onTitleChange]);
  useEffect(() => {
    markRead(id);
  }, [id, markRead]);
  // Passing undefined when the flag is off skips the availability fetch
  // entirely — the whole point of gating this behind a setting.
  const archive = useWaybackAvailability(showArchiveButton ? story?.url : undefined);

  return (
    <div className="min-h-full bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
        <button
          type="button"
          onClick={onBack}
          className="mb-4 flex items-center gap-1.5 text-sm font-semibold text-muted transition-colors hover:text-accent"
        >
          <BackArrowIcon />
          Back
        </button>

        {error && (
          <div className="rounded-2xl border border-danger/30 bg-danger-soft p-6 text-center text-danger">
            {error}
          </div>
        )}

        {!error && !story && (
          <div className="flex flex-col gap-4">
            <div className="h-28 animate-pulse rounded-2xl bg-surface" />
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonRow key={i} />
            ))}
          </div>
        )}

        {story && (
          <>
            <div className="rounded-2xl border border-border bg-surface/60 p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <SiteIcon domain={domain} size="lg" />
                <div className="min-w-0 flex-1">
                  <h1 className="text-xl font-bold leading-snug text-foreground sm:text-2xl">{story.title}</h1>
                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
                    {domain && <span>{domain}</span>}
                    <span className="font-semibold text-accent">▲ {story.score ?? 0} points</span>
                    {story.by && <span>by {story.by}</span>}
                    <span>{timeAgo(story.time)}</span>
                  </div>
                </div>
                <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => toggleSaved(story)}
                    title={isSaved(story.id) ? "Remove from saved" : "Save for later"}
                    aria-label={isSaved(story.id) ? "Remove from saved" : "Save for later"}
                    aria-pressed={isSaved(story.id)}
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                      isSaved(story.id)
                        ? "bg-accent-soft text-accent"
                        : "bg-surface text-foreground hover:bg-accent-soft hover:text-accent"
                    }`}
                  >
                    <BookmarkIcon filled={isSaved(story.id)} />
                    {isSaved(story.id) ? "Saved" : "Save"}
                  </button>
                  {story.url && (
                    <>
                      {showReadButton && (
                        <button
                          type="button"
                          onClick={() => setReaderMode("live")}
                          className="flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground transition-opacity hover:opacity-90"
                        >
                          <BookOpenIcon />
                          Read
                        </button>
                      )}
                      {archive.available && (
                        <button
                          type="button"
                          onClick={() => setReaderMode("archive")}
                          title="View the Wayback Machine snapshot of this page"
                          className="flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-accent-soft hover:text-accent"
                        >
                          <ArchiveIcon />
                          Archive
                        </button>
                      )}
                      <a
                        href={story.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-accent-soft hover:text-accent"
                      >
                        Open
                        <ExternalLinkIcon />
                      </a>
                    </>
                  )}
                </div>
              </div>

              {story.text && (
                <div
                  className="hn-comment mt-4 border-t border-border pt-4 text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: sanitizeCommentHtml(story.text) }}
                />
              )}
            </div>

            <div className="mt-2">
              {isLoading && roots.length === 0 && (
                <div className="flex flex-col">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <SkeletonRow key={i} />
                  ))}
                </div>
              )}

              {!isLoading && roots.length === 0 && (
                <p className="py-8 text-center text-sm text-muted">No comments yet.</p>
              )}

              <CommentThread nodes={roots} newSinceTime={previousVisitAt} />

              {truncated && (
                <p className="mt-4 border-t border-border pt-4 text-center text-xs text-muted">
                  Showing the first {fetchedCount} comments.{" "}
                  <a
                    href={itemUrl(id)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-accent hover:underline"
                  >
                    View the rest on Hacker News ↗
                  </a>
                </p>
              )}
            </div>
          </>
        )}
      </div>

      {story?.url && readerMode && (
        <ArticleReaderDialog
          url={readerMode === "archive" && archive.snapshotUrl ? archive.snapshotUrl : story.url}
          title={readerMode === "archive" ? `${story.title} (Archived)` : story.title}
          isOpen
          onClose={() => setReaderMode(null)}
        />
      )}
    </div>
  );
}
