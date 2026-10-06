"use client";

import { useEffect, useState } from "react";
import { Shell } from "@/components/layout/Shell";
import { EmptyState, ErrorState, Loader } from "@/components/feedback/States";
import { useT } from "@/hooks/useT";
import { messageKeyFor } from "@/lib/errors";
import { translate } from "@/locales";
import { useAppSelector } from "@/hooks/useT";
import { api } from "@/services/http";

type AuditRow = { occurred_at: string; event_type: string; actor_id: string | null; aggregate_id: string; request_id: string | null };

export default function AuditPage() {
  const t = useT();
  const locale = useAppSelector((state) => state.ui.locale);
  const [rows, setRows] = useState<AuditRow[] | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    void (async () => {
      const result = await api<AuditRow[]>("/api/v1/audit/");
      if (!result.ok) setError(t(messageKeyFor(result.error.code)));
      else setRows(result.data);
    })();
  }, []);
  return (
    <Shell permission="audit.read">
      <h1 className="mb-4 text-2xl">{t("audit.title")}</h1>
      {error ? <ErrorState message={error} /> : null}
      {rows === null && !error ? <Loader label={t("common.loading")} /> : null}
      {rows && rows.length === 0 ? <EmptyState message={t("audit.empty")} /> : null}
      <ul className="space-y-2">
        {rows?.map((row) => {
          const key = `audit.event.${row.event_type.replaceAll(".", "_")}`;
          const label = translate(locale, key) === key ? `${row.event_type} · ${t("audit.event.unknown")}` : translate(locale, key);
          return (
            <li className="border border-line p-3" key={`${row.event_type}-${row.occurred_at}-${row.aggregate_id}`}>
              <p>{label}</p>
              <p>{row.occurred_at}</p>
              {row.request_id ? <p className="text-sm">{t("common.request_id")}: {row.request_id}</p> : null}
            </li>
          );
        })}
      </ul>
    </Shell>
  );
}
