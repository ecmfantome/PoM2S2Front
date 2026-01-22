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

type Role = "student" | "teacher" | "";

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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload: any = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      role,
    };

    // Champs pour étudiant
    if (role === "student") {
      payload.formation = formData.get("formation");
      payload.ine = formData.get("ine");
      payload.birthdate = formData.get("birthdate");
      payload.promotion = formData.get("promotion");
    }

    // Champs pour enseignant
    if (role === "teacher") {
      payload.department = formData.get("department");
      payload.matricule = formData.get("matricule");
    }

    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
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
      <Card className="w-full max-w-xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-center">
            Ajouter un utilisateur
          </CardTitle>
        </CardHeader>

        <CardContent>
          {/* Choix du rôle */}
          <div className="mb-6">
            <Label>Choisir le type d’utilisateur</Label>
            <Select onValueChange={(v: Role) => setRole(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir..." />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="student">Étudiant</SelectItem>
                <SelectItem value="teacher">Enseignant</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {!role && (
            <p className="text-gray-500 text-center">
              Sélectionnez un type  d&apos;utilisateur pour continuer.
            </p>
          )}

          {role && (
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Nom */}
              <div>
                <Label>Nom complet</Label>
                <Input name="name" placeholder="Ex: Moussa Diop" required />
              </div>

              {/* Email */}
              <div>
                <Label>Email</Label>
                <Input name="email" type="email" placeholder="email@example.com" required />
              </div>

              {/* Mot de passe */}
              <div>
                <Label>Mot de passe</Label>
                <Input name="password" type="password" placeholder="******" required />
              </div>

              {/* Formulaire étudiant */}
              {role === "student" && (
                <>
                  <div>
                    <Label>INE</Label>
                    <Input name="ine" placeholder="Numéro INE" required />
                  </div>

                  <div>
                    <Label>Date de naissance</Label>
                    <Input name="birthdate" type="date" required />
                  </div>

                  <div>
                    <Label>Formation</Label>
                    <Input name="formation" placeholder="Ex: Master 2 Informatique" required />
                  </div>

                  <div>
                    <Label>Promotion</Label>
                    <Input name="promotion" placeholder="2024 - 2025" required />
                  </div>
                </>
              )}

              {/* Formulaire enseignant */}
              {role === "teacher" && (
                <>
                  <div>
                    <Label>Matricule</Label>
                    <Input name="matricule" placeholder="Ex: MAT-8934" required />
                  </div>

                  <div>
                    <Label>Département / Matière</Label>
                    <Input name="department" placeholder="Programmation, Réseau..." required />
                  </div>
                </>
              )}

              {/* Erreur */}
              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}

              {/* Bouton submit */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                Ajouter l’utilisateur
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
