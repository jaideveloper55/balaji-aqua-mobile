// src/stores/billDraft.ts
// The bill being built right now. A Zustand store is shared state that any
// screen can read: the bill screen writes it, the payment screen reads it.
import { create } from "zustand";

type BillDraftState = {
  customerId: string | null;
  quantities: Record<string, number>; // only products with qty > 0 are stored
  jarsGivenOverride: number | null; // null = automatic
  jarsReturned: number;

  start: (customerId: string) => void;
  setQuantity: (productId: string, qty: number) => void;
  setJarsGiven: (n: number) => void;
  setJarsReturned: (n: number) => void;
  clear: () => void;
};

export const useBillDraft = create<BillDraftState>()((set, get) => ({
  customerId: null,
  quantities: {},
  jarsGivenOverride: null,
  jarsReturned: 0,

  // Opening a bill for a DIFFERENT customer always begins with a blank draft
  start: (customerId) => {
    if (get().customerId !== customerId) {
      set({
        customerId,
        quantities: {},
        jarsGivenOverride: null,
        jarsReturned: 0,
      });
    }
  },

  setQuantity: (productId, qty) =>
    set((state) => {
      const next = { ...state.quantities };
      if (qty <= 0) delete next[productId];
      else next[productId] = qty;
      return { quantities: next };
    }),

  setJarsGiven: (n) => set({ jarsGivenOverride: n }),
  setJarsReturned: (n) => set({ jarsReturned: n }),

  clear: () =>
    set({
      customerId: null,
      quantities: {},
      jarsGivenOverride: null,
      jarsReturned: 0,
    }),
}));

// Reads the LIVE store, not a value captured by a render. The "discard bill?"
// check needs the current truth even if we just called clear().
export function isDraftEmpty(): boolean {
  const s = useBillDraft.getState();
  return (
    Object.keys(s.quantities).length === 0 &&
    s.jarsReturned === 0 &&
    s.jarsGivenOverride === null
  );
}
