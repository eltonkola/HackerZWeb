import { Dialog } from "./Dialog";
import { CloseIcon, GitHubIcon } from "./icons";

// TODO: replace with the real repo URL once this project has one.
const GITHUB_URL = "https://github.com/";

export function AboutDialog({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <Dialog isOpen={isOpen} onClose={onClose} ariaLabel="About HackerZ">
      <>
        <div className="flex shrink-0 items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-lg font-bold text-foreground">About</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close about"
            className="rounded-lg p-1.5 text-muted transition-colors hover:bg-surface hover:text-foreground"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-accent text-lg font-bold text-accent-foreground">
              Y
            </div>
            <div>
              <p className="text-base font-bold leading-tight text-foreground">HackerZ</p>
              <p className="text-sm text-muted">A modern reader for Hacker News</p>
            </div>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-muted">
            Stories and comments are fetched live from the{" "}
            <a
              href="https://github.com/HackerNews/API"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-accent hover:underline"
            >
              official HN API
            </a>
            . Built with{" "}
            <a
              href="https://heroui.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-accent hover:underline"
            >
              HeroUI
            </a>{" "}
            + React. Not affiliated with Y Combinator or Hacker News.
          </p>

          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 flex items-center justify-center gap-2 rounded-full bg-surface px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent-soft hover:text-accent"
          >
            <GitHubIcon />
            View source on GitHub
          </a>
        </div>
      </>
    </Dialog>
  );
}
