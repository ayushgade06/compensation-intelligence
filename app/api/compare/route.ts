import { prisma } from "@/lib/db/prisma";
import { handleApiError } from "@/lib/errors/handle-api-error";
import { success } from "@/lib/errors/error-response";
import { compareQuerySchema } from "@/lib/validators/compensation.validator";
import { normalizeCompanyName } from "@/lib/utils/normalization";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const input = compareQuerySchema.parse(Object.fromEntries(url.searchParams));

    const normalized = input.companies.map((company) =>
      normalizeCompanyName(company)
    );

    const companyRows = await prisma.company.findMany({
      where: {
        normalized_name: {
          in: normalized,
        },
      },
      select: {
        id: true,
        name: true,
        normalized_name: true,
      },
    });

    const grouped = await prisma.compensation.groupBy({
      by: ["company_id"],
      where: {
        company_id: {
          in: companyRows.map((company) => company.id),
        },
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
      _count: {
        id: true,
      },
    });

    const results = grouped.map((group) => {
      const company = companyRows.find((row) => row.id === group.company_id);

      return {
        company: company?.name,
        submissions: group._count.id,
        avg_tc: group._avg.total_compensation,
        max_tc: group._max.total_compensation,
        min_tc: group._min.total_compensation,
      };
    });

    return success(results, {
      count: results.length,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
