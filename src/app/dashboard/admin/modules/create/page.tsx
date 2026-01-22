"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";



export default function CreateModulePage() {
  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  
  useEffect(() => {
    fetch("/api/admin/teacher")
      .then((res) => res.json())
      .then((data) => setTeachers(data.teachers ?? []));
  }, []);

  console.log(teachers);


  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    const payload = {
      name: formData.get("name"),
      semester: formData.get("semester"),
      code: formData.get("code"),
      responsibleId: formData.get("responsibleId"),
    };

    const res = await fetch("/api/admin/module", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      setLoading(false);
      setError(data.error || "Erreur création module");
      return;
    }

    router.push("/dashboard/admin/modules");
  }

  return (
    <div className="flex justify-center pt-10 px-6">
      <Card className="w-full max-w-xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-center">
            Ajouter un module
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <Label>Nom du module</Label>
              <Input name="name" required />
            </div>

            <div>
              <Label>Code</Label>
              <Input name="code" required />
            </div>

            <div>
              <Label>Semestre</Label>
              <Input name="semester" required placeholder="S1, S2..." />
            </div>

            <div>
              <Label>Responsable</Label>
              <select
                name="responsibleId"
                required
                className="border rounded w-full p-2"
              >
                <option value="">-- Choisir un enseignant --</option>
                {teachers.map((t) => (
                  <option key={t.userId} value={t.userId}>
                   {t.name} {t.lastName}
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <p className="text-red-500 text-center">{error}</p>
            )}

            <Button type="submit" disabled={loading} className="w-full">
              {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Créer le module
            </Button>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}
