"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon, LogoMark } from "@/components/brand/Marks";
import { LanguageSelect } from "@/components/marketing/LanguageSelect";
import { useAppDispatch, useAppSelector, useT } from "@/hooks/useT";
import { fieldMessageKey, messageKeyFor } from "@/lib/errors";
import type { Locale } from "@/locales";
import { api } from "@/services/http";
import { clearTokens, setTokens } from "@/services/session";
import { setAuthError, setPrincipal } from "@/store/store";

type TokenPair = { access_token: string; refresh_token: string };
type Principal = {
  id: string;
  name: string;
  role: string;
  organization?: string;
  tenant_id: string;
  tenant_name?: string;
  shelter_id: string | null;
  block_id: string | null;
  permissions: string[];
};

const ROLES = [
  { id: "warden", icon: "shelter", en: "Shelter Warden", hi: "आश्रय वार्डन", or: "ଆଶ୍ରୟ ୱାର୍ଡେନ୍" },
  { id: "block_officer", icon: "building", en: "Block Officer", hi: "ब्लॉक अधिकारी", or: "ବ୍ଲକ୍ ଅଧିକାରୀ" },
  { id: "district_officer", icon: "shield", en: "District Officer", hi: "जिला अधिकारी", or: "ଜିଲ୍ଲା ଅଧିକାରୀ" },
  { id: "volunteer", icon: "users", en: "Volunteer / Support", hi: "स्वयंसेवक / सहायता", or: "ସ୍ୱେଚ୍ଛାସେବୀ / ସହଯୋଗ" },
];

const TEXT: Record<Locale, Record<string, string>> = {
  en: {
    headline: "Secure Access for a Safer Tomorrow",
    lead: "Log in to access your dashboard, manage shelters, track resources and coordinate relief operations.",
    access: "Role-based Access", accessSub: "Access only what you need",
    secure: "Secure & Encrypted", secureSub: "Your data is always protected",
    tenant: "Multi-tenant Support", tenantSub: "Built for districts and beyond",
    welcome: "Welcome Back", sub: "Sign in to your Raksha Setu account",
    select: "Select Your Role", email: "Email / Mobile Number", emailPh: "Enter your email or mobile number",
    password: "Password", passwordPh: "Enter your password", forgot: "Forgot password?",
    login: "Login", or: "Or", sso: "Login with SSO",
    terms: "By continuing, you agree to our Terms & Privacy Policy",
    roleMismatch: "This account does not match the selected role.",
    forgotMsg: "Ask your district administrator to reset this account.",
    ssoMsg: "SSO is not configured for this district.",
  },
  hi: {
    headline: "सुरक्षित कल के लिए सुरक्षित प्रवेश",
    lead: "डैशबोर्ड, आश्रय, संसाधन और राहत समन्वय के लिए साइन इन करें।",
    access: "भूमिका-आधारित पहुँच", accessSub: "केवल वही जो आपको चाहिए",
    secure: "सुरक्षित और एन्क्रिप्टेड", secureSub: "आपका डेटा सुरक्षित रहता है",
    tenant: "बहु-जिला समर्थन", tenantSub: "जिलों और उससे आगे के लिए",
    welcome: "वापसी पर स्वागत है", sub: "अपने रक्षा सेतु खाते में साइन इन करें",
    select: "अपनी भूमिका चुनें", email: "ईमेल / मोबाइल नंबर", emailPh: "ईमेल या मोबाइल नंबर दर्ज करें",
    password: "पासवर्ड", passwordPh: "अपना पासवर्ड दर्ज करें", forgot: "पासवर्ड भूल गए?",
    login: "लॉगिन", or: "या", sso: "SSO से लॉगिन",
    terms: "जारी रखकर आप शर्तें और गोपनीयता नीति स्वीकार करते हैं",
    roleMismatch: "यह खाता चुनी हुई भूमिका से मेल नहीं खाता।",
    forgotMsg: "इस खाते को रीसेट करने के लिए जिला प्रशासक से कहें।",
    ssoMsg: "इस जिले के लिए SSO कॉन्फ़िगर नहीं है।",
  },
  or: {
    headline: "ସୁରକ୍ଷିତ ଆସନ୍ତାକାଲି ପାଇଁ ସୁରକ୍ଷିତ ପ୍ରବେଶ",
    lead: "ଡ୍ୟାସବୋର୍ଡ, ଆଶ୍ରୟ, ସମ୍ବଳ ଓ ରିଲିଫ୍ ସମନ୍ୱୟ ପାଇଁ ସାଇନ୍ ଇନ୍ କରନ୍ତୁ।",
    access: "ଭୂମିକା-ଆଧାରିତ ପ୍ରବେଶ", accessSub: "କେବଳ ଯାହା ଆପଣଙ୍କୁ ଦରକାର",
    secure: "ସୁରକ୍ଷିତ ଓ ଏନକ୍ରିପ୍ଟେଡ୍", secureSub: "ଆପଣଙ୍କ ତଥ୍ୟ ସୁରକ୍ଷିତ",
    tenant: "ବହୁ-ଜିଲ୍ଲା ସହଯୋଗ", tenantSub: "ଜିଲ୍ଲା ଓ ତାହା ବାହାରେ",
    welcome: "ପୁଣି ସ୍ୱାଗତ", sub: "ଆପଣଙ୍କ ରକ୍ଷା ସେତୁ ଖାତାକୁ ସାଇନ୍ ଇନ୍ କରନ୍ତୁ",
    select: "ଆପଣଙ୍କ ଭୂମିକା ବାଛନ୍ତୁ", email: "ଇମେଲ୍ / ମୋବାଇଲ୍ ନମ୍ବର", emailPh: "ଇମେଲ୍ କିମ୍ବା ମୋବାଇଲ୍ ନମ୍ବର ଲେଖନ୍ତୁ",
    password: "ପାସୱାର୍ଡ", passwordPh: "ଆପଣଙ୍କ ପାସୱାର୍ଡ ଲେଖନ୍ତୁ", forgot: "ପାସୱାର୍ଡ ଭୁଲିଗଲେ?",
    login: "ଲଗଇନ୍", or: "କିମ୍ବା", sso: "SSO ରେ ଲଗଇନ୍",
    terms: "ଆଗକୁ ବଢ଼ିଲେ ଆପଣ ସର୍ତ୍ତ ଓ ଗୋପନୀୟତା ନୀତି ମାନନ୍ତି",
    roleMismatch: "ଏହି ଖାତା ବଛାଯାଇଥିବା ଭୂମିକା ସହ ମେଳ ଖାଉ ନାହିଁ।",
    forgotMsg: "ଏହି ଖାତା ରିସେଟ୍ ପାଇଁ ଜିଲ୍ଲା ପ୍ରଶାସକଙ୍କୁ କୁହନ୍ତୁ।",
    ssoMsg: "ଏହି ଜିଲ୍ଲା ପାଇଁ SSO ସେଟ୍ ହୋଇନାହିଁ।",
  },
};

