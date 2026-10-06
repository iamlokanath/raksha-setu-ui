"use client";

import { FormEvent, useEffect, useState } from "react";
import { Shell } from "@/components/layout/Shell";
import { EmptyState } from "@/components/feedback/States";
import { Button, FormField, Input, Select } from "@/components/ui/Controls";
import { useAppDispatch, useT } from "@/hooks/useT";
import { messageKeyFor } from "@/lib/errors";
import { api } from "@/services/http";
import { setNotice } from "@/store/store";

type UserRow = { id: string; name: string; username: string; role: string; organization: string };

export default function UsersPage() {
  const t = useT();
  const dispatch = useAppDispatch();
  const [rows, setRows] = useState<UserRow[]>([]);
  const [form, setForm] = useState({ name: "", username: "", password: "", role: "warden", organization: "", shelter_id: "", block_id: "" });
  async function load() {
    const result = await api<UserRow[]>("/api/v1/users/");
    if (result.ok) setRows(result.data);
  }
  useEffect(() => {
    void load();
  }, []);
  async function submit(event: FormEvent) {
    event.preventDefault();
    const body: Record<string, unknown> = {
      name: form.name,
      username: form.username,
      password: form.password,
      role: form.role,
      organization: form.organization,
      support_functions: form.role === "volunteer" ? ["reporting_support"] : [],
      grants: [],
    };
    if (form.role === "warden") body.shelter_id = form.shelter_id;
    if (form.role === "block_officer") body.block_id = form.block_id;
    if (form.role === "volunteer") body.shelter_id = form.shelter_id;
    const result = await api("/api/v1/users/", { method: "POST", body });
    dispatch(setNotice(result.ok ? t("feedback.saved") : t(messageKeyFor(result.error.code))));
    if (result.ok) await load();
  }
  return (
    <Shell permission="user.manage">
      <h1 className="mb-4 text-2xl">{t("users.title")}</h1>
      <form className="mb-6 grid max-w-xl gap-3" onSubmit={submit}>
        <FormField label={t("users.name")}><Input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></FormField>
        <FormField label={t("users.username")}><Input value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} /></FormField>
        <FormField label={t("users.password")}><Input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /></FormField>
        <FormField label={t("users.organization")}><Input value={form.organization} onChange={(event) => setForm({ ...form, organization: event.target.value })} /></FormField>
        <FormField label={t("users.role")}>
          <Select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}>
            <option value="warden">warden</option>
            <option value="block_officer">block_officer</option>
            <option value="district_officer">district_officer</option>
            <option value="volunteer">volunteer</option>
          </Select>
        </FormField>
        <FormField label={t("shelter.warden")}><Input value={form.shelter_id} onChange={(event) => setForm({ ...form, shelter_id: event.target.value })} /></FormField>
        <FormField label={t("shelter.block")}><Input value={form.block_id} onChange={(event) => setForm({ ...form, block_id: event.target.value })} /></FormField>
        <Button type="submit">{t("users.create")}</Button>
      </form>
      {rows.length === 0 ? <EmptyState message={t("users.empty")} /> : null}
      {rows.map((row) => (
        <p key={row.id}>{row.name} · {row.username} · {row.role}</p>
      ))}
    </Shell>
  );
}
