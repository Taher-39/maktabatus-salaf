"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { logout, api } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import DashboardLayout from "@/components/admin/DashboardLayout";
import { FiEdit2, FiSave, FiX } from "react-icons/fi";

export default function ProfilePage() {
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || "",
    village: user?.address?.village || "",
    thana: user?.address?.thana || "",
    district: user?.address?.district || "",
  });

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
    }
  }, [user, router]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      /* ignore */
    }
    clearAuth();
    router.push("/");
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.phone.trim()) {
      alert("Name and phone are required");
      return;
    }

    try {
      setLoading(true);
      await api.patch("/users/me", {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        address: {
          village: formData.village,
          thana: formData.thana,
          district: formData.district,
        },
      });
      alert("Profile updated successfully");
      setIsEditing(false);
    } catch (error: any) {
      console.error("Failed to update profile:", error);
      alert(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="p-6 max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Profile
          </h1>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 bg-blue-600 dark:bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition"
            >
              <FiEdit2 className="w-5 h-5" />
              Edit
            </button>
          )}
        </div>

        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          {isEditing ? (
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">
                  Phone *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">
                    Village
                  </label>
                  <input
                    type="text"
                    value={formData.village}
                    onChange={(e) =>
                      setFormData({ ...formData, village: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">
                    Thana
                  </label>
                  <input
                    type="text"
                    value={formData.thana}
                    onChange={(e) =>
                      setFormData({ ...formData, thana: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">
                    District
                  </label>
                  <input
                    type="text"
                    value={formData.district}
                    onChange={(e) =>
                      setFormData({ ...formData, district: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      name: user?.name || "",
                      phone: user?.phone || "",
                      email: user?.email || "",
                      village: user?.address?.village || "",
                      thana: user?.address?.thana || "",
                      district: user?.address?.district || "",
                    });
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  <FiX className="w-5 h-5" />
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 transition"
                >
                  <FiSave className="w-5 h-5" />
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Name</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {user.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {user.phone}
                  </p>
                </div>
                {user.email && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Email
                    </p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {user.email}
                    </p>
                  </div>
                )}
              </div>

              {user.address && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Address
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {[user.address.village, user.address.thana, user.address.district]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>
              )}

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Role</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                  {user.role}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Quick Links */}
        {user.role === "customer" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <Link
              href="/profile/orders"
              className="p-4 border-2 border-emerald-200 dark:border-emerald-700 rounded-lg text-center hover:bg-emerald-50 dark:hover:bg-emerald-900 transition"
            >
              <p className="font-semibold text-emerald-900 dark:text-emerald-100">
                My Orders
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                View your order history
              </p>
            </Link>
            <Link
              href="/orders/track"
              className="p-4 border-2 border-blue-200 dark:border-blue-700 rounded-lg text-center hover:bg-blue-50 dark:hover:bg-blue-900 transition"
            >
              <p className="font-semibold text-blue-900 dark:text-blue-100">
                Track Order
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Track a specific order
              </p>
            </Link>
          </div>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full px-4 py-3 bg-red-600 dark:bg-red-700 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition font-semibold"
        >
          Logout
        </button>
      </div>
    </DashboardLayout>
  );
}
