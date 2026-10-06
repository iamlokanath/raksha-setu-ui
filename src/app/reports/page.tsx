"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatWhen } from "@/components/app/Widgets";
import { Shell } from "@/components/layout/Shell";
import { ErrorState, Loader } from "@/components/feedback/States";
import { useAppSelector, useT } from "@/hooks/useT";
import { messageKeyFor } from "@/lib/errors";
import { api } from "@/services/http";

type Report = { id: string; shelter_id: string; reported_at: string; population: number; channel: string; applied_to_current: boolean; resources: { resource_type: string; quantity: number }[] };
type Shelter = { id: string; name: string };

export default function ReportsPage() {
  const t = useT();
  const canSubmit = useAppSelector((state) => state.auth.principal?.permissions.includes("report.submit"));
  const [rows, setRows] = useState<Report[] | null>(null);
  const [names, setNames] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  useEffect(() => {
    void (async () => {
      const [reports, shelters] = await Promise.all([api<Report[]>("/api/v1/reports/?page_size=100"), api<Shelter[]>("/api/v1/shelters/?page_size=100")]);
      if (!reports.ok) setError(t(messageKeyFor(reports.error.code)));
      else setRows(reports.data);
      if (shelters.ok) setNames(Object.fromEntries(shelters.data.map((row) => [row.id, row.name])));
    })();
  }, []);
  return (
    <Shell permission="report.read">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-sm text-ink-muted">Shelter status, population and resource levels</p>
        </div>
        {canSubmit ? <Link href="/report" className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">Submit report</Link> : null}
      </div>
      {canSubmit ? <Link href="/sync" className="mb-4 inline-block text-sm font-semibold text-brand">Sync queue</Link> : null}
      {error ? <ErrorState message={error} /> : null}
      {rows === null && !error ? <Loader label={t("common.loading")} /> : null}
      <section className="panel overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#f7fafc] text-ink-muted"><tr>{["When", "Shelter", "Population", "Food", "Water", "Medicine", "Channel", "Result"].map((header) => <th key={header} className="px-4 py-3 font-medium">{header}</th>)}</tr></thead>
          <tbody>
            {rows && rows.length === 0 ? <tr><td className="px-4 py-4" colSpan={8}>{t("sync.empty")}</td></tr> : null}
            {rows?.map((row) => (
              <tr key={row.id} className="border-t border-[#eef3f8]">
                <td className="px-4 py-3">{formatWhen(row.reported_at)}</td>
                <td className="px-4 py-3"><Link className="font-semibold text-brand" href={`/shelters/${row.shelter_id}`}>{names[row.shelter_id] ?? "Shelter"}</Link></td>
                <td className="px-4 py-3">{row.population}</td>
                {["food", "water", "medicine"].map((kind) => <td key={kind} className="px-4 py-3">{row.resources.find((item) => item.resource_type === kind)?.quantity ?? "—"}</td>)}
                <td className="px-4 py-3 capitalize">{row.channel}</td>
                <td className="px-4 py-3">{row.applied_to_current ? t("sync.applied") : t("sync.kept_as_history")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </Shell>
  );
}
