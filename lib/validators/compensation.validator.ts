import { z } from "zod";

export const createCompensationSchema =
  z.object({
    company: z.string(),

    role_id: z.string(),

    level_id: z.string(),

    location: z.object({
      city: z.string(),

      state: z.string().optional(),

      country: z.string(),
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
        .default("USD"),
  });

export type CreateCompensationInput =
  z.infer<
    typeof createCompensationSchema
  >;