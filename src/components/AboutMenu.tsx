import { InfoIcon } from "./icons";
import { SidebarMenuButton } from "./SidebarMenuButton";

export function AboutMenu({ onOpen, collapsed = false }: { onOpen: () => void; collapsed?: boolean }) {
  return (
    <SidebarMenuButton
      icon={InfoIcon}
      label="About"
      title="About HackerZ"
      onOpen={onOpen}
      collapsed={collapsed}
    />
  );
}
