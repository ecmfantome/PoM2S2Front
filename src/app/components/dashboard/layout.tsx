"use client";

import Sidebar from "../dashboard/Sidebar";
import Header from "../dashboard/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Exemple (à adapter si tu récupères l'utilisateur ailleurs)
  const user = {
    name: "Cheikh",
    role: "admin",
    email: "admin@test.com",
  };

  return (
  
    <div className="h-screen flex flex-col">

     

       
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>

      </div>
  

  );
}
