import { Avatar } from "@heroui/react";
import { faviconUrl } from "../lib/hn";

export function SiteIcon({ domain, size = "sm" }: { domain: string | null; size?: "sm" | "md" | "lg" }) {
  if (!domain) {
    return (
      <Avatar size={size} color="accent">
        <Avatar.Fallback>Y</Avatar.Fallback>
      </Avatar>
    );
  }

  return (
    <Avatar size={size}>
      <Avatar.Image src={faviconUrl(domain)} alt={domain} />
      <Avatar.Fallback>{domain[0]?.toUpperCase()}</Avatar.Fallback>
    </Avatar>
  );
}
