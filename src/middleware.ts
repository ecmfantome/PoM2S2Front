import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// routes par rôle
const roleRoutes = {
  admin: "/dashboard/admin",
  teacher: "/dashboard/teacher",
  student: "/dashboard/student",
};

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const path = req.nextUrl.pathname;

  // Laisse passer si ce n’est PAS une route dashboard
  if (!path.startsWith("/dashboard")) return NextResponse.next();

  // Vérifier cookie
  const encodedUser = req.cookies.get("campus_user")?.value;

  if (!encodedUser) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Décoder utilisateur
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let user: any;
  try {
    user = JSON.parse(Buffer.from(encodedUser, "base64").toString());
  } catch {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // 🟩 NORMALISATION DU RÔLE (OBLIGATOIRE)
  user.role = user.role?.toLowerCase();

  const role = user.role;

  // Vérifier si la route correspond au rôle
  if (
    (path.startsWith("/dashboard/admin") && role !== "admin") ||
    (path.startsWith("/dashboard/teacher") && role !== "teacher") ||
    (path.startsWith("/dashboard/student") && role !== "student")
  ) {
    url.pathname = "/dashboard/forbidden";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
