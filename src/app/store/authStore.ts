// stores/authStore.ts
"use client";
import {create }from "zustand";
import { persist } from "zustand/middleware";

type User = {
  userId: string;
  name: string;
  lastName: string;
  email: string;
  phone: string;
  role: "ADMIN" | "TEACHER" | "STUDENT";
  isActive: boolean;
};

type AuthState = {
  token: string | null;
  user: User | null;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: (token, user) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
    }),
    { name: "campusmaster-auth" }
  )
);
