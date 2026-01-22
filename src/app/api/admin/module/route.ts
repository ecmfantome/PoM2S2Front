// app/api/admin/module/route.ts
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
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const res = await fetch("http://localhost:9090/api/v1/module");
  const data = await res.json();

  return NextResponse.json({
    modules: Array.isArray(data) ? data : [],
  });
}

export async function POST(req: Request) {
  const admin = await isAdmin();
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const body = await req.json();

  const payload = {
    name: body.name,
    semester: body.semester,
    code: body.code,
    responsibleId: body.responsibleId,
    adminId: admin.id,
  };

  const res = await fetch("http://localhost:9090/api/v1/module", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok)
    return NextResponse.json({ error: data }, { status: res.status });

  return NextResponse.json({
    message: "Module créé",
    module: data,
  });
}
