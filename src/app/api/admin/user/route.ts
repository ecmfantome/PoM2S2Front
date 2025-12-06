import { NextResponse } from "next/server";
import { findUserById } from "../../../lib/fakeDB";
import { cookies } from "next/headers";

async function isAdmin() {
  const cookieStore = await cookies();
  const encoded = cookieStore.get("campus_user")?.value;

  if (!encoded) return null;

  try {
    const decoded = JSON.parse(Buffer.from(encoded, "base64").toString());
    return decoded.role === "admin" ? decoded : null;
  } catch {
    return null;
  }
}

export async function GET(req: Request, context: { params: { id: string } }) {
  const admin = await isAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  }

  const userId = context.params.id;
  const user = findUserById(userId);

  if (!user) {
    return NextResponse.json(
      { error: "Utilisateur introuvable" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      formation: user.formation ?? null,
    },
  });
}
