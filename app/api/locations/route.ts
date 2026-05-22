import { prisma } from "@/lib/db/prisma";
import { handleApiError } from "@/lib/errors/handle-api-error";
import { success } from "@/lib/errors/error-response";

export async function GET() {
  try {
    const locations = await prisma.location.findMany({
      orderBy: [
        {
          country: "asc",
        },
        {
          city: "asc",
        },
      ],
    });

    return success(locations, {
      count: locations.length,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
