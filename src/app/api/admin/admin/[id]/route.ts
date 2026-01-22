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

// GET — un admin
export async function GET(req: Request, ctx: { params: { id: string } }) {
  const { id } = ctx.params;

  const res = await fetch(`http://localhost:9090/api/v1/admin/${id}`);
  const data = await res.json();

  if (!res.ok)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ admin: data });
}

// PATCH — update admin
export async function PATCH(req: Request, ctx: { params: { id: string } }) {
  const { id } = ctx.params;
  const body = await req.json();

  const payload = {
    userId: id,                 // 🔥 obligatoire pour PUT backend
    name: body.name,
    lastName: body.lastName,
    email: body.email,
    phone: body.phone,
    isActive: body.isActive ?? true,
    post: "admin",
  };

  const res = await fetch("http://localhost:9090/api/v1/admin", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok)
    return NextResponse.json({ error: data.message }, { status: res.status });

  return NextResponse.json({ message: "Admin modifié", admin: data });
}

// DELETE — supprimer
export async function DELETE(req: Request, ctx: { params: { id: string } }) {
  const { id } = ctx.params;

  const res = await fetch(`http://localhost:9090/api/v1/admin/${id}`, {
    method: "DELETE",
  });

  if (!res.ok)
    return NextResponse.json({ error: "Erreur suppression" });

  return NextResponse.json({ message: "Admin supprimé" });
}
