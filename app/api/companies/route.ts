import { prisma } from "@/lib/db/prisma";

export async function GET() {
  try {
    const grouped =
      await prisma.compensation.groupBy({
        by: [
          "company_id",
        ],

        _count: {
          id: true,
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

        orderBy: {
          _count: {
            id: "desc",
          },
        },
      });

    const companies =
      await Promise.all(
        grouped.map(
          async (g) => {
            const company =
              await prisma.company.findUnique({
                where: {
                  id:
                    g.company_id,
                },
              });

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
        )
      );

    return Response.json({
      success: true,

      count:
        companies.length,

      data:
        companies,
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