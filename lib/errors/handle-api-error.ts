import { Prisma } from "@prisma/client";
import { ZodError } from "zod";

import { AppError } from "@/lib/errors/app-error";
import { failure } from "@/lib/errors/error-response";

export function handleApiError(error: unknown) {
  if (error instanceof AppError) {
    return failure(error.code, error.message, error.details, error.status);
  }

  if (error instanceof ZodError) {
    return failure(
      "VALIDATION_ERROR",
      "Invalid request",
      error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
      400
    );
  }

  if (error instanceof SyntaxError) {
    return failure("VALIDATION_ERROR", "Invalid JSON body", [], 400);
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return failure("CONFLICT", "Resource already exists", [], 409);
    }

    if (error.code === "P2025") {
      return failure("NOT_FOUND", "Resource not found", [], 404);
    }

    if (error.code === "P2003") {
      return failure("VALIDATION_ERROR", "Invalid related resource", [], 422);
    }
  }

  console.error(error);

  return failure("INTERNAL_SERVER_ERROR", "Internal server error", [], 500);
}
