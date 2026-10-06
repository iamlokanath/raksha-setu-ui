"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Shell } from "@/components/layout/Shell";
import { ErrorState, Loader } from "@/components/feedback/States";
import { useT } from "@/hooks/useT";
import { messageKeyFor } from "@/lib/errors";
import { api } from "@/services/http";

type Stock = { shelter_id: string; resource_type: string; quantity: number; unit: string };
type Shelter = { id: string; name: string };

export default function ResourcesPage() {
  const t = useT();
  const [rows, setRows] = useState<Stock[] | null>(null);
  const [names, setNames] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [kind, setKind] = useState("");
  useEffect(() => {
    void (async () => {
      const query = kind ? `?resource_type=${kind}&page_size=100` : "?page_size=100";
      const [stocks, shelters] = await Promise.all([api<Stock[]>(`/api/v1/resources/${query}`), api<Shelter[]>("/api/v1/shelters/?page_size=100")]);
      if (!stocks.ok) setError(t(messageKeyFor(stocks.error.code)));
      else setRows(stocks.data);
      if (shelters.ok) setNames(Object.fromEntries(shelters.data.map((row) => [row.id, row.name])));
    })();
  }, [kind]);
  const colors: Record<string, string> = { food: "#f58020", water: "#00a2e5", medicine: "#098855" };
  return (
    <Shell permission="resource.read">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Resources</h1>
          <p className="text-sm text-ink-muted">Food, water and medicine last reported by each shelter</p>
        </div>
        <label className="text-xs text-ink-muted">
          Type
          <select className="mt-1 block rounded-lg border border-line bg-white px-2 py-2 text-sm text-ink" value={kind} onChange={(event) => setKind(event.target.value)}>
            <option value="">All</option>
            <option value="food">Food</option>
            <option value="water">Water</option>
            <option value="medicine">Medicine</option>
          </select>
        </label>
      </div>
      {error ? <ErrorState message={error} /> : null}
      {rows === null && !error ? <Loader label={t("common.loading")} /> : null}
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {rows && rows.length === 0 ? <p className="panel p-4 text-sm">{t("resource.unreported")}</p> : null}
        {rows?.map((row) => (
          <Link key={`${row.shelter_id}-${row.resource_type}`} href={`/shelters/${row.shelter_id}`} className="panel p-4">
            <p className="text-sm capitalize" style={{ color: colors[row.resource_type] }}>{row.resource_type}</p>
            <p className="text-2xl font-bold">{row.quantity} <span className="text-sm font-medium text-ink-muted">{row.unit}</span></p>
            <p className="text-sm text-ink-muted">{names[row.shelter_id] ?? "Shelter"}</p>
          </Link>
        ))}
      </div>
    </Shell>
  );
}
