import { useNow } from "../hooks/useNow";
import { getDayOfYear, getDaysInYear, getGreeting } from "../lib/datetime";

export function WelcomeScreen() {
  const now = useNow();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  const dateLabel = now.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
      <p className="text-2xl font-semibold text-accent">{getGreeting(now.getHours())}</p>

      <div className="flex items-baseline gap-2 font-bold tabular-nums text-foreground">
        <span className="text-9xl">
          {hours}:{minutes}
        </span>
        <span className="text-4xl text-muted">:{seconds}</span>
      </div>

      <p className="text-xl text-muted">{dateLabel}</p>
      <p className="text-base text-muted">
        Day {getDayOfYear(now)} of {getDaysInYear(now.getFullYear())}
      </p>

      <p className="mt-10 max-w-sm text-lg text-muted">Select a story from the list to start reading.</p>
    </div>
  );
}
