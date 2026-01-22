"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

type Teacher = {
  userId: string;
  name: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  speciality: string;
  isActive: boolean;
};

export default function EditTeacherPage() {
  const router = useRouter();
  const params = useParams();
  const teacherId = params.id as string;

  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Charger les données de l’enseignant
  useEffect(() => {
    async function fetchTeacher() {
      const res = await fetch(`/api/admin/teacher/${teacherId}`);
      const data = await res.json();

      if (!res.ok) {
        setError("Impossible de charger l'enseignant.");
        setLoading(false);
        return;
      }

      setTeacher(data.teacher);
      setLoading(false);
    }

    fetchTeacher();
  }, [teacherId]);

  // Modifier l’enseignant
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    const payload = {
      userId: teacherId, // 🔥 obligatoire pour Spring PUT
      name: formData.get("name"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      department: formData.get("department"),
      speciality: formData.get("speciality"),
      isActive: formData.get("isActive") === "on",
    };

    const res = await fetch(`/api/admin/teacher/${teacherId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      setSaving(false);
      setError(data.error || "Erreur lors de la mise à jour");
      return;
    }

    router.push("/dashboard/admin/teachers");
  }

  // Loader
  if (loading) {
    return (
      <div className="flex justify-center pt-20">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (!teacher) {
    return <div className="text-center pt-10 text-red-600">{error}</div>;
  }

  return (
    <div className="flex justify-center pt-10 px-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-center">
            Modifier l’Enseignant
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Nom */}
            <div>
              <Label>Nom</Label>
              <Input name="name" required defaultValue={teacher.name} />
            </div>

            {/* Prénom */}
            <div>
              <Label>Prénom</Label>
              <Input name="lastName" required defaultValue={teacher.lastName} />
            </div>

            {/* Email */}
            <div>
              <Label>Email</Label>
              <Input type="email" name="email" required defaultValue={teacher.email} />
            </div>

            {/* Téléphone */}
            <div>
              <Label>Téléphone</Label>
              <Input name="phone" defaultValue={teacher.phone} />
            </div>

            {/* Département */}
            <div>
              <Label>Département</Label>
              <Input name="department" required defaultValue={teacher.department} />
            </div>

            {/* Spécialité */}
            <div>
              <Label>Spécialité</Label>
              <Input name="speciality" required defaultValue={teacher.speciality} />
            </div>

            {/* Actif */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isActive"
                defaultChecked={teacher.isActive}
              />
              <Label>Actif</Label>
            </div>

            {/* Erreur */}
            {error && <p className="text-red-500 text-center">{error}</p>}

            {/* Bouton */}
            <Button className="w-full" type="submit" disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Enregistrer les modifications
            </Button>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}
