import { NextResponse, type NextRequest } from "next/server";

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*"
  ],
};

export function middleware(request: NextRequest) {
  const token = request.cookies.get("sb-access-token")?.value;

  const isAdminPage = request.nextUrl.pathname.startsWith("/admin") &&
                      request.nextUrl.pathname !== "/admin/login";

  const isAdminApi = request.nextUrl.pathname.startsWith("/api/admin");

  if ((isAdminPage || isAdminApi) && !token) {
    if (isAdminApi) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (request.nextUrl.pathname === "/admin/login" && token) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}
