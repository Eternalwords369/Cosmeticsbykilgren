import { Badge } from "@/components/ui/badge";
import { sv } from "@/lib/copy/sv";
import { stockStatus } from "@/lib/stock";

export function StockBadge({
  stock,
  showInStock = false,
}: {
  stock: number;
  showInStock?: boolean;
}) {
  const status = stockStatus(stock);
  if (status === "sold-out") return <Badge variant="destructive">{sv.product.soldOut}</Badge>;
  if (status === "low") return <Badge variant="secondary">{sv.product.lowStock}</Badge>;
  if (showInStock) return <Badge variant="outline">{sv.product.inStock}</Badge>;
  return null;
}
