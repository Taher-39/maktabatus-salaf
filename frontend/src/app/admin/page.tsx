"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import {
  FiBook,
  FiUsers,
  FiShoppingCart,
} from "react-icons/fi";
import DashboardLayout from "@/components/admin/DashboardLayout";

interface Stats {
  totalBooks: number;
  totalAuthors: number;
  totalUsers: number;
  totalOrders: number;
}

export default function AdminOverviewPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [stats, setStats] = useState<Stats>({
    totalBooks: 0,
    totalAuthors: 0,
    totalUsers: 0,
    totalOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
      return;
    }
    if (user.role !== "admin") {
      router.push("/profile");
      return;
    }

    const fetchStats = async () => {
      try {
        const [booksRes, authorsRes, usersRes, ordersRes] = await Promise.all([
          api.get("/books?limit=1"),
          api.get("/authors?limit=1"),
          api.get("/users?limit=1"),
          api.get("/orders?limit=1"),
        ]);

        setStats({
          totalBooks: booksRes.data?.meta?.total || 0,
          totalAuthors: authorsRes.data?.meta?.total || 0,
          totalUsers: usersRes.data?.meta?.total || 0,
          totalOrders: ordersRes.data?.meta?.total || 0,
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user, router]);

  if (!user || user.role !== "admin") return null;

  const statCards = [
    {
      label: "Total Books",
      value: stats.totalBooks,
      icon: <FiBook className="w-8 h-8" />,
      bgColor: "bg-blue-100 dark:bg-blue-900",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      label: "Total Authors",
      value: stats.totalAuthors,
      icon: <FiUsers className="w-8 h-8" />,
      bgColor: "bg-purple-100 dark:bg-purple-900",
      iconColor: "text-purple-600 dark:text-purple-400",
    },
    {
      label: "Total Users",
      value: stats.totalUsers,
      icon: <FiUsers className="w-8 h-8" />,
      bgColor: "bg-green-100 dark:bg-green-900",
      iconColor: "text-green-600 dark:text-green-400",
    },
    {
      label: "Total Orders",
      value: stats.totalOrders,
      icon: <FiShoppingCart className="w-8 h-8" />,
      bgColor: "bg-orange-100 dark:bg-orange-900",
      iconColor: "text-orange-600 dark:text-orange-400",
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Welcome, {user.name}!
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                    {loading ? "..." : stat.value}
                  </p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <div className={stat.iconColor}>{stat.icon}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="/admin/authors"
              className="p-4 border-2 border-emerald-200 dark:border-emerald-700 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900 transition"
            >
              <p className="font-semibold text-emerald-900 dark:text-emerald-100">
                Manage Authors
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Add, edit, or delete authors
              </p>
            </a>
            <a
              href="/admin/books"
              className="p-4 border-2 border-blue-200 dark:border-blue-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900 transition"
            >
              <p className="font-semibold text-blue-900 dark:text-blue-100">
                Manage Books
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Add, edit, or delete books
              </p>
            </a>
            <a
              href="/admin/users"
              className="p-4 border-2 border-purple-200 dark:border-purple-700 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900 transition"
            >
              <p className="font-semibold text-purple-900 dark:text-purple-100">
                Manage Users
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                View and manage user accounts
              </p>
            </a>
            <a
              href="/admin/orders"
              className="p-4 border-2 border-orange-200 dark:border-orange-700 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900 transition"
            >
              <p className="font-semibold text-orange-900 dark:text-orange-100">
                View Orders
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Check order status and details
              </p>
            </a>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
