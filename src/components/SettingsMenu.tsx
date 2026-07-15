import { GearIcon } from "./icons";
import { SidebarMenuButton } from "./SidebarMenuButton";

export function SettingsMenu({ onOpen, collapsed = false }: { onOpen: () => void; collapsed?: boolean }) {
  return <SidebarMenuButton icon={GearIcon} label="Settings" onOpen={onOpen} collapsed={collapsed} />;
}
