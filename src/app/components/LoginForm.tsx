// components/LoginForm.tsx
"use client";
import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";

export default function LoginForm() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [showPass, setShowPass] = useState(false);
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (!res.ok) {
        setErr(data.error || "Erreur de connexion");
        return;
      }

      setAuth(data.token, data.user);

      if (data.user.role === "admin") router.push("/dashboard/admin");
      else if (data.user.role === "teacher") router.push("/dashboard/teacher");
      else router.push("/dashboard/student");
    } catch (error) {
      setErr("Erreur réseau");
    }
  };

  return (
    <div className="min-h-screen md:w-3/5 flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden flex w-full max-w-5xl">
        <div className="hidden md:block w-2/5 relative">
          <Image src="/jeune-etudiant-apprenant-dans-la-bibliotheque.jpg" alt="Student" fill className="object-cover" />
        </div>

        <div className="w-full md:w-3/5 p-12 flex flex-col justify-center">
          <div className="text-center mb-6">
            <Image src="/4f984418-1b26-4f21-97be-1c6965c39022.jpg" width={65} height={65} alt="Logo" className="mx-auto" />
            <h2 className="text-blue-700 text-xl font-semibold mt-3 uppercase tracking-wide">
              Service Central d’Authentification
            </h2>
          </div>

          <form onSubmit={submit} className="space-y-5">
            {err && <p className="text-red-600 text-sm bg-red-100 p-2 rounded">{err}</p>}

            <div>
              <label className="text-sm font-medium">Email</label>
              <input required value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="w-full p-3 border rounded mt-1" />
            </div>

            <div>
              <label className="text-sm font-medium">Mot de passe</label>
              <div className="relative">
                <input required value={password} onChange={(e) => setPassword(e.target.value)} type={showPass ? "text" : "password"} className="w-full p-3 border rounded mt-1 pr-12" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                  {showPass ? <EyeOff size={22} /> : <Eye size={22} />}
                </button>
              </div>
            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded font-medium text-lg">Se Connecter</button>

            <div className="text-center">
              <a href="#" className="text-sm text-blue-700 underline">Mot de passe oublié ?</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
