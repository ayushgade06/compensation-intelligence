import { prisma } from "@/lib/db/prisma";

export async function GET() {
  try {
    const summary =
      await prisma.compensation.aggregate({
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
      });

    const currency =
      await prisma.compensation.groupBy({
        by: [
          "currency",
        ],

        _count: {
          id: true,
        },
      });

    const levels =
      await prisma.compensation.groupBy({
        by: [
          "level_id",
        ],

        _count: {
          id: true,
        },
      });

    const levelRows =
      await prisma.level.findMany({
        select: {
          id: true,
          name: true,
        },
      });

    const levelDistribution =
      levels.map(
        (
          level
        ) => {
          const row =
            levelRows.find(
              (
                l
              ) =>
                l.id ===
                level.level_id
            );

          return {
            level:
              row?.name,

            submissions:
              level._count.id,
          };
        }
      );

    return Response.json({
      success: true,

      summary: {
        submissions:
          summary._count.id,

        average_tc:
          summary._avg
            .total_compensation,

        max_tc:
          summary._max
            .total_compensation,

        min_tc:
          summary._min
            .total_compensation,
      },

      currency_distribution:
        currency,

      level_distribution:
        levelDistribution,
    });
  }

  catch (error) {
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