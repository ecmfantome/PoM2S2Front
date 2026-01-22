import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createCourse } from "@/app/lib/fakeDB";

export async function POST(req: Request) {
  const cookie = (await cookies()).get("campus_user")?.value;
  if (!cookie) return NextResponse.json({ error: "Non autorisé" }, { status: 403 });

  const teacher = JSON.parse(Buffer.from(cookie, "base64").toString());
  if (teacher.role !== "teacher")
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });

  const body = await req.json();

  const course = createCourse({
    title: body.title,
    description: body.description,
    teacherId: teacher.id,
  });

  return NextResponse.json({ course });
}
