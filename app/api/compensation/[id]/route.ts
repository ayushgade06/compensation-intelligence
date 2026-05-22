import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(
  request: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const { id } = await context.params;

    // UUID validation
    const uuidRegex =
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

    if (!uuidRegex.test(id)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_ID",
            message: "Invalid compensation ID",
          },
        },
        {
          status: 400,
        }
      );
    }

    const compensation =
      await prisma.compensation.findUnique({
        where: {
          id,
        },

        include: {
          company: true,
          role: true,
          level: true,
          location: true,
        },
      });

    if (!compensation) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: "Compensation not found",
          },
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: compensation,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Internal server error",
        },
      },
      {
        status: 500,
      }
    );
  }
}