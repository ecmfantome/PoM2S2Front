export type UserRole = "admin" | "teacher" | "student";

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  formation?: string;
  createdAt: string;
};

// ================================
// Empêche la réinitialisation en Dev
// ================================
declare global {
  var __users: User[] | undefined;
}

if (!global.__users) {
  global.__users = [
    {
      id: "u-admin-default",
      name: "Super Admin",
      email: "admin@campusmaster.test",
      password: "admin123",
      role: "admin",
      createdAt: "2024-01-01T00:00:00.000Z",
    },
    {
      id: "u-teacher-default",
      name: "Professeur Test",
      email: "teacher@test.com",
      password: "teach123",
      role: "teacher",
      createdAt: new Date().toISOString()
    },
    {
      id: "u-student-default",
      name: "Étudiant Test",
      email: "student@test.com",
      password: "stud123",
      role: "student",
      formation: "Licence Informatique",
      createdAt: new Date().toISOString()
    }
  ];
}


const users = global.__users;

// ================================
// Helpers
// ================================
export function getUsers() {
  return users;
}

export function findUserByEmail(email: string) {
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function findUserById(id: string) {
  return users.find((u) => u.id === id);
}

// ================================
// CRUD
// ================================
export function createUser(data: {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  formation?: string;
}) {
  const exists = findUserByEmail(data.email);
  if (exists) {
    throw new Error("Un utilisateur avec cet email existe déjà.");
  }

  const newUser: User = {
    id: `u-${data.role}-${Date.now()}`,
    name: data.name,
    email: data.email,
    password: data.password,
    role: data.role,
    formation: data.role === "student" ? data.formation : undefined,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  return newUser;
}

export function updateUser(id: string, updates: Partial<User>) {
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) throw new Error("Utilisateur introuvable.");

  users[index] = { ...users[index], ...updates };
  return users[index];
}

export function deleteUser(id: string) {
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) throw new Error("Utilisateur introuvable.");

  const deleted = users[index];
  users.splice(index, 1);
  return deleted;
}
