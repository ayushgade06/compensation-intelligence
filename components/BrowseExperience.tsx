"use client";

import { useEffect, useState } from "react";

import { CompensationTable } from "@/components/CompensationTable";
import { FilterPanel, type Filters } from "@/components/FilterPanel";
import { Pagination } from "@/components/Pagination";
import type { ApiResponse, Compensation } from "@/components/types";

type Meta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

const initialMeta: Meta = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
  hasNext: false,
  hasPrev: false,
};

const emptyFilters: Filters = {
  company: "",
  role: "",
  location: "",
  min_tc: "",
  max_tc: "",
};

export function BrowseExperience() {
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<Compensation[]>([]);
  const [meta, setMeta] = useState<Meta>(initialMeta);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");

      const params = new URLSearchParams({
        page: String(page),
        limit: "10",
      });

      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        }
      });

      try {
        const response = await fetch(`/api/compensation?${params.toString()}`);
        const json = (await response.json()) as ApiResponse<Compensation[]>;

        if (!response.ok || !json.success) {
          throw new Error(json.error?.message ?? "Could not load compensation data.");
        }

        setRows(json.data ?? []);
        setMeta({
          ...initialMeta,
          ...(json.meta as Partial<Meta>),
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not load compensation data.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [filters, page]);

  return (
    <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
      <FilterPanel
        onApply={(nextFilters) => {
          setFilters(nextFilters);
          setPage(1);
        }}
      />
      <section className="grid gap-4">
        {error ? (
          <div className="rounded border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
        ) : null}
        <CompensationTable rows={rows} loading={loading} />
        <Pagination page={meta.page} totalPages={meta.totalPages} hasNext={meta.hasNext} hasPrev={meta.hasPrev} onPageChange={setPage} />
      </section>
    </div>
  );
}
