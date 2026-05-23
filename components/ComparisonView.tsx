"use client";

import { useEffect, useState } from "react";

import { CompanySelector } from "@/components/CompanySelector";
import type { ApiResponse, ComparisonRow } from "@/components/types";
import { formatMoney } from "@/components/types";

export function ComparisonView() {
  const [first, setFirst] = useState("");
  const [second, setSecond] = useState("");
  const [rows, setRows] = useState<ComparisonRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!first || !second || first === second) {
      return;
    }

    async function load() {
      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams({
          companies: `${first},${second}`,
        });
        const response = await fetch(`/api/compare?${params.toString()}`);
        const json = (await response.json()) as ApiResponse<ComparisonRow[]>;

        if (!response.ok || !json.success) {
          throw new Error(json.error?.message ?? "Could not compare companies.");
        }

        setRows(json.data ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not compare companies.");
      } finally {
        setLoading(false);
      }
    }

    queueMicrotask(load);
  }, [first, second]);

  return (
    <section className="grid gap-5">
      <div className="grid gap-4 rounded border border-slate-200 bg-white p-5 md:grid-cols-2">
        <CompanySelector label="Company A" value={first} onChange={(value) => { setRows([]); setFirst(value); }} />
        <CompanySelector label="Company B" value={second} onChange={(value) => { setRows([]); setSecond(value); }} />
      </div>

      {first && second && first === second ? (
        <div className="rounded border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">Choose two different companies.</div>
      ) : null}

      {error ? (
        <div className="rounded border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      ) : null}

      {loading ? (
        <div className="rounded border border-slate-200 bg-white p-5 text-sm text-slate-600">Loading comparison...</div>
      ) : null}

      {!loading && rows.length === 0 && first && second && first !== second ? (
        <div className="rounded border border-slate-200 bg-white p-5 text-sm text-slate-600">No comparison data found.</div>
      ) : null}

      {rows.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {rows.map((row : any) => (
            <article key={row.company} className="rounded border border-slate-200 bg-white p-5">
              <h2 className="text-lg font-semibold text-slate-950">{row.company}</h2>
              <dl className="mt-4 grid gap-3 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-600">Average TC</dt>
                  <dd className="font-semibold text-slate-950">{formatMoney(row.avg_tc)}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-600">Maximum TC</dt>
                  <dd className="font-semibold text-slate-950">{formatMoney(row.max_tc)}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-600">Submissions</dt>
                  <dd className="font-semibold text-slate-950">{row.submissions}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}
