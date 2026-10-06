"use client";

import Link from "next/link";
import { SiteFrame } from "@/components/marketing/SiteFrame";
import { useAppSelector } from "@/hooks/useT";
import type { Locale } from "@/locales";

const COPY: Record<Locale, { title: string; lead: string; card: string; body: string; start: string; note: string }> = {
  en: {
    title: "Contact",
    lead: "Raksha Setu is used by district, block and shelter teams. Public visitors sign in only when a district has issued an account.",
    card: "Reach your coordination desk",
    body: "Shelter reports, alerts and redistribution stay inside the signed-in workspace. Human officers approve every relief movement.",
    start: "Login",
    note: "English, Hindi and Odia are available from the language menu on every page.",
  },
  hi: {
    title: "संपर्क",
    lead: "रक्षा सेतु का उपयोग जिला, ब्लॉक और आश्रय टीमें करती हैं। खाता जिला जारी करता है।",
    card: "अपने समन्वय डेस्क तक पहुँचें",
    body: "आश्रय रिपोर्ट, चेतावनी और पुनर्वितरण साइन-इन कार्यक्षेत्र में रहते हैं। हर राहत आंदोलन अधिकारी स्वीकृत करते हैं।",
    start: "लॉगिन",
    note: "हर पृष्ठ के भाषा मेनू में अंग्रेज़ी, हिन्दी और ओड़िया उपलब्ध हैं।",
  },
  or: {
    title: "ଯୋଗାଯୋଗ",
    lead: "ରକ୍ଷା ସେତୁ ଜିଲ୍ଲା, ବ୍ଲକ୍ ଓ ଆଶ୍ରୟ ଦଳ ବ୍ୟବହାର କରନ୍ତି। ଖାତା ଜିଲ୍ଲା ଦିଏ।",
    card: "ଆପଣଙ୍କ ସମନ୍ୱୟ ଡେସ୍କ୍",
    body: "ଆଶ୍ରୟ ରିପୋର୍ଟ, ଚେତାବନୀ ଓ ପୁନଃବଣ୍ଟନ ସାଇନ୍-ଇନ୍ କାର୍ଯ୍ୟକ୍ଷେତ୍ର ଭିତରେ ରହେ। ପ୍ରତି ରିଲିଫ୍ ଗତିବିଧି ଅଧିକାରୀ ଅନୁମୋଦନ କରନ୍ତି।",
    start: "ଲଗଇନ୍",
    note: "ପ୍ରତି ପୃଷ୍ଠାର ଭାଷା ମେନୁରେ ଇଂରାଜୀ, ହିନ୍ଦୀ ଓ ଓଡ଼ିଆ ଅଛି।",
  },
};

export default function ContactPage() {
  const copy = COPY[useAppSelector((state) => state.ui.locale)];
  return (
    <SiteFrame>
      <div className="mx-auto max-w-3xl px-4 py-10">
        <section className="rounded-2xl bg-brand px-6 py-8 text-white">
          <h1 className="text-3xl font-bold">{copy.title}</h1>
          <p className="mt-2 text-white/85">{copy.lead}</p>
        </section>
        <section className="panel mt-6 p-6">
          <h2 className="text-xl font-bold">{copy.card}</h2>
          <p className="mt-2 text-ink-muted">{copy.body}</p>
          <p className="mt-3 text-sm text-ink-muted">{copy.note}</p>
          <Link href="/login" className="mt-5 inline-flex rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white">{copy.start}</Link>
        </section>
      </div>
    </SiteFrame>
  );
}
