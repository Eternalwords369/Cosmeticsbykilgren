import { describe, expect, it } from "vitest";
import { formatSek, kronorToOre, oreToKronor, vatFromInclusive } from "@/lib/money";

describe("money", () => {
  it("converts between kronor and öre without float drift", () => {
    expect(kronorToOre(129.9)).toBe(12990);
    expect(kronorToOre(0.1 + 0.2)).toBe(30);
    expect(oreToKronor(39500)).toBe(395);
  });

  it("formats SEK the Swedish way", () => {
    expect(formatSek(12900)).toBe("129 kr");
    expect(formatSek(12950)).toBe("129,50 kr");
    expect(formatSek(150000)).toBe("1 500 kr");
  });

  it("extracts VAT from VAT-inclusive prices", () => {
    expect(vatFromInclusive(11200, 12)).toBe(1200);
    expect(vatFromInclusive(12500, 25)).toBe(2500);
    expect(vatFromInclusive(8900, 12)).toBe(954);
  });
});
