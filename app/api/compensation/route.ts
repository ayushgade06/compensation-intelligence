import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/db/prisma";

import {
  createCompensationSchema,
} from "@/lib/validators/compensation.validator";

import {
  calculateTotalCompensation,
} from "@/lib/utils/calculation";

import {
  normalizeCompanyName,
  normalizeLocation,
} from "@/lib/utils/normalization";

export async function POST(
  req: NextRequest
) {
  try {
    const body =
      await req.json();

    const input =
      createCompensationSchema.parse(
        body
      );

    const normalizedCompany =
      normalizeCompanyName(
        input.company
      );

    let company =
      await prisma.company.findUnique({
        where: {
          normalized_name:
            normalizedCompany,
        },
      });

    if (!company) {
      company =
        await prisma.company.create({
          data: {
            name:
              input.company,

            normalized_name:
              normalizedCompany,

            slug:
              normalizedCompany,
          },
        });
    }

    const normalizedLocation =
      normalizeLocation(
        input.location.city,
        input.location.state,
        input.location.country
      );

    let location =
      await prisma.location.findUnique({
        where: {
          normalized:
            normalizedLocation,
        },
      });

    if (!location) {
      location =
        await prisma.location.create({
          data: {
            city:
              input.location.city,

            state:
              input.location.state,

            country:
              input.location.country,

            normalized:
              normalizedLocation,
          },
        });
    }

    const existing =
  await prisma.compensation.findFirst({
    where: {
      company_id:
        company.id,

      role_id:
        input.role_id,

      level_id:
        input.level_id,

      location_id:
        location.id,

      currency:
        input.currency,
    },
  });

    if (existing) {
    return NextResponse.json(
        {
        success: false,

        error:
            "Duplicate compensation entry",
        },

        {
        status: 409,
        }
    );
    }

    const tc =
      calculateTotalCompensation(
        input.base_salary,

        input.bonus,

        input.stock_value
      );

    const created =
      await prisma.compensation.create({
        data: {
          company_id:
            company.id,

          role_id:
            input.role_id,

          level_id:
            input.level_id,

          location_id:
            location.id,

          base_salary:
            input.base_salary,

          bonus:
            input.bonus,

          stock_value:
            input.stock_value,

          total_compensation:
            tc,

          years_of_experience:
            input.years_of_experience,

          currency:
            input.currency,
        },
      });

    return NextResponse.json(
      {
        success: true,
        data: created,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      {
        status: 400,
      }
    );
  }
}