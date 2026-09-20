export type PaymentMethod = "CASH" | "UPI" | "CREDIT";

export const todaySummary = {
  billCount: 23,
  totalBilled: 18450,
  cash: 9200,
  upi: 5250,
  credit: 4000,
};

export const recentBills = [
  {
    id: "BA-000123",
    customer: "Sri Lakshmi Stores",
    amount: 1200,
    method: "CASH" as PaymentMethod,
    time: "10:42 AM",
  },
  {
    id: "BA-000122",
    customer: "Kumar Tea Shop",
    amount: 480,
    method: "UPI" as PaymentMethod,
    time: "10:15 AM",
  },
  {
    id: "BA-000121",
    customer: "Anand Apartments",
    amount: 2400,
    method: "CREDIT" as PaymentMethod,
    time: "9:50 AM",
  },
  {
    id: "BA-000120",
    customer: "Murugan Hotel",
    amount: 960,
    method: "CASH" as PaymentMethod,
    time: "9:20 AM",
  },
];
