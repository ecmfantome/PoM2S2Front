import { NextResponse } from "next/server";
import { getCourses } from "@/app/lib/fakeDB";

export function GET() {
  return NextResponse.json({ courses: getCourses() });
}
