"use client";

import { FormEvent, useEffect, useState } from "react";

import type { ApiResponse, Level, Role } from "@/components/types";

type FormState = {
  company: string;
  role_id: string;
  level_id: string;
  city: string;
  state: string;
  country: string;
  base_salary: string;
  bonus: string;
  stock_value: string;
  years_of_experience: string;
  currency: string;
};

const initialState: FormState = {
  company: "",
  role_id: "",
  level_id: "",
  city: "",
  state: "",
  country: "USA",
  base_salary: "",
  bonus: "0",
  stock_value: "0",
  years_of_experience: "",
  currency: "USD",
};

export function CompensationForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [roles, setRoles] = useState<Role[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    Promise.all([fetch("/api/roles"), fetch("/api/levels")])
      .then(async ([rolesResponse, levelsResponse]) => {
        const rolesJson = (await rolesResponse.json()) as ApiResponse<Role[]>;
        const levelsJson = (await levelsResponse.json()) as ApiResponse<Level[]>;
        setRoles(rolesJson.data ?? []);
        setLevels(levelsJson.data ?? []);
      })
      .catch(() => {
        setMessage("Could not load roles or levels.");
      });
  }, []);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const payload = {
      company: form.company,
      role_id: form.role_id,
      level_id: form.level_id,
      location: {
        city: form.city,
        state: form.state || undefined,
        country: form.country,
      },
      base_salary: Number(form.base_salary),
      bonus: Number(form.bonus || 0),
      stock_value: Number(form.stock_value || 0),
      years_of_experience: form.years_of_experience
        ? Number(form.years_of_experience)
        : undefined,
      currency: form.currency,
    };

    const response = await fetch("/api/compensation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const json = (await response.json()) as ApiResponse<unknown>;

    if (!response.ok || !json.success) {
      setStatus("error");
      setMessage(json.error?.message ?? "Submission failed.");
      return;
    }

    setForm(initialState);
    setStatus("success");
    setMessage("Compensation submitted.");
    window.dispatchEvent(new Event("compensation:created"));
  }

  return (
    <section className="rounded border border-slate-200 bg-white p-5">
      <div className="mb-5">
        <h1 className="text-2xl font-semibold text-slate-950">Compensation Intelligence</h1>
        <p className="mt-1 text-sm text-slate-600">
          Submit normalized compensation data for comparison by company, role, level, and location.
        </p>
      </div>

      <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Company
          <input className="rounded border border-slate-300 px-3 py-2" value={form.company} onChange={(event) => update("company", event.target.value)} required />
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Currency
          <input className="rounded border border-slate-300 px-3 py-2 uppercase" value={form.currency} onChange={(event) => update("currency", event.target.value)} maxLength={3} required />
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Role
          <select className="rounded border border-slate-300 px-3 py-2" value={form.role_id} onChange={(event) => update("role_id", event.target.value)} required>
            <option value="">Select role</option>
            {roles.map((role : any) => (
              <option key={role.id} value={role.id}>{role.name}</option>
            ))}
          </select>
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Level
          <select className="rounded border border-slate-300 px-3 py-2" value={form.level_id} onChange={(event) => update("level_id", event.target.value)} required>
            <option value="">Select level</option>
            {levels.map((level : any) => (
              <option key={level.id} value={level.id}>{level.name}</option>
            ))}
          </select>
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          City
          <input className="rounded border border-slate-300 px-3 py-2" value={form.city} onChange={(event) => update("city", event.target.value)} required />
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          State
          <input className="rounded border border-slate-300 px-3 py-2" value={form.state} onChange={(event) => update("state", event.target.value)} />
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Country
          <input className="rounded border border-slate-300 px-3 py-2" value={form.country} onChange={(event) => update("country", event.target.value)} required />
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Years of experience
          <input className="rounded border border-slate-300 px-3 py-2" type="number" min="0" value={form.years_of_experience} onChange={(event) => update("years_of_experience", event.target.value)} />
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Base salary
          <input className="rounded border border-slate-300 px-3 py-2" type="number" min="1" value={form.base_salary} onChange={(event) => update("base_salary", event.target.value)} required />
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Bonus
          <input className="rounded border border-slate-300 px-3 py-2" type="number" min="0" value={form.bonus} onChange={(event) => update("bonus", event.target.value)} />
        </label>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Stock value
          <input className="rounded border border-slate-300 px-3 py-2" type="number" min="0" value={form.stock_value} onChange={(event) => update("stock_value", event.target.value)} />
        </label>

        <div className="flex items-end">
          <button className="w-full rounded bg-slate-950 px-4 py-2 text-sm font-semibold text-white disabled:bg-slate-400" disabled={status === "loading"}>
            {status === "loading" ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>

      {message ? (
        <p className={`mt-4 text-sm ${status === "error" ? "text-red-700" : "text-emerald-700"}`}>
          {message}
        </p>
      ) : null}
    </section>
  );
}
