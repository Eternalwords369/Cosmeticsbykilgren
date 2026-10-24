import { sv } from "@/lib/copy/sv";
import { stockStatus } from "@/lib/stock";
import { cn } from "@/lib/utils";

/** Plain-text stock signal. Only sold-out and low stock are shown unless `showInStock`. */
export function StockStatus({
  stock,
  showInStock = false,
  className,
}: {
  stock: number;
  showInStock?: boolean;
  className?: string;
}) {
  const status = stockStatus(stock);
  if (status === "sold-out") {
    return (
      <span className={cn("font-medium text-destructive", className)}>{sv.product.soldOut}</span>
    );
  }
  if (status === "low") {
    return <span className={cn("font-medium", className)}>{sv.product.lowStock}</span>;
  }
  if (showInStock) {
    return <span className={cn("text-muted-foreground", className)}>{sv.product.inStock}</span>;
  }
  return null;
}
