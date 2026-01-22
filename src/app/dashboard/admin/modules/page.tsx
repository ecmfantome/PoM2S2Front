"use client";

import {  useEffectEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import AddModulePopup from "../../../components/dashboard/AddModulePopup";


export default function ModulesPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [modules, setModules] = useState<any[]>([]);
  const router = useRouter();

  async function loadModules() {
    const res = await fetch("/api/admin/module");
    const data = await res.json();
    setModules(data.modules ?? []);
  }

  async function deleteModule(id: string) {
    if (!confirm("Supprimer ce module ?")) return;
    await fetch(`/api/admin/module/${id}`, { method: "DELETE" });
    loadModules();
  }

  useEffectEvent(() => {
    loadModules();
  });

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Modules</h1>
      <AddModulePopup reload={loadModules} />
      </div>

      <table className="w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3">Nom</th>
            <th className="p-3">Code</th>
            <th className="p-3">Semestre</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {modules.map((m) => (
            <tr key={m.id} className="border-b">
              <td className="p-3">{m.name}</td>
              <td className="p-3">{m.code}</td>
              <td className="p-3">{m.semester}</td>
              <td className="p-3 flex gap-2">
                <Button size="sm" onClick={() => router.push(`/dashboard/admin/modules/view/${m.id}`)}>
                  Voir
                </Button>
                <Button size="sm" variant="outline" onClick={() => router.push(`/dashboard/admin/modules/edit/${m.id}`)}>
                  <Pencil size={14} />
                </Button>
                <Button size="sm" variant="destructive" onClick={() => deleteModule(m.id)}>
                  <Trash size={14} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
