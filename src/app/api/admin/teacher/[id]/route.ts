import { NextResponse } from "next/server";
import { cookies } from "next/headers";

async function isAdmin() {
  const cookieStore = await cookies();
  const encoded = cookieStore.get("campus_user")?.value;
  if (!encoded) return null;

  try {
    const data = JSON.parse(Buffer.from(encoded, "base64").toString());
    return data.role?.toLowerCase() === "admin" ? data : null;
  } catch {
    return null;
  }
}

// GET — Récupérer un enseignant
export async function GET(req: Request, ctx: { params: { id: string } }) {
  const admin = await isAdmin();
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const { id } = ctx.params;

  const res = await fetch(`http://localhost:9090/api/v1/teacher/${id}`);
  const data = await res.json();

  if (!res.ok)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ teacher: data });
}

// PATCH — Modifier un enseignant
export async function PATCH(req: Request, ctx: { params: { id: string } }) {
  const admin = await isAdmin();
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const { id } = ctx.params;
  const body = await req.json();

  // 🔥 Payload EXACT du backend Spring
  const payload = {
    userId: id,                     // OBLIGATOIRE pour Spring
    name: body.name,
    lastName: body.lastName,
    email: body.email,
    phone: body.phone,
    speciality: body.speciality,
    department: body.department,
    isActive: body.isActive ?? true,
  };

  const res = await fetch(`http://localhost:9090/api/v1/teacher`, {
    method: "PUT",                  // ✔ PUT sans /id selon Swagger
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok)
    return NextResponse.json({ error: data.message }, { status: res.status });

  return NextResponse.json({ message: "Modifié", teacher: data });
}

// DELETE — Supprimer un enseignant
export async function DELETE(req: Request, ctx: { params: { id: string } }) {
  const admin = await isAdmin();
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const { id } = ctx.params;

  const res = await fetch(`http://localhost:9090/api/v1/teacher/${id}`, {
    method: "DELETE",
  });

  if (!res.ok)
    return NextResponse.json({ error: "Erreur suppression" }, { status: res.status });

  return NextResponse.json({ message: "Enseignant supprimé" });
}
 