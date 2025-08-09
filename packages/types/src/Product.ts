export interface Product {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: "income" | "expense";
}
