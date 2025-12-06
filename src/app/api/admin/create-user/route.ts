import { NextResponse } from "next/server";
import { createUser, type User } from "../../../lib/fakeDB"; // on importe aussi le type User

// Typage minimal attendu pour le body
type CreateUserBody = {
  name?: string;
  email?: string;
  password?: string;
  role?: "admin" | "teacher" | "student";
  formation?: string | null;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CreateUserBody;

    const { name, email, password, role, formation } = body;

    // validation simple côté serveur
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: "Champs obligatoires manquants (name, email, password, role)." },
        { status: 400 }
      );
    }

    const newUser = createUser({
      name,
      email,
      password,
      role,
      formation: formation ?? undefined, // convertit null -> undefined
    });

    // construire un objet sans le mot de passe, de façon typée
    const { password: _pw, ...userWithoutPassword } = newUser as User;
    const safeUser = userWithoutPassword as Omit<User, "password">;

    return NextResponse.json({ message: "Utilisateur créé", user: safeUser });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ message: message || "Erreur interne" }, { status: 400 });
  }
}
