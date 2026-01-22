import { NextResponse } from "next/server";
import { cookies } from "next/headers";

async function isAdmin() {
  const cookieStore = await cookies();
  const encoded = cookieStore.get("campus_user")?.value;
  if (!encoded) return null;
  try {
    const d = JSON.parse(Buffer.from(encoded, "base64").toString());
    return d.role?.toLowerCase() === "admin" ? d : null;
  } catch {
    return null;
  }
}

export async function GET(req: Request, ctx: { params: { id: string } }) {
  const { id } = ctx.params;

  const admin = await isAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const res = await fetch(`http://localhost:9090/api/v1/student/${id}`);
  const data = await res.json();

  if (!res.ok)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ student: data });
}

export async function PATCH(req: Request, ctx: { params: { id: string } }) {
  const { id } = ctx.params;

  const body = await req.json();

  const payload = {
    matricule: body.matricule,
    anneeEntre: body.anneeEntre,
    name: body.name,
    lastName: body.lastName,
    email: body.email,
    phone: body.phone,
    isActive: body.isActive ?? true,
  };

  const res = await fetch(`http://localhost:9090/api/v1/student/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok)
    return NextResponse.json({ error: data.message }, { status: res.status });

  return NextResponse.json({ message: "Étudiant modifié", student: data });
}

export async function DELETE(req: Request, ctx: { params: { id: string } }) {
  const { id } = ctx.params;

  const res = await fetch(`http://localhost:9090/api/v1/student/${id}`, {
    method: "DELETE",
  });

  if (!res.ok)
    return NextResponse.json({ error: "Erreur suppression" });

  return NextResponse.json({ message: "Étudiant supprimé" });
}
