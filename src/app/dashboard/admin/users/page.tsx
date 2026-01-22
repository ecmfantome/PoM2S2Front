"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Trash, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import AddUserPopup from "../../../components/dashboard/AddUserPopup";

export type UserRole = "admin" | "teacher" | "student";

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  formation?: string;
};

export default function UsersListPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch users
  async function loadUsers() {
    setLoading(true);
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    setUsers(data.users || []);
    setLoading(false);
  }

  // Delete user
  async function deleteUser(id: string) {
    if (!confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) return;

    const res = await fetch(`/api/admin/delete-user/${id}`, { method: "DELETE" });

    if (res.ok) {
      loadUsers();
    }
  }

  useEffect(() => {
  async function load() {
    setLoading(true);

    const res = await fetch("/api/admin/users");
    const data = await res.json();

    setUsers(data.users || []);
    setLoading(false);
  }

  load();
}, []);


  return (
    <div className="pt-10 px-6">
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="text-xl font-semibold">Liste des utilisateurs</CardTitle>

          <AddUserPopup />
        </CardHeader>

        <CardContent>
          {/* Loader */}
          {loading && (
            <div className="flex justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          )}

          {/* Tableau */}
          {!loading && users.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="p-3">Nom</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Rôle</th>
                    <th className="p-3">Formation</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{u.name}</td>
                      <td className="p-3">{u.email}</td>
                      <td className="p-3 capitalize">{u.role}</td>
                      <td className="p-3">{u.role === "student" ? u.formation : "---"}</td>

                      <td className="p-3 flex items-center justify-center gap-3">
                        {/* Éditer */}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            router.push(`/dashboard/admin/users/edit/${u.id}`)
                          }
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>

                        {/* Supprimer */}
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteUser(u.id)}
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

          {/* Aucun utilisateur */}
          {!loading && users.length === 0 && (
            <p className="text-center text-gray-500 py-6">
              Aucun utilisateur pour le moment.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
