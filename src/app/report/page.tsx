"use client";

import { FormEvent, useState } from "react";
import { Shell } from "@/components/layout/Shell";
import { StatusBadge } from "@/components/feedback/StatusBadge";
import { Button, FormField, Input, TextArea } from "@/components/ui/Controls";
import { useAppDispatch, useAppSelector, useT } from "@/hooks/useT";
import { fieldMessageKey, messageKeyFor } from "@/lib/errors";
import { api } from "@/services/http";
import { saveLocal } from "@/services/queue";
import { setNotice } from "@/store/store";

const GROUPS = ["children", "older_adults", "pregnant_women", "persons_with_disability", "injured_or_sick"] as const;
const RESOURCES = ["food", "water", "medicine"] as const;

export default function ReportPage() {
  const t = useT();
  const dispatch = useAppDispatch();
  const shelterId = useAppSelector((state) => state.auth.principal?.shelter_id);
  const [population, setPopulation] = useState("0");
  const [counts, setCounts] = useState<Record<string, string>>({ children: "0", older_adults: "0", pregnant_women: "0", persons_with_disability: "0", injured_or_sick: "0" });
  const [stock, setStock] = useState<Record<string, { quantity: string; unit: string }>>({
    food: { quantity: "0", unit: "kg" },
    water: { quantity: "0", unit: "l" },
    medicine: { quantity: "0", unit: "kits" },
  });
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  async function submit(event: FormEvent) {
    event.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length || !shelterId) return;
    const clientId = crypto.randomUUID();
    const reportedAt = new Date().toISOString();
    const body = {
      client_report_id: clientId,
      shelter_id: shelterId,
      reported_at: reportedAt,
      population: Number(population),
      vulnerability: Object.fromEntries(GROUPS.map((key) => [key, Number(counts[key])])),
      resources: RESOURCES.map((kind) => ({ resource_type: kind, quantity: Number(stock[kind].quantity), unit: stock[kind].unit })),
      incident_notes: notes,
      channel: "web",
    };
    setPending(true);
    const result = await api<Record<string, unknown>>("/api/v1/reports/", { method: "POST", body });
    setPending(false);
    if (!result.ok && result.error.code === "NETWORK") {
      await saveLocal({ client_report_id: clientId, reported_at: reportedAt, payload: body, state: "local_only" });
      dispatch(setNotice(t("sync.saved_on_device")));
      return;
    }
    if (!result.ok) {
      const fieldMap: Record<string, string> = {};
      result.error.details.forEach((detail) => {
        fieldMap[detail.field] = t(fieldMessageKey(detail.code));
      });
      setErrors(fieldMap);
      dispatch(setNotice(t(messageKeyFor(result.error.code))));
      return;
    }
    dispatch(setNotice(result.meta.idempotent_replay ? t("feedback.already_recorded") : t("report.saved")));
    if (result.data.processing_status === "accepted") dispatch(setNotice(t("report.checks_pending")));
    const shelter = await api<{ current_status: string }>(`/api/v1/shelters/${shelterId}`);
    if (shelter.ok) setStatus(shelter.data.current_status);
  }

  function validate() {
    const found: Record<string, string> = {};
    if (population === "" || Number(population) < 0) found.population = t("validation.min_value");
    const total = GROUPS.reduce((sum, key) => sum + Number(counts[key] || 0), 0);
    if (total > Number(population)) found.vulnerability = t("validation.sum_exceeds");
    RESOURCES.forEach((kind) => {
      if (stock[kind].quantity === "" || Number(stock[kind].quantity) < 0 || !stock[kind].unit) found[kind] = t("validation.resource_set");
    });
    return found;
  }

  return (
    <Shell permission="report.submit">
      <h1 className="mb-4 text-2xl font-bold">{t("report.title")}</h1>
      <form className="panel max-w-xl space-y-3 p-5" onSubmit={submit}>
        <FormField error={errors.population} label={t("report.population")}>
          <Input inputMode="numeric" value={population} onChange={(event) => setPopulation(event.target.value)} />
        </FormField>
        {errors.vulnerability ? <p>{errors.vulnerability}</p> : null}
        {GROUPS.map((key) => (
          <FormField key={key} label={t(`report.${key}`)}>
            <Input inputMode="numeric" value={counts[key]} onChange={(event) => setCounts({ ...counts, [key]: event.target.value })} />
          </FormField>
        ))}
        {RESOURCES.map((kind) => (
          <div className="grid grid-cols-2 gap-2" key={kind}>
            <FormField error={errors[kind]} label={t(`resource.${kind}`)}>
              <Input inputMode="decimal" value={stock[kind].quantity} onChange={(event) => setStock({ ...stock, [kind]: { ...stock[kind], quantity: event.target.value } })} />
            </FormField>
            <FormField label={t("resource.unit")}>
              <Input value={stock[kind].unit} onChange={(event) => setStock({ ...stock, [kind]: { ...stock[kind], unit: event.target.value } })} />
            </FormField>
          </div>
        ))}
        <FormField label={t("report.notes")}>
          <TextArea value={notes} onChange={(event) => setNotes(event.target.value)} />
        </FormField>
        <Button disabled={pending} type="submit">{t("report.submit")}</Button>
      </form>
      {status ? <div className="mt-4"><StatusBadge status={status} /></div> : null}
    </Shell>
  );
}
