"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export type UserRole = "admin" | "teacher" | "student";

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  formation?: string | null;
};

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [role, setRole] = useState<UserRole | "">("");
  const [userData, setUserData] = useState<User | null>(null);

  // Fetch existing user
  useEffect(() => {
    async function fetchUser() {
      const res = await fetch(`/api/admin/user/${userId}`);
      const data = await res.json();

      if (!res.ok) {
        setError("Utilisateur introuvable");
        setLoading(false);
        return;
      }

      setUserData(data.user);
      setRole(data.user.role);
      setLoading(false);
    }

    fetchUser();
  }, [userId]);

  // Submit edit
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const res = await fetch(`/api/admin/user/${userId}`, {
      method: "PATCH",
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password") || null,
        role,
        formation: role === "student" ? formData.get("formation") : null,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setSaving(false);
      setError(data.message || "Erreur lors de la mise à jour");
      return;
    }

    router.push("/dashboard/admin/users");
  }

  if (loading) {
    return (
      <div className="flex justify-center pt-20">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (!userData) {
    return <div className="text-center pt-10 text-red-500">{error}</div>;
  }

  return (
    <div className="flex justify-center pt-10">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-center">
            Modifier l’utilisateur
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Name */}
            <div>
              <Label>Nom</Label>
              <Input name="name" defaultValue={userData.name} required />
            </div>

            {/* Email */}
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                name="email"
                defaultValue={userData.email}
                required
              />
            </div>

            {/* Password */}
            <div>
              <Label>Nouveau mot de passe (optionnel)</Label>
              <Input
                type="password"
                name="password"
                placeholder="Laisser vide pour ne pas modifier"
              />
            </div>

            {/* Role */}
            <div>
              <Label>Rôle</Label>
              <Select
                onValueChange={(v: UserRole) => setRole(v)}
                value={role}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un rôle" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="teacher">Enseignant</SelectItem>
                  <SelectItem value="student">Étudiant</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Formation */}
            {role === "student" && (
              <div>
                <Label>Formation</Label>
                <Input
                  name="formation"
                  defaultValue={userData.formation || ""}
                  required
                />
              </div>
            )}

            {/* Error */}
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            {/* Submit */}
            <Button type="submit" disabled={saving} className="w-full">
              {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Enregistrer les modifications
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
