import { NextResponse } from "next/server";
import { cookies } from "next/headers";

async function isAdmin() {
  const cookieStore = await cookies();
  const encoded = cookieStore.get("campus_user")?.value;
  if (!encoded) return null;

  try {
    const decoded = JSON.parse(Buffer.from(encoded, "base64").toString());
    return decoded.role?.toUpperCase() === "ADMIN" ? decoded : null;
  } catch {
    return null;
  }
}

// GET : backend ne fournit pas encore de liste
export async function GET() {
  return NextResponse.json({
    users: [],
    message:
      "Endpoint LIST USERS non disponible côté backend pour le moment.",
  });
}

// POST : création user via backend
export async function POST(req: Request) {
  const admin = await isAdmin();
  if (!admin)
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });

  const body = await req.json();
  const role = body.role?.toUpperCase();

  if (!role)
    return NextResponse.json({ error: "Role manquant" }, { status: 400 });

  let backendUrl = "";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let payload: any = {};

  switch (role) {
    // 🎓 Étudiant
    case "STUDENT":
      backendUrl = "http://localhost:9090/api/v1/student";
      payload = {
        matricule: body.matricule,
        anneeEntre: body.promotion, // année d'entrée
      };
      break;

    // 👨‍🏫 Enseignant
    case "TEACHER":
      backendUrl = "http://localhost:9090/api/v1/teacher";
      payload = {
        registration_number: body.matricule,
        speciality: body.speciality ?? "",
        department: body.department,
      };
      break;

    // 🛡 Admin
    case "ADMIN":
      backendUrl = "http://localhost:9090/api/v1/admin";
      payload = {
        post: "admin",
      };
      break;

    default:
      return NextResponse.json({ error: "Role invalide" }, { status: 400 });
  }

  // Appel backend
  const res = await fetch(backendUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.text();

  if (!res.ok)
    return NextResponse.json({ error: data }, { status: res.status });

  return NextResponse.json({
    message: "Utilisateur créé avec succès",
    backendResponse: data,
  });
}
