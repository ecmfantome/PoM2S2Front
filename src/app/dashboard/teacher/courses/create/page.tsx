"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";
export default function CreateCoursePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function submit(e: any) {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.target);

    await fetch("/api/teacher/courses/create", {
      method: "POST",
      body: JSON.stringify({
        title: form.get("title"),
        description: form.get("description"),
      }),
    });

    router.push("/dashboard/teacher/courses");
  }
  function closePopup() {
    setOpen(false);
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <Dialog open={open} onClose={closePopup} className="relative z-50">
  {/* Overlay */}
  <div
    className="fixed inset-0 bg-black/40"
    aria-hidden="true"
  />

  {/* Conteneur centré */}
  <div className="fixed inset-0 flex items-center justify-center">
    <Dialog.Panel className="bg-white p-6 rounded shadow-lg w-96 relative">
      
      <button
        className="absolute top-3 right-3 text-gray-500 hover:text-black"
        onClick={() => router.push("/dashboard/teacher/courses")}
      >
        <X size={22} />
      </button>

      <Dialog.Title className="text-lg font-semibold text-center mb-4">
        Ajouter un cours
      </Dialog.Title>

      <form onSubmit={submit} className="space-y-4">
        <Input name="title" placeholder="Titre du cours" required  className="border border-gray-500 outline-none focus:ring-2 focus:ring-blue-600"/>
        <Textarea name="description" placeholder="Description…" required
        className="border border-gray-500 outline-none focus:ring-2 focus:ring-blue-600" />

        <Button disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white text-md rounded-md mt-3 p-3 w-full">
          {loading ? "Enregistrement..." : "Créer"}
        </Button>
      </form>

    </Dialog.Panel>
  </div>
</Dialog>

    </div>
  );
}
