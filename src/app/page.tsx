"use client";

import Link from "next/link";
import { Icon } from "@/components/brand/Marks";
import { SiteFrame } from "@/components/marketing/SiteFrame";
import { useAppSelector } from "@/hooks/useT";
import type { Locale } from "@/locales";

const COPY: Record<Locale, {
  titleA: string; titleB: string; lead: string; body: string; start: string; more: string;
  featuresTitle: string; how: string; impact: string; impactNote: string;
  features: { icon: string; tint: string; title: string; text: string }[];
  steps: { n: string; tint: string; title: string; text: string }[];
  stats: { value: string; label: string; tint: string }[];
}> = {
  en: {
    titleA: "Safer Communities,",
    titleB: "Stronger Together",
    lead: "Raksha Setu enables real-time coordination of emergency shelters and relief resources during cyclones and floods.",
    body: "From shelter reporting to resource management, we help authorities make faster, data-driven decisions when it matters most.",
    start: "Get Started",
    more: "Learn More",
    featuresTitle: "Key Features",
    how: "How It Works",
    impact: "Our Impact (Pilot Phase)",
    impactNote: "Figures shown here are the pilot story on this page. Live shelter numbers appear after sign-in.",
    features: [
      { icon: "monitor", tint: "bg-[#e7f3ff] text-brand", title: "Real-time Monitoring", text: "Track shelter status, population, alerts and stock in real time." },
      { icon: "offline", tint: "bg-[#e7f7ef] text-stable", title: "Offline Support", text: "Report and sync data even without internet." },
      { icon: "bell", tint: "bg-[#fff1e6] text-amber", title: "Smart Alerts", text: "Get notified about shortages, capacity issues and more." },
      { icon: "boxes", tint: "bg-[#fff8e0] text-[#c89600]", title: "Resource Coordination", text: "Support and manage resource redistribution." },
      { icon: "language", tint: "bg-[#fdecec] text-alert", title: "Multi-language", text: "Support for English, Hindi and Odia." },
    ],
    steps: [
      { n: "1", tint: "bg-brand", title: "Report", text: "Shelter wardens submit regular reports." },
      { n: "2", tint: "bg-stable", title: "Monitor", text: "Officers see conditions and alerts." },
      { n: "3", tint: "bg-sun text-[#1c2b3a]", title: "Analyze", text: "The system identifies shortage and priorities." },
      { n: "4", tint: "bg-amber", title: "Act", text: "Human officers approve and coordinate relief." },
    ],
    stats: [
      { value: "12", label: "Shelters Monitored", tint: "text-brand" },
      { value: "1,250", label: "People Supported", tint: "text-stable" },
      { value: "8", label: "Alerts Resolved", tint: "text-amber" },
      { value: "45 min", label: "Avg. Response Time", tint: "text-sky" },
    ],
  },
  hi: {
    titleA: "सुरक्षित समुदाय,",
    titleB: "मिलकर और मजबूत",
    lead: "रक्षा सेतु चक्रवात और बाढ़ के दौरान आपातकालीन आश्रयों और राहत संसाधनों का वास्तविक समय समन्वय करता है।",
    body: "आश्रय रिपोर्ट से संसाधन प्रबंधन तक, हम अधिकारियों को तब तेज़, आँकड़ों पर आधारित निर्णय लेने में मदद करते हैं जब उसकी सबसे अधिक ज़रूरत हो।",
    start: "शुरू करें",
    more: "और जानें",
    featuresTitle: "मुख्य सुविधाएँ",
    how: "यह कैसे काम करता है",
    impact: "हमारा प्रभाव (पायलट चरण)",
    impactNote: "ये आँकड़े इस पृष्ठ की पायलट कहानी हैं। जीवित आश्रय संख्या साइन-इन के बाद दिखती है।",
    features: [
      { icon: "monitor", tint: "bg-[#e7f3ff] text-brand", title: "वास्तविक समय निगरानी", text: "आश्रय स्थिति, जनसंख्या, चेतावनी और स्टॉक एक साथ देखें।" },
      { icon: "offline", tint: "bg-[#e7f7ef] text-stable", title: "ऑफ़लाइन सहायता", text: "इंटरनेट के बिना भी रिपोर्ट करें और बाद में सिंक करें।" },
      { icon: "bell", tint: "bg-[#fff1e6] text-amber", title: "स्मार्ट चेतावनी", text: "कमी, क्षमता और अन्य चिंताओं की सूचना पाएँ।" },
      { icon: "boxes", tint: "bg-[#fff8e0] text-[#c89600]", title: "संसाधन समन्वय", text: "संसाधन पुनर्वितरण का समर्थन और प्रबंधन।" },
      { icon: "language", tint: "bg-[#fdecec] text-alert", title: "बहुभाषा", text: "अंग्रेज़ी, हिन्दी और ओड़िया।" },
    ],
    steps: [
      { n: "1", tint: "bg-brand", title: "रिपोर्ट", text: "वार्डन नियमित रिपोर्ट जमा करते हैं।" },
      { n: "2", tint: "bg-stable", title: "निगरानी", text: "अधिकारी स्थिति और चेतावनी देखते हैं।" },
      { n: "3", tint: "bg-sun text-[#1c2b3a]", title: "विश्लेषण", text: "प्रणाली कमी और प्राथमिकता पहचानती है।" },
      { n: "4", tint: "bg-amber", title: "कार्रवाई", text: "अधिकारी राहत की मंजूरी देते हैं।" },
    ],
    stats: [
      { value: "12", label: "निगरानी किए आश्रय", tint: "text-brand" },
      { value: "1,250", label: "सहायता प्राप्त लोग", tint: "text-stable" },
      { value: "8", label: "हल हुई चेतावनियाँ", tint: "text-amber" },
      { value: "45 मिनट", label: "औसत प्रतिक्रिया समय", tint: "text-sky" },
    ],
  },
  or: {
    titleA: "ସୁରକ୍ଷିତ ସମୁଦାୟ,",
    titleB: "ମିଶି ଆହୁରି ଶକ୍ତ",
    lead: "ରକ୍ଷା ସେତୁ ଘୂର୍ଣ୍ଣିବାତ୍ୟା ଓ ବନ୍ୟା ସମୟରେ ଜରୁରୀକାଳୀନ ଆଶ୍ରୟ ଓ ରିଲିଫ୍ ସମ୍ବଳର ରିଅଲ୍-ଟାଇମ୍ ସମନ୍ୱୟ କରେ।",
    body: "ଆଶ୍ରୟ ରିପୋର୍ଟରୁ ସମ୍ବଳ ପରିଚାଳନା ପର୍ଯ୍ୟନ୍ତ, ଆମେ ଅଧିକାରୀମାନଙ୍କୁ ଦରକାର ସମୟରେ ଦ୍ରୁତ ଓ ତଥ୍ୟଭିତ୍ତିକ ନିଷ୍ପତ୍ତି ନେବାରେ ସାହାଯ୍ୟ କରୁ।",
    start: "ଆରମ୍ଭ କରନ୍ତୁ",
    more: "ଅଧିକ ଜାଣନ୍ତୁ",
    featuresTitle: "ମୁଖ୍ୟ ସୁବିଧା",
    how: "ଏହା କିପରି କାମ କରେ",
    impact: "ଆମ ପ୍ରଭାବ (ପାଇଲଟ୍ ପର୍ଯ୍ୟାୟ)",
    impactNote: "ଏହି ସଂଖ୍ୟା ଏହି ପୃଷ୍ଠାର ପାଇଲଟ୍ କାହାଣୀ। ସାଇନ୍-ଇନ୍ ପରେ ପ୍ରକୃତ ଆଶ୍ରୟ ସଂଖ୍ୟା ଦେଖାଯିବ।",
    features: [
      { icon: "monitor", tint: "bg-[#e7f3ff] text-brand", title: "ରିଅଲ୍-ଟାଇମ୍ ନଜର", text: "ଆଶ୍ରୟ ସ୍ଥିତି, ଜନସଂଖ୍ୟା, ଚେତାବନୀ ଓ ଷ୍ଟକ୍ ଦେଖନ୍ତୁ।" },
      { icon: "offline", tint: "bg-[#e7f7ef] text-stable", title: "ଅଫଲାଇନ୍ ସହଯୋଗ", text: "ଇଣ୍ଟରନେଟ୍ ବିନା ରିପୋର୍ଟ କରନ୍ତୁ ଓ ପରେ ସିଙ୍କ୍ କରନ୍ତୁ।" },
      { icon: "bell", tint: "bg-[#fff1e6] text-amber", title: "ସ୍ମାର୍ଟ ଚେତାବନୀ", text: "ଅଭାବ, କ୍ଷମତା ଓ ଅନ୍ୟ ଚିନ୍ତାର ସୂଚନା ପାଆନ୍ତୁ।" },
      { icon: "boxes", tint: "bg-[#fff8e0] text-[#c89600]", title: "ସମ୍ବଳ ସମନ୍ୱୟ", text: "ସମ୍ବଳ ପୁନଃବଣ୍ଟନକୁ ସମର୍ଥନ ଓ ପରିଚାଳନା।" },
      { icon: "language", tint: "bg-[#fdecec] text-alert", title: "ବହୁଭାଷା", text: "ଇଂରାଜୀ, ହିନ୍ଦୀ ଓ ଓଡ଼ିଆ।" },
    ],
    steps: [
      { n: "1", tint: "bg-brand", title: "ରିପୋର୍ଟ", text: "ୱାର୍ଡେନ୍ ନିୟମିତ ରିପୋର୍ଟ ଦାଖଲ କରନ୍ତି।" },
      { n: "2", tint: "bg-stable", title: "ନଜର", text: "ଅଧିକାରୀ ସ୍ଥିତି ଓ ଚେତାବନୀ ଦେଖନ୍ତି।" },
      { n: "3", tint: "bg-sun text-[#1c2b3a]", title: "ବିଶ୍ଳେଷଣ", text: "ପ୍ରଣାଳୀ ଅଭାବ ଓ ପ୍ରାଥମିକତା ଚିହ୍ନଟ କରେ।" },
      { n: "4", tint: "bg-amber", title: "କାର୍ଯ୍ୟ", text: "ଅଧିକାରୀ ରିଲିଫ୍ ଅନୁମୋଦନ କରନ୍ତି।" },
    ],
    stats: [
      { value: "12", label: "ନଜର ରଖାଯାଇଥିବା ଆଶ୍ରୟ", tint: "text-brand" },
      { value: "1,250", label: "ସହାୟତା ପାଇଥିବା ଲୋକ", tint: "text-stable" },
      { value: "8", label: "ସମାଧାନ ହୋଇଥିବା ଚେତାବନୀ", tint: "text-amber" },
      { value: "45 ମିନିଟ୍", label: "ହାରାହାରି ପ୍ରତିକ୍ରିୟା ସମୟ", tint: "text-sky" },
    ],
  },
};

