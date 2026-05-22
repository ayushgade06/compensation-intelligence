import { prisma } from "@/lib/db/prisma";

export async function GET(
  req: Request
) {
  try {
    const url =
      new URL(req.url);

    const metric =
      (
        url.searchParams.get(
          "metric"
        ) ?? "avg"
      ).toLowerCase();

    const limit =
      Math.min(
        Number(
          url.searchParams.get(
            "limit"
          ) ?? 10
        ),
        50
      );

      const allowed = [
        "avg",
        "max",
        "submissions",
        ];

        if (
        !allowed.includes(
            metric
        )
        ) {
        return Response.json(
            {
            success: false,

            error:
                "Invalid metric",
            },

            {
            status: 400,
            }
        );
    }

    const grouped =
      await prisma.compensation.groupBy({
        by: [
          "company_id",
        ],

        _avg: {
          total_compensation:
            true,
        },

        _max: {
          total_compensation:
            true,
        },

        _count: {
          id: true,
        },
      });

    const companies =
      await prisma.company.findMany({
        select: {
          id: true,
          name: true,
        },
      });

    const leaderboard =
      grouped.map(
        (g) => {
          const company =
            companies.find(
              (c) =>
                c.id ===
                g.company_id
            );

          let score =
            0;

          if (
            metric ===
            "avg"
          ) {
            score =
              Number(
                g._avg
                  .total_compensation ??
                  0
              );
          }

          else if (
            metric ===
            "max"
          ) {
            score =
              Number(
                g._max
                  .total_compensation ??
                  0
              );
          }

          else if (
            metric ===
            "submissions"
          ) {
            score =
              g._count.id;
          }

          return {
            company:
              company?.name,

            score,
          };
        }
      );

    leaderboard.sort(
      (
        a,
        b
      ) =>
        b.score -
        a.score
    );

    return Response.json({
      success: true,

      metric,

      count:
        leaderboard.length,

      data:
        leaderboard.slice(
          0,
          limit
        ),
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