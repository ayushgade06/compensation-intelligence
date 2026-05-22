import { prisma } from "@/lib/db/prisma";

export async function PATCH(
  _: Request,

  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const { id } =
      await params;

    const existing =
      await prisma.compensation.findUnique({
        where: {
          id,
        },
      });

    if (!existing) {
      return Response.json(
        {
          success: false,

          error:
            "Compensation not found",
        },

        {
          status: 404,
        }
      );
    }

    const updated =
      await prisma.compensation.update({
        where: {
          id,
        },

        data: {
          verified:
            true,
        },
      });

    return Response.json({
      success: true,

      data:
        updated,
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