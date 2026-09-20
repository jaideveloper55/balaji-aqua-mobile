// src/lib/format.ts
// One place that decides how money looks, so every screen matches.

// en-IN gives Indian grouping: 1,23,456 (not 123,456)
export function formatINR(amount: number): string {
  return `₹${amount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}
