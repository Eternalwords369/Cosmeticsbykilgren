"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { sv } from "@/lib/copy/sv";

export function SignOutButton() {
  return (
    <Button variant="outline" onClick={() => signOut({ callbackUrl: "/admin/login" })}>
      {sv.admin.signOut}
    </Button>
  );
}
