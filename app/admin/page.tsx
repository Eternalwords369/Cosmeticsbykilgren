import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { LeadList } from "@/components/admin/lead-list";
import { SignOutButton } from "@/components/admin/sign-out-button";
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
        {sv.admin.roleLabel}:{" "}
        <span className="text-foreground">{sv.admin.roles[session.user.role]}</span>
      </p>
      <p className="text-muted-foreground">{sv.admin.dashboardSoon}</p>
      <SignOutButton />
      {session.user.role === "ADMIN" ? <LeadList /> : null}
    </div>
  );
}
