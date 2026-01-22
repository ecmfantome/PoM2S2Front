import { NextResponse } from "next/server";
import { findUserById, deleteUser, updateUser } from "../../../../lib/fakeDB";
import { cookies } from "next/headers";

// Vérifier admin
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

// GET → Lire un user
export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const admin = await isAdmin();
  if (!admin) return NextResponse.json({ error: "Accès refusé" }, { status: 403 });

  const user = findUserById(id);
  if (!user) return NextResponse.json({ error: "User introuvable" }, { status: 404 });

  return NextResponse.json({ user });
}

// PATCH → Modifier
export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const body = await req.json();

  const updated = updateUser(id, {
    name: body.name,
    email: body.email,
    password: body.password || undefined,
    role: body.role,
    formation: body.role === "student" ? body.formation : undefined,
  });

  return NextResponse.json({ message: "Modifié", user: updated });
}

// DELETE → Supprimer
export async function DELETE(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;

  try {
    const deleted = deleteUser(id);
    return NextResponse.json({ deleted });
  } catch {
    return NextResponse.json({ error: "User introuvable" }, { status: 404 });
  }
}
