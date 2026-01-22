import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  try {
   
    const res = await fetch("http://localhost:9090/api/v1/user/sign_in", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true,
      }),
    });

    const data = await res.json();
  
    if (!res.ok) {
      return NextResponse.json(
        { error: data.message || "Identifiants invalides" },
        { status: res.status }
      );
    }

    // 🎯 Normalisation du rôle backend → frontend
    const role = data.role?.toLowerCase();

    const userForCookie = {
      userId: data.userId,
      name: data.name,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      role,
      isActive: data.isActive,
    };

    // Encodage base64 lisible par middleware
    const encoded = Buffer.from(JSON.stringify(userForCookie)).toString("base64");

    const response = NextResponse.json({
      token: data.token,
      user: userForCookie,
    });

    // 🔥 Cookies front lisibles par middleware
    response.cookies.set("campus_user", encoded, {
      httpOnly: false,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60,
    });

    response.cookies.set("campus_token", data.token, {
      httpOnly: false,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur de connexion au serveur" },
      { status: 500 }
    );
  }
}
