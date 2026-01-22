"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Shield,
  Users2,
  Layers,
  BookOpen,
  Calendar,
  PlusSquare,
  ClipboardList,
  FileText,
  Book,
  Download,
  Menu,
} from "lucide-react";

type MenuItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

export default function Sidebar({
  role,
}: {
  role: "admin" | "teacher" | "student";
}) {
  const path = usePathname();

  const adminMenus: MenuItem[] = [
    { label: "Tableau de bord", href: "/dashboard/admin", icon: <LayoutDashboard size={18} /> },
    { label: "Étudiants", href: "/dashboard/admin/students", icon: <Users size={18} /> },
    { label: "Enseignants", href: "/dashboard/admin/teachers", icon: <UserCheck size={18} /> },
    { label: "Administrateurs", href: "/dashboard/admin/admins", icon: <Shield size={18} /> },
    { label: "Utilisateurs (tous)", href: "/dashboard/admin/users", icon: <Users2 size={18} /> },
    { label: "Modules", href: "/dashboard/admin/modules", icon: <Layers size={18} /> },
    { label: "Matières", href: "/dashboard/admin/subjects", icon: <BookOpen size={18} /> },
    { label: "Semestres", href: "/dashboard/admin/semesters", icon: <Calendar size={18} /> },
  ];

  const teacherMenus: MenuItem[] = [
    { label: "Tableau de bord", href: "/dashboard/teacher", icon: <LayoutDashboard size={18} /> },
    { label: "Ajouter un cours", href: "/dashboard/teacher/courses", icon: <PlusSquare size={18} /> },
    { label: "Devoirs", href: "/dashboard/teacher/homeworks", icon: <ClipboardList size={18} /> },
    { label: "Documents", href: "/dashboard/teacher/resources", icon: <FileText size={18} /> },
  ];

  const studentMenus: MenuItem[] = [
    { label: "Tableau de bord", href: "/dashboard/student", icon: <LayoutDashboard size={18} /> },
    { label: "Mes cours", href: "/dashboard/student/courses", icon: <Book size={18} /> },
    { label: "Télécharger documents", href: "/dashboard/student/resources", icon: <Download size={18} /> },
  ];

  const menus =
    role === "admin"
      ? adminMenus
      : role === "teacher"
      ? teacherMenus
      : studentMenus;

  return (
    <>
    
    <aside className="hidden w-64 bg-blue-600 text-white p-6 md:flex flex-col">

      {/* 🔵 LOGO */}
      <div className="flex flex-col items-center mb-8">
        <h1 className="mt-3 text-lg font-bold tracking-wide">
          CampusMaster
        </h1>
      </div>

      {/* 🔵 MENU */}
      <nav className="space-y-1 flex-1">
        {menus.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-2 rounded-md transition ${
              path === item.href
                ? "bg-blue-800 font-semibold"
                : "hover:bg-blue-700"
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
    </>
  );
}
