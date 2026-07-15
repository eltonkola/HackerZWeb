import { useEffect, useMemo, useState, type KeyboardEvent } from "react";
import { Dialog } from "./Dialog";
import { CommandIcon } from "./icons";

export interface CommandAction {
  id: string;
  label: string;
  hint?: string;
  run: () => void;
}

export function CommandPalette({
  isOpen,
  onClose,
  actions,
}: {
  isOpen: boolean;
  onClose: () => void;
  actions: CommandAction[];
}) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (isOpen) setQuery("");
  }, [isOpen]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? actions.filter((action) => action.label.toLowerCase().includes(q)) : actions;
  }, [actions, query]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const runAction = (action: CommandAction | undefined) => {
    if (!action) return;
    action.run();
    onClose();
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      runAction(filtered[selectedIndex]);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      ariaLabel="Command palette"
      panelClassName="flex w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-xl"
    >
      <>
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <CommandIcon className="size-4 shrink-0 text-muted" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Jump to a feed, toggle a setting…"
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted focus:outline-none"
          />
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {filtered.length === 0 && (
            <p className="px-3 py-6 text-center text-sm text-muted">No matching commands.</p>
          )}
          {filtered.map((action, index) => (
            <button
              key={action.id}
              type="button"
              onClick={() => runAction(action)}
              onMouseEnter={() => setSelectedIndex(index)}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-medium transition-colors ${
                index === selectedIndex ? "bg-accent-soft text-accent" : "text-foreground hover:bg-surface"
              }`}
            >
              {action.label}
              {action.hint && <span className="text-xs text-muted">{action.hint}</span>}
            </button>
          ))}
        </div>
      </>
    </Dialog>
  );
}
