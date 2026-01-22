"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function EditStudentPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [student, setStudent] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/admin/students/${id}`);
      const data = await res.json();

      if (!res.ok) {
        setError("Étudiant introuvable");
        setLoading(false);
        return;
      }

      setStudent(data.student);
      setLoading(false);
    }

    load();
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const body = {
      name: formData.get("name"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      matricule: formData.get("matricule"),
      anneeEntre: formData.get("anneeEntre"),
      isActive: formData.get("isActive") === "on",
    };

    const res = await fetch(`/api/admin/students/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    setSaving(false);

    if (!res.ok) {
      setError(data.error);
      return;
    }

    router.push("/dashboard/admin/students");
  }

  if (loading) {
    return (
      <div className="flex justify-center pt-20">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!student) return <p className="text-center pt-10">{error}</p>;

  return (
    <div className="max-w-lg mx-auto pt-10">
      <h1 className="text-2xl font-semibold text-center mb-6">
        Modifier l’étudiant
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label>Nom</label>
          <input
            name="name"
            defaultValue={student.name}
            required
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label>Prénom</label>
          <input
            name="lastName"
            defaultValue={student.lastName}
            required
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label>Email</label>
          <input
            name="email"
            type="email"
            defaultValue={student.email}
            required
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label>Téléphone</label>
          <input
            name="phone"
            defaultValue={student.phone}
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label>Matricule</label>
          <input
            name="matricule"
            defaultValue={student.matricule}
            required
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label>Année d’entrée</label>
          <input
            name="anneeEntre"
            type="number"
            defaultValue={student.anneeEntre}
            required
            className="border p-2 rounded w-full"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isActive"
            defaultChecked={student.isActive}
          />
          <label>Actif</label>
        </div>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <button
          disabled={saving}
          className="w-full bg-blue-600 text-white py-2 rounded flex items-center justify-center"
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
          Enregistrer
        </button>
      </form>
    </div>
  );
}