export default function LoginPage() {
  const t = useT();
  const locale = useAppSelector((state) => state.ui.locale);
  const copy = TEXT[locale];
  const dispatch = useAppDispatch();
  const router = useRouter();
  const error = useAppSelector((state) => state.auth.error);
  const [role, setRole] = useState("district_officer");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [pending, setPending] = useState(false);
  const [fields, setFields] = useState<Record<string, string>>({});
  const [hint, setHint] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setHint("");
    setPending(true);
    const result = await api<TokenPair>("/api/v1/auth/login", { method: "POST", body: { username, password } });
    if (!result.ok) {
      const next: Record<string, string> = {};
      result.error.details.forEach((detail) => {
        next[detail.field] = t(fieldMessageKey(detail.code));
      });
      setFields(next);
      dispatch(setAuthError(t(messageKeyFor(result.error.code))));
      setPending(false);
      return;
    }
    setTokens(result.data.access_token, result.data.refresh_token);
    const me = await api<Principal>("/api/v1/auth/me");
    if (!me.ok) {
      dispatch(setAuthError(t(messageKeyFor(me.error.code))));
      setPending(false);
      return;
    }
    if (me.data.role !== role) {
      clearTokens();
      dispatch(setAuthError(copy.roleMismatch));
      setPending(false);
      return;
    }
    dispatch(setPrincipal(me.data));
    dispatch(setAuthError(null));
    if (me.data.permissions.includes("dashboard.read")) router.replace("/dashboard");
    else if (me.data.permissions.includes("report.submit")) router.replace("/report");
    else router.replace("/shelters");
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-[0.92fr_1.08fr]">
      <section className="relative hidden overflow-hidden bg-gradient-to-b from-[#163f86] to-[#1b52a4] px-10 py-10 text-white lg:block">
        <Link href="/" className="flex items-center gap-3">
          <LogoMark light className="h-12 w-12" />
          <span>
            <span className="block text-xl font-bold leading-none">Raksha Setu</span>
            <span className="text-xs text-white/75">Emergency Shelter Coordination</span>
          </span>
        </Link>
        <h1 className="mt-16 max-w-md text-4xl font-bold leading-tight">{copy.headline}</h1>
        <p className="mt-4 max-w-md text-white/85">{copy.lead}</p>
        <ul className="mt-10 space-y-5">
          {[
            ["stable", "check", copy.access, copy.accessSub],
            ["sky", "lock", copy.secure, copy.secureSub],
            ["sun", "building", copy.tenant, copy.tenantSub],
          ].map(([tint, icon, title, sub]) => (
            <li key={title} className="flex items-center gap-3">
              <span className={`flex h-11 w-11 items-center justify-center rounded-full ${tint === "stable" ? "bg-stable" : tint === "sky" ? "bg-sky" : "bg-sun text-[#1c2b3a]"}`}>
                <Icon name={icon} className="h-5 w-5" />
              </span>
              <span>
                <span className="block font-semibold">{title}</span>
                <span className="text-sm text-white/75">{sub}</span>
              </span>
            </li>
          ))}
        </ul>
        <VillageArt />
      </section>
      <section className="flex items-center bg-white px-6 py-10">
        <form className="mx-auto w-full max-w-md" onSubmit={submit}>
          <div className="mb-8 flex justify-end"><LanguageSelect /></div>
          <h2 className="text-3xl font-bold">{copy.welcome}</h2>
          <p className="mt-1 text-sm text-ink-muted">{copy.sub}</p>
          <p className="mb-2 mt-6 text-sm font-medium">{copy.select}</p>
          <div className="grid grid-cols-2 gap-3">
            {ROLES.map((item) => {
              const active = role === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setRole(item.id)}
                  className={`flex items-center gap-2 rounded-xl border px-3 py-3 text-left text-sm font-semibold ${active ? "border-brand bg-brand text-white" : "border-[#d5e2f2] bg-white text-[#1c2b3a]"}`}
                >
                  <Icon name={item.icon} className="h-5 w-5" />
                  {item[locale]}
                </button>
              );
            })}
          </div>
          <label className="mt-5 block text-sm font-medium">
            {copy.email}
            <span className="mt-1 flex items-center gap-2 rounded-lg border border-[#d5e2f2] px-3">
              <Icon name="mail" className="h-4 w-4 text-ink-muted" />
              <input className="w-full py-3 text-sm outline-none" value={username} placeholder={copy.emailPh} autoComplete="username" onChange={(event) => setUsername(event.target.value)} />
            </span>
            {fields.username ? <span className="mt-1 block text-alert">{fields.username}</span> : null}
          </label>
          <label className="mt-4 block text-sm font-medium">
            <span className="flex items-center justify-between">
              {copy.password}
              <button type="button" className="text-xs font-semibold text-brand" onClick={() => setHint(copy.forgotMsg)}>{copy.forgot}</button>
            </span>
            <span className="mt-1 flex items-center gap-2 rounded-lg border border-[#d5e2f2] px-3">
              <Icon name="lock" className="h-4 w-4 text-ink-muted" />
              <input className="w-full py-3 text-sm outline-none" type={show ? "text" : "password"} value={password} placeholder={copy.passwordPh} autoComplete="current-password" onChange={(event) => setPassword(event.target.value)} />
              <button type="button" className="text-ink-muted" onClick={() => setShow((value) => !value)} aria-label="Show password"><Icon name="eye" className="h-4 w-4" /></button>
            </span>
            {fields.password ? <span className="mt-1 block text-alert">{fields.password}</span> : null}
          </label>
          {error ? <p className="mt-3 text-sm text-alert">{error}</p> : null}
          {hint ? <p className="mt-3 text-sm text-ink-muted">{hint}</p> : null}
          <button disabled={pending} className="mt-5 w-full rounded-lg bg-brand py-3 text-sm font-semibold text-white disabled:opacity-60" type="submit">{copy.login}</button>
          <div className="my-4 flex items-center gap-3 text-xs text-ink-muted"><span className="h-px flex-1 bg-[#e4eef8]" />{copy.or}<span className="h-px flex-1 bg-[#e4eef8]" /></div>
          <button type="button" className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#d5e2f2] py-3 text-sm font-semibold" onClick={() => setHint(copy.ssoMsg)}>
            <Icon name="shield" className="h-4 w-4 text-brand" /> {copy.sso}
          </button>
          <p className="mt-4 text-center text-xs text-ink-muted">
            <Link href="/about" className="font-semibold text-brand">{copy.terms}</Link>
          </p>
        </form>
      </section>
    </div>
  );
}

function VillageArt() {
  return (
    <svg viewBox="0 0 640 220" className="pointer-events-none absolute bottom-0 left-0 w-full text-white/25" aria-hidden="true">
      <path d="M0 170c40-30 70-20 100-40 30 24 60 10 90-16 28 22 70 18 100-8 30 20 80 10 110-20 20 18 60 16 90-6 24 16 70 8 110-18v158H0z" fill="currentColor" />
      <path d="M70 150 110 112l40 38H70zM150 158l46-52 46 52h-92zM430 146l34-40 34 40h-68z" fill="none" stroke="currentColor" strokeWidth="3" />
      <path d="M250 168c8-28 10-40 8-62M300 168c6-24 8-36 6-54" stroke="currentColor" strokeWidth="3" fill="none" />
      <path d="M236 118c14-8 22-8 34 0M288 122c12-6 20-6 30 0" stroke="currentColor" strokeWidth="3" fill="none" />
    </svg>
  );
}
