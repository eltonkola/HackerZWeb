import { useEffect, useState } from "react";

interface WaybackAvailability {
  isChecking: boolean;
  available: boolean;
  snapshotUrl: string | null;
}

const IDLE: WaybackAvailability = { isChecking: false, available: false, snapshotUrl: null };

/** Checks the Internet Archive's (CORS-open) availability API for a snapshot of `url`. */
export function useWaybackAvailability(url: string | undefined): WaybackAvailability {
  const [state, setState] = useState<WaybackAvailability>(url ? { ...IDLE, isChecking: true } : IDLE);

  useEffect(() => {
    if (!url) {
      setState(IDLE);
      return;
    }

    let cancelled = false;
    setState({ isChecking: true, available: false, snapshotUrl: null });

    fetch(`https://archive.org/wayback/available?url=${encodeURIComponent(url)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled) return;
        const closest = data?.archived_snapshots?.closest;
        if (closest?.available && typeof closest.url === "string") {
          setState({ isChecking: false, available: true, snapshotUrl: closest.url });
        } else {
          setState({ isChecking: false, available: false, snapshotUrl: null });
        }
      })
      .catch(() => {
        if (!cancelled) setState({ isChecking: false, available: false, snapshotUrl: null });
      });

    return () => {
      cancelled = true;
    };
  }, [url]);

  return state;
}
