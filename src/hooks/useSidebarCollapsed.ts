import { useLocalStorageState } from "./useLocalStorageState";

const STORAGE_KEY = "hn-tablet-sidebar-collapsed";

function parseCollapsed(raw: string): boolean | undefined {
  return raw === "true" || raw === "false" ? raw === "true" : undefined;
}

export function useSidebarCollapsed() {
  return useLocalStorageState<boolean>(STORAGE_KEY, false, parseCollapsed);
}
