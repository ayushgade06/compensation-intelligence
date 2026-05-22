import { prisma } from "@/lib/db/prisma";
import { NotFoundError } from "@/lib/errors/app-error";
import { handleApiError } from "@/lib/errors/handle-api-error";
import { success } from "@/lib/errors/error-response";
import { idParamSchema } from "@/lib/validators/compensation.validator";

export async function PATCH(
  _request: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const params = idParamSchema.parse(await context.params);

    const existing = await prisma.compensation.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!existing) {
      throw new NotFoundError("Compensation not found");
    }

    const updated = await prisma.compensation.update({
      where: {
        id: params.id,
      },
      data: {
        verified: true,
      },
    });

    return success(updated);
  } catch (error) {
    return handleApiError(error);
  }
}
