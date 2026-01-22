"use client";

import { useEffect, useState, useCallback } from "react";
import { Loader2, Pencil, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Import direct → évite TOUTES les erreurs React portal / hydration
import AddAdminPopup from "@/app/components/dashboard/AddAdminPopup";

type Admin = {
  userId: string;
  name: string;
  lastName: string;
  email: string;
  phone: string;
  isActive: boolean;
  post: string;
};

export default function AdminsListPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Chargement admins (useCallback évite re-rendu inutile)
  const loadAdmins = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/admin");
      const data = await res.json();
      setAdmins(data.admins ?? []);
    } catch (e) {
      console.error("Erreur chargement admins :", e);
    } finally {
      setLoading(false);
    }
  }, []);

  // Suppression admin
  async function deleteAdmin(id: string) {
    if (!confirm("Supprimer cet administrateur ?")) return;

    const res = await fetch(`/api/admin/admin/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Erreur lors de la suppression");
      return;
    }

    loadAdmins();
  }

  // Charger au mount
  useEffect(() => {
    loadAdmins();
  }, [loadAdmins]);

  return (
    <div className="pt-10 px-6">
      <Card className="shadow-lg">
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold">
            Liste des Administrateurs
          </CardTitle>

          <AddAdminPopup reload={loadAdmins} />
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : admins.length === 0 ? (
            <p className="text-center text-gray-500 py-6">
              Aucun administrateur trouvé.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="p-3">Nom</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Téléphone</th>
                    <th className="p-3">Fonction</th>
                    <th className="p-3">Statut</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {admins.map((a) => (
                    <tr
                      key={a.userId}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="p-3">
                        {a.name} {a.lastName}
                      </td>
                      <td className="p-3">{a.email}</td>
                      <td className="p-3">{a.phone}</td>
                      <td className="p-3 capitalize">{a.post}</td>

                      <td className="p-3">
                        {a.isActive ? (
                          <span className="text-green-600 font-semibold">
                            Actif
                          </span>
                        ) : (
                          <span className="text-red-600 font-semibold">
                            Inactif
                          </span>
                        )}
                      </td>

                      <td className="p-3 flex justify-center gap-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            router.push(`/dashboard/admin/admins/edit/${a.userId}`)
                          }
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>

                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteAdmin(a.userId)}
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
