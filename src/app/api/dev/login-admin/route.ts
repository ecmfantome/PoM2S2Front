import { NextResponse } from "next/server";

export async function GET() {
  const admin = {
    id: "u-admin-default",
    name: "Super Admin",
    email: "admin@campusmaster.test",
    role: "admin",
  };

  const encoded = Buffer.from(JSON.stringify(admin)).toString("base64");

  const response = NextResponse.json({
    message: "Connecté comme ADMIN (DEV MODE). Cookies enregistrés."
  });

  // 🔥 Ces options SONT OBLIGATOIRES pour que Chrome/Next accepte les cookies
  response.cookies.set("campus_user", encoded, {
    httpOnly: false,
    sameSite: "lax",
    secure: false,
    path: "/",
    maxAge: 60 * 60,
  });

  response.cookies.set("campus_token", "dev-admin-token", {
    httpOnly: false,
    sameSite: "lax",
    secure: false,
    path: "/",
    maxAge: 60 * 60,
  });

  return response;
}
