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

  const res = await fetch("http://localhost:9090/api/v1/teacher");
  const raw = await res.text();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let data: any;
  try {
    data = JSON.parse(raw);
  } catch {
    data = [];
  }

  const teachers =
    Array.isArray(data)
      ? data
      : Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data?.content)
      ? data.content
      : [];

  return NextResponse.json({ teachers });
}


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
    speciality: body.speciality,
    department: body.department,
    isActive: true,
  };

  const res = await fetch("http://localhost:9090/api/v1/teacher", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const raw = await res.text();

 
  if (!res.ok) {
    let message = "Erreur création enseignant";

    try {
      const parsed = JSON.parse(raw);
      message = parsed.error || parsed.message || message;
    } catch {
      message = raw || message;
    }

    return NextResponse.json(
      { error: message },
      { status: res.status }
    );
  }

  return NextResponse.json({
    message: "Enseignant créé",
  });
}
