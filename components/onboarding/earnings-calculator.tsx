"use client";

import { useId, useState } from "react";
import { monthlyCostOre } from "@/lib/engine/plan-advisor";
import { PRICING_PLANS } from "@/lib/engine/plans";
import { sv } from "@/lib/copy/sv";
import { formatSek, kronorToOre } from "@/lib/money";

const copy = sv.sell.calculator;
const MAX_KR = 50_000;
const STEP_KR = 500;

export function EarningsCalculator({ initialKr = 5000 }: { initialKr?: number }) {
  const id = useId();
  const [kr, setKr] = useState(initialKr);
  const gross = kronorToOre(kr);

  const commissionFee = monthlyCostOre(gross, PRICING_PLANS.COMMISSION);
  const memberFee = monthlyCostOre(gross, PRICING_PLANS.MEMBER);
  const memberSaving = commissionFee - memberFee;

  return (
    <div className="rounded-xl border bg-card p-6">
      <h2 className="font-heading text-xl font-semibold">{copy.title}</h2>
      <label htmlFor={id} className="mt-4 block text-sm text-muted-foreground">
        {copy.label}
      </label>
      <output htmlFor={id} className="mt-1 block font-heading text-3xl font-semibold tabular-nums">
        {formatSek(gross)}
      </output>
      <input
        id={id}
        type="range"
        min={0}
        max={MAX_KR}
        step={STEP_KR}
        value={kr}
        onChange={(event) => setKr(Number(event.target.value))}
        className="mt-3 w-full accent-primary"
      />

      <dl className="mt-6 grid grid-cols-2 gap-4 border-t pt-4">
        <div>
          <dt className="text-sm text-muted-foreground">{copy.keepLabel}</dt>
          <dd className="mt-1 text-2xl font-semibold tabular-nums">
            {formatSek(gross - commissionFee)}
          </dd>
        </div>
        <div>
          <dt className="text-sm text-muted-foreground">{copy.feeLabel}</dt>
          <dd className="mt-1 text-2xl font-semibold tabular-nums">{formatSek(commissionFee)}</dd>
        </div>
      </dl>

      <p className="mt-4 text-sm" aria-live="polite">
        {memberSaving > 0 ? copy.memberCheaper(formatSek(memberSaving)) : copy.zeroNote}
      </p>
      <p className="mt-2 text-xs text-muted-foreground">{copy.vatNote}</p>
    </div>
  );
}
