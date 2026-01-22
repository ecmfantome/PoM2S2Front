"use client";

import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Loader2, X } from "lucide-react";

type Role = "" | "student" | "teacher";

export default function AddUserPopup() {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<Role>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function closePopup() {
    setRole("");
    setOpen(false);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    // payload commun
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload: any = {
      role,
      name: formData.get("name"),
      email: formData.get("email"),
    };

    // ---- 🎓 STUDENT ----
    if (role === "student") {
      payload.matricule = formData.get("matricule");
      payload.anneeEntre = formData.get("anneeEntre");
    }

    // ---- 🎓 TEACHER ----
    if (role === "teacher") {
      payload.registration_number = formData.get("registration_number");
      payload.department = formData.get("department");
      payload.speciality = formData.get("speciality");
    }

    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    setLoading(false);

    if (!res.ok) {
      setError(data.error || data.message || "Erreur lors de la création");
      return;
    }

    closePopup();
  }

  return (
    <>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={() => setOpen(true)}
      >
        + Ajouter un utilisateur
      </button>

      <Dialog
        open={open}
        onClose={closePopup}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      >
        <div className="bg-white p-6 rounded shadow-lg w-96 relative">
          <button
            className="absolute top-3 right-3 text-gray-500 hover:text-black transition"
            onClick={closePopup}
          >
            <X size={22} />
          </button>

          {!role ? (
            <>
              <h2 className="text-lg font-semibold text-center mb-4">
                Choisir un type d’utilisateur
              </h2>

              <button
                className="w-full bg-blue-600 text-white p-2 rounded"
                onClick={() => setRole("student")}
              >
                Étudiant
              </button>

              <button
                className="w-full bg-green-600 text-white p-2 rounded mt-2"
                onClick={() => setRole("teacher")}
              >
                Enseignant
              </button>
            </>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 mt-6">
              <h2 className="text-lg font-semibold text-center">
                Ajouter un {role === "student" ? "étudiant" : "enseignant"}
              </h2>

              {/* NOM */}
              <div>
                <label>Nom</label>
                <input required name="name" className="border w-full p-2 rounded" />
              </div>

              {/* EMAIL */}
              <div>
                <label>Email</label>
                <input required type="email" name="email" className="border w-full p-2 rounded" />
              </div>

              {/* ---------- STUDENT FORM ---------- */}
              {role === "student" && (
                <>
                  <div>
                    <label>Matricule</label>
                    <input
                      required
                      name="matricule"
                      className="border w-full p-2 rounded"
                      placeholder="Ex: STU-2024-00321"
                    />
                  </div>

                  <div>
                    <label>Année d’entrée</label>
                    <input
                      required
                      name="anneeEntre"
                      type="number"
                      className="border w-full p-2 rounded"
                      placeholder="2024"
                    />
                  </div>
                </>
              )}

              {/* ---------- TEACHER FORM ---------- */}
              {role === "teacher" && (
                <>
                  <div>
                    <label>Registration Number</label>
                    <input
                      required
                      name="registration_number"
                      className="border w-full p-2 rounded"
                    />
                  </div>

                  <div>
                    <label>Département</label>
                    <input
                      required
                      name="department"
                      className="border w-full p-2 rounded"
                    />
                  </div>

                  <div>
                    <label>Spécialité</label>
                    <input
                      required
                      name="speciality"
                      className="border w-full p-2 rounded"
                    />
                  </div>
                </>
              )}

              {error && (
                <p className="text-red-500 text-center text-sm">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded flex items-center justify-center"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Créer l’utilisateur"}
              </button>

              <button
                type="button"
                className="w-full bg-gray-200 py-2 rounded"
                onClick={() => setRole("")}
              >
                ← Retour
              </button>
            </form>
          )}
        </div>
      </Dialog>
    </>
  );
}
