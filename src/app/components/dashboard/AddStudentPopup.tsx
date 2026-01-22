"use client";

import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Loader2, X } from "lucide-react";

export default function AddStudentPopup({ reload }: { reload: () => void }) {
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

    // Construction payload => conforme backend
    const payload = {
      name: formData.get("name"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      isActive: true,
      backToSchoolYear: formData.get("backToSchoolYear")
    };

    const res = await fetch("/api/admin/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Erreur lors de la création");
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
        + Ajouter un étudiant
      </button>

      <Dialog
        open={open}
        onClose={closePopup}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      >
        <div className="bg-white p-6 rounded shadow-lg w-96 relative">

          {/* bouton fermer */}
          <button
            className="absolute top-3 right-3 text-gray-500 hover:text-black"
            onClick={closePopup}
          >
            <X size={22} />
          </button>

          <h2 className="text-lg font-semibold text-center mb-4">
            Ajouter un étudiant
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Name */}
            <div>
              <label>Prénom</label>
              <input
                name="name"
                required
                className="border w-full p-2 rounded"
              />
            </div>

            {/* Lastname */}
            <div>
              <label>Nom</label>
              <input
                name="lastName"
                required
                className="border w-full p-2 rounded"
              />
            </div>

            {/* Email */}
            <div>
              <label>Email</label>
              <input
                name="email"
                type="email"
                required
                className="border w-full p-2 rounded"
              />
            </div>

            {/* Phone */}
            <div>
              <label>Téléphone</label>
              <input
                name="phone"
                className="border w-full p-2 rounded"
                placeholder="77 000 00 00"
              />
            </div>
            {/* Année d'entrée */}
            <div>
              <label>Année d’entrée</label>
              <input
                name="backToSchoolYear"
                required
                type="number"
                className="border w-full p-2 rounded"
                placeholder="2024"
              />
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
              className="w-full bg-gray-200 py-2 rounded mt-2"
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
