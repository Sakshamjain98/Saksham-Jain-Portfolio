import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const ADMIN_ROLES = new Set(["admin", "editor"]);

export default withAuth(
  function middleware(req) {
    // Let the login page through, regardless of token state.
    if (req.nextUrl.pathname.startsWith("/admin/login")) {
      return NextResponse.next();
    }

    const role = (req.nextauth.token?.role as string | undefined) ?? "viewer";
    if (!ADMIN_ROLES.has(role)) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("forbidden", "1");
      url.searchParams.set("callbackUrl", req.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  },
  {
    pages: { signIn: "/admin/login" },
    callbacks: {
      // `authorized` runs first. If the request is /admin/login, allow through;
      // for any other admin path, require a token.
      authorized: ({ token, req }) => {
        if (req.nextUrl.pathname.startsWith("/admin/login")) return true;
        return Boolean(token);
      },
    },
  },
);

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
