import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookie = (await cookies()).get("campus_user")?.value;
  if (!cookie) return NextResponse.json({ user: null });

  try {
    const user = JSON.parse(Buffer.from(cookie, "base64").toString());
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ user: null });
  }
}
