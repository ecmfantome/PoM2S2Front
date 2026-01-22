import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCourseById, updateCourse, deleteCourse } from "@/app/lib/fakeDB";

async function getTeacher() {
  const cookie = (await cookies()).get("campus_user")?.value;
  if (!cookie) return null;
  return JSON.parse(Buffer.from(cookie, "base64").toString());
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const teacher = await getTeacher();
  if (!teacher || teacher.role !== "teacher")
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });

  const course = getCourseById(params.id);
  if (!course || course.teacherId !== teacher.id)
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });

  const body = await req.json();
  const updated = updateCourse(params.id, body);

  return NextResponse.json({ course: updated });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const teacher = await getTeacher();
  if (!teacher || teacher.role !== "teacher")
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });

  const course = getCourseById(params.id);
  if (!course || course.teacherId !== teacher.id)
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });

  const deleted = deleteCourse(params.id);
  return NextResponse.json({ deleted });
}
