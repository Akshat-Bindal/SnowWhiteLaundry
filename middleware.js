import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("token")?.value; // ✅ token stored in cookies

  const { pathname } = req.nextUrl;

  // Define protected routes (anything inside /app/(admin))
  if (pathname.startsWith("/(admin)")) {
    if (!token) {
      return NextResponse.redirect(new URL("/(auth)/auth-1/sign-in", req.url));
    }
  }

  // Redirect logged-in users away from sign-in page
  if (pathname.startsWith("/(auth)/auth-1/sign-in") && token) {
    return NextResponse.redirect(new URL("/(admin)/(apps)/(dashboards)/dashboard", req.url));
  }

  return NextResponse.next();
}

// Tell Next.js which paths to apply this middleware on
export const config = {
  matcher: ["/(admin)/(.*)", "/(auth)/auth-1/sign-in"],
};
