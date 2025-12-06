// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { findUserByEmail } from "../../../lib/fakeDB";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password } = body;

  const user = findUserByEmail(email);
  if (!user || user.password !== password) {
    return NextResponse.json({ error: "Email ou mot de passe invalide" }, { status: 401 });
  }

  const token = `fake-token-${user.id}-${Date.now()}`;

  const publicUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    formation: user.formation,
  };

  const res = NextResponse.json({ token, user: publicUser });

  // Démo : cookies non httpOnly (plus simple pour la démo/middleware). En prod, mettre httpOnly:true et JWT signé.
  res.cookies.set("campus_token", token, { httpOnly: false, maxAge: 60 * 60, path: "/" });

  const encodedUser = Buffer.from(JSON.stringify(publicUser)).toString("base64");
  res.cookies.set("campus_user", encodedUser, { httpOnly: false, maxAge: 60 * 60, path: "/" });

  return res;
}
