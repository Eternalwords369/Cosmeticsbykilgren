import { sv } from "@/lib/copy/sv";

export async function CopyrightYear() {
  "use cache";
  return <>{sv.footer.copyright(new Date().getFullYear())}</>;
}
