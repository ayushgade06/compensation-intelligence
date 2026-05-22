export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  meta?: Record<string, unknown>;
  error?: {
    code: string;
    message: string;
    details: unknown[];
  };
};

export type Role = {
  id: string;
  name: string;
  category?: string | null;
};

export type Level = {
  id: string;
  name: string;
  code: string;
  order: number;
};

export type Compensation = {
  id: string;
  base_salary: string | number;
  bonus: string | number;
  stock_value: string | number;
  total_compensation: string | number;
  years_of_experience?: number | null;
  currency: string;
  verified: boolean;
  created_at: string;
  company: {
    name: string;
  };
  role: {
    name: string;
  };
  level: {
    name: string;
    code: string;
  };
  location: {
    city: string;
    state?: string | null;
    country: string;
  };
};

export type CompanySummary = {
  company?: string;
  normalized_name?: string;
  submissions: number;
  avg_tc?: string | number | null;
  max_tc?: string | number | null;
  min_tc?: string | number | null;
};

export type ComparisonRow = {
  company?: string;
  submissions: number;
  avg_tc?: string | number | null;
  max_tc?: string | number | null;
  min_tc?: string | number | null;
};

export function formatMoney(value: string | number | null | undefined, currency = "USD") {
  const numberValue = Number(value ?? 0);

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(numberValue);
}
