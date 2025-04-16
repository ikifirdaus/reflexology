// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: "ADMIN" | "USER"; // Tambahkan role di sini
    };
  }

  interface User {
    id: string;
    name: string;
    email: string;
    role: "ADMIN" | "USER";
  }
}
