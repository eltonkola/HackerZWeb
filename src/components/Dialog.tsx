import type { ReactNode } from "react";
import { useEffect } from "react";
import { pushModal } from "../lib/modalStack";

export function Dialog({
  isOpen,
  onClose,
  ariaLabel,
  panelClassName = "flex max-h-[85vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-xl",
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  ariaLabel: string;
  panelClassName?: string;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!isOpen) return;
    // Registers with the shared Escape stack so only the topmost dialog (or
    // panel) closes on a given keypress, instead of every open one racing.
    return pushModal(onClose);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        className={panelClassName}
      >
        {children}
      </div>
    </div>
  );
}
