"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Shell } from "@/components/layout/Shell";
import { ErrorState, Loader } from "@/components/feedback/States";
import { Modal } from "@/components/data/Table";
import { Button, FormField, Input } from "@/components/ui/Controls";
import { useAppDispatch, useAppSelector, useT } from "@/hooks/useT";
import { messageKeyFor } from "@/lib/errors";
import { api } from "@/services/http";
import { setNotice } from "@/store/store";

type ActionItem = {
  id: string;
  source_shelter_id: string;
  destination_shelter_id: string;
  resource_type: string;
  suggested_quantity: number;
  approved_quantity: number | null;
  decision: string;
  explanation_key: string;
  explanation_params: { source_shelter_name?: string; destination_shelter_name?: string; resource_type: string; quantity: number; unit: string };
};
type Shelter = { id: string; name: string; current_status: string };
type Alert = { id: string; shelter_id: string; type: string; resource_type: string | null; severity: string };

const STEPS = ["Shortage Shelters", "Nearby Surplus", "Suggested Transfer", "Review & Approve", "Receipt"];

export default function ActionListPage() {
  const t = useT();
  const dispatch = useAppDispatch();
  const canApprove = useAppSelector((state) => state.auth.principal?.permissions.includes("action.approve"));
  const [rows, setRows] = useState<ActionItem[] | null>(null);
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [error, setError] = useState("");
  const [configNote, setConfigNote] = useState("");

  async function load() {
    const [actions, shelterResult, alertResult, surplus] = await Promise.all([
      api<ActionItem[]>("/api/v1/actions/?page_size=100"),
      api<Shelter[]>("/api/v1/shelters/?page_size=100"),
      api<Alert[]>("/api/v1/alerts/?page_size=100"),
      api<unknown[]>("/api/v1/resources/?surplus=true&page_size=100"),
    ]);
    if (!actions.ok) setError(t(messageKeyFor(actions.error.code)));
    else setRows(actions.data);
    if (shelterResult.ok) setShelters(shelterResult.data);
    if (alertResult.ok) setAlerts(alertResult.data.filter((item) => item.type === "shortage"));
    if (!surplus.ok && surplus.error.code === "CONFIGURATION_REQUIRED") setConfigNote(t("errors.configuration_required"));
    else setConfigNote("");
  }
  useEffect(() => { void load(); }, []);

  const nameOf = (id: string) => shelters.find((shelter) => shelter.id === id)?.name ?? id.slice(0, 8);
  const shortages = alerts;
  const pending = (rows ?? []).filter((row) => row.decision === "proposed");

  async function decide(id: string, kind: "approve" | "reject") {
    const result = await api(`/api/v1/actions/${id}/${kind}`, { method: "POST", body: {} });
    dispatch(setNotice(result.ok ? t("action.recorded") : t(messageKeyFor(result.error.code))));
    if (result.ok) await load();
  }

  return (
    <Shell permission="action.read">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Resource Redistribution</h1>
          <p className="text-sm text-ink-muted">Match shortages with available surplus across shelters</p>
        </div>
        <Link href="/actions" className="text-sm font-semibold text-brand">View All Actions</Link>
      </div>
      <ol className="mb-4 flex flex-wrap gap-2">
        {STEPS.map((step, index) => (
          <li key={step} className={`rounded-full px-3 py-1 text-xs font-semibold ${index === 3 ? "bg-brand text-white" : "bg-white text-[#3e5164]"}`}>{index + 1} {step}</li>
        ))}
      </ol>
      {error ? <ErrorState message={error} /> : null}
      {rows === null && !error ? <Loader label={t("common.loading")} /> : null}
      <div className="grid gap-4 lg:grid-cols-3">
        <section className="panel p-4">
          <h2 className="font-semibold">Shelters with Shortages</h2>
          <p className="mb-3 text-xs text-ink-muted">Identify shelters needing resources</p>
          {shortages.length === 0 ? <p className="text-sm text-ink-muted">{t("alert.empty")}</p> : null}
          {shortages.map((alert) => (
            <article key={alert.id} className="mb-2 rounded-xl border border-[#e4eef8] p-3 text-sm">
              <p className="font-semibold">{nameOf(alert.shelter_id)}</p>
              <p className="capitalize text-ink-muted">{alert.resource_type} · {alert.severity}</p>
            </article>
          ))}
        </section>
        <section className="panel p-4">
          <h2 className="font-semibold">Nearby Surplus Shelters</h2>
          <p className="mb-3 text-xs text-ink-muted">Find shelters with resources to share</p>
          {configNote ? <p className="text-sm text-ink-muted">{configNote}</p> : <p className="text-sm text-ink-muted">Surplus uses the approved shortage configuration for this district.</p>}
        </section>
        <section className="panel p-4">
          <h2 className="font-semibold">Suggested Transfer</h2>
          <p className="mb-3 text-xs text-ink-muted">System recommendation</p>
          {pending.length === 0 ? <p className="text-sm text-ink-muted">{t("action.empty")}</p> : null}
          {pending.map((row) => (
            <article key={row.id} className="mb-2 rounded-xl border border-[#e4eef8] p-3 text-sm">
              <p className="font-semibold">{nameOf(row.source_shelter_id)} → {nameOf(row.destination_shelter_id)}</p>
              <p className="capitalize text-ink-muted">{row.resource_type} · {row.suggested_quantity} {row.explanation_params.unit}</p>
              <Link className="text-brand" href={`/actions/${row.id}`}>View details</Link>
            </article>
          ))}
        </section>
      </div>
      <section className="panel mt-4 overflow-hidden">
        <div className="px-4 py-3"><h2 className="font-semibold">Pending Approvals</h2></div>
        <table className="w-full text-left text-sm">
          <thead className="bg-[#f7fafc] text-ink-muted"><tr>{["Transfer", "Resource", "Qty", "Status", "Action"].map((header) => <th key={header} className="px-4 py-2 font-medium">{header}</th>)}</tr></thead>
          <tbody>
            {(rows ?? []).length === 0 ? <tr><td className="px-4 py-4" colSpan={5}>{t("action.empty")}</td></tr> : null}
            {rows?.map((row) => (
              <tr key={row.id} className="border-t border-[#eef3f8]">
                <td className="px-4 py-3">{nameOf(row.source_shelter_id)} → {nameOf(row.destination_shelter_id)}</td>
                <td className="px-4 py-3 capitalize">{row.resource_type}</td>
                <td className="px-4 py-3">{row.approved_quantity ?? row.suggested_quantity}</td>
                <td className="px-4 py-3">{t(`action.${row.decision}`)}</td>
                <td className="px-4 py-3">
                  {row.decision === "proposed" && canApprove ? (
                    <span className="flex gap-2">
                      <button className="rounded-lg border border-line px-2 py-1" type="button" onClick={() => decide(row.id, "reject")}>Reject</button>
                      <button className="rounded-lg bg-brand px-2 py-1 text-white" type="button" onClick={() => decide(row.id, "approve")}>Approve</button>
                    </span>
                  ) : <Link className="font-semibold text-brand" href={`/actions/${row.id}`}>Review</Link>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </Shell>
  );
}

export function ActionDetailPage() {
  const t = useT();
  const params = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const principal = useAppSelector((state) => state.auth.principal);
  const [action, setAction] = useState<ActionItem | null>(null);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState("");
  const [confirm, setConfirm] = useState<"approve" | "reject" | null>(null);
  async function load() {
    const result = await api<ActionItem>(`/api/v1/actions/${params.id}`);
    if (!result.ok) setError(t(messageKeyFor(result.error.code)));
    else setAction(result.data);
  }
  useEffect(() => { void load(); }, [params.id]);
  async function decide(kind: "approve" | "modify" | "reject") {
    const body = kind === "modify" ? { quantity: Number(quantity) } : {};
    if (kind === "modify" && quantity === "") {
      setError(t("validation.required"));
      return;
    }
    const result = await api(`/api/v1/actions/${params.id}/${kind}`, { method: "POST", body });
    if (!result.ok) setError(t(messageKeyFor(result.error.code)));
    else {
      dispatch(setNotice(t("action.recorded")));
      setConfirm(null);
      await load();
    }
  }
  async function receipt(event: FormEvent) {
    event.preventDefault();
    const result = await api(`/api/v1/actions/${params.id}/confirm-receipt`, { method: "POST", body: { quantity: Number(quantity), unit: action?.explanation_params.unit ?? "" } });
    dispatch(setNotice(result.ok ? t("action.receipt_recorded") : t(messageKeyFor(result.error.code))));
    if (result.ok) await load();
  }
  const canApprove = principal?.permissions.includes("action.approve");
  const canReceive = principal?.permissions.includes("action.confirm_receipt") && principal.shelter_id === action?.destination_shelter_id;
  return (
    <Shell permission="action.read">
      <Link href="/actions" className="text-sm font-semibold text-brand">← Back</Link>
      {error ? <ErrorState message={error} /> : null}
      {!action && !error ? <Loader label={t("common.loading")} /> : null}
      {action ? (
        <section className="panel mt-4 max-w-xl space-y-3 p-5">
          <h1 className="text-2xl font-bold">{t(`action.${action.decision}`)}</h1>
          <p>{t(action.explanation_key, action.explanation_params)}</p>
          {action.decision === "proposed" && canApprove ? (
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => setConfirm("approve")} type="button">{t("action.approve")}</Button>
              <Button onClick={() => setConfirm("reject")} type="button">{t("action.reject")}</Button>
              <FormField label={t("action.quantity")}><Input value={quantity} onChange={(event) => setQuantity(event.target.value)} /></FormField>
              <Button onClick={() => decide("modify")} type="button">{t("action.modify")}</Button>
            </div>
          ) : null}
          {canReceive && (action.decision === "approved" || action.decision === "modified") ? (
            <form className="space-y-2" onSubmit={receipt}>
              <FormField label={t("action.quantity")}><Input value={quantity} onChange={(event) => setQuantity(event.target.value)} /></FormField>
              <Button type="submit">{t("action.confirm_receipt")}</Button>
            </form>
          ) : null}
        </section>
      ) : null}
      {confirm ? (
        <Modal title={t(confirm === "approve" ? "action.confirm_approve" : "action.confirm_reject")} onCancel={() => setConfirm(null)} cancelLabel={t("common.cancel")}>
          <Button onClick={() => decide(confirm)} type="button">{t("common.confirm")}</Button>
        </Modal>
      ) : null}
    </Shell>
  );
}
