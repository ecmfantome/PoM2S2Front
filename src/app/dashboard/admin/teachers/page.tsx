"use client";

import AddTeacherPopup from  "../../../components/dashboard/AddTeacherPopup";
import { useEffect, useState, useMemo } from "react";
import { Loader2, Pencil, Trash, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import dynamic from "next/dynamic";

type Teacher = {
  teacherId: string;
  name: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  speciality: string;
  isActive: boolean;
};

export default function TeachersListPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔍 Recherche + Filtre + Pagination States
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  const [page, setPage] = useState(1);
  const perPage = 10;

  const router = useRouter();

  async function loadTeachers() {
    setLoading(true);

    const res = await fetch("/api/admin/teacher");
    const data = await res.json();

    setTeachers(data.teachers ?? []);
    setLoading(false);
  }

  const AddTeacherPopup = dynamic(
  () => import("../../../components/dashboard/AddTeacherPopup"),
  { ssr: false } // 🔥 empêche Next de le rendre côté serveur
);

  async function deleteTeacher(id: string) {
    const ok = confirm("Supprimer cet enseignant ?");
    if (!ok) return;

    const res = await fetch(`/api/admin/teacher/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Erreur suppression");
      return;
    }

    loadTeachers();
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadTeachers();
  }, []);

  // ✅ Recherche + Filtre STATUS
  const filteredTeachers = useMemo(() => {
    return teachers
      .filter((t) => {
        const text =
          `${t.name} ${t.lastName} ${t.email} ${t.phone} ${t.department} ${t.speciality}`
            .toLowerCase();

        return text.includes(search.toLowerCase());
      })
      .filter((t) => {
        if (statusFilter === "active") return t.isActive === true;
        if (statusFilter === "inactive") return t.isActive === false;
        return true;
      });
  }, [teachers, search, statusFilter]);

  // 📄 Pagination
  const totalPages = Math.ceil(filteredTeachers.length / perPage);

  const paginatedTeachers = filteredTeachers.slice(
    (page - 1) * perPage,
    page * perPage
  );

  return (
    <div className="pt-10 px-6">
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="text-xl font-semibold">
            Liste des Enseignants
          </CardTitle>
            <AddTeacherPopup reload={loadTeachers} />
          
        </CardHeader>

        <CardContent>
      
          <div className="flex flex-wrap gap-4 mb-6 items-center">

            <div className="relative w-full max-w-xs">
              <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Rechercher..."
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              className="border p-2 rounded"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as "all" | "active" | "inactive")
              }
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Actifs</option>
              <option value="inactive">Inactifs</option>
            </select>
          </div>

          {loading && (
            <div className="flex justify-center py-10">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          )}

          {!loading && paginatedTeachers.length > 0 && (
            <>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-100 text-left">
                      <th className="p-3">Nom</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">Téléphone</th>
                      <th className="p-3">Département</th>
                      <th className="p-3">Spécialité</th>
                      <th className="p-3">Statut</th>
                      <th className="p-3 text-center">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {paginatedTeachers.map((t) => (
                      <tr key={t.teacherId} className="border-b hover:bg-gray-50">
                        <td className="p-3">{t.name} {t.lastName}</td>
                        <td className="p-3">{t.email}</td>
                        <td className="p-3">{t.phone}</td>
                        <td className="p-3">{t.department}</td>
                        <td className="p-3">{t.speciality}</td>

                        <td className="p-3">
                          {t.isActive ? (
                            <span className="text-green-600 font-semibold">Actif</span>
                          ) : (
                            <span className="text-red-600 font-semibold">Inactif</span>
                          )}
                        </td>

                        <td className="p-3 flex items-center justify-center gap-3">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              router.push(`/dashboard/admin/teachers/edit/${t.teacherId}`)
                            }
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>

                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteTeacher(t.teacherId)}
                          >
                            <Trash className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* PAGINATION */}
              <div className="flex justify-center mt-6 gap-3">
                <Button
                  variant="outline"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Précédent
                </Button>

                <span className="py-2 px-4">
                  Page {page} / {totalPages}
                </span>

                <Button
                  variant="outline"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Suivant
                </Button>
              </div>
            </>
          )}

          {!loading && filteredTeachers.length === 0 && (
            <p className="text-center py-6 text-gray-500">
              Aucun enseignant trouvé.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
