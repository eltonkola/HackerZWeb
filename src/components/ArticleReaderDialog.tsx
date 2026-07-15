import { Dialog } from "./Dialog";
import { CloseIcon, ExternalLinkIcon } from "./icons";

export function ArticleReaderDialog({
  url,
  title,
  isOpen,
  onClose,
}: {
  url: string;
  title: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      ariaLabel={title}
      panelClassName="flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-xl"
    >
      <>
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-4 py-3">
          <p className="truncate text-sm font-semibold text-foreground">{title}</p>
          <div className="flex shrink-0 items-center gap-2">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-accent-soft hover:text-accent"
            >
              Open in new tab
              <ExternalLinkIcon />
            </a>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close reader"
              className="rounded-lg p-1.5 text-muted transition-colors hover:bg-surface hover:text-foreground"
            >
              <CloseIcon />
            </button>
          </div>
        </div>

        <p className="shrink-0 bg-surface px-4 py-1.5 text-center text-xs text-muted">
          Some sites block being embedded here — if the page stays blank, use "Open in new tab" above.
        </p>

        <iframe
          src={url}
          title={title}
          className="h-full w-full flex-1 border-0 bg-white"
          referrerPolicy="no-referrer"
        />
      </>
    </Dialog>
  );
}
