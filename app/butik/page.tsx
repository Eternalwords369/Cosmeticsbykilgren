import type { Metadata } from "next";
import { ComingSoon } from "@/components/layout/coming-soon";
import { sv } from "@/lib/copy/sv";

export const metadata: Metadata = { title: sv.nav.shop };

export default function Page() {
  return <ComingSoon title={sv.nav.shop} />;
}
