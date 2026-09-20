// src/lib/bill.ts
// ALL billing math lives here, in one pure function (no React, no state).
// Pure = same input always gives the same output, so it is easy to test with Jest.
import { Product, priceFor, products } from "../mocks/products";

export type BillLine = {
  product: Product;
  qty: number;
  unitPrice: number;
  lineTotal: number;
  isSpecialRate: boolean; // customer's price differs from the default
};

export type BillSummary = {
  lines: BillLine[];
  itemCount: number;
  subtotal: number;
  jarsHeld: number; // with the customer BEFORE this bill
  jarsGiven: number;
  jarsReturned: number;
  jarsAfter: number; // with the customer AFTER this bill
  jarsGivenIsAuto: boolean;
};

// Money math is done in paise (whole numbers). 0.1 + 0.2 = 0.30000000000000004
// in JavaScript, and a bill must never show that.
const toPaise = (rupees: number) => Math.round(rupees * 100);

export function lineTotalOf(unitPrice: number, qty: number): number {
  return (toPaise(unitPrice) * qty) / 100;
}

type Input = {
  customerId: string;
  quantities: Record<string, number>; // productId -> qty
  jarsGivenOverride: number | null; // null = "follow the jar products automatically"
  jarsReturned: number;
  jarsHeld: number;
  trackJars: boolean; // false for BEVERAGE companies
};

export function summarize(input: Input): BillSummary {
  const lines: BillLine[] = [];
  let itemCount = 0;
  let jarQty = 0;
  let subtotalPaise = 0;

  for (const product of products) {
    const qty = input.quantities[product.id] ?? 0;
    if (qty <= 0) continue;

    const unitPrice = priceFor(input.customerId, product);
    subtotalPaise += toPaise(unitPrice) * qty;
    itemCount += qty;
    if (product.isJar) jarQty += qty;

    lines.push({
      product,
      qty,
      unitPrice,
      lineTotal: lineTotalOf(unitPrice, qty),
      isSpecialRate: unitPrice !== product.price,
    });
  }

  // Jars given follow the cans on the bill, unless the delivery boy changed it
  const jarsGiven = input.trackJars ? (input.jarsGivenOverride ?? jarQty) : 0;
  // A customer can't hand back more jars than they hold plus the ones just given
  const jarsReturned = input.trackJars
    ? Math.min(input.jarsReturned, input.jarsHeld + jarsGiven)
    : 0;

  return {
    lines,
    itemCount,
    subtotal: subtotalPaise / 100,
    jarsHeld: input.jarsHeld,
    jarsGiven,
    jarsReturned,
    jarsAfter: input.jarsHeld + jarsGiven - jarsReturned,
    jarsGivenIsAuto: input.jarsGivenOverride === null,
  };
}
