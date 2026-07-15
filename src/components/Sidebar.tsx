import type { ComponentType } from "react";
import type { FeedKey } from "../lib/hn";
import type { Density, FontSize, ThemeMode } from "../lib/theme";
import { AboutDialog } from "./AboutDialog";
import { AboutMenu } from "./AboutMenu";
import { SettingsDialog } from "./SettingsDialog";
import { SettingsMenu } from "./SettingsMenu";
import { BookmarkIcon, BriefcaseIcon, ClockIcon, EyeIcon, FlameIcon, QuestionIcon, StarIcon } from "./icons";

const NAV_ITEMS: { key: FeedKey; label: string; icon: ComponentType<{ className?: string }> }[] = [
  { key: "top", label: "Top", icon: FlameIcon },
  { key: "new", label: "New", icon: ClockIcon },
  { key: "best", label: "Best", icon: StarIcon },
  { key: "ask", label: "Ask", icon: QuestionIcon },
  { key: "show", label: "Show", icon: EyeIcon },
  { key: "job", label: "Jobs", icon: BriefcaseIcon },
];

export function Sidebar({
  feed,
  onFeedChange,
  showSaved,
  onShowSavedChange,
  mode,
  onModeChange,
  accent,
  onAccentChange,
  fontSize,
  onFontSizeChange,
  density,
  onDensityChange,
  collapsed,
  isSettingsOpen,
  onSettingsOpenChange,
  isAboutOpen,
  onAboutOpenChange,
}: {
  feed: FeedKey;
  onFeedChange: (feed: FeedKey) => void;
  showSaved: boolean;
  onShowSavedChange: () => void;
  mode: ThemeMode;
  onModeChange: (mode: ThemeMode) => void;
  accent: string;
  onAccentChange: (accent: string) => void;
  fontSize: FontSize;
  onFontSizeChange: (size: FontSize) => void;
  density: Density;
  onDensityChange: (density: Density) => void;
  collapsed: boolean;
  isSettingsOpen: boolean;
  onSettingsOpenChange: (isOpen: boolean) => void;
  isAboutOpen: boolean;
  onAboutOpenChange: (isOpen: boolean) => void;
}) {
  return (
    <aside
      className={`flex h-full shrink-0 flex-col border-r border-border bg-surface/40 transition-[width] duration-150 ${
        collapsed ? "w-16" : "w-52"
      }`}
    >
      <button
        type="button"
        onClick={() => onFeedChange("top")}
        title="Go to Top Stories"
        aria-label="Go to Top Stories"
        className="flex items-center gap-2 px-3 py-4 text-left transition-opacity hover:opacity-80"
      >
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent text-sm font-bold text-accent-foreground">
          Y
        </div>
        {!collapsed && <span className="truncate text-sm font-bold text-foreground">HackerZ</span>}
      </button>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-2">
        {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => onFeedChange(key)}
            title={label}
            aria-current={!showSaved && feed === key}
            className={`flex items-center gap-3 rounded-xl px-2.5 py-2 text-sm font-semibold transition-colors ${
              !showSaved && feed === key
                ? "bg-accent-soft text-accent"
                : "text-muted hover:bg-surface hover:text-foreground"
            }`}
          >
            <Icon className="size-4.5 shrink-0" />
            {!collapsed && <span className="truncate">{label}</span>}
          </button>
        ))}

        <div className="mt-1 border-t border-border pt-1">
          <button
            type="button"
            onClick={onShowSavedChange}
            title="Saved"
            aria-current={showSaved}
            className={`flex items-center gap-3 rounded-xl px-2.5 py-2 text-sm font-semibold transition-colors ${
              showSaved ? "bg-accent-soft text-accent" : "text-muted hover:bg-surface hover:text-foreground"
            }`}
          >
            <BookmarkIcon className="size-4.5 shrink-0" filled={showSaved} />
            {!collapsed && <span className="truncate">Saved</span>}
          </button>
        </div>
      </nav>

      <div className="flex flex-col gap-1 border-t border-border px-2 py-2">
        <SettingsMenu onOpen={() => onSettingsOpenChange(true)} collapsed={collapsed} />
        <AboutMenu onOpen={() => onAboutOpenChange(true)} collapsed={collapsed} />
      </div>

      <SettingsDialog
        isOpen={isSettingsOpen}
        onClose={() => onSettingsOpenChange(false)}
        mode={mode}
        onModeChange={onModeChange}
        accent={accent}
        onAccentChange={onAccentChange}
        fontSize={fontSize}
        onFontSizeChange={onFontSizeChange}
        density={density}
        onDensityChange={onDensityChange}
      />
      <AboutDialog isOpen={isAboutOpen} onClose={() => onAboutOpenChange(false)} />
    </aside>
  );
}