export default function HomePage() {
  const locale = useAppSelector((state) => state.ui.locale);
  const copy = COPY[locale];
  return (
    <SiteFrame>
      <section className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-12 lg:grid-cols-2">
        <div>
          <h1 className="text-4xl font-bold leading-tight md:text-5xl">
            {copy.titleA}
            <span className="block text-brand">{copy.titleB}</span>
          </h1>
          <p className="mt-4 text-lg text-[#3e5164]">{copy.lead}</p>
          <p className="mt-3 text-[#5d6b7a]">{copy.body}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/login" className="rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-white">{copy.start}</Link>
            <Link href="/features" className="rounded-lg border border-brand bg-white px-5 py-3 text-sm font-semibold text-brand">{copy.more}</Link>
          </div>
        </div>
        <img src="/hero-shelter.jpg" alt="Coastal emergency shelter" className="h-[340px] w-full rounded-2xl object-cover shadow-card" />
      </section>
      <section className="mx-auto max-w-6xl px-4 pb-12">
        <h2 className="mb-4 text-2xl font-bold">{copy.featuresTitle}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {copy.features.map((item) => (
            <article key={item.title} className="panel p-4">
              <span className={`mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl ${item.tint}`}>
                <Icon name={item.icon} />
              </span>
              <h3 className="font-semibold">{item.title}</h3>
              <p className="mt-1 text-sm text-ink-muted">{item.text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 pb-12">
        <h2 className="mb-6 text-2xl font-bold">{copy.how}</h2>
        <ol className="grid gap-6 md:grid-cols-4">
          {copy.steps.map((step) => (
            <li key={step.n} className="text-center">
              <span className={`mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full text-lg font-bold text-white ${step.tint}`}>{step.n}</span>
              <h3 className="font-semibold">{step.title}</h3>
              <p className="mt-1 text-sm text-ink-muted">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>
      <section className="mx-auto max-w-6xl px-4 pb-14">
        <h2 className="mb-4 text-2xl font-bold">{copy.impact}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {copy.stats.map((stat) => (
            <article key={stat.label} className="panel p-5 text-center">
              <p className={`text-3xl font-bold ${stat.tint}`}>{stat.value}</p>
              <p className="mt-1 text-sm text-ink-muted">{stat.label}</p>
            </article>
          ))}
        </div>
        <p className="mt-3 text-xs text-ink-muted">{copy.impactNote}</p>
      </section>
    </SiteFrame>
  );
}
