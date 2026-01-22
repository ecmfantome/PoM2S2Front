/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Pencil, Trash } from "lucide-react";
import AddStudentPopup from "@/app/components/dashboard/AddStudentPopup";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const AddStudentPopup = dynamic(
  () => import("@/app/components/dashboard/AddStudentPopup"),
  { ssr: false }
);

  const loadStudents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/students");
      const data = await res.json();
      setStudents(data.students ?? []);
    } catch (e) {
      console.error("Erreur chargement étudiants :", e);
    } finally {
      setLoading(false);
    }
  }, []);

  async function deleteStudent(id: string) {
    if (!confirm("Supprimer cet étudiant ?")) return;

    const res = await fetch(`/api/admin/students/${id}`, { method: "DELETE" });

    if (!res.ok) return alert("Erreur suppression étudiant");

    loadStudents();
  }

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  return (
    <div className="pt-10 px-6">
      <Card>
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Étudiants</CardTitle>
          <AddStudentPopup reload={loadStudents} />
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin w-6 h-6" />
            </div>
          ) : students.length === 0 ? (
            <p className="text-center text-gray-500">Aucun étudiant trouvé.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3">Nom</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Année d’entrée</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {students.map((s: any) => (
                    <tr key={s.userId} className="border-b hover:bg-gray-50">
                      <td className="p-3">{s.name} {s.lastName}</td>
                      <td className="p-3">{s.email}</td>
                      <td className="p-3">{s.backToSchoolYear}</td>

                      <td className="p-3 flex gap-2 justify-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            router.push(`/dashboard/admin/students/edit/${s.userId}`)
                          }
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>

                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteStudent(s.userId)}
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
