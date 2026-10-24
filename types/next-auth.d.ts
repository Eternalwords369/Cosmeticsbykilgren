import type { DefaultSession } from "next-auth";
import type { AdminRole } from "@/lib/generated/prisma/enums";

declare module "next-auth" {
  interface User {
    role: AdminRole;
    producerId: string | null;
  }
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: AdminRole;
      producerId: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: AdminRole;
    producerId: string | null;
  }
}
