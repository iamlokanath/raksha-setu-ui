"use client";

import Link from "next/link";
import { Icon } from "@/components/brand/Marks";
import { SiteFrame } from "@/components/marketing/SiteFrame";
import { useAppSelector } from "@/hooks/useT";
import type { Locale } from "@/locales";

const ITEMS = [
  { icon: "shelter", tint: "bg-[#e7f3ff] text-brand", href: "/report" },
  { icon: "offline", tint: "bg-[#e7f7ef] text-stable", href: "/sync" },
  { icon: "bell", tint: "bg-[#fdecec] text-alert", href: "/alerts" },
  { icon: "boxes", tint: "bg-[#fff1e6] text-amber", href: "/actions" },
  { icon: "dashboard", tint: "bg-[#e7f7ef] text-stable", href: "/dashboard" },
  { icon: "language", tint: "bg-[#e7f3ff] text-sky", href: "/about" },
];

const COPY: Record<Locale, { title: string; lead: string; more: string; back: string; cards: { title: string; text: string }[] }> = {
  en: {
    title: "Features & Functionalities",
    lead: "Everything you need to coordinate emergency shelters and relief resources efficiently and effectively.",
    more: "Learn More",
    back: "Back to Home",
    cards: [
      { title: "Shelter Reporting", text: "Report shelter status, population, vulnerable groups and resource levels in real time." },
      { title: "Offline-First Reporting", text: "Save reports locally while offline and sync automatically when connected." },
      { title: "Alerts & Notifications", text: "Get instant alerts for shortages, capacity issues and critical situations." },
      { title: "Resource Redistribution", text: "Find nearby shelters with surplus and suggest resource transfers." },
      { title: "District Dashboard", text: "View all shelters, alerts, resources and priority actions on a unified map and dashboard." },
      { title: "Multi-language Support", text: "Use the platform in English, Hindi or Odia for better accessibility and reach." },
    ],
  },
  hi: {
    title: "सुविधाएँ और कार्य",
    lead: "आपातकालीन आश्रयों और राहत संसाधनों के समन्वय के लिए जो कुछ चाहिए।",
    more: "और जानें",
    back: "होम पर वापस",
    cards: [
      { title: "आश्रय रिपोर्ट", text: "स्थिति, जनसंख्या, संवेदनशील समूह और संसाधन स्तर वास्तविक समय में रिपोर्ट करें।" },
      { title: "ऑफ़लाइन-पहले रिपोर्ट", text: "ऑफ़लाइन रिपोर्ट सहेजें और जुड़ने पर अपने आप सिंक करें।" },
      { title: "चेतावनी और सूचना", text: "कमी, क्षमता और गंभीर स्थितियों की तुरंत सूचना।" },
      { title: "संसाधन पुनर्वितरण", text: "अधिशेष वाले नज़दीकी आश्रय खोजें और स्थानांतरण सुझाएँ।" },
      { title: "जिला डैशबोर्ड", text: "सभी आश्रय, चेतावनी, संसाधन और प्राथमिक कार्रवाई एक दृश्य में।" },
      { title: "बहुभाषा समर्थन", text: "अंग्रेज़ी, हिन्दी या ओड़िया में मंच का उपयोग करें।" },
    ],
  },
  or: {
    title: "ସୁବିଧା ଓ କାର୍ଯ୍ୟ",
    lead: "ଜରୁରୀକାଳୀନ ଆଶ୍ରୟ ଓ ରିଲିଫ୍ ସମ୍ବଳ ସମନ୍ୱୟ ପାଇଁ ଯାହା ଦରକାର।",
    more: "ଅଧିକ ଜାଣନ୍ତୁ",
    back: "ହୋମକୁ ଫେରନ୍ତୁ",
    cards: [
      { title: "ଆଶ୍ରୟ ରିପୋର୍ଟ", text: "ସ୍ଥିତି, ଜନସଂଖ୍ୟା, ସମ୍ବେଦନଶୀଳ ଗୋଷ୍ଠୀ ଓ ସମ୍ବଳ ସ୍ତର ରିପୋର୍ଟ କରନ୍ତୁ।" },
      { title: "ଅଫଲାଇନ୍-ପ୍ରଥମ ରିପୋର୍ଟ", text: "ଅଫଲାଇନ୍ ରିପୋର୍ଟ ସାଇତନ୍ତୁ ଓ ସଂଯୋଗ ହେଲେ ସିଙ୍କ୍ କରନ୍ତୁ।" },
      { title: "ଚେତାବନୀ ଓ ସୂଚନା", text: "ଅଭାବ, କ୍ଷମତା ଓ ଗୁରୁତର ସ୍ଥିତିର ତୁରନ୍ତ ସୂଚନା।" },
      { title: "ସମ୍ବଳ ପୁନଃବଣ୍ଟନ", text: "ଅଧିକ ଥିବା ନିକଟସ୍ଥ ଆଶ୍ରୟ ଖୋଜନ୍ତୁ ଓ ସ୍ଥାନାନ୍ତର ପ୍ରସ୍ତାବ ଦିଅନ୍ତୁ।" },
      { title: "ଜିଲ୍ଲା ଡ୍ୟାସବୋର୍ଡ", text: "ସମସ୍ତ ଆଶ୍ରୟ, ଚେତାବନୀ, ସମ୍ବଳ ଓ ପ୍ରାଥମିକ କାର୍ଯ୍ୟ ଗୋଟିଏ ଦୃଶ୍ୟରେ।" },
      { title: "ବହୁଭାଷା ସହଯୋଗ", text: "ଇଂରାଜୀ, ହିନ୍ଦୀ କିମ୍ବା ଓଡ଼ିଆରେ ପ୍ଲାଟଫର୍ମ ବ୍ୟବହାର କରନ୍ତୁ।" },
    ],
  },
};

export default function FeaturesPage() {
  const copy = COPY[useAppSelector((state) => state.ui.locale)];
  return (
    <SiteFrame>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <section className="rounded-2xl bg-brand px-6 py-8 text-white md:flex md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">{copy.title}</h1>
            <p className="mt-2 max-w-2xl text-white/85">{copy.lead}</p>
          </div>
          <Icon name="shield" className="mt-4 hidden h-16 w-16 text-white/80 md:block" />
        </section>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {copy.cards.map((card, index) => (
            <article key={card.title} className="panel p-5">
              <span className={`mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl ${ITEMS[index].tint}`}>
                <Icon name={ITEMS[index].icon} />
              </span>
              <h2 className="text-lg font-semibold">{card.title}</h2>
              <p className="mt-1 text-sm text-ink-muted">{card.text}</p>
              <Link href={ITEMS[index].href} className="mt-3 inline-block text-sm font-semibold text-brand">{copy.more} →</Link>
            </article>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/" className="inline-flex rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white">{copy.back}</Link>
        </div>
      </div>
    </SiteFrame>
  );
}
