"use client";

import Image from "next/image";
import { Bell, User, LogOut, Settings, User2, MessageCircle, Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Header({ user }: { user: any }) {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <header className="h-16 bg-white shadow flex items-center justify-between px-6">

      {/*LOGO + BIENVENUE */}
      <div className="flex items-center gap-4">
        <Menu className="md:hidden" />
        <Image
          src="/4f984418-1b26-4f21-97be-1c6965c39022.jpg"
          alt="CampusMaster"
          width={40}
          height={40}
          priority
        />

        <div className="leading-tight">
          <h2 className="text-sm text-gray-500">
            Bienvenue 👋
          </h2>
          <p className="text-lg font-semibold text-gray-800">
            {user?.name} {user?.lastName}
          </p>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex items-center gap-6">

        <Bell className="w-6 h-6 text-gray-600 cursor-pointer" />
        <MessageCircle className="w-6 h-6 text-gray-600 cursor-pointer" />

        <DropdownMenu>
          <DropdownMenuTrigger className="cursor-pointer focus:outline-none">
            <User className="w-6 h-6 text-gray-600" />
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-56 mr-4 bg-white shadow-lg border border-gray-200">
            <DropdownMenuLabel className="text-sm">
              Connecté en tant que :
              <br />
              <span className="font-semibold">{user?.email}</span>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() => router.push("/dashboard/profile")}>
              <User2 className="w-4 h-4 mr-2" />
              Mon Profil
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => router.push("/dashboard/settings")}>
              <Settings className="w-4 h-4 mr-2" />
              Paramètres
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="text-red-600"
              onClick={logout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Se déconnecter
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
