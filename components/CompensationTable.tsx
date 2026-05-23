"use client";

import type { Compensation } from "@/components/types";
import { formatMoney } from "@/components/types";

type Props = {
  rows: Compensation[];
  loading?: boolean;
};

export function CompensationTable({ rows, loading = false }: Props) {
  if (loading) {
    return <div className="rounded border border-slate-200 bg-white p-5 text-sm text-slate-600">Loading compensation data...</div>;
  }

  if (rows.length === 0) {
    return <div className="rounded border border-slate-200 bg-white p-5 text-sm text-slate-600">No compensation submissions found.</div>;
  }

  return (
    <div className="overflow-x-auto rounded border border-slate-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
          <tr>
            <th className="px-4 py-3">Company</th>
            <th className="px-4 py-3">Role</th>
            <th className="px-4 py-3">Level</th>
            <th className="px-4 py-3">Location</th>
            <th className="px-4 py-3">Total comp</th>
            <th className="px-4 py-3">Verified</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row : any) => (
            <tr key={row.id}>
              <td className="px-4 py-3 font-medium text-slate-950">{row.company.name}</td>
              <td className="px-4 py-3 text-slate-700">{row.role.name}</td>
              <td className="px-4 py-3 text-slate-700">{row.level.name}</td>
              <td className="px-4 py-3 text-slate-700">
                {[row.location.city, row.location.state, row.location.country].filter(Boolean).join(", ")}
              </td>
              <td className="px-4 py-3 font-semibold text-slate-950">{formatMoney(row.total_compensation, row.currency)}</td>
              <td className="px-4 py-3 text-slate-700">{row.verified ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
