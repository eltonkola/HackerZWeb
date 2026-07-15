import { useState, type KeyboardEvent } from "react";
import { FEED_LABEL } from "../routes";
import type { FeedKey } from "../lib/hn";
import { CloseIcon, CommandIcon, PanelToggleIcon, SearchIcon } from "./icons";

export function Header({
  feed,
  showSaved,
  collapsed,
  onToggleCollapsed,
  searchQuery,
  onSearchQueryChange,
  onOpenPalette,
}: {
  feed: FeedKey;
  showSaved: boolean;
  collapsed: boolean;
  onToggleCollapsed: () => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onOpenPalette: () => void;
}) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const showSearchInput = isSearchOpen || searchQuery.length > 0;

  const closeSearch = () => {
    onSearchQueryChange("");
    setIsSearchOpen(false);
  };

  const handleSearchKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      closeSearch();
    }
  };

  return (
    <header className="relative flex shrink-0 items-center gap-3 border-b border-border bg-background/80 px-4 py-4 backdrop-blur-md sm:px-6">
      <button
        type="button"
        onClick={onToggleCollapsed}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="flex size-8 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface hover:text-foreground"
      >
        <PanelToggleIcon collapsed={collapsed} />
      </button>

      {/* The search input overlays the title in a narrow header rather than
          squeezing in alongside it — this column can be as narrow as ~330px
          (sidebar + list share it), too tight to fit both comfortably. */}
      <h1
        className={`shrink-0 text-lg font-bold leading-tight text-foreground transition-opacity ${
          showSearchInput ? "opacity-0" : ""
        }`}
      >
        {showSaved ? "Saved" : FEED_LABEL[feed]}
      </h1>

      {showSearchInput && (
        <div className="absolute inset-y-0 left-14 right-4 flex items-center gap-2 bg-background/80 backdrop-blur-md sm:left-[4.5rem] sm:right-6">
          <div className="relative flex-1">
            <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted" />
            <input
              autoFocus
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search HN…"
              aria-label="Search Hacker News"
              className="w-full rounded-full bg-surface py-1.5 pl-8 pr-8 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <button
              type="button"
              onClick={closeSearch}
              aria-label="Close search"
              className="absolute right-1.5 top-1/2 flex size-5 -translate-y-1/2 items-center justify-center rounded-full text-muted hover:text-foreground"
            >
              <CloseIcon className="size-3" />
            </button>
          </div>
        </div>
      )}

      <div className="ml-auto flex shrink-0 items-center gap-2">
        {!showSearchInput && (
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            title="Search"
            aria-label="Search Hacker News"
            className="flex size-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface hover:text-foreground"
          >
            <SearchIcon className="size-4" />
          </button>
        )}
        <button
          type="button"
          onClick={onOpenPalette}
          title="Command palette (⌘K)"
          aria-label="Open command palette"
          className="hidden size-8 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface hover:text-foreground sm:flex"
        >
          <CommandIcon className="size-4" />
        </button>
      </div>
    </header>
  );
}
