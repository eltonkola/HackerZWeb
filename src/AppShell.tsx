import type { CSSProperties } from "react";
import { useCallback, useEffect, useState } from "react";
import App from "./App";
import { ItemView } from "./components/ItemView";
import { ReaderButtonsProvider } from "./components/ReaderButtonsProvider";
import { ReadStoriesProvider } from "./components/ReadStoriesProvider";
import { SavedStoriesProvider } from "./components/SavedStoriesProvider";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { useResizableWidth } from "./hooks/useResizableWidth";
import { pushModal } from "./lib/modalStack";
import { FEED_LABEL, PATH_BY_FEED, SAVED_PATH, itemPath, routeFromLocation, type Route } from "./routes";
import type { FeedKey } from "./lib/hn";

const LIST_WIDTH_KEY = "hn-tablet-list-width";
// The list column also hosts the sidebar (64-208px), so these bounds leave
// enough room for the row content next to it either way.
const DEFAULT_LIST_WIDTH = 800;
const MIN_LIST_WIDTH = 600;
const MAX_LIST_WIDTH = 1200;

export function AppShell({ initialRoute }: { initialRoute: Route }) {
  const [feed, setFeed] = useState<FeedKey>(initialRoute.type === "feed" ? initialRoute.feed : "top");
  const [showSaved, setShowSaved] = useState(initialRoute.type === "saved");
  const [openItemId, setOpenItemId] = useState<number | null>(
    initialRoute.type === "item" ? initialRoute.id : null,
  );
  const [itemTitle, setItemTitle] = useState<string | null>(null);
  const { width: listWidth, startDrag } = useResizableWidth(
    LIST_WIDTH_KEY,
    DEFAULT_LIST_WIDTH,
    MIN_LIST_WIDTH,
    MAX_LIST_WIDTH,
  );

  useEffect(() => {
    const onPopState = () => {
      const next = routeFromLocation(window.location);
      if (!next) return;
      if (next.type === "feed") {
        setShowSaved(false);
        setFeed(next.feed);
        setOpenItemId(null);
      } else if (next.type === "saved") {
        setShowSaved(true);
        setOpenItemId(null);
      } else {
        setOpenItemId(next.id);
      }
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  // Single source of truth for document.title, covering every way the route
  // can change: nav clicks, browser back/forward, and initial load — plus
  // updating once the opened story's real title arrives.
  useEffect(() => {
    document.title =
      openItemId !== null
        ? `${itemTitle ?? "Loading…"} | HackerZ`
        : `${showSaved ? "Saved" : FEED_LABEL[feed]} | HackerZ`;
  }, [openItemId, itemTitle, feed, showSaved]);

  useEffect(() => {
    setItemTitle(null);
  }, [openItemId]);

  const closeItem = useCallback(() => {
    window.history.pushState({ hackerz: true }, "", showSaved ? SAVED_PATH : PATH_BY_FEED[feed]);
    setOpenItemId(null);
  }, [feed, showSaved]);

  useEffect(() => {
    if (openItemId === null) return;
    // Registers the panel itself with the shared Escape stack, alongside any
    // dialogs (Settings, article reader, ...) — Escape closes only whichever
    // is topmost instead of every open one racing.
    return pushModal(closeItem);
  }, [openItemId, closeItem]);

  const goToFeed = (next: FeedKey) => {
    const path = PATH_BY_FEED[next];
    if (window.location.pathname !== path) {
      window.history.pushState({ hackerz: true }, "", path);
    }
    setShowSaved(false);
    setFeed(next);
    setOpenItemId(null);
  };

  const goToSaved = () => {
    if (window.location.pathname !== SAVED_PATH) {
      window.history.pushState({ hackerz: true }, "", SAVED_PATH);
    }
    setShowSaved(true);
    setOpenItemId(null);
  };

  const openItem = (id: number) => {
    window.history.pushState({ hackerz: true }, "", itemPath(id));
    setOpenItemId(id);
  };

  return (
    <ReaderButtonsProvider>
      <ReadStoriesProvider>
        <SavedStoriesProvider>
          <div className="flex h-screen overflow-hidden bg-background text-foreground">
            {/* List (+ sidebar). Full width until something's open, then a
                fixed/resizable rail on desktop — but on mobile it's hidden
                entirely in favor of the full-screen item overlay below. */}
            <div
              style={{ "--list-width": `${listWidth}px` } as CSSProperties}
              className={`h-full w-full overflow-hidden md:w-[var(--list-width)] md:shrink-0 md:border-r md:border-border ${
                openItemId !== null ? "hidden md:block" : "block"
              }`}
            >
              <App
                feed={feed}
                onFeedChange={goToFeed}
                showSaved={showSaved}
                onShowSavedChange={goToSaved}
                onOpenItem={openItem}
                activeItemId={openItemId}
              />
            </div>

            <div
              onPointerDown={startDrag}
              role="separator"
              aria-orientation="vertical"
              aria-label="Resize panel"
              className="hidden w-1.5 shrink-0 cursor-col-resize touch-none bg-transparent transition-colors hover:bg-accent-soft md:block"
            />

            {/* Third panel: welcome screen (desktop-only) or the story — a single
                mount point so opening a story only fetches its data once. On
                mobile a story takes over as a full-screen overlay instead of a
                persistent panel; on desktop it docks into the flex row. */}
            <div
              className={
                openItemId !== null
                  ? "fixed inset-0 z-20 h-full w-full overflow-y-auto bg-background motion-safe:animate-[hn-slide-in_0.18s_ease-out] md:static md:z-auto md:h-full md:flex-1 md:animate-none"
                  : "hidden h-full flex-1 overflow-y-auto md:block"
              }
            >
              {openItemId !== null ? (
                // `key` forces a full remount when navigating between stories —
                // otherwise ItemView's local state (readerMode, etc.) would leak
                // from the previous story into the next one.
                <ItemView key={openItemId} id={openItemId} onBack={closeItem} onTitleChange={setItemTitle} />
              ) : (
                <WelcomeScreen />
              )}
            </div>
          </div>
        </SavedStoriesProvider>
      </ReadStoriesProvider>
    </ReaderButtonsProvider>
  );
}
