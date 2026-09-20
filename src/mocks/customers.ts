// src/mocks/customers.ts
// FAKE data until the backend Customers module exists. The shape below is what
// the API will return, so the screen barely changes when we connect it.
export type Customer = {
  id: string;
  name: string;
  phone: string; // 10 digits, stored without spaces
  area: string;
  outstanding: number; // rupees this customer owes (computed by the server later)
  jarsHeld: number; // jars currently with the customer (WATER_PLANT only)
};

export const customers: Customer[] = [
  {
    id: "c1",
    name: "Sri Lakshmi Stores",
    phone: "9876543201",
    area: "Gandhi Nagar",
    outstanding: 1200,
    jarsHeld: 6,
  },
  {
    id: "c2",
    name: "Kumar Tea Shop",
    phone: "9876543202",
    area: "Market Road",
    outstanding: 0,
    jarsHeld: 2,
  },
  {
    id: "c3",
    name: "Anand Apartments",
    phone: "9876543203",
    area: "Lake View",
    outstanding: 7400,
    jarsHeld: 24,
  },
  {
    id: "c4",
    name: "Murugan Hotel",
    phone: "9876543204",
    area: "Railway Colony",
    outstanding: 960,
    jarsHeld: 8,
  },
  {
    id: "c5",
    name: "Priya Medicals",
    phone: "9876543205",
    area: "Temple Street",
    outstanding: 0,
    jarsHeld: 0,
  },
  {
    id: "c6",
    name: "Selvam Bakery",
    phone: "9876543206",
    area: "Market Road",
    outstanding: 2350,
    jarsHeld: 4,
  },
  {
    id: "c7",
    name: "Ganesh Tiffin Centre",
    phone: "9876543207",
    area: "Gandhi Nagar",
    outstanding: 0,
    jarsHeld: 3,
  },
  {
    id: "c8",
    name: "Meena Ladies Hostel",
    phone: "9876543208",
    area: "Lake View",
    outstanding: 5100,
    jarsHeld: 15,
  },
  {
    id: "c9",
    name: "Ravi Electricals",
    phone: "9876543209",
    area: "Railway Colony",
    outstanding: 300,
    jarsHeld: 1,
  },
  {
    id: "c10",
    name: "Sathya Coaching Centre",
    phone: "9876543210",
    area: "Temple Street",
    outstanding: 0,
    jarsHeld: 5,
  },
  {
    id: "c11",
    name: "Bharath Mess",
    phone: "9876543211",
    area: "Market Road",
    outstanding: 1800,
    jarsHeld: 10,
  },
  {
    id: "c12",
    name: "Lakshmi Textiles",
    phone: "9876543212",
    area: "Gandhi Nagar",
    outstanding: 0,
    jarsHeld: 0,
  },
];
