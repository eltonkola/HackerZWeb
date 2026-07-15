import type { CSSProperties, ReactNode } from "react";
import { Button } from "@heroui/react";
import { useReaderButtons } from "../hooks/useReaderButtons";
import { Dialog } from "./Dialog";
import {
  ACCENT_PRESETS,
  DENSITY_LABEL,
  FONT_SIZE_LABEL,
  type Density,
  type FontSize,
  type ThemeMode,
} from "../lib/theme";
import { CloseIcon, MoonIcon, SunIcon, SystemIcon } from "./icons";

const MODES: { key: ThemeMode; label: string; icon: ReactNode }[] = [
  { key: "light", label: "Light", icon: <SunIcon className="size-3.5" /> },
  { key: "dark", label: "Dark", icon: <MoonIcon className="size-3.5" /> },
  { key: "system", label: "System", icon: <SystemIcon className="size-3.5" /> },
];

const FONT_SIZES: FontSize[] = ["sm", "md", "lg", "xl"];
const DENSITIES: Density[] = ["comfortable", "compact"];

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? "bg-accent" : "bg-surface"}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

export function SettingsDialog({
  isOpen,
  onClose,
  mode,
  onModeChange,
  accent,
  onAccentChange,
  fontSize,
  onFontSizeChange,
  density,
  onDensityChange,
}: {
  isOpen: boolean;
  onClose: () => void;
  mode: ThemeMode;
  onModeChange: (mode: ThemeMode) => void;
  accent: string;
  onAccentChange: (accent: string) => void;
  fontSize: FontSize;
  onFontSizeChange: (size: FontSize) => void;
  density: Density;
  onDensityChange: (density: Density) => void;
}) {
  const { showReadButton, setShowReadButton, showArchiveButton, setShowArchiveButton } = useReaderButtons();

  return (
    <Dialog isOpen={isOpen} onClose={onClose} ariaLabel="Settings">
      <>
        <div className="flex shrink-0 items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-lg font-bold text-foreground">Settings</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close settings"
            className="rounded-lg p-1.5 text-muted transition-colors hover:bg-surface hover:text-foreground"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-5">
          <section>
            <h3 className="text-sm font-semibold text-foreground">Appearance</h3>
            <p className="text-xs text-muted">Choose how HackerZ looks.</p>
            <div className="mt-3 flex gap-1 rounded-full bg-surface p-1">
              {MODES.map(({ key, label, icon }) => (
                <Button
                  key={key}
                  size="sm"
                  variant={mode === key ? "primary" : "ghost"}
                  className="flex-1 gap-1 rounded-full px-2 text-xs"
                  onPress={() => onModeChange(key)}
                >
                  {icon}
                  {label}
                </Button>
              ))}
            </div>
          </section>

          <section className="mt-6">
            <h3 className="text-sm font-semibold text-foreground">Accent color</h3>
            <p className="text-xs text-muted">Used for links, buttons, and highlights.</p>
            <div className="mt-3 grid grid-cols-8 gap-2 sm:grid-cols-8">
              {ACCENT_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  title={preset.name}
                  aria-label={preset.name}
                  aria-pressed={accent === preset.value}
                  onClick={() => onAccentChange(preset.value)}
                  className={`aspect-square rounded-full transition-transform hover:scale-110 ${
                    accent === preset.value ? "ring-2 ring-offset-2 ring-offset-background" : ""
                  }`}
                  style={{
                    backgroundColor: preset.value,
                    ...(accent === preset.value ? ({ "--tw-ring-color": preset.value } as CSSProperties) : {}),
                  }}
                />
              ))}
            </div>
          </section>

          <section className="mt-6">
            <h3 className="text-sm font-semibold text-foreground">Readability</h3>
            <p className="text-xs text-muted">Adjust text size and row spacing to taste.</p>

            <p className="mt-3 text-xs font-semibold text-muted">Font size</p>
            <div className="mt-1.5 flex gap-1 rounded-full bg-surface p-1">
              {FONT_SIZES.map((size) => (
                <Button
                  key={size}
                  size="sm"
                  variant={fontSize === size ? "primary" : "ghost"}
                  className="flex-1 rounded-full px-2 text-xs"
                  onPress={() => onFontSizeChange(size)}
                >
                  {FONT_SIZE_LABEL[size]}
                </Button>
              ))}
            </div>

            <p className="mt-4 text-xs font-semibold text-muted">Row spacing</p>
            <div className="mt-1.5 flex gap-1 rounded-full bg-surface p-1">
              {DENSITIES.map((d) => (
                <Button
                  key={d}
                  size="sm"
                  variant={density === d ? "primary" : "ghost"}
                  className="flex-1 rounded-full px-2 text-xs"
                  onPress={() => onDensityChange(d)}
                >
                  {DENSITY_LABEL[d]}
                </Button>
              ))}
            </div>
          </section>

          <section className="mt-6">
            <h3 className="text-sm font-semibold text-foreground">Reader tools</h3>
            <p className="text-xs text-muted">
              Extra actions on the comments screen. Off by default to keep it fast — Archive checks
              Wayback Machine availability for every story you open, and Read embeds an iframe.
            </p>
            <div className="mt-2 divide-y divide-border">
              <ToggleRow
                label="Read button"
                description="Open the live article in an in-app dialog."
                checked={showReadButton}
                onChange={setShowReadButton}
              />
              <ToggleRow
                label="Archive button"
                description="Show a button to the Wayback Machine snapshot, when one exists."
                checked={showArchiveButton}
                onChange={setShowArchiveButton}
              />
            </div>
          </section>
        </div>
      </>
    </Dialog>
  );
}
