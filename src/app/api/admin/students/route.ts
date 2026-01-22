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

export async function GET() {
  const admin = await isAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const res = await fetch("http://localhost:9090/api/v1/student");
  const data = await res.json();

  return NextResponse.json({
    students: Array.isArray(data)
      ? data
      : Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data?.content)
      ? data.content
      : [],
  });
}

export async function POST(req: Request) {
  const admin = await isAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const body = await req.json();

  const payload = {
    name: body.name,
    lastName: body.lastName,
    email: body.email,
    phone: body.phone,
    isActive: true,
    backToSchoolYear: body.backToSchoolYear,
  };

  const res = await fetch("http://localhost:9090/api/v1/student", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const raw = await res.text();

  if (!res.ok)
    return NextResponse.json({ error: raw }, { status: res.status });

  return NextResponse.json({
    message: "Étudiant créé",
    id: raw,
  });
}
