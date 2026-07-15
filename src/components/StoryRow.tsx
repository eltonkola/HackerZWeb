import type { MouseEvent } from "react";
import { Chip } from "@heroui/react";
import { type HNItem, getDomain, itemUrl, timeAgo } from "../lib/hn";
import { SiteIcon } from "./SiteIcon";
import { BookmarkIcon, CommentIcon, ScoreIcon } from "./icons";

export function StoryRow({
  item,
  rank,
  onOpen,
  isActive = false,
  isFocused = false,
  isRead = false,
  isSaved = false,
  onToggleSaved,
}: {
  item: HNItem;
  rank: number;
  onOpen: (id: number) => void;
  isActive?: boolean;
  isFocused?: boolean;
  isRead?: boolean;
  isSaved?: boolean;
  onToggleSaved?: (item: HNItem) => void;
}) {
  const domain = getDomain(item.url);
  const isJob = item.type === "job";

  const handleRowClick = (e: MouseEvent) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    onOpen(item.id);
  };

  return (
    <div
      className={`group relative flex items-center gap-3 border-l-2 px-3 py-[var(--row-padding-y)] transition-colors sm:gap-4 sm:px-4 ${
        isActive
          ? "border-l-accent bg-accent-soft"
          : "border-l-transparent hover:bg-surface"
      } ${isFocused ? "ring-2 ring-inset ring-accent/50" : ""}`}
    >
      <a
        href={itemUrl(item.id)}
        onClick={handleRowClick}
        aria-label={item.title}
        className="absolute inset-0"
      />

      <span className="w-5 shrink-0 text-right text-xs font-semibold tabular-nums text-muted">{rank}</span>
      <SiteIcon domain={domain} />

      <div className="min-w-0 flex-1">
        <h3
          className={`text-sm font-semibold leading-snug sm:text-base ${isRead ? "text-muted" : "text-foreground"}`}
        >
          {item.title}
        </h3>
        <p className="truncate text-xs text-muted">
          {domain && <>{domain} · </>}
          {item.by && <>by {item.by} · </>}
          {timeAgo(item.time)}
        </p>
      </div>

      {onToggleSaved && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleSaved(item);
          }}
          title={isSaved ? "Remove from saved" : "Save for later"}
          aria-label={isSaved ? "Remove from saved" : "Save for later"}
          aria-pressed={isSaved}
          className={`relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-accent-soft hover:text-accent ${
            isSaved ? "text-accent opacity-100" : "text-muted opacity-0 group-hover:opacity-100"
          }`}
        >
          <BookmarkIcon filled={isSaved} />
        </button>
      )}

      <div className="flex shrink-0 flex-col items-center gap-1 text-xs font-semibold">
        {isJob ? (
          <Chip color="accent" variant="soft" size="sm">
            Hiring
          </Chip>
        ) : (
          <span className="flex items-center gap-1 text-accent">
            <ScoreIcon />
            {item.score ?? 0}
          </span>
        )}
        <span className="flex items-center gap-1 text-muted">
          <CommentIcon />
          {item.descendants ?? 0}
        </span>
      </div>
    </div>
  );
}
