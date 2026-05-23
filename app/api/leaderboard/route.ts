import { prisma } from "@/lib/db/prisma";
import { handleApiError } from "@/lib/errors/handle-api-error";
import { success } from "@/lib/errors/error-response";
import { leaderboardQuerySchema } from "@/lib/validators/compensation.validator";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const { metric, limit } = leaderboardQuerySchema.parse(
      Object.fromEntries(url.searchParams)
    );

    const grouped = await prisma.compensation.groupBy({
      by: ["company_id"],
      _avg: {
        total_compensation: true,
      },
      _max: {
        total_compensation: true,
      },
      _count: {
        id: true,
      },
    });

    const companies = await prisma.company.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    const leaderboard = grouped.map((group : any) => {
      const company = companies.find((row : any) => row.id === group.company_id);
      let score = 0;

      if (metric === "avg") {
        score = Number(group._avg.total_compensation ?? 0);
      } else if (metric === "max") {
        score = Number(group._max.total_compensation ?? 0);
      } else {
        score = group._count.id;
      }

      return {
        company: company?.name,
        score,
      };
    });

    leaderboard.sort((a, b) => b.score - a.score);

    return success(leaderboard.slice(0, limit), {
      metric,
      count: leaderboard.length,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
