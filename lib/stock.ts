export const LOW_STOCK_THRESHOLD = 5;

export type StockStatus = "sold-out" | "low" | "in-stock";

export function stockStatus(stock: number): StockStatus {
  if (stock <= 0) return "sold-out";
  if (stock <= LOW_STOCK_THRESHOLD) return "low";
  return "in-stock";
}
