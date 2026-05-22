import { NextResponse } from "next/server";

type Meta = Record<string, unknown>;

export function success<T>(data: T, meta: Meta = {}, status = 200) {
  return NextResponse.json(
    {
      success: true,
      data,
      meta,
    },
    { status }
  );
}

export function failure(
  code: string,
  message: string,
  details: unknown[] = [],
  status = 500
) {
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
        details,
      },
    },
    { status }
  );
}
