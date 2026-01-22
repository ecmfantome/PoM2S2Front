"use client";

import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Loader2, X } from "lucide-react";

export default function AddAdminPopup({ reload }: { reload: () => void }) {
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

    const form = new FormData(e.currentTarget);

    const payload = {
      name: form.get("name"),
      lastName: form.get("lastName"),
      email: form.get("email"),
      phone: form.get("phone"),
      isActive: true,
      post: "admin",
    };

    const res = await fetch("/api/admin/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    setLoading(false);

    if (!res.ok) {
      setError(text || "Erreur lors de la création");
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
        + Ajouter un administrateur
      </button>

      <Dialog
        open={open}
        onClose={closePopup}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      >
        {/* CONTENU DE LA MODALE */}
        <div className="bg-white p-6 rounded-lg shadow-xl w-96 relative font-sans">

          {/* Bouton fermer */}
          <button
            className="absolute top-3 right-3 text-gray-500 hover:text-black"
            onClick={closePopup}
          >
            <X size={22} />
          </button>

          {/* Titre */}
          <h2 className="text-lg font-semibold text-center mb-4 text-gray-900">
            Ajouter un administrateur
          </h2>

          {/* FORMULAIRE */}
          <form onSubmit={handleSubmit} className="space-y-4 text-gray-800">

            <div>
              <label className="block mb-1 text-sm font-medium">Prénom</label>
              <input
                name="name"
                required
                className="border w-full p-2 rounded focus:ring focus:ring-blue-300 outline-none"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Nom</label>
              <input
                name="lastName"
                required
                className="border w-full p-2 rounded focus:ring focus:ring-blue-300 outline-none"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                required
                className="border w-full p-2 rounded focus:ring focus:ring-blue-300 outline-none"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Téléphone</label>
              <input
                name="phone"
                className="border w-full p-2 rounded focus:ring focus:ring-blue-300 outline-none"
                placeholder="77 000 00 00"
              />
            </div>

            {/* Message erreur */}
            {error && (
              <p className="text-red-500 text-center text-sm">{error}</p>
            )}

            {/* Bouton enregistrer */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded flex items-center justify-center hover:bg-blue-700"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Enregistrer
            </button>

            {/* Bouton annuler */}
            <button
              type="button"
              onClick={closePopup}
              className="w-full bg-gray-200 py-2 rounded hover:bg-gray-300"
            >
              Annuler
            </button>
          </form>
        </div>
      </Dialog>
    </>
  );
}
