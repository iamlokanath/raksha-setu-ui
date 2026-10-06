"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { Icon, LogoMark } from "@/components/brand/Marks";
import { LanguageSelect } from "@/components/marketing/LanguageSelect";
import { useAppDispatch, useAppSelector, useT } from "@/hooks/useT";
import type { Locale } from "@/locales";
import { api } from "@/services/http";
import { clearTokens, getRefresh } from "@/services/session";
import { setNotice, setPrincipal } from "@/store/store";

const NAV: { href: string; icon: string; perm: string | null; key: string }[] = [
  { href: "/dashboard", icon: "dashboard", perm: "dashboard.read", key: "dashboard" },
  { href: "/shelters", icon: "shelter", perm: "shelter.read", key: "shelters" },
  { href: "/reports", icon: "report", perm: "report.read", key: "reports" },
  { href: "/alerts", icon: "alert", perm: "alert.read", key: "alerts" },
  { href: "/resources", icon: "resource", perm: "resource.read", key: "resources" },
  { href: "/actions", icon: "action", perm: "action.read", key: "actions" },
  { href: "/users", icon: "users", perm: "user.read", key: "users" },
  { href: "/settings", icon: "settings", perm: null, key: "settings" },
];

const LABELS: Record<Locale, Record<string, string>> = {
  en: {
    dashboard: "Dashboard", shelters: "Shelters", reports: "Reports", alerts: "Alerts", resources: "Resources", actions: "Actions", users: "Users", settings: "Settings",
    tagline: "Safer Communities. Stronger Together.", sub: "Emergency Shelter Coordination & Relief Resource Visibility",
    monitor: "Real-time Monitoring", coordination: "Better Coordination", response: "Faster Response", safer: "Safer Communities",
    admin: "District Administration", logout: "Log out", warden: "Shelter Warden", block_officer: "Block Officer", district_officer: "District Officer", volunteer: "Volunteer / Support",
  },
  hi: {
    dashboard: "डैशबोर्ड", shelters: "आश्रय", reports: "रिपोर्ट", alerts: "चेतावनी", resources: "संसाधन", actions: "कार्रवाई", users: "उपयोगकर्ता", settings: "सेटिंग्स",
    tagline: "सुरक्षित समुदाय। मिलकर और मजबूत।", sub: "आपातकालीन आश्रय समन्वय और राहत संसाधन दृश्यता",
    monitor: "वास्तविक समय निगरानी", coordination: "बेहतर समन्वय", response: "तेज़ प्रतिक्रिया", safer: "सुरक्षित समुदाय",
    admin: "जिला प्रशासन", logout: "लॉग आउट", warden: "आश्रय वार्डन", block_officer: "ब्लॉक अधिकारी", district_officer: "जिला अधिकारी", volunteer: "स्वयंसेवक / सहायता",
  },
  or: {
    dashboard: "ଡ୍ୟାସବୋର୍ଡ", shelters: "ଆଶ୍ରୟ", reports: "ରିପୋର୍ଟ", alerts: "ଚେତାବନୀ", resources: "ସମ୍ବଳ", actions: "କାର୍ଯ୍ୟ", users: "ବ୍ୟବହାରକାରୀ", settings: "ସେଟିଂସ",
    tagline: "ସୁରକ୍ଷିତ ସମୁଦାୟ। ମିଶି ଆହୁରି ଶକ୍ତ।", sub: "ଜରୁରୀକାଳୀନ ଆଶ୍ରୟ ସମନ୍ୱୟ ଓ ରିଲିଫ୍ ସମ୍ବଳ ଦୃଶ୍ୟମାନତା",
    monitor: "ରିଅଲ୍-ଟାଇମ୍ ନଜର", coordination: "ଉତ୍ତମ ସମନ୍ୱୟ", response: "ଦ୍ରୁତ ପ୍ରତିକ୍ରିୟା", safer: "ସୁରକ୍ଷିତ ସମୁଦାୟ",
    admin: "ଜିଲ୍ଲା ପ୍ରଶାସନ", logout: "ଲଗ୍ ଆଉଟ୍", warden: "ଆଶ୍ରୟ ୱାର୍ଡେନ୍", block_officer: "ବ୍ଲକ୍ ଅଧିକାରୀ", district_officer: "ଜିଲ୍ଲା ଅଧିକାରୀ", volunteer: "ସ୍ୱେଚ୍ଛାସେବୀ / ସହଯୋଗ",
  },
};

