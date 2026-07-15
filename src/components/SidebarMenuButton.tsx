import type { ComponentType } from "react";

export function SidebarMenuButton({
  icon: Icon,
  label,
  title,
  onOpen,
  collapsed = false,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  title?: string;
  onOpen: () => void;
  collapsed?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      title={title ?? label}
      aria-label={title ?? label}
      className="flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-sm font-semibold text-muted transition-colors hover:bg-surface hover:text-foreground"
    >
      <Icon className="size-4.5 shrink-0" />
      {!collapsed && <span className="truncate">{label}</span>}
    </button>
  );
}
