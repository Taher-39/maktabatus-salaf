"use client";

import { ToastProvider } from "@/components/shared/ToastProvider";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <ToastProvider>{children}</ToastProvider>;
}
