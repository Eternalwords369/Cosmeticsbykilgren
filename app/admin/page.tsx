import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { SignOutButton } from "@/components/admin/sign-out-button";
import { Badge } from "@/components/ui/badge";
import { getAdminSession } from "@/lib/auth";
import { sv } from "@/lib/copy/sv";

export const metadata: Metadata = { title: sv.admin.dashboardTitle, robots: { index: false } };

export default function AdminPage() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-12">
      <h1 className="font-heading text-3xl font-semibold">{sv.admin.dashboardTitle}</h1>
      <Suspense fallback={<p className="mt-6 text-muted-foreground">{sv.admin.loading}</p>}>
        <AdminDashboard />
      </Suspense>
    </section>
  );
}

async function AdminDashboard() {
  const session = await getAdminSession();
  if (!session?.user) redirect("/admin/login");

  return (
    <div className="mt-6 space-y-4">
      <p className="text-lg">{sv.admin.welcome(session.user.name ?? session.user.email ?? "")}</p>
      <p className="text-sm text-muted-foreground">
        {sv.admin.roleLabel}: <Badge variant="secondary">{sv.admin.roles[session.user.role]}</Badge>
      </p>
      <p className="text-muted-foreground">{sv.admin.dashboardSoon}</p>
      <SignOutButton />
    </div>
  );
}