const SWATCHES = ["#1b52a4", "#00a2e5", "#fec40d", "#f58020", "#d64246", "#098855"];

export function Shell({ children, permission }: { children: ReactNode; permission?: string }) {
  const t = useT();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const principal = useAppSelector((state) => state.auth.principal);
  const locale = useAppSelector((state) => state.ui.locale);
  const notice = useAppSelector((state) => state.ui.notice);
  const [open, setOpen] = useState(false);
  const copy = LABELS[locale];
  useEffect(() => {
    if (!principal) router.replace("/login");
  }, [principal, router]);
  if (!principal) return null;
  const allowed = !permission || principal.permissions.includes(permission) || (permission === "tenant.manage" && principal.permissions.includes("user.manage"));
  const district = principal.tenant_name || principal.organization || "District";
  async function logout() {
    await api("/api/v1/auth/logout", { method: "POST", body: { refresh_token: getRefresh() } });
    clearTokens();
    dispatch(setPrincipal(null));
    router.replace("/login");
  }
  const links = NAV.filter((item) => item.perm === null || principal.permissions.includes(item.perm) || (item.href === "/reports" && principal.permissions.includes("report.submit")));
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-[240px] flex-col bg-brand text-white transition-transform ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
        <div className="flex items-center gap-2 px-4 py-4">
          <LogoMark light className="h-10 w-10" />
          <div>
            <p className="font-bold leading-none">Raksha Setu</p>
            <p className="text-[11px] text-white/70">Emergency Shelter Coordination</p>
          </div>
        </div>
        <p className="mx-4 mb-3 rounded-lg bg-white/10 px-3 py-2 text-sm">{district}</p>
        <nav className="flex-1 space-y-1 px-3">
          {links.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${active ? "bg-[#2f74d6]" : "hover:bg-white/10"}`}>
                <Icon name={item.icon} className="h-5 w-5" />
                {copy[item.key]}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-white/15 px-4 py-4 text-xs">
          <p className="text-white/70">{copy.admin}</p>
          <p className="font-semibold">{district}</p>
          <button className="mt-2 underline" type="button" onClick={logout}>{copy.logout}</button>
        </div>
      </aside>
      {open ? <button className="fixed inset-0 z-30 bg-black/30 lg:hidden" aria-label="Close menu" onClick={() => setOpen(false)} /> : null}
      <div className="lg:pl-[240px]">
        <header className="flex flex-wrap items-center gap-4 border-b border-[#e4eef8] bg-white px-4 py-3">
          <button className="rounded-lg border border-line px-2 py-1 lg:hidden" type="button" onClick={() => setOpen(true)}>Menu</button>
          <div className="min-w-[220px]">
            <p className="font-semibold text-brand">{copy.tagline}</p>
            <p className="text-xs text-ink-muted">{copy.sub}</p>
          </div>
          <div className="ml-auto hidden items-center gap-4 xl:flex">
            <span className="flex gap-1">{SWATCHES.map((color) => <i key={color} className="h-4 w-4 rounded-full" style={{ background: color }} />)}</span>
            {[["monitor", copy.monitor], ["boxes", copy.coordination], ["bell", copy.response], ["shield", copy.safer]].map(([icon, label]) => (
              <span key={label} className="flex items-center gap-1 text-xs font-medium text-[#3e5164]"><Icon name={icon} className="h-4 w-4 text-brand" />{label}</span>
            ))}
          </div>
          <LanguageSelect />
          <div className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">{initials(principal.name)}</span>
            <span>
              <span className="block text-sm font-semibold leading-tight">{principal.name}</span>
              <span className="text-xs text-ink-muted">{copy[principal.role] ?? principal.role}</span>
            </span>
          </div>
        </header>
        <main className="p-4 md:p-6">
          {notice ? <p className="mb-4 rounded-xl border border-[#d7e8ff] bg-white px-4 py-3 text-sm">{notice}</p> : null}
          {allowed ? children : <p className="panel p-6">{t("common.forbidden")}</p>}
        </main>
      </div>
    </div>
  );
}

function initials(name: string) {
  return name.split(" ").slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "").join("") || "RS";
}

export function notice(dispatch: (action: ReturnType<typeof setNotice>) => void, message: string) {
  dispatch(setNotice(message));
}
