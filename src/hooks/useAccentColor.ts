import { useEffect } from "react";
import { ACCENT_PRESETS, DEFAULT_ACCENT } from "../lib/theme";
import { useLocalStorageState } from "./useLocalStorageState";

const STORAGE_KEY = "hn-tablet-accent";

function parseAccent(raw: string): string {
  return raw;
}

export function useAccentColor() {
  const [accent, setAccent] = useLocalStorageState<string>(STORAGE_KEY, DEFAULT_ACCENT.value, parseAccent);

  useEffect(() => {
    document.documentElement.style.setProperty("--accent", accent);

    const preset = ACCENT_PRESETS.find((p) => p.value === accent);
    if (preset?.foreground) {
      document.documentElement.style.setProperty("--accent-foreground", preset.foreground);
    } else {
      document.documentElement.style.removeProperty("--accent-foreground");
    }
  }, [accent]);

  return { accent, setAccent };
}
