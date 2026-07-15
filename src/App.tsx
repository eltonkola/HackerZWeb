import { useEffect, useState } from "react";
import { Button, Spinner } from "@heroui/react";
import { CommandPalette, type CommandAction } from "./components/CommandPalette";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { StoryRow } from "./components/StoryRow";
import { SkeletonRow } from "./components/SkeletonRow";
import { useAccentColor } from "./hooks/useAccentColor";
import { useDensity } from "./hooks/useDensity";
import { useFeed } from "./hooks/useFeed";
import { useFontSize } from "./hooks/useFontSize";
import { useReadStories } from "./hooks/useReadStories";
import { useSavedStories } from "./hooks/useSavedStories";
import { useSearch } from "./hooks/useSearch";
import { useSidebarCollapsed } from "./hooks/useSidebarCollapsed";
import { useTheme } from "./hooks/useTheme";
import { isAnyModalOpen } from "./lib/modalStack";
import { FEED_LABEL } from "./routes";
import { itemUrl, type FeedKey, type HNItem } from "./lib/hn";

const FEED_ORDER: FeedKey[] = ["top", "new", "best", "ask", "show", "job"];

interface AppProps {
  feed?: FeedKey;
  onFeedChange?: (feed: FeedKey) => void;
  showSaved?: boolean;
  onShowSavedChange?: () => void;
  onOpenItem?: (id: number) => void;
  activeItemId?: number | null;
}

