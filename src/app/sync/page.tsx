"use client";

import { useEffect, useState } from "react";
import { Shell } from "@/components/layout/Shell";
import { EmptyState } from "@/components/feedback/States";
import { Button } from "@/components/ui/Controls";
import { useAppDispatch, useT } from "@/hooks/useT";
import { messageKeyFor } from "@/lib/errors";
import { api } from "@/services/http";
import { listLocal, removeLocal, updateLocal, type QueuedReport } from "@/services/queue";
import { setNotice } from "@/store/store";

const STATE_KEY: Record<string, string> = {
  local_only: "sync.saved_on_device",
  accepted: "sync.accepted_processing",
  applied: "sync.applied",
  stored_historical: "sync.kept_as_history",
  duplicate: "feedback.already_recorded",
  rejected: "errors.duplicate_mismatch",
};

export default function SyncPage() {
  const t = useT();
  const dispatch = useAppDispatch();
  const [rows, setRows] = useState<QueuedReport[]>([]);

  async function refresh() {
    setRows(await listLocal());
  }
  useEffect(() => {
    void refresh();
  }, []);

  async function send() {
    const pending = rows.filter((row) => row.state === "local_only");
    if (!pending.length) return;
    const result = await api<{ batch_id: string }>("/api/v1/sync/reports", { method: "POST", body: { reports: pending.map((row) => row.payload) } });
    if (!result.ok) {
      dispatch(setNotice(t(messageKeyFor(result.error.code))));
      return;
    }
    dispatch(setNotice(t("sync.accepted_processing")));
    for (const row of pending) await updateLocal({ ...row, state: "accepted" });
    const batch = await api<{ items: { client_report_id: string; state: string; error_code: string | null }[] }>(`/api/v1/sync/batches/${result.data.batch_id}`);
    if (batch.ok) {
      for (const item of batch.data.items) {
        const current = pending.find((row) => row.client_report_id === item.client_report_id);
        if (!current) continue;
        const state = item.state === "duplicate" ? "duplicate" : item.state === "stored_historical" ? "stored_historical" : item.state === "applied" ? "applied" : "rejected";
        await updateLocal({ ...current, state, error_code: item.error_code ?? undefined });
      }
    }
    await refresh();
  }

  return (
    <Shell permission="report.submit">
      <h1 className="mb-4 text-2xl">{t("sync.queue_title")}</h1>
      <Button onClick={send} type="button">{t("sync.retry")}</Button>
      <div className="mt-4 space-y-3">
        {rows.length === 0 ? <EmptyState message={t("sync.empty")} /> : null}
        {rows.map((row) => (
          <article className="border border-line p-3" key={row.client_report_id}>
            <p>{row.reported_at}</p>
            <p>{t(STATE_KEY[row.state] ?? "errors.unexpected")}</p>
            {row.state === "local_only" ? (
              <Button
                className="mt-2"
                onClick={async () => {
                  if (window.confirm(t("sync.confirm_discard"))) {
                    await removeLocal(row.client_report_id);
                    await refresh();
                  }
                }}
                type="button"
              >
                {t("sync.discard")}
              </Button>
            ) : null}
          </article>
        ))}
      </div>
    </Shell>
  );
}
