import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/db/prisma";
import { ConflictError, NotFoundError } from "@/lib/errors/app-error";
import { handleApiError } from "@/lib/errors/handle-api-error";
import { success } from "@/lib/errors/error-response";

import {
  createCompensationSchema,
  compensationQuerySchema,
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

    const [role, level] =
      await Promise.all([
        prisma.role.findUnique({
          where: {
            id: input.role_id,
          },
        }),

        prisma.level.findUnique({
          where: {
            id: input.level_id,
          },
        }),
      ]);

    if (!role) {
      throw new NotFoundError(
        "Role not found"
      );
    }

    if (!level) {
      throw new NotFoundError(
        "Level not found"
      );
    }

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
      throw new ConflictError(
        "Duplicate compensation entry"
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

    return success(created, {}, 201);
  } catch (error) {
    return handleApiError(error);
  }
}


export async function GET(
  req: Request
) {
  try {
    const url =
      new URL(req.url);

    const input =
      compensationQuerySchema.parse(
        Object.fromEntries(
          url.searchParams
        )
      );

    const {
      company,
      role,
      location,
      min_tc: minTC,
      max_tc: maxTC,
      page,
      limit,
    } = input;

    const skip =
      (page - 1) *
      limit;

    const where: Prisma.CompensationWhereInput = {};

    if (company) {
      where.company = {
        normalized_name:
          normalizeCompanyName(
            company
          ),
      };
    }

    if (role) {
      where.role = {
        name: {
          contains:
            role,

          mode:
            "insensitive",
        },
      };
    }

    if (location) {
      where.location = {
        city: {
          contains:
            location,

          mode:
            "insensitive",
        },
      };
    }

    if (
      minTC ||
      maxTC
    ) {
      where.total_compensation =
        {};

      if (minTC) {
        where.total_compensation.gte =
          minTC;
      }

      if (maxTC) {
        where.total_compensation.lte =
          maxTC;
      }
    }

    const [
      results,
      total,
    ] =
      await Promise.all([

        prisma.compensation.findMany({
          where,

          include: {
            company:
              true,

            role:
              true,

            level:
              true,

            location:
              true,
          },

          orderBy: {
            total_compensation:
              "desc",
          },

          skip,

          take:
            limit,
        }),

        prisma.compensation.count({
          where,
        }),

      ]);

    const totalPages =
      Math.ceil(
        total /
          limit
      );

    return success(
      results,
      {
        page,

        limit,

        total,

        totalPages,

        hasNext:
          page <
          totalPages,

        hasPrev:
          page > 1,

        filters: {
          company,

          role,

          location,

          minTC,

          maxTC,
        },
      },
    );

  } catch (
    error
  ) {
    return handleApiError(error);
  }
}
