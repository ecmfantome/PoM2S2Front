"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type Admin = {
  userId: string;
  name: string;
  lastName: string;
  email: string;
  phone: string;
  post: string;
  isActive: boolean;
};

export default function EditAdminPage() {
  const router = useRouter();
  const params = useParams();
  const adminId = params.id as string;

  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // 🔥 Charger l'administrateur
  useEffect(() => {
    async function fetchAdmin() {
      const res = await fetch(`/api/admin/admin/${adminId}`);
      const data = await res.json();

      if (!res.ok) {
        setError("Impossible de charger l'administrateur.");
        setLoading(false);
        return;
      }

      setAdmin(data.admin);
      setLoading(false);
    }

    fetchAdmin();
  }, [adminId]);

  // 🔥 Soumission formulaire
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      userId: adminId,
      name: formData.get("name"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      post: "admin",
      isActive: formData.get("isActive") === "on",
    };

    const res = await fetch(`/api/admin/admin/${adminId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      setSaving(false);
      setError(data.error || "Erreur lors de la mise à jour.");
      return;
    }

    router.push("/dashboard/admin/admins");
  }

  // Loader
  if (loading) {
    return (
      <div className="flex justify-center pt-20">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (!admin) {
    return <p className="text-center text-red-500 pt-10">{error}</p>;
  }

  return (
    <div className="flex justify-center pt-10">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-center">
            Modifier un Administrateur
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <Label>Nom</Label>
              <Input name="name" defaultValue={admin.name} required />
            </div>

            <div>
              <Label>Prénom</Label>
              <Input name="lastName" defaultValue={admin.lastName} required />
            </div>

            <div>
              <Label>Email</Label>
              <Input type="email" name="email" defaultValue={admin.email} required />
            </div>

            <div>
              <Label>Téléphone</Label>
              <Input name="phone" defaultValue={admin.phone} required />
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" name="isActive" defaultChecked={admin.isActive} />
              <Label>Actif</Label>
            </div>

            {error && <p className="text-red-500 text-center">{error}</p>}

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
