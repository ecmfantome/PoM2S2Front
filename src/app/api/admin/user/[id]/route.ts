import { NextResponse } from "next/server";
import { findUserById, updateUser } from "../../../../lib/fakeDB";
import { cookies } from "next/headers";

// Vérifie si admin
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

// =======================
//       GET USER
// =======================
export async function GET(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params; // 🔥 OBLIGATOIRE sous Next 16

  const admin = await isAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const user = findUserById(id);
  if (!user) {
    return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
  }

  return NextResponse.json({ user });
}

// =======================
//      PATCH USER
// =======================
export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params; // 🔥 FIX obligatoire

  const body = await req.json();
  const { name, email, password, role, formation } = body;

  if (!name || !email || !role) {
    return NextResponse.json({ message: "Champs requis manquants" }, { status: 400 });
  }

  const updated = updateUser(id, {
    name,
    email,
    password: password || undefined,
    role,
    formation: role === "student" ? formation : undefined,
  });

  return NextResponse.json({
    message: "Utilisateur mis à jour",
    user: updated,
  });
}
