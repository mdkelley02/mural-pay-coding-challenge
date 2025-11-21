import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    if (
      req.nextUrl.pathname.startsWith("/dashboard") &&
      req.nextauth.token?.role !== "ADMIN"
    ) {
      return NextResponse.rewrite(new URL("/", req.url));
    }
  },
  {
    pages: {
      signIn: "/auth/sign-in",
    },
  }
);

export const config = {
  matcher: [
    "/((?!api/webhook|api/auth|auth/sign-in|_next/static|_next/image|favicon.ico).*)",
  ],
};
