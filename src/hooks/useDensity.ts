import { useEffect } from "react";
import { DENSITY_ROW_PADDING, type Density } from "../lib/theme";
import { useLocalStorageState } from "./useLocalStorageState";

const STORAGE_KEY = "hn-tablet-density";

function parseDensity(raw: string): Density | undefined {
  return raw === "comfortable" || raw === "compact" ? raw : undefined;
}

export function useDensity() {
  const [density, setDensity] = useLocalStorageState<Density>(STORAGE_KEY, "comfortable", parseDensity);

  useEffect(() => {
    document.documentElement.style.setProperty("--row-padding-y", DENSITY_ROW_PADDING[density]);
  }, [density]);

  return { density, setDensity };
}
