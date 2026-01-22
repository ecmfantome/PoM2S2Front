"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function EditModulePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [module, setModule] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [teachers, setTeachers] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/admin/module/${id}`)
      .then((res) => res.json())
      .then((data) => setModule(data.module));

    fetch("/api/admin/teacher")
      .then((res) => res.json())
      .then((data) => setTeachers(data.teachers ?? []));
  }, [id]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    const payload = {
      id,
      name: formData.get("name"),
      semester: formData.get("semester"),
      code: formData.get("code"),
      responsibleId: formData.get("responsibleId"),
      createdBy: module.createdBy?.id,
    };

    const res = await fetch(`/api/admin/module/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      setSaving(false);
      setError(data.error || "Erreur mise à jour");
      return;
    }

    router.push("/dashboard/admin/modules");
  }

  if (!module) {
    return (
      <div className="flex justify-center pt-20">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex justify-center pt-10 px-6">
      <Card className="w-full max-w-xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-center">
            Modifier le module
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <Label>Nom</Label>
              <Input name="name" defaultValue={module.name} required />
            </div>

            <div>
              <Label>Code</Label>
              <Input name="code" defaultValue={module.code} required />
            </div>

            <div>
              <Label>Semestre</Label>
              <Input name="semester" defaultValue={module.semester} required />
            </div>

            <div>
              <Label>Responsable</Label>
              <select
                name="responsibleId"
                defaultValue={module.responsible?.id}
                className="border rounded w-full p-2"
              >
                {teachers.map((t) => (
                  <option key={t.teacherId} value={t.teacherId}>
                    {t.name} {t.lastName}
                  </option>
                ))}
              </select>
            </div>

            {error && <p className="text-red-500 text-center">{error}</p>}

            <Button type="submit" disabled={saving} className="w-full">
              {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Enregistrer
            </Button>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}
