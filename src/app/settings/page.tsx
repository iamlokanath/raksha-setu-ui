"use client";

import Link from "next/link";
import { Shell } from "@/components/layout/Shell";
import { useAppSelector, useT } from "@/hooks/useT";

export default function SettingsPage() {
  const t = useT();
  const principal = useAppSelector((state) => state.auth.principal);
  const links = [
    principal?.permissions.includes("tenant.manage") || principal?.permissions.includes("user.manage") ? ["/configuration", t("config.title"), t("config.notice")] : null,
    principal?.permissions.includes("audit.read") ? ["/audit", t("audit.title"), "Review sign-in, reports, alerts and decisions."] : null,
    principal?.permissions.includes("report.submit") ? ["/sync", t("sync.queue_title"), "Reports saved on this device while offline."] : null,
    principal?.permissions.includes("shelter.register") ? ["/shelters/new", t("shelter.create"), "Register a shelter in this district."] : null,
  ].filter(Boolean) as [string, string, string][];
  return (
    <Shell>
      <h1 className="mb-4 text-2xl font-bold">Settings</h1>
      <section className="panel mb-4 p-5">
        <p className="text-sm text-ink-muted">Signed in as</p>
        <p className="text-lg font-semibold">{principal?.name}</p>
        <p className="text-sm text-ink-muted">{principal?.tenant_name || principal?.organization}</p>
        <p className="mt-3 text-sm text-ink-muted">Language can be changed from the menu in the top bar. English, Hindi and Odia use the same screens.</p>
      </section>
      <div className="grid gap-3 md:grid-cols-2">
        {links.map(([href, title, text]) => (
          <Link key={href} href={href} className="panel p-4">
            <h2 className="font-semibold text-brand">{title}</h2>
            <p className="mt-1 text-sm text-ink-muted">{text}</p>
          </Link>
        ))}
      </div>
    </Shell>
  );
}
