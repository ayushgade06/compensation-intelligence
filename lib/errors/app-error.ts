export type AppErrorDetails = unknown[];

export class AppError extends Error {
  code: string;
  status: number;
  details: AppErrorDetails;

  constructor(
    message: string,
    code: string,
    status: number,
    details: AppErrorDetails = []
  ) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export class ValidationError extends AppError {
  constructor(message = "Invalid request", details: AppErrorDetails = []) {
    super(message, "VALIDATION_ERROR", 400, details);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found", details: AppErrorDetails = []) {
    super(message, "NOT_FOUND", 404, details);
  }
}

export class ConflictError extends AppError {
  constructor(message = "Conflict", details: AppErrorDetails = []) {
    super(message, "CONFLICT", 409, details);
  }
}

export class InternalServerError extends AppError {
  constructor(message = "Internal server error", details: AppErrorDetails = []) {
    super(message, "INTERNAL_SERVER_ERROR", 500, details);
  }
}
