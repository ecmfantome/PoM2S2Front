import { cookies } from "next/headers";
import DashboardShell from "./DashboardShell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookie = (await cookies()).get("campus_user")?.value;
  let user = null;

  if (cookie) {
    user = JSON.parse(Buffer.from(cookie, "base64").toString());
  }

  return (
    <DashboardShell user={user}>
      {children}
    </DashboardShell>
  );
}
