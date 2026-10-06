import en, { type MessageKey } from "./en";
import hi from "./hi";
import or from "./or";

export type Locale = "en" | "hi" | "or";
export const locales: Record<Locale, Record<MessageKey, string>> = { en, hi, or };

export function translate(locale: Locale, key: string, params?: Record<string, string | number | null>) {
  const table = locales[locale] as Record<string, string>;
  const template = table[key] ?? locales.en[key as MessageKey] ?? key;
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (_, name: string) => String(params[name] ?? ""));
}
