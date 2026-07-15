// A real LIFO stack, not just an open-counter: when multiple dialogs/panels
// are stacked (e.g. Settings open on top of the item panel, or the article
// reader open on top of Settings), Escape must close only the topmost one —
// a plain "is anything open" check can't express that.
interface ModalEntry {
  close: () => void;
}

const stack: ModalEntry[] = [];

if (typeof window !== "undefined") {
  window.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    stack[stack.length - 1]?.close();
  });
}

/** Call on a modal's mount with its close handler; call the returned function on its unmount. */
export function pushModal(close: () => void): () => void {
  const entry: ModalEntry = { close };
  stack.push(entry);
  return () => {
    const index = stack.indexOf(entry);
    if (index !== -1) stack.splice(index, 1);
  };
}

/** Whether any modal (settings, article reader, ...) is currently open. */
export function isAnyModalOpen(): boolean {
  return stack.length > 0;
}
