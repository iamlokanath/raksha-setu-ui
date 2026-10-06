"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { formatWhen, statusColor } from "@/components/app/Widgets";
import { Shell } from "@/components/layout/Shell";
import { EmptyState, ErrorState, Loader } from "@/components/feedback/States";
import { Button, FormField, Input, Select } from "@/components/ui/Controls";
import { useAppDispatch, useAppSelector, useT } from "@/hooks/useT";
import { messageKeyFor } from "@/lib/errors";
import { api } from "@/services/http";
import { setNotice } from "@/store/store";

type Shelter = {
  id: string;
  name: string;
  block_id: string;
  location_label: string;
  capacity: number;
  operational_status: string;
  current_status: string;
  current_population: number | null;
  last_applied_report_at: string | null;
  warden_user_id: string;
  reporting_contact: string;
};

const STATUS: Record<string, string> = { green: "Stable", yellow: "Attention", red: "Urgent", unknown: "Status withheld" };

export default function ShelterListPage() {
  const t = useT();
  const canRegister = useAppSelector((state) => state.auth.principal?.permissions.includes("shelter.register"));
  const [rows, setRows] = useState<Shelter[] | null>(null);
  const [error, setError] = useState("");
  async function load() {
    const result = await api<Shelter[]>("/api/v1/shelters/?page_size=100");
    if (!result.ok) setError(t(messageKeyFor(result.error.code)));
    else setRows(result.data);
  }
  useEffect(() => { void load(); }, []);
  return (
    <Shell permission="shelter.read">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Shelters</h1>
        {canRegister ? <Link href="/shelters/new" className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">{t("shelter.create")}</Link> : null}
      </div>
      {error ? <ErrorState message={error} onRetry={load} retryLabel={t("common.retry")} /> : null}
      {rows === null && !error ? <Loader label={t("common.loading")} /> : null}
      {rows && rows.length === 0 ? <EmptyState message={t("shelter.empty")} /> : null}
      <div className="grid gap-4 md:grid-cols-2">
        {rows?.map((row) => (
          <Link key={row.id} href={`/shelters/${row.id}`} className="panel flex gap-4 p-4">
            <img src="/hero-shelter.jpg" alt="" className="h-24 w-32 rounded-xl object-cover" />
            <span>
              <span className="flex items-center gap-2">
                <span className="font-semibold">{row.name}</span>
                <span className="rounded-full px-2 py-0.5 text-xs font-semibold text-white" style={{ background: statusColor(row.current_status) }}>{STATUS[row.current_status]}</span>
              </span>
              <span className="mt-1 block text-sm text-ink-muted">{row.location_label}</span>
              <span className="mt-2 block text-sm">Capacity {row.capacity} · Population {row.current_population ?? t("resource.unreported")}</span>
            </span>
          </Link>
        ))}
      </div>
    </Shell>
  );
}

export function ShelterCreatePage() {
  const t = useT();
  const dispatch = useAppDispatch();
  const [form, setForm] = useState({ name: "", block_id: "", location_label: "", capacity: "1", warden_user_id: "", reporting_contact: "", operational_status: "active" });
  async function submit(event: FormEvent) {
    event.preventDefault();
    const result = await api("/api/v1/shelters/", { method: "POST", body: { ...form, capacity: Number(form.capacity), latitude: null, longitude: null } });
    dispatch(setNotice(result.ok ? t("shelter.registered") : t(messageKeyFor(result.error.code))));
  }
  return (
    <Shell permission="shelter.register">
      <h1 className="mb-4 text-2xl font-bold">{t("shelter.create")}</h1>
      <form className="panel max-w-xl space-y-3 p-5" onSubmit={submit}>
        {(["name", "block_id", "location_label", "capacity", "warden_user_id", "reporting_contact"] as const).map((field) => (
          <FormField key={field} label={t(field === "name" ? "shelter.name" : field === "block_id" ? "shelter.block" : field === "location_label" ? "shelter.location" : field === "capacity" ? "shelter.capacity" : field === "warden_user_id" ? "shelter.warden" : "shelter.contact")}>
            <Input value={form[field]} onChange={(event) => setForm({ ...form, [field]: event.target.value })} />
          </FormField>
        ))}
        <FormField label={t("shelter.operational_status")}>
          <Select value={form.operational_status} onChange={(event) => setForm({ ...form, operational_status: event.target.value })}>
            <option value="active">{t("shelter.active")}</option>
            <option value="inactive">{t("shelter.inactive")}</option>
          </Select>
        </FormField>
        <Button type="submit">{t("shelter.create")}</Button>
      </form>
    </Shell>
  );
}

type Report = { id: string; reported_at: string; population: number; channel: string; applied_to_current: boolean; vulnerability: Record<string, number>; resources: { resource_type: string; quantity: number; unit: string }[] };
type UserRow = { id: string; name: string };

export function ShelterDetailPage() {
  const t = useT();
  const params = useParams<{ id: string }>();
  const canEdit = useAppSelector((state) => state.auth.principal?.permissions.includes("shelter.update"));
  const dispatch = useAppDispatch();
  const [shelter, setShelter] = useState<Shelter | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [stocks, setStocks] = useState<{ resource_type: string; quantity: number | null; unit: string | null }[]>([]);
  const [warden, setWarden] = useState("");
  const [tab, setTab] = useState<"reports" | "alerts" | "actions">("reports");
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ name: "", location_label: "", capacity: "", reporting_contact: "" });

  async function load() {
    const result = await api<Shelter>(`/api/v1/shelters/${params.id}`);
    if (!result.ok) {
      setError(t(messageKeyFor(result.error.code)));
      return;
    }
    setShelter(result.data);
    setDraft({ name: result.data.name, location_label: result.data.location_label, capacity: String(result.data.capacity), reporting_contact: result.data.reporting_contact });
    const [history, resources, users] = await Promise.all([
      api<Report[]>(`/api/v1/shelters/${params.id}/reports`),
      api<{ resource_type: string; quantity: number | null; unit: string | null }[]>(`/api/v1/shelters/${params.id}/resources`),
      api<UserRow[]>("/api/v1/users/"),
    ]);
    if (history.ok) setReports(history.data);
    if (resources.ok) setStocks(resources.data);
    if (users.ok) setWarden(users.data.find((user) => user.id === result.data.warden_user_id)?.name ?? "");
  }
  useEffect(() => { void load(); }, [params.id]);

  async function save(event: FormEvent) {
    event.preventDefault();
    const result = await api(`/api/v1/shelters/${params.id}`, { method: "PATCH", body: { name: draft.name, location_label: draft.location_label, capacity: Number(draft.capacity), reporting_contact: draft.reporting_contact } });
    if (!result.ok) setError(t(messageKeyFor(result.error.code)));
    else {
      dispatch(setNotice(t("feedback.saved")));
      setEditing(false);
      await load();
    }
  }

  const latest = reports.find((report) => report.applied_to_current) ?? reports[0];
  const vulnerable = latest ? Object.values(latest.vulnerability).reduce((sum, value) => sum + value, 0) : null;
  const groups = [
    ["children", "Children"],
    ["older_adults", "Elderly"],
    ["pregnant_women", "Pregnant Women"],
    ["persons_with_disability", "Persons with Disability"],
    ["injured_or_sick", "Medical Needs"],
  ] as const;

  return (
    <Shell permission="shelter.read">
      {error ? <ErrorState message={error} /> : null}
      {!shelter && !error ? <Loader label={t("common.loading")} /> : null}
      {shelter ? (
        <div className="space-y-4">
          <Link href="/shelters" className="text-sm font-semibold text-brand">← Back</Link>
          <section className="panel p-4 md:flex md:items-center md:gap-4">
            <img src="/hero-shelter.jpg" alt="" className="h-28 w-full rounded-xl object-cover md:w-44" />
            <div className="mt-3 flex-1 md:mt-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold">{shelter.name}</h1>
                <span className="rounded-full px-2 py-0.5 text-xs font-semibold text-white" style={{ background: statusColor(shelter.current_status) }}>{STATUS[shelter.current_status]}</span>
              </div>
              <p className="text-sm text-ink-muted">{shelter.location_label}</p>
              <p className="text-sm text-ink-muted">Warden: {warden || "—"} · Contact: {shelter.reporting_contact}</p>
            </div>
            {canEdit ? <button className="rounded-lg border border-brand px-4 py-2 text-sm font-semibold text-brand" type="button" onClick={() => setEditing((value) => !value)}>Edit</button> : null}
          </section>
          {editing ? (
            <form className="panel grid gap-3 p-4 md:grid-cols-2" onSubmit={save}>
              <FormField label={t("shelter.name")}><Input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} /></FormField>
              <FormField label={t("shelter.location")}><Input value={draft.location_label} onChange={(event) => setDraft({ ...draft, location_label: event.target.value })} /></FormField>
              <FormField label={t("shelter.capacity")}><Input value={draft.capacity} onChange={(event) => setDraft({ ...draft, capacity: event.target.value })} /></FormField>
              <FormField label={t("shelter.contact")}><Input value={draft.reporting_contact} onChange={(event) => setDraft({ ...draft, reporting_contact: event.target.value })} /></FormField>
              <Button type="submit">{t("common.confirm")}</Button>
            </form>
          ) : null}
          <div className="grid gap-3 md:grid-cols-4">
            <Info label="Capacity" value={String(shelter.capacity)} />
            <Info label="Current Population" value={shelter.current_population === null ? t("resource.unreported") : `${shelter.current_population}${shelter.capacity ? ` (${Math.round((shelter.current_population / shelter.capacity) * 100)}%)` : ""}`} />
            <Info label="Vulnerable Groups" value={vulnerable === null ? t("resource.unreported") : String(vulnerable)} />
            <Info label="Status" value={STATUS[shelter.current_status]} hint={shelter.current_status === "unknown" ? "Colour is withheld until configuration and an applied report exist." : "From the latest applied report."} />
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {["food", "water", "medicine"].map((kind) => {
              const stock = stocks.find((item) => item.resource_type === kind);
              return (
                <article key={kind} className="panel p-4">
                  <p className="text-sm capitalize text-ink-muted">{kind} Stock</p>
                  <p className="text-2xl font-bold">{stock?.quantity ?? "—"} <span className="text-sm font-medium text-ink-muted">{stock?.unit ?? ""}</span></p>
                  {stock?.quantity === null || stock?.quantity === undefined ? <p className="text-xs text-ink-muted">{t("resource.unreported")}</p> : null}
                </article>
              );
            })}
          </div>
          <section className="panel p-4">
            <h2 className="mb-3 font-semibold">Vulnerable Group Count</h2>
            <div className="grid gap-2 sm:grid-cols-5">
              {groups.map(([key, label]) => (
                <p key={key} className="rounded-xl bg-[#f7fafc] p-3 text-sm">
                  <span className="block text-ink-muted">{label}</span>
                  <span className="text-lg font-bold">{latest ? latest.vulnerability[key] : "—"}</span>
                </p>
              ))}
            </div>
          </section>
          <section className="panel p-4">
            <div className="mb-3 flex gap-2">
              {(["reports", "alerts", "actions"] as const).map((item) => (
                <button key={item} type="button" className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${tab === item ? "bg-brand text-white" : "bg-[#f4f8fc]"}`} onClick={() => setTab(item)}>
                  {item === "reports" ? "Recent Reports" : item === "alerts" ? "Active Alerts" : "Action History"}
                </button>
              ))}
            </div>
            {tab === "reports" ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-ink-muted"><tr>{["Date & Time", "Population", "Food", "Water", "Medicine", "Status"].map((header) => <th key={header} className="py-2 pr-3 font-medium">{header}</th>)}</tr></thead>
                  <tbody>
                    {reports.length === 0 ? <tr><td className="py-3" colSpan={6}>{t("sync.empty")}</td></tr> : null}
                    {reports.map((report) => (
                      <tr key={report.id} className="border-t border-[#eef3f8]">
                        <td className="py-2 pr-3">{formatWhen(report.reported_at)}</td>
                        <td className="py-2 pr-3">{report.population}</td>
                        {["food", "water", "medicine"].map((kind) => <td key={kind} className="py-2 pr-3">{report.resources.find((item) => item.resource_type === kind)?.quantity ?? "—"}</td>)}
                        <td className="py-2">{report.applied_to_current ? t("sync.applied") : t("sync.kept_as_history")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
            {tab === "alerts" ? <Link className="text-sm font-semibold text-brand" href="/alerts">Open alerts</Link> : null}
            {tab === "actions" ? <Link className="text-sm font-semibold text-brand" href="/actions">Open redistribution</Link> : null}
          </section>
        </div>
      ) : null}
    </Shell>
  );
}

function Info({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <article className="panel p-4">
      <p className="text-sm text-ink-muted">{label}</p>
      <p className="text-xl font-bold">{value}</p>
      {hint ? <p className="text-xs text-ink-muted">{hint}</p> : null}
    </article>
  );
}
