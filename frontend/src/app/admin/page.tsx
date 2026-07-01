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
    router.replace("/auth/login");
    return;
  }
  if (user.role !== "admin") {
    router.replace("/profile");
    return;
  }

  const fetchStats = async () => {
    try {
      // Promise.all এর বদলে Promise.allSettled ব্যবহার করা হয়েছে
      const results = await Promise.allSettled([
        api.get("/books?limit=1"),
        api.get("/authors?limit=1"),
        api.get("/users?limit=1"),
        api.get("/orders?limit=1"),
      ]);

      // প্রতিটি রেসপন্স সফল হয়েছে কিনা চেক করে ডেটা নেওয়া
      const booksRes = results[0].status === "fulfilled" ? results[0].value : null;
      const authorsRes = results[1].status === "fulfilled" ? results[1].value : null;
      const usersRes = results[2].status === "fulfilled" ? results[2].value : null;
      const ordersRes = results[3].status === "fulfilled" ? results[3].value : null;

      // যদি কোনো এপিআই ফেইল করে তবে কনসোলে নির্দিষ্ট করে এরর দেখাবে
      results.forEach((result, index) => {
        if (result.status === "rejected") {
          const endpoints = ["/books", "/authors", "/users", "/orders"];
          console.error(`Failed to fetch from ${endpoints[index]}:`, result.reason);
        }
      });

      setStats({
        totalBooks: booksRes?.data?.meta?.total || 0,
        totalAuthors: authorsRes?.data?.meta?.total || 0,
        totalUsers: usersRes?.data?.meta?.total || 0,
        totalOrders: ordersRes?.data?.meta?.total || 0,
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
      <div className="mx-auto max-w-7xl p-6">
        <div className="mb-8 rounded-3xl border border-emerald-100 bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-700 p-6 text-white shadow-xl">
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-200">Operations overview</p>
          <h1 className="mt-2 text-3xl font-bold">Welcome, {user.name}!</h1>
          <p className="mt-3 max-w-2xl text-sm text-emerald-100">Track orders, monitor book performance and keep your store moving with a clearer daily snapshot.</p>
        </div>

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

        <div className="mb-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-emerald-700">Sales snapshot</p>
                <h2 className="text-lg font-bold text-gray-900">Weekly activity</h2>
              </div>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Updated today</span>
            </div>
            <div className="flex h-48 items-end gap-3">
              {[48, 72, 56, 82, 94, 69, 88].map((height, index) => (
                <div key={index} className="flex flex-1 flex-col items-center gap-2">
                  <div className="w-full rounded-t-xl bg-gradient-to-t from-emerald-700 to-amber-400" style={{ height: `${height}%` }} />
                  <span className="text-[10px] uppercase text-gray-500">{["S", "M", "T", "W", "T", "F", "S"][index]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-emerald-700">Distribution</p>
            <div className="mt-4 flex items-center justify-center">
              <div
                className="flex h-40 w-40 items-center justify-center rounded-full border-[16px] border-emerald-200"
                style={{ background: "conic-gradient(#059669 0 60%, #f59e0b 60% 85%, #6366f1 85% 100%)" }}
              >
                <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-white text-center">
                  <span className="text-xl font-bold text-gray-900">85%</span>
                  <span className="text-[10px] uppercase text-gray-500">Active</span>
                </div>
              </div>
            </div>
            <div className="mt-4 space-y-2 text-sm text-gray-600">
              <div className="flex items-center justify-between"><span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-emerald-600" />Orders</span><span>60%</span></div>
              <div className="flex items-center justify-between"><span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-amber-500" />Books</span><span>25%</span></div>
              <div className="flex items-center justify-between"><span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-indigo-500" />Users</span><span>15%</span></div>
            </div>
          </div>
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
