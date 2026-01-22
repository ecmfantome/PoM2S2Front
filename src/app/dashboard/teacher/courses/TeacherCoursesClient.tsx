"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Course } from "@/app/lib/fakeDB";

export default function TeacherCoursesClient() {
  const [courses, setCourses] = useState<Course[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/teacher/courses")
      .then(res => res.json())
      .then(data => setCourses(data.courses || []));
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Mes Cours</h1>
        <Button className="bg-blue-600 text-white px-4 py-2 rounded"
         onClick={() => router.push("/dashboard/teacher/courses/create")}>
          + Ajouter un cours
        </Button>
      </div>

      <div className="space-y-3">
        {courses.map((c) => (
          <div key={c.id} className="p-4 border rounded shadow-sm bg-white flex justify-between">
            <div>
              <h2 className="font-semibold">{c.title}</h2>
              <p className="text-sm text-gray-500">{c.description}</p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => router.push(`/dashboard/teacher/courses/edit/${c.id}`)}
              >
                Modifier
              </Button>

              <Button
                variant="destructive"
                onClick={async () => {
                  if (!confirm("Supprimer ce cours ?")) return;
                  await fetch(`/api/teacher/courses/${c.id}`, { method: "DELETE" });
                  location.reload();
                }}
              >
                Supprimer
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
