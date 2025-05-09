// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: "ADMIN" | "USER" | "SUPERADMIN"; // Tambahkan role di sini
      branchId: number;
    };
  }

  interface User {
    id: string;
    name: string;
    email: string;
    role: "ADMIN" | "USER" | "SUPERADMIN";
    branchId: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "ADMIN" | "USER" | "SUPERADMIN";
    branchId: number;
  }
}
