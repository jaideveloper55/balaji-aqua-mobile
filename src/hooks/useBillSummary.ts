// src/hooks/useBillSummary.ts
// Turns the raw draft into totals. Both the bill and payment screens use it,
// so they can never disagree about the amount.
import { useMemo } from "react";
import { summarize } from "../lib/bill";
import { IS_WATER_PLANT } from "../lib/company";
import { customers } from "../mocks/customers";
import { useBillDraft } from "@/app/stores/billDraft";


export function useBillSummary(customerId: string | null | undefined) {
  // Select each value separately, so the screen re-renders only when it changes
  const quantities = useBillDraft((s) => s.quantities);
  const jarsGivenOverride = useBillDraft((s) => s.jarsGivenOverride);
  const jarsReturned = useBillDraft((s) => s.jarsReturned);

  return useMemo(() => {
    const customer = customers.find((c) => c.id === customerId);
    return summarize({
      customerId: customerId ?? "",
      quantities,
      jarsGivenOverride,
      jarsReturned,
      jarsHeld: customer?.jarsHeld ?? 0,
      trackJars: IS_WATER_PLANT,
    });
  }, [customerId, quantities, jarsGivenOverride, jarsReturned]);
}
