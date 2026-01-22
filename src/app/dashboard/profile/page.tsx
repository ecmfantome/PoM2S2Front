"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfilePage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetch("/api/auth/me").then(async (res) => {
      const data = await res.json();
      setUser(data.user);
    });
  }, []);

  if (!user) return <p className="p-6">Chargement...</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Mon Profil</h1>

      <Card className="shadow">
        <CardHeader>
          <CardTitle>Informations personnelles</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          <p>
            <strong>Nom :</strong> {user.name}
          </p>

          <p>
            <strong>Email :</strong> {user.email}
          </p>

          <p className="capitalize">
            <strong>Rôle :</strong> {user.role}
          </p>

          {user.createdAt && (
            <p>
              <strong>Membre depuis :</strong>{" "}
              {new Date(user.createdAt).toLocaleDateString("fr-FR")}
            </p>
          )}

          {user.role === "student" && (
            <>
              <hr className="my-4" />
              <h3 className="font-semibold text-lg">Informations Étudiant</h3>

              <p>
                <strong>Formation :</strong> {user.formation}
              </p>

              {user.ine && <p><strong>INE :</strong> {user.ine}</p>}

              {user.birthdate && (
                <p>
                  <strong>Date de naissance :</strong>{" "}
                  {new Date(user.birthdate).toLocaleDateString("fr-FR")}
                </p>
              )}

              {user.promotion && (
                <p>
                  <strong>Promotion :</strong> {user.promotion}
                </p>
              )}
            </>
          )}

          {user.role === "teacher" && (
            <>
              <hr className="my-4" />
              <h3 className="font-semibold text-lg">Informations Enseignant</h3>

              {user.speciality && (
                <p>
                  <strong>Spécialité :</strong> {user.speciality}
                </p>
              )}

              {user.level && (
                <p>
                  <strong>Niveaux enseignés :</strong> {user.level}</p>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
