import {
  calculateTotalCompensation,
} from "@/lib/utils/calculation";

import {
  normalizeCompanyName,
} from "@/lib/utils/normalization";
import { success } from "@/lib/errors/error-response";

export async function GET() {
  return success({
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
