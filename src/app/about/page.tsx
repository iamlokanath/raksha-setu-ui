"use client";

import { Icon } from "@/components/brand/Marks";
import { SiteFrame } from "@/components/marketing/SiteFrame";
import { useAppSelector } from "@/hooks/useT";
import type { Locale } from "@/locales";

const COPY: Record<Locale, { title: string; lead: string; ready: string; readySub: string; how: string; goal: string; note: string; roles: { title: string; text: string; tint: string }[]; goals: string[] }> = {
  en: {
    title: "About Raksha Setu",
    lead: "A district-level emergency shelter coordination system that connects people, resources and decisions when it matters most.",
    ready: "Prepared Today",
    readySub: "Safer Tomorrow",
    how: "How It Works",
    goal: "Our Goal",
    note: "The system provides recommendations and insights. Human officers make the final decisions.",
    roles: [
      { title: "Shelter Warden", text: "Reports shelter status and resources", tint: "bg-stable" },
      { title: "Block Officer", text: "Monitors and validates block-level data", tint: "bg-brand" },
      { title: "District Officer", text: "Reviews priorities and approves actions", tint: "bg-sun text-[#1c2b3a]" },
    ],
    goals: ["Faster response times", "Better resource allocation", "Support for vulnerable communities", "Transparent and accountable", "Scalable from one block to entire districts"],
  },
  hi: {
    title: "रक्षा सेतु के बारे में",
    lead: "एक जिला-स्तरीय आपातकालीन आश्रय समन्वय प्रणाली, जो ज़रूरत के समय लोगों, संसाधनों और निर्णयों को जोड़ती है।",
    ready: "आज तैयार",
    readySub: "कल सुरक्षित",
    how: "यह कैसे काम करता है",
    goal: "हमारा लक्ष्य",
    note: "प्रणाली सुझाव और जानकारी देती है। अंतिम निर्णय मानव अधिकारी करते हैं।",
    roles: [
      { title: "आश्रय वार्डन", text: "आश्रय स्थिति और संसाधन रिपोर्ट करते हैं", tint: "bg-stable" },
      { title: "ब्लॉक अधिकारी", text: "ब्लॉक-स्तर के आँकड़ों की निगरानी और जाँच", tint: "bg-brand" },
      { title: "जिला अधिकारी", text: "प्राथमिकता देखते हैं और कार्रवाई स्वीकृत करते हैं", tint: "bg-sun text-[#1c2b3a]" },
    ],
    goals: ["तेज़ प्रतिक्रिया", "बेहतर संसाधन आवंटन", "संवेदनशील समुदायों का समर्थन", "पारदर्शी और जवाबदेह", "एक ब्लॉक से पूरे जिले तक विस्तार"],
  },
  or: {
    title: "ରକ୍ଷା ସେତୁ ବିଷୟରେ",
    lead: "ଏକ ଜିଲ୍ଲା-ସ୍ତରୀୟ ଜରୁରୀକାଳୀନ ଆଶ୍ରୟ ସମନ୍ୱୟ ପ୍ରଣାଳୀ, ଯାହା ଦରକାର ସମୟରେ ଲୋକ, ସମ୍ବଳ ଓ ନିଷ୍ପତ୍ତିକୁ ଯୋଡ଼େ।",
    ready: "ଆଜି ପ୍ରସ୍ତୁତ",
    readySub: "ଆସନ୍ତାକାଲି ସୁରକ୍ଷିତ",
    how: "ଏହା କିପରି କାମ କରେ",
    goal: "ଆମ ଲକ୍ଷ୍ୟ",
    note: "ପ୍ରଣାଳୀ ପରାମର୍ଶ ଓ ସୂଚନା ଦିଏ। ଚୂଡ଼ାନ୍ତ ନିଷ୍ପତ୍ତି ମାନବ ଅଧିକାରୀ ନିଅନ୍ତି।",
    roles: [
      { title: "ଆଶ୍ରୟ ୱାର୍ଡେନ୍", text: "ଆଶ୍ରୟ ସ୍ଥିତି ଓ ସମ୍ବଳ ରିପୋର୍ଟ କରନ୍ତି", tint: "bg-stable" },
      { title: "ବ୍ଲକ୍ ଅଧିକାରୀ", text: "ବ୍ଲକ୍ ସ୍ତରର ତଥ୍ୟ ନଜର ଓ ଯାଞ୍ଚ", tint: "bg-brand" },
      { title: "ଜିଲ୍ଲା ଅଧିକାରୀ", text: "ପ୍ରାଥମିକତା ଦେଖନ୍ତି ଓ କାର୍ଯ୍ୟ ଅନୁମୋଦନ କରନ୍ତି", tint: "bg-sun text-[#1c2b3a]" },
    ],
    goals: ["ଦ୍ରୁତ ପ୍ରତିକ୍ରିୟା", "ଉତ୍ତମ ସମ୍ବଳ ବଣ୍ଟନ", "ସମ୍ବେଦନଶୀଳ ସମୁଦାୟ ସହଯୋଗ", "ସ୍ୱଚ୍ଛ ଓ ଜବାବଦେହ", "ଗୋଟିଏ ବ୍ଲକରୁ ସମଗ୍ର ଜିଲ୍ଲା ପର୍ଯ୍ୟନ୍ତ"],
  },
};

export default function AboutPage() {
  const copy = COPY[useAppSelector((state) => state.ui.locale)];
  return (
    <SiteFrame>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <section className="rounded-2xl bg-brand px-6 py-8 text-white md:flex md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">{copy.title}</h1>
            <p className="mt-2 max-w-2xl text-white/85">{copy.lead}</p>
          </div>
          <div className="mt-4 text-right">
            <p className="text-sm text-white/80">{copy.ready}</p>
            <p className="text-xl font-semibold">{copy.readySub}</p>
          </div>
        </section>
        <div className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
          <section className="panel p-6">
            <h2 className="text-xl font-bold">{copy.how}</h2>
            <p className="text-sm text-ink-muted">A simple workflow. A powerful impact.</p>
            <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
              {copy.roles.map((role, index) => (
                <div key={role.title} className="flex items-start gap-3">
                  {index > 0 ? <span className="mt-4 hidden text-sky md:inline">→</span> : null}
                  <div className="max-w-[180px] text-center">
                    <span className={`mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full text-white ${role.tint}`}>
                      <Icon name={index === 0 ? "shelter" : index === 1 ? "building" : "shield"} className="h-7 w-7" />
                    </span>
                    <h3 className="font-semibold">{role.title}</h3>
                    <p className="text-sm text-ink-muted">{role.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-6 rounded-xl bg-[#f4f8fc] p-3 text-sm text-[#3e5164]">{copy.note}</p>
          </section>
          <section className="panel p-6">
            <h2 className="text-xl font-bold">{copy.goal}</h2>
            <p className="mt-1 text-sm text-ink-muted">To improve the speed and fairness of emergency resource coordination during cyclones and floods, while keeping human officers in control.</p>
            <ul className="mt-4 space-y-3">
              {copy.goals.map((goal) => (
                <li key={goal} className="flex items-start gap-2 text-sm">
                  <span className="mt-0.5 text-stable"><Icon name="check" className="h-4 w-4" /></span>
                  {goal}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </SiteFrame>
  );
}
