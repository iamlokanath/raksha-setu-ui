"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { formatWhen } from "@/components/app/Widgets";
import { Shell } from "@/components/layout/Shell";
import { ErrorState, Loader } from "@/components/feedback/States";
import { Button, FormField, Input } from "@/components/ui/Controls";
import { useAppDispatch, useAppSelector, useT } from "@/hooks/useT";
import { messageKeyFor } from "@/lib/errors";
import { api } from "@/services/http";
import { setNotice } from "@/store/store";

type Alert = { id: string; shelter_id: string; type: string; resource_type: string | null; severity: string; status: string; created_at: string };
type Shelter = { id: string; name: string };

const STEPS = ["detected", "acknowledged", "action_planned", "action_in_progress", "resolved", "closed"];
const STEP_LABEL: Record<string, string> = {
  detected: "Detected", acknowledged: "Acknowledged", action_planned: "Action Planned", action_in_progress: "Action In Progress", resolved: "Resolved", closed: "Closed",
};
const NEXT: Record<string, [string, string, string]> = {
  detected: ["acknowledge", "alert.acknowledge", "Acknowledge"],
  acknowledged: ["plan", "alert.plan", "Plan Action"],
  action_planned: ["start", "alert.progress", "Start"],
  action_in_progress: ["resolve", "alert.resolve", "Mark Resolved"],
  resolved: ["close", "alert.close", "Close"],
};

