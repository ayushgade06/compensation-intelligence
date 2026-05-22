import { z } from "zod";

const uuidSchema =
  z.string().uuid();

const optionalPositiveNumberFromQuery =
  z
    .string()
    .optional()
    .transform((value) =>
      value === undefined || value === "" ? undefined : Number(value)
    )
    .pipe(z.number().positive().optional());

export const createCompensationSchema =
  z.object({
    company: z.string().trim().min(1),

    role_id: uuidSchema,

    level_id: uuidSchema,

    location: z.object({
      city: z.string().trim().min(1),

      state: z.string().trim().optional(),

      country: z.string().trim().min(1),
    }),

    base_salary:
      z.number().positive(),

    bonus:
      z.number()
        .nonnegative()
        .default(0),

    stock_value:
      z.number()
        .nonnegative()
        .default(0),

    years_of_experience:
      z.number()
        .int()
        .optional(),

    currency:
      z.string()
        .length(3)
        .default("USD")
        .transform((value) =>
          value.toUpperCase()
        ),
  });

export const compensationQuerySchema =
  z
    .object({
      company: z.string().trim().optional(),
      role: z.string().trim().optional(),
      location: z.string().trim().optional(),
      min_tc: optionalPositiveNumberFromQuery,
      max_tc: optionalPositiveNumberFromQuery,
      page: z.coerce.number().int().positive().default(1),
      limit: z.coerce.number().int().positive().max(100).default(20),
    })
    .refine(
      (input) =>
        input.min_tc === undefined ||
        input.max_tc === undefined ||
        input.min_tc <= input.max_tc,
      {
        message: "min_tc cannot be greater than max_tc",
        path: ["min_tc"],
      }
    );

export const compareQuerySchema =
  z.object({
    companies: z
      .string()
      .min(1)
      .transform((value) =>
        value
          .split(",")
          .map((company) => company.trim())
          .filter(Boolean)
      )
      .refine((companies) => companies.length >= 2, {
        message: "At least 2 companies are required for comparison",
      }),
  });

export const leaderboardQuerySchema =
  z.object({
    metric: z.enum(["avg", "max", "submissions"]).default("avg"),
    limit: z.coerce.number().int().positive().max(50).default(10),
  });

export const idParamSchema =
  z.object({
    id: uuidSchema,
  });

export type CreateCompensationInput =
  z.infer<
    typeof createCompensationSchema
  >;
