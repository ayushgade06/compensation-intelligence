"use client";

type Props = {
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  onPageChange: (page: number) => void;
};

export function Pagination({ page, totalPages, hasNext, hasPrev, onPageChange }: Props) {
  return (
    <div className="flex items-center justify-between rounded border border-slate-200 bg-white px-4 py-3 text-sm">
      <button className="rounded border border-slate-300 px-3 py-2 disabled:opacity-50" disabled={!hasPrev} onClick={() => onPageChange(page - 1)}>
        Previous
      </button>
      <span className="text-slate-600">
        Page {page} of {Math.max(totalPages, 1)}
      </span>
      <button className="rounded border border-slate-300 px-3 py-2 disabled:opacity-50" disabled={!hasNext} onClick={() => onPageChange(page + 1)}>
        Next
      </button>
    </div>
  );
}
