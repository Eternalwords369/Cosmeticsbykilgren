/** All amounts are stored as integer öre. Never use floats for money. */

export function kronorToOre(kronor: number): number {
  return Math.round(kronor * 100);
}

export function oreToKronor(ore: number): number {
  return ore / 100;
}

const wholeKronor = new Intl.NumberFormat("sv-SE", {
  style: "currency",
  currency: "SEK",
  maximumFractionDigits: 0,
});

const withOre = new Intl.NumberFormat("sv-SE", {
  style: "currency",
  currency: "SEK",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** 12900 → "129 kr", 12950 → "129,50 kr" */
export function formatSek(ore: number): string {
  const formatter = ore % 100 === 0 ? wholeKronor : withOre;
  return formatter.format(oreToKronor(ore)).replace(/[\u00a0\u202f]/g, " ");
}

/** VAT included in a VAT-inclusive price, rounded to whole öre. */
export function vatFromInclusive(priceOre: number, vatRatePercent: number): number {
  return Math.round(priceOre - priceOre / (1 + vatRatePercent / 100));
}
