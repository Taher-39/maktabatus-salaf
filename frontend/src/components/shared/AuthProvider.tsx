"use client";

import { useEffect } from "react";
import { getMe } from "@/lib/api";
import { useAuthStore } from "@/lib/store";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { token, setAuth, clearAuth } = useAuthStore();

  useEffect(() => {
    if (!token) return;
    getMe()
      .then((res) => {
        if (res.success && res.data) {
          setAuth(res.data, token);
        } else {
          clearAuth();
        }
      })
      .catch(() => clearAuth());
  }, [token, setAuth, clearAuth]);

  return <>{children}</>;
}
