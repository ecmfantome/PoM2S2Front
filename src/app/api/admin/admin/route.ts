import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// Vérifier admin via cookie
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

// GET — liste admins
export async function GET() {
  const admin = await isAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const res = await fetch("http://localhost:9090/api/v1/admin");
  const data = await res.json();

 return NextResponse.json({
  admins: Array.isArray(data)
    ? data
    : Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data?.content)
    ? data.content
    : [],
});

}

// POST — créer admin
export async function POST(req: Request) {
  const admin = await isAdmin();
  if (!admin) 
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const body = await req.json();

  const payload = {
    name: body.name,
    lastName: body.lastName,
    email: body.email,
    phone: body.phone,
    isActive: true,
    post: "admin",
  };

  const res = await fetch("http://localhost:9090/api/v1/admin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const raw = await res.text(); // <-- PREND LE TEXTE DU BACKEND

  if (!res.ok)
    return NextResponse.json({ error: raw }, { status: res.status });

  return NextResponse.json({
    message: "Admin créé",
    adminId: raw, // <-- ID généré par Spring
  });
}

