"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function CreateAdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: formData.get("name"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      post: "admin",        // 🔥 Fixé par défaut
      isActive: true,       // 🔥 Par défaut actif
    };

    const res = await fetch("/api/admin/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      setLoading(false);
      setError(data.error || "Erreur lors de la création de l’administrateur");
      return;
    }

    router.push("/dashboard/admin/admins");
  }

  return (
    <div className="flex justify-center pt-10 px-6">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-center">
            Ajouter un Administrateur
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Nom */}
            <div>
              <Label>Nom</Label>
              <Input name="name" required placeholder="Cheikh" />
            </div>

            {/* Prénom */}
            <div>
              <Label>Prénom</Label>
              <Input name="lastName" required placeholder="Fall" />
            </div>

            {/* Email */}
            <div>
              <Label>Email</Label>
              <Input type="email" name="email" required placeholder="admin@example.com" />
            </div>

            {/* Téléphone */}
            <div>
              <Label>Téléphone</Label>
              <Input name="phone" required placeholder="77 123 45 67" />
            </div>

            {/* Message erreur */}
            {error && (
              <p className="text-red-500 text-center text-sm">{error}</p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Créer l’administrateur
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
