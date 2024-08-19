export { default } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  if (
    token &&
    (url.pathname.startsWith("/signup") ||
      url.pathname.startsWith("/login") ||
      url.pathname.startsWith("/verify") ||
      url.pathname.startsWith("/"))
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!token && url.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/sign-up", request.url));
  }

  return NextResponse.next();
}

// Those are path where middileware should be work
export const config = {
  matcher: ["/sign-up", "/sign-in", "/", "/dashboard/:path*", "/verify/:path*"],
};
