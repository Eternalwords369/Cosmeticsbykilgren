"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { sv } from "@/lib/copy/sv";
import { shopHref, sortOptions, type ShopFilters } from "@/lib/schemas/catalog";

const ALL = "alla";

type Props = {
  filters: ShopFilters;
  producers: { slug: string; name: string }[];
};

export function ShopSortFilter({ filters, producers }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function navigate(next: Partial<ShopFilters>) {
    startTransition(() => {
      router.push(shopHref({ ...filters, ...next }), { scroll: false });
    });
  }

  return (
    <div className="flex flex-wrap gap-4" aria-busy={pending}>
      <div className="flex min-w-48 flex-1 flex-col gap-1.5 sm:flex-none">
        <Label htmlFor="producer-filter">{sv.shop.producerLabel}</Label>
        <Select
          value={filters.producent ?? ALL}
          onValueChange={(value) => navigate({ producent: value === ALL ? undefined : value })}
        >
          <SelectTrigger id="producer-filter" className="w-full sm:w-56">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>{sv.shop.allProducers}</SelectItem>
            {producers.map((producer) => (
              <SelectItem key={producer.slug} value={producer.slug}>
                {producer.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex min-w-48 flex-1 flex-col gap-1.5 sm:flex-none">
        <Label htmlFor="sort-filter">{sv.shop.sortLabel}</Label>
        <Select
          value={filters.sortera}
          onValueChange={(value) => navigate({ sortera: value as ShopFilters["sortera"] })}
        >
          <SelectTrigger id="sort-filter" className="w-full sm:w-52">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {sv.shop.sort[option]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
