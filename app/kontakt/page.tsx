import type { Metadata } from "next";
import { ComingSoon } from "@/components/layout/coming-soon";
import { sv } from "@/lib/copy/sv";

export const metadata: Metadata = { title: sv.footer.contact };

export default function Page() {
  return <ComingSoon title={sv.footer.contact} />;
}
