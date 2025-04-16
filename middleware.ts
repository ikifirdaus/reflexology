import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const { pathname } = req.nextUrl;

  // Jika user belum login, hanya boleh akses halaman "/", "/signin", dan "/register"
  if (!token) {
    if (!["/", "/signin", "/register"].includes(pathname)) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  // Jika user login tapi bukan admin, cegah akses ke "/admin/dashboard"
  if (
    (pathname.startsWith("/admin/dashboard") ||
      pathname.startsWith("/admin/feedbackCustomer") ||
      pathname.startsWith("/admin/therapist") ||
      pathname.startsWith("/admin/customer") ||
      pathname.startsWith("/admin/treatment") ||
      pathname.startsWith("/admin/article") ||
      pathname.startsWith("/admin/setting") ||
      pathname.startsWith("/admin/users") ||
      pathname.startsWith("/admin/blog")) &&
    token.role !== "ADMIN"
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Blokir akses ke /personalityTest jika bukan USER
  if (pathname.startsWith("/personalityTest") && token.role !== "USER") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Jika role ADMIN, cegah akses ke /signin, /register, dan /personalityTest
  if (
    (pathname.startsWith("/signin") ||
      pathname.startsWith("/register") ||
      pathname.startsWith("/personalityTest")) &&
    token.role === "ADMIN"
  ) {
    return NextResponse.redirect(new URL("/admin/feedbackCustomer", req.url));
  }

  return NextResponse.next();
}

// Terapkan middleware hanya untuk route yang perlu dicegah
export const config = {
  matcher: ["/admin/:path*", "/personalityTest/:path*", "/signin", "/register"],
};
