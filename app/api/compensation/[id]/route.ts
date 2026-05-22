import { NextRequest } from "next/server";

import { prisma } from "@/lib/db/prisma";
import { NotFoundError } from "@/lib/errors/app-error";
import { handleApiError } from "@/lib/errors/handle-api-error";
import { success } from "@/lib/errors/error-response";
import { idParamSchema } from "@/lib/validators/compensation.validator";

export async function GET(
  _request: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const params = idParamSchema.parse(await context.params);

    const compensation = await prisma.compensation.findUnique({
      where: {
        id: params.id,
      },
      include: {
        company: true,
        role: true,
        level: true,
        location: true,
      },
    });

    if (!compensation) {
      throw new NotFoundError("Compensation not found");
    }

    return success(compensation);
  } catch (error) {
    return handleApiError(error);
  }
}
