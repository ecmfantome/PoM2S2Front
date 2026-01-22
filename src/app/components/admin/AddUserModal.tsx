"use client";

import { useState } from "react";
import { createPortal } from "react-dom";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function AddUserModal({ open, onClose, onCreated }: any) {
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.target);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload: any = {
      role,
      name: form.get("name"),
      email: form.get("email"),
      password: form.get("password"),
    };

    if (role === "student") {
      payload.matricule = form.get("matricule");
      payload.anneeEntre = form.get("anneeEntre");
    }

    if (role === "teacher") {
      payload.registrationNumber = form.get("registrationNumber");
      payload.department = form.get("department");
      payload.speciality = form.get("speciality");
    }

    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      onCreated();
      onClose();
    } else {
      alert(data.error);
    }
  }

  return createPortal(
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow w-96">
        <h2 className="text-lg font-bold mb-4">Ajouter un utilisateur</h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Sélection du rôle */}
          <select
            name="role"
            required
            onChange={(e) => setRole(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="">-- Sélectionner un rôle --</option>
            <option value="student">Étudiant</option>
            <option value="teacher">Enseignant</option>
          </select>

          <input name="name" required placeholder="Nom" className="w-full border p-2 rounded" />
          <input name="email" required placeholder="Email" className="w-full border p-2 rounded" />
          <input name="password" required placeholder="Mot de passe" className="w-full border p-2 rounded" />

          {/* === FORMULAIRE STUDENT === */}
          {role === "student" && (
            <>
              <input
                name="matricule"
                required
                placeholder="Matricule"
                className="w-full border p-2 rounded"
              />

              <input
                name="anneeEntre"
                required
                type="number"
                placeholder="Année d'entrée — ex: 2024"
                className="w-full border p-2 rounded"
              />
            </>
          )}

          {/* === FORMULAIRE TEACHER === */}
          {role === "teacher" && (
            <>
              <input
                name="registrationNumber"
                required
                placeholder="Matricule enseignant"
                className="w-full border p-2 rounded"
              />

              <input
                name="department"
                required
                placeholder="Département"
                className="w-full border p-2 rounded"
              />

              <input
                name="speciality"
                required
                placeholder="Spécialité"
                className="w-full border p-2 rounded"
              />
            </>
          )}

          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose}>Annuler</button>

            <button className="bg-blue-600 text-white px-4 py-2 rounded">
              {loading ? "Création..." : "Créer"}
            </button>
          </div>

        </form>
      </div>
    </div>,
    document.body
  );
}
