"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "@/components/admin/DashboardLayout";
import { banToggleUser, changeUserRole, deleteUser, getUsers } from "@/lib/api";

import type { User } from "@/lib/types";
import { useToast } from "@/components/shared/ToastProvider";
import { useAuthStore } from "@/lib/store";

type Role = "admin" | "customer";

// API returns createdAt/isBanned for users, but the shared User type doesn't include them.
type UserRow = User & {
  isBanned?: boolean;
  createdAt?: string;
};




type UsersResponse = {

  data: User[];
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPage?: number;
  };
};

export default function AdminUsersPage() {
  const { user } = useAuthStore();
  const toast = useToast();

  const [users, setUsers] = useState<UserRow[]>([]);

  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [search, setSearch] = useState("");
  const [isBanned, setIsBanned] = useState<boolean | "all">("all");

  const [meta, setMeta] = useState<NonNullable<UsersResponse["meta"]>>({
    total: 0,
    page: 1,
    limit: 10,
    totalPage: 0,
  });

  const canUse = user?.role === "admin";

  const fetchUsers = async () => {
    if (!canUse) return;
    setLoading(true);
    try {
      const params: any = { page, limit };
      if (search.trim()) params.search = search.trim();
      if (isBanned !== "all") params.isBanned = isBanned;

      const res = (await getUsers(params)) as any;
      const payload = res.data as UsersResponse;

      // Current backend returns: sendResponse(res, 200, ..., result.data, result.meta)
      // so frontend receives ApiResponse<{data,meta}> and Axios maps: {success,message,data,meta?}
      // In case your wrapper differs, fall back to res.data/res.data.data.
      const usersList: User[] =
        (res?.data as any)?.data ?? (res as any)?.data ?? [];

      setUsers(usersList);
      setMeta(
        (res?.data as any)?.meta ??
          (res as any)?.meta ??
          payload?.meta ??
          { total: 0, page, limit, totalPage: 0 }
      );
    } catch (e) {
      console.error(e);
      toast.showToast("ইউজার লোড করতে ব্যর্থ হয়েছে", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, search, isBanned, canUse]);

  const totalPages = meta.totalPage ?? 0;

  const currentFiltersText = useMemo(() => {
    const s = search.trim() ? `search: ${search.trim()}` : "";
    const b = isBanned === "all" ? "all" : isBanned ? "banned" : "active";
    return [s, `filter: ${b}`].filter(Boolean).join(" | ");
  }, [search, isBanned]);

  const onToggleBan = async (id: string) => {
    try {
      const res = await banToggleUser(id);
      toast.showToast(res.message || "স্ট্যাটাস আপডেট হয়েছে", "success");
      await fetchUsers();
    } catch (e: any) {
      toast.showToast(e?.response?.data?.message || "অপারেশন ব্যর্থ", "error");
    }
  };

  const onChangeRole = async (id: string, role: Role) => {
    try {
      const res = await changeUserRole(id, role);
      toast.showToast(res.message || "Role আপডেট হয়েছে", "success");
      await fetchUsers();
    } catch (e: any) {
      toast.showToast(e?.response?.data?.message || "Role পরিবর্তন ব্যর্থ", "error");
    }
  };

  const onDelete = async (id: string) => {
    if (!confirm("এই ইউজারটি ডিলিট করবেন?")) return;
    try {
      const res = await deleteUser(id);
      toast.showToast(res.message || "ইউজার ডিলিট হয়েছে", "success");
      await fetchUsers();
    } catch (e: any) {
      toast.showToast(e?.response?.data?.message || "ডিলিট ব্যর্থ", "error");
    }
  };

  if (!user || user.role !== "admin") return null;

  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Users</h1>
          <p className="mt-2 text-gray-600">{currentFiltersText}</p>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-4">
          <div className="flex flex-col md:flex-row gap-3 md:items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Search (name/phone)</label>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Type to search..."
                className="mt-1 w-full rounded border border-gray-200 px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Ban filter</label>
              <select
                value={isBanned === "all" ? "all" : isBanned ? "true" : "false"}
                onChange={(e) => {
                  const v = e.target.value;
                  if (v === "all") setIsBanned("all");
                  else setIsBanned(v === "true");
                }}
                className="mt-1 rounded border border-gray-200 px-3 py-2"
              >
                <option value="all">All</option>
                <option value="false">Active</option>
                <option value="true">Banned</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button
                className="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700"
                onClick={() => fetchUsers()}
                disabled={loading}
              >
                {loading ? "Loading..." : "Apply"}
              </button>
              <button
                className="px-4 py-2 rounded border border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                onClick={() => {
                  setSearch("");
                  setIsBanned("all");
                  setPage(1);
                }}
                disabled={loading}
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Name</th>
                  <th className="px-4 py-3 text-left font-semibold">Phone</th>
                  <th className="px-4 py-3 text-left font-semibold">Role</th>
                  <th className="px-4 py-3 text-left font-semibold">Status</th>
                  <th className="px-4 py-3 text-left font-semibold">Created</th>
                  <th className="px-4 py-3 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="px-4 py-3 font-medium">{u.name}</td>
                    <td className="px-4 py-3">{u.phone}</td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          u.role === "admin"
                            ? "inline-flex items-center rounded-full bg-emerald-100 text-emerald-800 px-3 py-1 text-xs font-semibold"
                            : "inline-flex items-center rounded-full bg-blue-100 text-blue-800 px-3 py-1 text-xs font-semibold"
                        }
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          u.isBanned
                            ? "inline-flex items-center rounded-full bg-red-100 text-red-700 px-3 py-1 text-xs font-semibold"
                            : "inline-flex items-center rounded-full bg-emerald-100 text-emerald-700 px-3 py-1 text-xs font-semibold"
                        }
                      >
                        {u.isBanned ? "Banned" : "Active"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "-"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        {/* Role change */}
                        <button
                          className="px-3 py-1 rounded bg-amber-500 text-white hover:bg-amber-600 text-xs"
                          onClick={() => onChangeRole(u._id, u.role === "admin" ? "customer" : "admin")}
                        >
                          Make {u.role === "admin" ? "Customer" : "Admin"}
                        </button>


                        <button
                          className="px-3 py-1 rounded border border-gray-200 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 text-xs"
                          onClick={() => onToggleBan(u._id)}
                          disabled={u.role === "admin"}
                          title={u.role === "admin" ? "Admin ban করা যাবে না" : ""}
                        >
                          {u.isBanned ? "Unban" : "Ban"}
                        </button>

                        <button
                          className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 text-xs"
                          onClick={() => onDelete(u._id)}
                          disabled={u.role === "admin"}
                          title={u.role === "admin" ? "Admin delete করা যাবে না" : ""}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {users.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-gray-500">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <div className="text-gray-600 text-sm">
            Total: <span className="font-semibold">{meta.total ?? 0}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-2 rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
            >
              Prev
            </button>
            <span className="px-3 py-2 text-sm">
              Page <b>{page}</b> / {totalPages || 1}
            </span>
            <button
              className="px-3 py-2 rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
              onClick={() => setPage((p) => Math.min(totalPages || p + 1, p + 1))}
              disabled={totalPages ? page >= totalPages : false}
            >
              Next
            </button>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className="ml-2 rounded border border-gray-200 px-3 py-2 text-sm"
            >
              {[5, 10, 20, 50].map((n) => (
                <option key={n} value={n}>
                  {n}/page
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

