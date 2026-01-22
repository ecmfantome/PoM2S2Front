// src/app/dashboard/layout.tsx
import Sidebar from "../components/dashboard/Sidebar";
import Header  from "../components/dashboard/Header";
import { cookies } from "next/headers";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookie = (await cookies()).get("campus_user")?.value;
  let user = null;

  if (cookie) {
    user = JSON.parse(Buffer.from(cookie, "base64").toString());
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar role={user?.role} />

      <div className="flex-1 flex flex-col">
        <Header user={user} />

        <main className="p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
