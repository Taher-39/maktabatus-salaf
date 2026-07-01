"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { useEffect } from "react";
import {
  FiMenu,
  FiX,
  FiHome,
  FiUsers,
  FiBook,
  FiBarChart,
  FiSettings,
  FiLogOut,
  FiUser,
  FiPackage,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface DashboardNavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, clearAuth, authReady } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [ready, setReady] = useState(false);

  const adminNavItems: DashboardNavItem[] = [
    { href: "/admin", label: "Overview", icon: <FiHome className="w-5 h-5" /> },
    {
      href: "/admin/users",
      label: "Manage Users",
      icon: <FiUsers className="w-5 h-5" />,
    },
    {
      href: "/admin/authors",
      label: "Manage Authors",
      icon: <FiBook className="w-5 h-5" />,
    },
    {
      href: "/admin/categories",
      label: "Categories",
      icon: <FiBarChart className="w-5 h-5" />,
    },
    {
      href: "/admin/publishers",
      label: "Publishers",
      icon: <FiPackage className="w-5 h-5" />,
    },
    {
      href: "/admin/books",
      label: "Books",
      icon: <FiBook className="w-5 h-5" />,
    },
    {
      href: "/admin/blogs",
      label: "Blogs",
      icon: <FiBarChart className="w-5 h-5" />,
    },
    {
      href: "/admin/orders",
      label: "Orders",
      icon: <FiBarChart className="w-5 h-5" />,
    },
     {
      href: "/orders/track",
      label: "Track Order",
      icon: <FiBook className="w-5 h-5" />,
    },
  ];

  const userNavItems: DashboardNavItem[] = [
    { href: "/dashboard", label: "Overview", icon: <FiHome className="w-5 h-5" /> },
    {
      href: "/profile",
      label: "My Profile",
      icon: <FiUser className="w-5 h-5" />,
    },
    {
      href: "/profile/orders",
      label: "My Orders",
      icon: <FiBook className="w-5 h-5" />,
    },
    {
      href: "/orders/track",
      label: "Track Order",
      icon: <FiBook className="w-5 h-5" />,
    },
    {
      href: "/profile/change-password",
      label: "Change Password",
      icon: <FiSettings className="w-5 h-5" />,
    },
  ];

  const navItems = user?.role === "admin" ? adminNavItems : userNavItems;

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready || !authReady) return;
    if (!user) {
      router.replace("/auth/login");
      return;
    }
  }, [ready, authReady, user, router]);

  const handleLogout = () => {
    clearAuth();
    router.replace("/auth/login");
  };

  if (!ready || !authReady || !user) return null;

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-800 text-white shadow-2xl transform transition-all duration-300 ease-in-out md:relative md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          sidebarCollapsed ? "w-20" : "w-64"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between border-b border-emerald-800/80 p-4">
            {!sidebarCollapsed ? (
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-emerald-200">Control Panel</p>
                <h1 className="text-lg font-semibold">Dashboard</h1>
              </div>
            ) : (
              <div className="mx-auto h-10 w-10 rounded-full bg-amber-500/20 p-2 text-amber-300">
                <FiBook className="h-6 w-6" />
              </div>
            )}
            <button
              className="hidden rounded-full p-2 hover:bg-emerald-800 md:block"
              onClick={() => setSidebarCollapsed((prev) => !prev)}
              aria-label="Collapse sidebar"
            >
              {sidebarCollapsed ? <FiChevronRight className="h-5 w-5" /> : <FiChevronLeft className="h-5 w-5" />}
            </button>
            <button
              className="md:hidden"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-3 transition",
                  pathname === item.href
                    ? "bg-amber-500 font-semibold text-emerald-950 shadow-lg"
                    : "text-emerald-100 hover:bg-emerald-800/70",
                  sidebarCollapsed && "justify-center px-2"
                )}
              >
                <span className="shrink-0">{item.icon}</span>
                {!sidebarCollapsed && <span>{item.label}</span>}
              </Link>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="border-t border-emerald-800/80 p-4">
            <button
              onClick={handleLogout}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl bg-red-500/90 px-4 py-3 text-white shadow-sm transition hover:bg-red-600",
                sidebarCollapsed && "justify-center px-2"
              )}
            >
              <FiLogOut className="h-5 w-5" />
              {!sidebarCollapsed && <span>Logout</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              className="text-emerald-900 dark:text-emerald-100 md:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle sidebar"
            >
              <FiMenu className="h-6 w-6" />
            </button>

            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-600">Welcome back</p>
              <h2 className="text-xl font-bold text-emerald-900 dark:text-emerald-100 sm:text-2xl">
                {user?.role === "admin" ? "Admin Dashboard" : "User Dashboard"}
              </h2>
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdown(!profileDropdown)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
              >
                <FiUser className="w-5 h-5" />
                <span className="hidden sm:inline">{user?.name}</span>
              </button>

              {profileDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-10">
                  <Link
                    href="/profile"
                    onClick={() => setProfileDropdown(false)}
                    className="block px-4 py-2 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition first:rounded-t-lg"
                  >
                    Profile
                  </Link>
                  <Link
                    href="/profile/change-password"
                    onClick={() => setProfileDropdown(false)}
                    className="block px-4 py-2 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    Change Password
                  </Link>
                  <button
                    onClick={() => {
                      setProfileDropdown(false);
                      handleLogout();
                    }}
                    className="w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 transition last:rounded-b-lg border-t border-gray-200 dark:border-gray-700"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
          {children}
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}


