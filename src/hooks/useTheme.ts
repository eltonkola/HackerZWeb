import { useEffect, useState } from "react";
import type { ThemeMode } from "../lib/theme";
import { useLocalStorageState } from "./useLocalStorageState";

const STORAGE_KEY = "hn-tablet-theme-mode";

function parseMode(raw: string): ThemeMode | undefined {
  return raw === "light" || raw === "dark" || raw === "system" ? raw : undefined;
}

function systemPrefersDark(): boolean {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function resolve(mode: ThemeMode): "light" | "dark" {
  return mode === "system" ? (systemPrefersDark() ? "dark" : "light") : mode;
}

export function useTheme() {
  const [mode, setMode] = useLocalStorageState<ThemeMode>(STORAGE_KEY, "system", parseMode);
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">(() => resolve(mode));

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", resolve(mode));
    setResolvedTheme(resolve(mode));

    if (mode !== "system") return;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      document.documentElement.setAttribute("data-theme", resolve(mode));
      setResolvedTheme(resolve(mode));
    };
    mediaQuery.addEventListener("change", onChange);
    return () => mediaQuery.removeEventListener("change", onChange);
  }, [mode]);

  return { mode, setMode, resolvedTheme };
}
