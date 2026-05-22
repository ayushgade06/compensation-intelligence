"use client";

import { useEffect, useState } from "react";

import { CompensationTable } from "@/components/CompensationTable";
import type { ApiResponse, Compensation } from "@/components/types";

export function RecentSubmissions() {
  const [rows, setRows] = useState<Compensation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/compensation?limit=5");
      const json = (await response.json()) as ApiResponse<Compensation[]>;

      if (!response.ok || !json.success) {
        throw new Error(json.error?.message ?? "Could not load submissions.");
      }

      setRows(json.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load submissions.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    queueMicrotask(load);
    window.addEventListener("compensation:created", load);
    return () => window.removeEventListener("compensation:created", load);
  }, []);

  if (error) {
    return <div className="rounded border border-red-200 bg-red-50 p-5 text-sm text-red-700">{error}</div>;
  }

  return (
    <section className="grid gap-3">
      <h2 className="text-lg font-semibold text-slate-950">Recent submissions</h2>
      <CompensationTable rows={rows} loading={loading} />
    </section>
  );
}
