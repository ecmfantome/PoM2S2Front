"use client";

import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { Loader2, X } from "lucide-react";

export default function AddModulePopup({ reload }: { reload: () => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [teachers, setTeachers] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/admin/teacher")
      .then((res) => res.json())
      .then((data) => setTeachers(data.teachers ?? []));
  }, []);

  function closePopup() {
    setOpen(false);
    setError("");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    const payload = {
      name: formData.get("name"),
      code: formData.get("code"),
      semester: formData.get("semester"),
      responsibleId: formData.get("responsibleId"),
    };

    const res = await fetch("/api/admin/module", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Erreur création module");
      return;
    }

    reload();
    closePopup();
  }

  return (
    <>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={() => setOpen(true)}
      >
        + Ajouter un module
      </button>

      <Dialog
        open={open}
        onClose={closePopup}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      >
        <div className="bg-white p-6 rounded shadow-lg w-96 relative">

          <button
            className="absolute top-3 right-3 text-gray-500 hover:text-black"
            onClick={closePopup}
          >
            <X size={22} />
          </button>

          <h2 className="text-lg font-semibold text-center mb-4">
            Ajouter un module
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label>Nom</label>
              <input name="name" required className="border w-full p-2 rounded" />
            </div>

            <div>
              <label>Code</label>
              <input name="code" required className="border w-full p-2 rounded" />
            </div>

            <div>
              <label>Semestre</label>
              <input
                name="semester"
                required
                placeholder="S1"
                className="border w-full p-2 rounded"
              />
            </div>

            <div>
              <label>Responsable</label>
              <select
                name="responsibleId"
                required
                className="border w-full p-2 rounded"
              >
                <option value="">-- Choisir --</option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} {t.lastName}
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <p className="text-red-500 text-center text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded flex justify-center"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Enregistrer
            </button>

            <button
              type="button"
              className="w-full bg-gray-200 py-2 rounded"
              onClick={closePopup}
            >
              Annuler
            </button>

          </form>
        </div>
      </Dialog>
    </>
  );
}
