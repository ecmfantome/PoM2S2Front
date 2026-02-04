"use client";

import { useState } from "react";
import Sidebar from "@/app/components/dashboard/Sidebar";
import Header from "@/app/components/dashboard/Header";



export default function DashboardShell({
  user,
  children,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any;
  children: React.ReactNode;
}) {

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
    if (!user) return null;
    
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        role={user.role}
        isOpen={isSidebarOpen}
      />

      <div className="flex-1 flex flex-col w-full">
        <Header
          user={user}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        <main className="p-6 overflow-y-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
