"use client";

import { FormEvent, useEffect, useState } from "react";
import { Shell } from "@/components/layout/Shell";
import { Button, TextArea } from "@/components/ui/Controls";
import { useAppDispatch, useAppSelector, useT } from "@/hooks/useT";
import { messageKeyFor } from "@/lib/errors";
import { api } from "@/services/http";
import { setNotice } from "@/store/store";

export default function ConfigurationPage() {
  const t = useT();
  const dispatch = useAppDispatch();
  const tenantId = useAppSelector((state) => state.auth.principal?.tenant_id);
  const [text, setText] = useState('{\n  "shortage": null,\n  "capacity": null,\n  "priority": null\n}');
  useEffect(() => {
    if (!tenantId) return;
    void (async () => {
      const result = await api("/api/v1/tenants/" + tenantId + "/configuration");
      if (result.ok) setText(JSON.stringify(result.data, null, 2));
    })();
  }, [tenantId]);
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!tenantId) return;
    let body: unknown;
    try {
      body = JSON.parse(text);
    } catch {
      dispatch(setNotice(t("validation.invalid")));
      return;
    }
    const result = await api(`/api/v1/tenants/${tenantId}/configuration`, { method: "PUT", body });
    dispatch(setNotice(result.ok ? t("config.saved") : t(messageKeyFor(result.error.code))));
  }
  return (
    <Shell permission="tenant.manage">
      <h1 className="mb-2 text-2xl">{t("config.title")}</h1>
      <p className="mb-4 max-w-2xl">{t("config.notice")}</p>
      <form className="max-w-2xl space-y-3" onSubmit={submit}>
        <TextArea className="min-h-64 font-mono" value={text} onChange={(event) => setText(event.target.value)} />
        <Button type="submit">{t("config.save")}</Button>
      </form>
    </Shell>
  );
}
