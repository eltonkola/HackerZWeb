import { useEffect } from "react";
import { FONT_SIZE_PX, type FontSize } from "../lib/theme";
import { useLocalStorageState } from "./useLocalStorageState";

const STORAGE_KEY = "hn-tablet-font-size";

function parseFontSize(raw: string): FontSize | undefined {
  return raw === "sm" || raw === "md" || raw === "lg" || raw === "xl" ? raw : undefined;
}

export function useFontSize() {
  const [fontSize, setFontSize] = useLocalStorageState<FontSize>(STORAGE_KEY, "md", parseFontSize);

  useEffect(() => {
    document.documentElement.style.fontSize = `${FONT_SIZE_PX[fontSize]}px`;
  }, [fontSize]);

  return { fontSize, setFontSize };
}
