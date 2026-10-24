import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/login-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { sv } from "@/lib/copy/sv";

export const metadata: Metadata = { title: sv.admin.loginTitle, robots: { index: false } };

export default function AdminLoginPage() {
  return (
    <section className="mx-auto w-full max-w-sm px-4 py-16">
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-2xl">{sv.admin.loginTitle}</CardTitle>
          <CardDescription>{sv.admin.loginText}</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </section>
  );
}
