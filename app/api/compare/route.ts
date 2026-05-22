import { prisma } from "@/lib/db/prisma";

import {
  normalizeCompanyName,
} from "@/lib/utils/normalization";

export async function GET(
  req: Request
) {
  try {
    const url =
      new URL(req.url);

    const companies =
      url.searchParams.get(
        "companies"
      );

    if (!companies) {
      return Response.json(
        {
          success: false,

          error:
            "companies required",
        },
        {
          status: 400,
        }
      );
    }

    const normalized =
  companies
    .split(",")

    .map((c) =>
      normalizeCompanyName(
        c.trim()
      )
    )

    .filter(Boolean);

    if (normalized.length < 2) {
        return Response.json(
            {
            success: false,

            error:
                "At least 2 companies are required for comparison",
            },

            {
            status: 400,
            }
        );
    }

    const companyRows =
      await prisma.company.findMany({
        where: {
          normalized_name: {
            in:
              normalized,
          },
        },

        select: {
          id: true,
          name: true,
          normalized_name:
            true,
        },
      });

    const grouped =
      await prisma.compensation.groupBy({
        by: [
          "company_id",
        ],

        where: {
          company_id: {
            in:
              companyRows.map(
                (c) =>
                  c.id
              ),
          },
        },

        _avg: {
          total_compensation:
            true,
        },

        _max: {
          total_compensation:
            true,
        },

        _min: {
          total_compensation:
            true,
        },

        _count: {
          id: true,
        },
      });

    const results =
      grouped.map(
        (g) => {
          const company =
            companyRows.find(
              (
                c
              ) =>
                c.id ===
                g.company_id
            );

          return {
            company:
              company?.name,

            submissions:
              g._count.id,

            avg_tc:
              g._avg
                .total_compensation,

            max_tc:
              g._max
                .total_compensation,

            min_tc:
              g._min
                .total_compensation,
          };
        }
      );

    return Response.json({
      success: true,

      count:
        results.length,

      data:
        results,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,

        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      {
        status: 500,
      }
    );
  }
}