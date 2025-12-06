import { NextResponse } from "next/server";
import { getUsers } from "../../../lib/fakeDB";
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

export async function GET() {
  const admin = await isAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Vous n’êtes pas autorisé." }, { status: 403 });
  }

  const users = getUsers().map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    formation: u.formation || null,
  }));

  return NextResponse.json({ users });
}
