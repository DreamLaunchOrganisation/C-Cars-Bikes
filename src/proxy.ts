import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/admin/session-token";

/**
 * Renvoie vers la page de connexion toute visite de /admin sans session valide.
 * Simple confort de navigation : chaque Server Action / Route Handler de l'admin
 * revérifie la session elle-même (requireAdmin).
 */
export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/admin/login") return NextResponse.next();

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!verifySessionToken(token, process.env.SESSION_SECRET ?? "", Date.now())) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
