import { prisma } from "@/lib/db/prisma";
import { handleApiError } from "@/lib/errors/handle-api-error";
import { success } from "@/lib/errors/error-response";

export async function GET() {
  try {
    const levels = await prisma.level.findMany({
      orderBy: {
        order: "asc",
      },
    });

    return success(levels, {
      count: levels.length,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
