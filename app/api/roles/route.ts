import { prisma } from "@/lib/db/prisma";
import { handleApiError } from "@/lib/errors/handle-api-error";
import { success } from "@/lib/errors/error-response";

export async function GET() {
  try {
    const roles = await prisma.role.findMany({
      orderBy: [
        {
          category: "asc",
        },
        {
          name: "asc",
        },
      ],
    });

    return success(roles, {
      count: roles.length,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
