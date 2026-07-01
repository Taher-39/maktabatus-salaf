"use client";

import { useEffect } from "react";
import { getMe } from "@/lib/api";
import { useAuthStore } from "@/lib/store";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { token, setAuth, clearAuth, setAuthReady, hydrationComplete } = useAuthStore();

  useEffect(() => {
    if (!hydrationComplete) return;

    if (!token) {
      setAuthReady();
      return;
    }

    let isMounted = true;
    getMe()
      .then((res) => {
        if (!isMounted) return;
        if (res.success && res.data) {
          setAuth(res.data, token);
        } else {
          clearAuth();
        }
      })
      .catch(() => {
        if (!isMounted) return;
        clearAuth();
      })
      .finally(() => {
        if (!isMounted) return;
        setAuthReady();
      });

    return () => {
      isMounted = false;
    };
  }, [token, hydrationComplete, setAuth, clearAuth, setAuthReady]);

  return <>{children}</>;
}
