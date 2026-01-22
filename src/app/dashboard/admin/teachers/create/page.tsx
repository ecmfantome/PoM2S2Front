"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function CreateTeacherPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    const payload = {
      name: formData.get("name"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      department: formData.get("department"),
      speciality: formData.get("speciality"),
      isActive: true,
    };

    const res = await fetch("/api/admin/teacher", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      setLoading(false);
      setError(data.error || "Erreur lors de la création");
      return;
    }

    router.push("/dashboard/admin/teachers");
  }

  return (
    <div className="flex justify-center pt-10 px-6">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-center">
            Ajouter un Enseignant
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Nom */}
            <div>
              <Label>Nom</Label>
              <Input name="name" required />
            </div>

            {/* Prénom */}
            <div>
              <Label>Prénom</Label>
              <Input name="lastName" required />
            </div>

            {/* Email */}
            <div>
              <Label>Email</Label>
              <Input name="email" type="email" required />
            </div>

            {/* Téléphone */}
            <div>
              <Label>Téléphone</Label>
              <Input name="phone" required />
            </div>

            {/* Département */}
            <div>
              <Label>Département</Label>
              <Input name="department" required />
            </div>

            {/* Spécialité */}
            <div>
              <Label>Spécialité</Label>
              <Input name="speciality" required />
            </div>

            {/* Error */}
            {error && <p className="text-red-500 text-center">{error}</p>}

            <Button type="submit" disabled={loading} className="w-full flex justify-center items-center">
              {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Ajouter l&apos;enseignant
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
