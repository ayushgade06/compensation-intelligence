import { prisma } from "@/lib/db/prisma";
import { handleApiError } from "@/lib/errors/handle-api-error";
import { success } from "@/lib/errors/error-response";
import { AnyARecord } from "dns";

export async function GET() {
  try {
    const [summary, currency, levels, levelRows] = await Promise.all([
      prisma.compensation.aggregate({
        _count: {
          id: true,
        },
        _avg: {
          total_compensation: true,
        },
        _max: {
          total_compensation: true,
        },
        _min: {
          total_compensation: true,
        },
      }),
      prisma.compensation.groupBy({
        by: ["currency"],
        _count: {
          id: true,
        },
      }),
      prisma.compensation.groupBy({
        by: ["level_id"],
        _count: {
          id: true,
        },
      }),
      prisma.level.findMany({
        select: {
          id: true,
          name: true,
        },
      }),
    ]);

    const levelDistribution = levels.map((level : any) => {
      const row = levelRows.find((item : any) => item.id === level.level_id);

      return {
        level: row?.name,
        submissions: level._count.id,
      };
    });

    return success({
      summary: {
        submissions: summary._count.id,
        average_tc: summary._avg.total_compensation,
        max_tc: summary._max.total_compensation,
        min_tc: summary._min.total_compensation,
      },
      currency_distribution: currency,
      level_distribution: levelDistribution,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
