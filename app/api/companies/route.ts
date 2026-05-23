import { prisma } from "@/lib/db/prisma";
import { handleApiError } from "@/lib/errors/handle-api-error";
import { success } from "@/lib/errors/error-response";

type CompanyGroup = {
  company_id: string;
  _count: {
    id: number;
  };
  _avg: {
    total_compensation: unknown;
  };
  _max: {
    total_compensation: unknown;
  };
  _min: {
    total_compensation: unknown;
  };
};

export async function GET() {
  try {
    const groupedResult = await prisma.compensation.groupBy({
      by: ["company_id"],
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
      orderBy: {
        _count: {
          id: "desc",
        },
      },
    });
    const grouped = groupedResult as unknown as CompanyGroup[];

    const companyRows = await prisma.company.findMany({
      where: {
        id: {
          in: grouped.map((group : any) => group.company_id),
        },
      },
    });

    const companies = grouped.map((group : any) => {
      const company = companyRows.find((row : any) => row.id === group.company_id);

      return {
        id: company?.id,
        company: company?.name,
        normalized_name: company?.normalized_name,
        submissions: group._count.id,
        avg_tc: group._avg.total_compensation,
        max_tc: group._max.total_compensation,
        min_tc: group._min.total_compensation,
      };
    });

    return success(companies, {
      count: companies.length,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
