import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  const isPublicPath = ["/", "/signin", "/register"].includes(pathname);
  const isAdminPath = pathname.startsWith("/admin");
  const isFeedback = pathname.startsWith("/admin/feedbackCustomer");
  const isTherapist = pathname.startsWith("/admin/therapist");
  const isUsers = pathname.startsWith("/admin/user");
  const isPersonalityTest = pathname.startsWith("/personalityTest");

  // Not logged in
  if (!token) {
    if (!isPublicPath) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  const role = token.role;

  // Role USER hanya boleh ke /personalityTest
  if (role === "USER" && !isPersonalityTest && !isPublicPath) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Role ADMIN: hanya bisa ke /admin/feedbackCustomer, /admin/therapist, /admin/users
  if (
    role === "ADMIN" &&
    isAdminPath &&
    !isFeedback &&
    !isTherapist &&
    !isUsers
  ) {
    return NextResponse.redirect(new URL("/admin/feedbackCustomer", req.url));
  }

  // Role ADMIN tidak boleh akses /signin, /register, atau /personalityTest
  if (
    role === "ADMIN" &&
    (pathname === "/signin" || pathname === "/register" || isPersonalityTest)
  ) {
    return NextResponse.redirect(new URL("/admin/feedbackCustomer", req.url));
  }

  // Role SUPERADMIN tidak boleh akses /signin, /register, atau /personalityTest
  if (
    role === "SUPERADMIN" &&
    (pathname === "/signin" || pathname === "/register" || isPersonalityTest)
  ) {
    return NextResponse.redirect(new URL("/admin/feedbackCustomer", req.url));
  }

  // SUPERADMIN bisa ke mana saja (tidak perlu pembatasan di middleware)

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/personalityTest/:path*", "/signin", "/register"],
};
