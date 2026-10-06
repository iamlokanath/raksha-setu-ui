"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { LogoMark } from "@/components/brand/Marks";
import { useAppSelector } from "@/hooks/useT";
import type { Locale } from "@/locales";
import { LanguageSelect } from "./LanguageSelect";

const COPY: Record<Locale, { tag: string; links: [string, string][]; login: string; footer: string; rights: string }> = {
  en: {
    tag: "Emergency Shelter Coordination",
    links: [["/", "Home"], ["/features", "Features"], ["/about", "About"], ["/contact", "Contact"]],
    login: "Login",
    footer: "Together for a safer tomorrow",
    rights: "Built for safe communities",
  },
  hi: {
    tag: "आपातकालीन आश्रय समन्वय",
    links: [["/", "होम"], ["/features", "सुविधाएँ"], ["/about", "परिचय"], ["/contact", "संपर्क"]],
    login: "लॉगिन",
    footer: "एक सुरक्षित कल के लिए साथ",
    rights: "सुरक्षित समुदायों के लिए",
  },
  or: {
    tag: "ଜରୁରୀକାଳୀନ ଆଶ୍ରୟ ସମନ୍ୱୟ",
    links: [["/", "ହୋମ"], ["/features", "ସୁବିଧା"], ["/about", "ବିଷୟରେ"], ["/contact", "ଯୋଗାଯୋଗ"]],
    login: "ଲଗଇନ୍",
    footer: "ଏକ ସୁରକ୍ଷିତ ଆସନ୍ତାକାଲି ପାଇଁ",
    rights: "ସୁରକ୍ଷିତ ସମୁଦାୟ ପାଇଁ",
  },
};

export function useSiteCopy() {
  const locale = useAppSelector((state) => state.ui.locale);
  return COPY[locale];
}

export function SiteFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const copy = useSiteCopy();
  return (
    <div className="min-h-screen bg-[#f4f8fc] text-[#1c2b3a]">
      <header className="border-b border-[#e4eef8] bg-white">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <LogoMark className="h-11 w-11" />
            <span>
              <span className="block text-lg font-bold leading-none text-brand">Raksha Setu</span>
              <span className="text-[11px] text-ink-muted">{copy.tag}</span>
            </span>
          </Link>
          <nav className="ml-auto hidden items-center gap-6 text-sm font-medium text-[#4d5d6e] md:flex">
            {copy.links.map(([href, label]) => (
              <Link key={href} href={href} className={pathname === href ? "text-brand" : "hover:text-brand"}>
                {label}
              </Link>
            ))}
          </nav>
          <LanguageSelect />
          <Link href="/login" className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">
            {copy.login}
          </Link>
        </div>
        <nav className="flex gap-4 overflow-auto px-4 pb-3 text-sm font-medium text-[#4d5d6e] md:hidden">
          {copy.links.map(([href, label]) => (
            <Link key={href} href={href} className={pathname === href ? "text-brand" : ""}>
              {label}
            </Link>
          ))}
        </nav>
      </header>
      <main>{children}</main>
      <footer className="bg-brand text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-4 py-5">
          <LogoMark light className="h-10 w-10" />
          <div>
            <p className="font-semibold">Raksha Setu</p>
            <p className="text-xs text-white/80">{copy.tag}</p>
          </div>
          <nav className="ml-auto flex flex-wrap gap-4 text-sm">
            {copy.links.map(([href, label]) => (
              <Link key={href} href={href}>{label}</Link>
            ))}
          </nav>
          <p className="w-full text-sm text-white/80 md:w-auto">{copy.footer}</p>
        </div>
        <div className="border-t border-white/15 px-4 py-3 text-center text-xs text-white/75">{copy.rights}</div>
      </footer>
    </div>
  );
}
