import { useEffect, useState, type Dispatch, type SetStateAction } from "react";

/**
 * localStorage-backed useState. `parse` validates the raw stored string and
 * returns `undefined` for anything invalid/missing, in which case
 * `defaultValue` is used instead — callers don't need to re-check on every
 * read.
 */
export function useLocalStorageState<T>(
  key: string,
  defaultValue: T,
  parse: (raw: string) => T | undefined,
  serialize: (value: T) => string = String,
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key);
    if (stored === null) return defaultValue;
    const parsed = parse(stored);
    return parsed === undefined ? defaultValue : parsed;
  });

  useEffect(() => {
    localStorage.setItem(key, serialize(value));
  }, [key, value, serialize]);

  return [value, setValue];
}
