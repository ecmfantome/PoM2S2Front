"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

// 👉 Définition du type pour éviter les ANY
type Role = "student" | "teacher" | "admin" | "";

export default function CreateUserPage() {
  const router = useRouter();

  const [role, setRole] = useState<Role>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    const res = await fetch("/api/admin/create-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
        role: formData.get("role"),
        formation: formData.get("formation") || null,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setLoading(false);
      setError(data.message || "Une erreur est survenue");
      return;
    }

    router.push("/dashboard/admin/users");
  }

  return (
    <div className="flex justify-center pt-10">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-center">
            Ajouter un utilisateur
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form className="space-y-5" onSubmit={handleSubmit}>
            
            {/* Nom */}
            <div>
              <Label>Nom</Label>
              <Input name="name" placeholder="Ex: Moussa Diop" required />
            </div>

            {/* Email */}
            <div>
              <Label>Email</Label>
              <Input type="email" name="email" placeholder="email@example.com" required />
            </div>

            {/* Mot de passe */}
            <div>
              <Label>Mot de passe</Label>
              <Input type="password" name="password" placeholder="******" required />
            </div>

            {/* Rôle */}
            <div>
              <Label>Rôle</Label>
              <Select
  onValueChange={(value: Role) => setRole(value)}
  required
>
  <SelectTrigger>
    <SelectValue placeholder="Sélectionner un rôle" />
  </SelectTrigger>

  <SelectContent>
    <SelectItem value="teacher">Enseignant</SelectItem>
    <SelectItem value="student">Étudiant</SelectItem>
  </SelectContent>
</Select>

<input type="hidden" name="role" value={role} />

            </div>

            {/* Formation visible seulement si étudiant */}
            {role === "student" && (
              <div>
                <Label>Formation</Label>
                <Input
                  name="formation"
                  placeholder="Ex: Licence 3 Informatique"
                  required
                />
              </div>
            )}

            {/* Erreur */}
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Ajouter l’utilisateur
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
