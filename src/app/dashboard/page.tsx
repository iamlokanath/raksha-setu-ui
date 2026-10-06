"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Donut, Meter, StatusMap, formatWhen, statusColor } from "@/components/app/Widgets";
import { Icon } from "@/components/brand/Marks";
import { Shell } from "@/components/layout/Shell";
import { ErrorState, Loader } from "@/components/feedback/States";
import { useT } from "@/hooks/useT";
import { messageKeyFor } from "@/lib/errors";
import { api } from "@/services/http";

type Alert = { id: string; type: string; resource_type: string | null; severity: string; status: string; created_at: string };
type ShelterRow = {
  id: string;
  name: string;
  location_label: string;
  latitude: number | null;
  longitude: number | null;
  block_name: string;
  capacity: number;
  population: number | null;
  vulnerability: Record<string, number> | null;
  stocks: { resource_type: string; quantity: number | null; unit: string | null }[];
  current_status: string;
  latest_report_at: string | null;
  open_alerts: Alert[];
  priority_score: number | null;
};

const STATUS_LABEL: Record<string, string> = { green: "Stable", yellow: "Attention", red: "Urgent", unknown: "Status withheld" };

export default function DashboardPage() {
  const t = useT();
  const router = useRouter();
  const [rows, setRows] = useState<ShelterRow[] | null>(null);
  const [error, setError] = useState("");
  const [block, setBlock] = useState("");
  const [status, setStatus] = useState("");
  const [shortage, setShortage] = useState("");
  const [priority, setPriority] = useState("");

  useEffect(() => {
    void (async () => {
      const result = await api<ShelterRow[]>("/api/v1/dashboard/shelters?page_size=100");
      if (!result.ok) setError(t(messageKeyFor(result.error.code)));
      else setRows(result.data);
    })();
  }, []);

  const blocks = useMemo(() => Array.from(new Set((rows ?? []).map((row) => row.block_name).filter(Boolean))), [rows]);
  const filtered = (rows ?? []).filter((row) => {
    if (block && row.block_name !== block) return false;
    if (status && row.current_status !== status) return false;
    if (shortage && !row.open_alerts.some((alert) => alert.type === "shortage" && alert.resource_type === shortage)) return false;
    if (priority === "scored" && row.priority_score === null) return false;
    if (priority === "unscored" && row.priority_score !== null) return false;
    return true;
  });

  const population = filtered.reduce((sum, row) => sum + (row.population ?? 0), 0);
  const vulnerable = filtered.reduce((sum, row) => sum + Object.values(row.vulnerability ?? {}).reduce((inner, value) => inner + value, 0), 0);
  const capacity = filtered.reduce((sum, row) => sum + row.capacity, 0);
  const occupied = filtered.reduce((sum, row) => sum + (row.population ?? 0), 0);
  const occupancy = capacity ? (occupied / capacity) * 100 : 0;
  const counts = {
    green: filtered.filter((row) => row.current_status === "green").length,
    yellow: filtered.filter((row) => row.current_status === "yellow").length,
    red: filtered.filter((row) => row.current_status === "red").length,
  };
  const alerts = filtered.flatMap((row) => row.open_alerts.map((alert) => ({ ...alert, shelter: row.name, shelterId: row.id }))).slice(0, 5);
  const latest = filtered.map((row) => row.latest_report_at).filter(Boolean).sort().at(-1) ?? null;
  const stockMeters = ["food", "water", "medicine"].map((kind) => {
    const values = filtered.map((row) => row.stocks.find((item) => item.resource_type === kind)?.quantity).filter((value): value is number => value !== null && value !== undefined);
    return { kind, reported: values.length, total: filtered.length };
  });

  return (
    <Shell permission="dashboard.read">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">District Dashboard</h1>
          <p className="text-sm text-ink-muted">Live overview of all shelters and resources</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Filter label="Block" value={block} onChange={setBlock} options={[[ "", "All Blocks" ], ...blocks.map((name) => [name, name] as [string, string])]} />
          <Filter label="Status" value={status} onChange={setStatus} options={[["", "All Status"], ["green", "Stable"], ["yellow", "Attention"], ["red", "Urgent"], ["unknown", "Status withheld"]]} />
          <Filter label="Shortage" value={shortage} onChange={setShortage} options={[["", "All"], ["food", "Food"], ["water", "Water"], ["medicine", "Medicine"]]} />
          <Filter label="Priority" value={priority} onChange={setPriority} options={[["", "All"], ["scored", "Scored"], ["unscored", "Score withheld"]]} />
          <div className="text-xs text-ink-muted">
            <p>Last Updated</p>
            <p className="font-semibold text-ink">{formatWhen(latest)}</p>
          </div>
        </div>
      </div>
      {error ? <ErrorState message={error} /> : null}
      {rows === null && !error ? <Loader label={t("common.loading")} /> : null}
      {rows ? (
        <>
          <div className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
            <Stat icon="shelter" tint="bg-[#e7f3ff] text-brand" label="Total Shelters" value={String(filtered.length)} />
            <Stat icon="users" tint="bg-[#e7f3ff] text-sky" label="Total Population" value={population.toLocaleString()} />
            <Stat icon="alert" tint="bg-[#fff1e6] text-amber" label="Vulnerable People" value={vulnerable.toLocaleString()} />
            <Stat icon="check" tint="bg-[#e7f7ef] text-stable" label="Stable" value={String(counts.green)} />
            <Stat icon="bell" tint="bg-[#fff4e8] text-amber" label="Attention" value={String(counts.yellow)} />
            <Stat icon="alert" tint="bg-[#fdecec] text-alert" label="Urgent" value={String(counts.red)} />
          </div>
          <div className="grid gap-4 xl:grid-cols-[1.3fr_0.9fr_0.8fr]">
            <section className="panel p-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-semibold">Shelter Status Map</h2>
              </div>
              <StatusMap pins={filtered.map((row) => ({ id: row.id, name: row.name, status: row.current_status, latitude: row.latitude, longitude: row.longitude }))} onSelect={(id) => router.push(`/shelters/${id}`)} />
              {filtered.every((row) => row.latitude === null) ? <p className="mt-2 text-xs text-ink-muted">{t("dashboard.map_empty")}</p> : null}
            </section>
            <section className="panel p-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-semibold">Priority Alerts</h2>
                <Link href="/alerts" className="text-sm font-semibold text-brand">View All</Link>
              </div>
              <div className="space-y-3">
                {alerts.length === 0 ? <p className="text-sm text-ink-muted">{t("alert.empty")}</p> : null}
                {alerts.map((alert) => (
                  <Link key={alert.id} href={`/alerts/${alert.id}`} className="block rounded-xl border border-[#e4eef8] p-3">
                    <span className="flex items-center justify-between gap-2">
                      <span className="font-semibold">{alert.shelter}</span>
                      <span className="rounded-full px-2 py-0.5 text-xs font-semibold text-white" style={{ background: alert.severity === "urgent" ? "#d64246" : "#f58020" }}>{alert.severity}</span>
                    </span>
                    <span className="mt-1 block text-sm text-ink-muted">{alert.type}{alert.resource_type ? ` · ${alert.resource_type}` : ""}</span>
                  </Link>
                ))}
              </div>
            </section>
            <div className="space-y-4">
              <section className="panel p-4">
                <h2 className="mb-3 font-semibold">Occupancy Summary</h2>
                <Donut value={occupancy} label="Total Occupancy" sub={`${occupied.toLocaleString()} / ${capacity.toLocaleString()}`} />
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <p><span className="text-ink-muted">Available </span><b>{Math.max(capacity - occupied, 0).toLocaleString()}</b></p>
                  <p><span className="text-ink-muted">Occupied </span><b>{occupied.toLocaleString()}</b></p>
                </div>
              </section>
              <section className="panel p-4">
                <h2 className="mb-3 font-semibold">Stock Summary</h2>
                <div className="space-y-3">
                  {stockMeters.map((item) => (
                    <Meter
                      key={item.kind}
                      label={item.kind[0].toUpperCase() + item.kind.slice(1)}
                      value={item.total ? (item.reported / item.total) * 100 : null}
                      color={item.kind === "food" ? "#f58020" : item.kind === "water" ? "#00a2e5" : "#098855"}
                      caption={`${item.reported} of ${item.total} shelters reported`}
                    />
                  ))}
                </div>
              </section>
            </div>
          </div>
          <section className="panel mt-4 overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#f7fafc] text-ink-muted">
                <tr>{["Shelter", "Block", "Population", "Status", "Last report"].map((header) => <th key={header} className="px-4 py-3 font-medium">{header}</th>)}</tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <tr key={row.id} className="border-t border-[#eef3f8]">
                    <td className="px-4 py-3"><Link className="font-semibold text-brand" href={`/shelters/${row.id}`}>{row.name}</Link></td>
                    <td className="px-4 py-3">{row.block_name}</td>
                    <td className="px-4 py-3">{row.population ?? t("resource.unreported")}</td>
                    <td className="px-4 py-3"><span className="rounded-full px-2 py-1 text-xs font-semibold text-white" style={{ background: statusColor(row.current_status) }}>{STATUS_LABEL[row.current_status] ?? row.current_status}</span></td>
                    <td className="px-4 py-3">{formatWhen(row.latest_report_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </>
      ) : null}
    </Shell>
  );
}

function Stat({ icon, tint, label, value }: { icon: string; tint: string; label: string; value: string }) {
  return (
    <article className="panel flex items-center gap-3 p-4">
      <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${tint}`}><Icon name={icon} /></span>
      <span>
        <span className="block text-xs text-ink-muted">{label}</span>
        <span className="text-xl font-bold">{value}</span>
      </span>
    </article>
  );
}

function Filter({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: [string, string][] }) {
  return (
    <label className="text-xs text-ink-muted">
      {label}
      <select className="mt-1 block rounded-lg border border-line bg-white px-2 py-2 text-sm text-ink" value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map(([optionValue, optionLabel]) => <option key={optionLabel} value={optionValue}>{optionLabel}</option>)}
      </select>
    </label>
  );
}
