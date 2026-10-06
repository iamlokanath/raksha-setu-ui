"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/useT";
import type { Locale } from "@/locales";
import { setLocale } from "@/store/store";

const LABELS: Record<Locale, string> = { en: "English", hi: "हिन्दी", or: "ଓଡ଼ିଆ" };

export function LanguageSelect({ light = false }: { light?: boolean }) {
  const locale = useAppSelector((state) => state.ui.locale);
  const dispatch = useAppDispatch();
  return (
    <label className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm ${light ? "border-white/40 text-white" : "border-[#d5e2f2] bg-white text-[#1c2b3a]"}`}>
      <span aria-hidden="true">🌐</span>
      <span className="sr-only">Language</span>
      <select
        className={`bg-transparent outline-none ${light ? "text-white" : "text-[#1c2b3a]"}`}
        value={locale}
        onChange={(event) => dispatch(setLocale(event.target.value as Locale))}
      >
        {(Object.keys(LABELS) as Locale[]).map((key) => (
          <option key={key} value={key} className="text-[#1c2b3a]">
            {LABELS[key]}
          </option>
        ))}
      </select>
    </label>
  );
}
