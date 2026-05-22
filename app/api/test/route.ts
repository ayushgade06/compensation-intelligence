import { NextResponse } from "next/server";

import {
  calculateTotalCompensation,
} from "@/lib/utils/calculation";

import {
  normalizeCompanyName,
} from "@/lib/utils/normalization";

export async function GET() {
  return NextResponse.json({
    tc:
      calculateTotalCompensation(
        180000,
        25000,
        80000
      ),

    normalized:
      normalizeCompanyName(
        "Google Inc"
      ),
  });
}