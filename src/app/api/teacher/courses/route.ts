import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCoursesByTeacher } from "@/app/lib/fakeDB";

async function getTeacher() {
  const cookie = (await cookies()).get("campus_user")?.value;
  if (!cookie) return null;

  try {
    const user = JSON.parse(Buffer.from(cookie, "base64").toString());
    return user.role === "teacher" ? user : null;
  } catch {
    return null;
  }
}

export async function GET() {
  const teacher =await getTeacher();
  if (!teacher) return NextResponse.json({ error: "Accès refusé" }, { status: 403 });

  const courses = getCoursesByTeacher(teacher.id);
  return NextResponse.json({ courses });
}
