// src/mocks/products.ts
// FAKE data until the backend Products module exists.
export type Product = {
  id: string;
  name: string;
  unit: string; // "can", "box"
  price: number; // default price in rupees
  stock: number; // units on the delivery vehicle (per-vehicle stock, Option B)
  isJar: boolean; // true = a returnable jar goes with it (WATER_PLANT)
};

export const products: Product[] = [
  {
    id: "p1",
    name: "20L Water Can",
    unit: "can",
    price: 35,
    stock: 48,
    isJar: true,
  },
  {
    id: "p2",
    name: "10L Water Can",
    unit: "can",
    price: 20,
    stock: 30,
    isJar: true,
  },
  {
    id: "p3",
    name: "1L Bottle Box (12)",
    unit: "box",
    price: 120,
    stock: 20,
    isJar: false,
  },
  {
    id: "p4",
    name: "500ml Bottle Box (24)",
    unit: "box",
    price: 180,
    stock: 14,
    isJar: false,
  },
  {
    id: "p5",
    name: "250ml Cup Box (48)",
    unit: "box",
    price: 160,
    stock: 3,
    isJar: false,
  },
];

// Negotiated rates: customerId -> productId -> price.
// Later this becomes the CustomerProductPrice table on the server.
const customerPrices: Record<string, Record<string, number>> = {
  c1: { p1: 30 },
  c3: { p1: 28, p2: 18 },
  c8: { p1: 30 },
};

// The customer's own price if they have one, otherwise the default price
export function priceFor(customerId: string, product: Product): number {
  return customerPrices[customerId]?.[product.id] ?? product.price;
}
