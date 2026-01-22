"use client";

import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Loader2, X } from "lucide-react";

export default function AddTeacherPopup({ reload }: { reload: () => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

    const raw = await res.text(); // <-- SAFE, même si backend renvoie string

    setLoading(false);

    if (!res.ok) {
      setError(raw || "Erreur lors de la création");
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
        + Ajouter un enseignant
      </button>

      <Dialog
        open={open}
        onClose={closePopup}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      >
        <div className="bg-white p-6 rounded-lg shadow-xl w-96 relative font-sans">

          <button
            className="absolute top-3 right-3 text-gray-500 hover:text-black"
            onClick={closePopup}
          >
            <X size={22} />
          </button>

          <h2 className="text-lg font-semibold text-center mb-4 text-gray-900">
            Ajouter un enseignant
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4 text-gray-800">

            <div>
              <label className="block mb-1 text-sm font-medium">Prénom</label>
              <input name="name" required className="border w-full p-2 rounded" />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Nom</label>
              <input name="lastName" required className="border w-full p-2 rounded" />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Email</label>
              <input name="email" type="email" required className="border w-full p-2 rounded" />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Téléphone</label>
              <input name="phone" className="border w-full p-2 rounded" />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Département</label>
              <input name="department" required className="border w-full p-2 rounded" />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Spécialité</label>
              <input name="speciality" required className="border w-full p-2 rounded" />
            </div>

            {error && (
              <p className="text-red-500 text-center text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded flex items-center justify-center"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Enregistrer
            </button>

            <button
              type="button"
              onClick={closePopup}
              className="w-full bg-gray-200 py-2 rounded"
            >
              Annuler
            </button>

          </form>
        </div>
      </Dialog>
    </>
  );
}
