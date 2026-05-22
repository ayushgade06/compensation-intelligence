"use client";

import { FormEvent, useState } from "react";

export type Filters = {
  company: string;
  role: string;
  location: string;
  min_tc: string;
  max_tc: string;
};

type Props = {
  onApply: (filters: Filters) => void;
};

const emptyFilters: Filters = {
  company: "",
  role: "",
  location: "",
  min_tc: "",
  max_tc: "",
};

export function FilterPanel({ onApply }: Props) {
  const [filters, setFilters] = useState<Filters>(emptyFilters);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onApply(filters);
  }

  function update<K extends keyof Filters>(key: K, value: Filters[K]) {
    setFilters((current) => ({
      ...current,
      [key]: value,
    }));
  }

  return (
    <form onSubmit={submit} className="grid gap-4 rounded border border-slate-200 bg-white p-5">
      <h2 className="text-lg font-semibold text-slate-950">Filters</h2>
      <label className="grid gap-1 text-sm font-medium text-slate-700">
        Company
        <input className="rounded border border-slate-300 px-3 py-2" value={filters.company} onChange={(event) => update("company", event.target.value)} />
      </label>
      <label className="grid gap-1 text-sm font-medium text-slate-700">
        Role
        <input className="rounded border border-slate-300 px-3 py-2" value={filters.role} onChange={(event) => update("role", event.target.value)} />
      </label>
      <label className="grid gap-1 text-sm font-medium text-slate-700">
        Location
        <input className="rounded border border-slate-300 px-3 py-2" value={filters.location} onChange={(event) => update("location", event.target.value)} />
      </label>
      <label className="grid gap-1 text-sm font-medium text-slate-700">
        Min TC
        <input className="rounded border border-slate-300 px-3 py-2" type="number" min="0" value={filters.min_tc} onChange={(event) => update("min_tc", event.target.value)} />
      </label>
      <label className="grid gap-1 text-sm font-medium text-slate-700">
        Max TC
        <input className="rounded border border-slate-300 px-3 py-2" type="number" min="0" value={filters.max_tc} onChange={(event) => update("max_tc", event.target.value)} />
      </label>
      <div className="grid grid-cols-2 gap-2">
        <button className="rounded bg-slate-950 px-4 py-2 text-sm font-semibold text-white">Apply</button>
        <button type="button" className="rounded border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700" onClick={() => { setFilters(emptyFilters); onApply(emptyFilters); }}>
          Clear
        </button>
      </div>
    </form>
  );
}
