export function redirectByRole(role: string) {
  switch (role) {
    case "admin": return "/dashboard/admin";
    case "teacher": return "/dashboard/teacher";
    case "student": return "/dashboard/student";
    default: return "/login";
  }
}
