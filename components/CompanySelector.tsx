"use client";

import { useEffect, useState } from "react";

import type { ApiResponse, CompanySummary } from "@/components/types";

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

export function CompanySelector({ label, value, onChange }: Props) {
  const [companies, setCompanies] = useState<CompanySummary[]>([]);

  useEffect(() => {
    fetch("/api/companies")
      .then(async (response) => {
        const json = (await response.json()) as ApiResponse<CompanySummary[]>;
        setCompanies(json.data ?? []);
      })
      .catch(() => setCompanies([]));
  }, []);

  return (
    <label className="grid gap-1 text-sm font-medium text-slate-700">
      {label}
      <select className="rounded border border-slate-300 px-3 py-2" value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">Select company</option>
        {companies.map((company) => (
          <option key={company.normalized_name ?? company.company} value={company.company ?? ""}>
            {company.company}
          </option>
        ))}
      </select>
    </label>
  );
}
