"use client";

import { Badge } from "@/components/feedback/States";
import { useT } from "@/hooks/useT";

const KEYS: Record<string, string> = {
  green: "status.stable",
  yellow: "status.attention",
  red: "status.urgent",
  unknown: "status.unknown",
};

export function StatusBadge({ status }: { status: string }) {
  const t = useT();
  return <Badge>{t(KEYS[status] ?? "status.unknown")}</Badge>;
}