export default function AlertListPage() {
  const t = useT();
  const [rows, setRows] = useState<Alert[] | null>(null);
  const [names, setNames] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [severity, setSeverity] = useState("");
  async function load() {
    const query = new URLSearchParams({ page_size: "100" });
    if (status) query.set("status", status);
    if (severity) query.set("severity", severity);
    const [alerts, shelters] = await Promise.all([api<Alert[]>(`/api/v1/alerts/?${query}`), api<Shelter[]>("/api/v1/shelters/?page_size=100")]);
    if (!alerts.ok) setError(t(messageKeyFor(alerts.error.code)));
    else {
      setRows(alerts.data);
      setSelected((current) => current ?? alerts.data[0]?.id ?? null);
    }
    if (shelters.ok) setNames(Object.fromEntries(shelters.data.map((row) => [row.id, row.name])));
  }
  useEffect(() => { void load(); }, [status, severity]);
  const current = rows?.find((row) => row.id === selected) ?? null;
  return (
    <Shell permission="alert.read">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Alerts & Actions</h1>
          <p className="text-sm text-ink-muted">Monitor alerts, track lifecycle and manage actions</p>
        </div>
        <div className="flex gap-2">
          <SelectFilter label="Status" value={status} onChange={setStatus} options={[["", "All"], ...STEPS.map((step) => [step, STEP_LABEL[step]] as [string, string])]} />
          <SelectFilter label="Priority" value={severity} onChange={setSeverity} options={[["", "All"], ["urgent", "Urgent"], ["attention", "Attention"]]} />
        </div>
      </div>
      {error ? <ErrorState message={error} /> : null}
      {rows === null && !error ? <Loader label={t("common.loading")} /> : null}
      <section className="panel mb-4 p-4">
        <h2 className="mb-3 text-sm font-semibold">Alert Lifecycle</h2>
        <ol className="flex flex-wrap items-center gap-2">
          {STEPS.slice(0, 5).map((step, index) => (
            <li key={step} className="flex items-center gap-2">
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${current?.status === step ? "bg-brand text-white" : "bg-[#eef4fb] text-[#3e5164]"}`}>{STEP_LABEL[step]}</span>
              {index < 4 ? <span className="text-ink-muted">→</span> : null}
            </li>
          ))}
        </ol>
      </section>
      <div className="grid gap-4 xl:grid-cols-[1.4fr_0.8fr]">
        <section className="panel overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <h2 className="font-semibold">Active Alerts</h2>
            <span className="text-xs text-ink-muted">{rows?.length ?? 0}</span>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="bg-[#f7fafc] text-ink-muted"><tr>{["ID", "Shelter", "Type", "Priority", "Status"].map((header) => <th key={header} className="px-4 py-2 font-medium">{header}</th>)}</tr></thead>
            <tbody>
              {rows && rows.length === 0 ? <tr><td className="px-4 py-4" colSpan={5}>{t("alert.empty")}</td></tr> : null}
              {rows?.map((row) => (
                <tr key={row.id} className={`cursor-pointer border-t border-[#eef3f8] ${selected === row.id ? "bg-[#f4f8ff]" : ""}`} onClick={() => setSelected(row.id)}>
                  <td className="px-4 py-3 font-semibold text-brand">{row.id.slice(0, 8).toUpperCase()}</td>
                  <td className="px-4 py-3">{names[row.shelter_id] ?? "Shelter"}</td>
                  <td className="px-4 py-3 capitalize">{row.type}{row.resource_type ? ` · ${row.resource_type}` : ""}</td>
                  <td className="px-4 py-3"><span className={`rounded-full px-2 py-0.5 text-xs font-semibold text-white ${row.severity === "urgent" ? "bg-alert" : "bg-amber"}`}>{row.severity}</span></td>
                  <td className="px-4 py-3">{STEP_LABEL[row.status] ?? row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <AlertPanel alert={current} shelterName={current ? names[current.shelter_id] : ""} onChanged={load} />
      </div>
    </Shell>
  );
}

function AlertPanel({ alert, shelterName, onChanged }: { alert: Alert | null; shelterName?: string; onChanged: () => Promise<void> }) {
  const t = useT();
  const dispatch = useAppDispatch();
  const permissions = useAppSelector((state) => state.auth.principal?.permissions ?? []);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  if (!alert) return <section className="panel p-4 text-sm text-ink-muted">{t("alert.empty")}</section>;
  const step = NEXT[alert.status];
  async function transition() {
    if (!step) return;
    const result = await api(`/api/v1/alerts/${alert!.id}/${step[0]}`, { method: "POST", body: note ? { note } : {} });
    if (!result.ok) setError(t(messageKeyFor(result.error.code)));
    else {
      dispatch(setNotice(t("alert.updated")));
      setNote("");
      await onChanged();
    }
  }
  return (
    <section className="panel p-4">
      <p className="text-xs text-ink-muted">Alert Details</p>
      <h2 className="text-xl font-bold">{alert.id.slice(0, 8).toUpperCase()}</h2>
      <p className="text-sm text-ink-muted">{shelterName} · {alert.type}{alert.resource_type ? ` · ${alert.resource_type}` : ""}</p>
      <p className="mt-2 text-sm">Opened {formatWhen(alert.created_at)}</p>
      <p className="mt-1"><span className="rounded-full bg-[#eef4fb] px-2 py-1 text-xs font-semibold">{STEP_LABEL[alert.status]}</span></p>
      {error ? <p className="mt-2 text-sm text-alert">{error}</p> : null}
      {step && permissions.includes(step[1]) ? (
        <div className="mt-4 space-y-2">
          <FormField label={t("alert.note")}><Input value={note} onChange={(event) => setNote(event.target.value)} /></FormField>
          <Button type="button" onClick={transition}>{step[2]}</Button>
        </div>
      ) : null}
      <Link className="mt-3 inline-block text-sm font-semibold text-brand" href={`/alerts/${alert.id}`}>View details</Link>
    </section>
  );
}

export function AlertDetailPage() {
  const t = useT();
  const params = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const permissions = useAppSelector((state) => state.auth.principal?.permissions ?? []);
  const [alert, setAlert] = useState<Alert | null>(null);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  async function load() {
    const result = await api<Alert>(`/api/v1/alerts/${params.id}`);
    if (!result.ok) setError(t(messageKeyFor(result.error.code)));
    else setAlert(result.data);
  }
  useEffect(() => { void load(); }, [params.id]);
  const step = alert ? NEXT[alert.status] : undefined;
  async function transition() {
    if (!step || !alert) return;
    const result = await api(`/api/v1/alerts/${alert.id}/${step[0]}`, { method: "POST", body: note ? { note } : {} });
    if (!result.ok) setError(t(messageKeyFor(result.error.code)));
    else {
      dispatch(setNotice(t("alert.updated")));
      await load();
    }
  }
  return (
    <Shell permission="alert.read">
      <Link href="/alerts" className="text-sm font-semibold text-brand">← Back</Link>
      {error ? <ErrorState message={error} /> : null}
      {!alert && !error ? <Loader label={t("common.loading")} /> : null}
      {alert ? (
        <section className="panel mt-4 max-w-xl p-5">
          <h1 className="text-2xl font-bold">{t(`alert.type.${alert.type}`)}</h1>
          <p className="mt-1 text-sm text-ink-muted">{STEP_LABEL[alert.status]} · {alert.severity}</p>
          {step && permissions.includes(step[1]) ? (
            <div className="mt-4 space-y-2">
              <FormField label={t("alert.note")}><Input value={note} onChange={(event) => setNote(event.target.value)} /></FormField>
              <Button onClick={transition} type="button">{step[2]}</Button>
            </div>
          ) : null}
        </section>
      ) : null}
    </Shell>
  );
}

function SelectFilter({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: [string, string][] }) {
  return (
    <label className="text-xs text-ink-muted">
      {label}
      <select className="mt-1 block rounded-lg border border-line bg-white px-2 py-2 text-sm text-ink" value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map(([optionValue, optionLabel]) => <option key={optionLabel + optionValue} value={optionValue}>{optionLabel}</option>)}
      </select>
    </label>
  );
}