function App({
  feed: controlledFeed,
  onFeedChange,
  showSaved = false,
  onShowSavedChange,
  onOpenItem,
  activeItemId,
}: AppProps = {}) {
  const [internalFeed, setInternalFeed] = useState<FeedKey>(controlledFeed ?? "top");
  const feed = controlledFeed ?? internalFeed;
  const handleFeedChange = (next: FeedKey) => {
    setInternalFeed(next);
    onFeedChange?.(next);
  };
  const handleOpenItem = onOpenItem ?? ((id: number) => window.open(itemUrl(id), "_blank"));

  const { mode, setMode } = useTheme();
  const { accent, setAccent } = useAccentColor();
  const { fontSize, setFontSize } = useFontSize();
  const { density, setDensity } = useDensity();
  const [sidebarCollapsed, setSidebarCollapsed] = useSidebarCollapsed();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const {
    items: feedItems,
    isInitialLoading,
    isLoadingMore,
    hasMore,
    error: feedError,
    loadMore,
  } = useFeed(feed);
  const search = useSearch(searchQuery);
  const { savedItems, isSaved, toggleSaved } = useSavedStories();
  const { isRead } = useReadStories();

  const isSearching = searchQuery.trim().length > 0;
  const items: HNItem[] = isSearching ? search.results : showSaved ? savedItems : feedItems;
  const isLoading = isSearching ? search.isLoading : !showSaved && isInitialLoading;
  const error = isSearching ? search.error : showSaved ? null : feedError;

  const viewKey = isSearching ? `search:${searchQuery}` : showSaved ? "saved" : `feed:${feed}`;
  const [focusedIndex, setFocusedIndex] = useState(-1);
  useEffect(() => {
    setFocusedIndex(-1);
  }, [viewKey]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const isMod = e.metaKey || e.ctrlKey;
      if (isMod && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsPaletteOpen(true);
        return;
      }
      // Disabled while any dialog or the item panel is open (they register
      // on the same stack) or while typing anywhere — j/k/Enter should only
      // steer this row list, never hijack a keystroke meant for a field.
      if (isAnyModalOpen()) return;
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;

      if (items.length === 0) return;
      if (e.key === "j" || e.key === "ArrowDown") {
        e.preventDefault();
        setFocusedIndex((i) => Math.min(i + 1, items.length - 1));
      } else if (e.key === "k" || e.key === "ArrowUp") {
        e.preventDefault();
        setFocusedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        const focused = items[focusedIndex];
        if (!focused) return;
        e.preventDefault();
        handleOpenItem(focused.id);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, focusedIndex]);

  const paletteActions: CommandAction[] = [
    ...FEED_ORDER.map((key) => ({
      id: `feed:${key}`,
      label: `Go to ${FEED_LABEL[key]}`,
      run: () => handleFeedChange(key),
    })),
    { id: "saved", label: "Go to Saved stories", run: () => onShowSavedChange?.() },
    { id: "theme-light", label: "Switch to Light theme", run: () => setMode("light") },
    { id: "theme-dark", label: "Switch to Dark theme", run: () => setMode("dark") },
    { id: "theme-system", label: "Switch to System theme", run: () => setMode("system") },
    {
      id: "toggle-sidebar",
      label: sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar",
      run: () => setSidebarCollapsed((v) => !v),
    },
    { id: "settings", label: "Open Settings", run: () => setIsSettingsOpen(true) },
    { id: "about", label: "Open About", run: () => setIsAboutOpen(true) },
  ];

  return (
    <div className="flex h-full bg-background text-foreground">
      <Sidebar
        feed={feed}
        onFeedChange={handleFeedChange}
        showSaved={showSaved}
        onShowSavedChange={() => onShowSavedChange?.()}
        mode={mode}
        onModeChange={setMode}
        accent={accent}
        onAccentChange={setAccent}
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
        density={density}
        onDensityChange={setDensity}
        collapsed={sidebarCollapsed}
        isSettingsOpen={isSettingsOpen}
        onSettingsOpenChange={setIsSettingsOpen}
        isAboutOpen={isAboutOpen}
        onAboutOpenChange={setIsAboutOpen}
      />

      <div className="flex h-full flex-1 flex-col overflow-hidden">
        <Header
          feed={feed}
          showSaved={showSaved}
          collapsed={sidebarCollapsed}
          onToggleCollapsed={() => setSidebarCollapsed((v) => !v)}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          onOpenPalette={() => setIsPaletteOpen(true)}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-3xl pb-4 sm:pb-6">
            {isSearching && !search.isLoading && (
              <p className="px-3 pt-4 text-xs text-muted sm:px-4">
                {search.results.length} result{search.results.length === 1 ? "" : "s"} for "
                {searchQuery.trim()}"
              </p>
            )}

            {error && (
              <div className="mx-3 rounded-2xl border border-danger/30 bg-danger-soft p-6 text-center text-danger sm:mx-4">
                {error}
              </div>
            )}

            {!error && (
              <div className="divide-y divide-border">
                {isLoading && Array.from({ length: 12 }).map((_, i) => <SkeletonRow key={i} />)}

                {!isLoading && items.length === 0 && (
                  <p className="py-10 text-center text-sm text-muted">
                    {isSearching
                      ? "No stories found."
                      : showSaved
                        ? "No saved stories yet — bookmark one from a story's list row or its page."
                        : "Nothing here."}
                  </p>
                )}

                {!isLoading &&
                  items.map((item, index) => (
                    <StoryRow
                      key={item.id}
                      item={item}
                      rank={index + 1}
                      onOpen={handleOpenItem}
                      isActive={item.id === activeItemId}
                      isFocused={index === focusedIndex}
                      isRead={isRead(item.id)}
                      isSaved={isSaved(item.id)}
                      onToggleSaved={toggleSaved}
                    />
                  ))}
              </div>
            )}

            {!error && !isSearching && !showSaved && !isInitialLoading && hasMore && (
              <div className="flex justify-center pt-6">
                <Button
                  variant="outline"
                  onPress={loadMore}
                  isDisabled={isLoadingMore}
                  className="rounded-full px-6"
                >
                  {isLoadingMore ? <Spinner size="sm" /> : "Load more stories"}
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>

      <CommandPalette isOpen={isPaletteOpen} onClose={() => setIsPaletteOpen(false)} actions={paletteActions} />
    </div>
  );
}

export default App;
