"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { asyncSetUsers } from "../states/action";
import { formatDate } from "@/helpers/toolsHelper";
import {
  IconSearch,
  IconUsers,
  IconLoader2,
  IconMail,
  IconCalendar,
} from "@tabler/icons-react";

export function UsersPage() {
  const dispatch = useAppDispatch();
  const { users, isUsers } = useAppSelector((state) => state.users);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(asyncSetUsers());
  }, [dispatch]);

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;
    const q = searchQuery.toLowerCase();
    return users.filter(
      (u) =>
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q)
    );
  }, [users, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Daftar Pengguna
          </h1>
          <p className="text-sm text-slate-500">
            Temukan dan terhubung dengan mahasiswa serta anggota komunitas Delcom
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <IconSearch size={16} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama atau email..."
            className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
        </div>
      </div>

      {/* Users grid */}
      {isUsers && users.length === 0 ? (
        <div className="py-24 flex flex-col items-center justify-center text-slate-600" data-testid="users-loading">
          <IconLoader2 size={36} className="animate-spin text-blue-600 mb-2" />
          <p className="text-sm font-medium">Memuat data pengguna...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-500 mb-3">
            <IconUsers size={24} />
          </div>
          <h2 className="text-base font-semibold text-slate-800">
            Pengguna Tidak Ditemukan
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {searchQuery
              ? `Tidak ada pengguna yang cocok dengan pencarian "${searchQuery}".`
              : "Belum ada daftar pengguna."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition flex items-start space-x-4"
            >
              {user.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.photo}
                  alt=""
                  aria-hidden="true"
                  className="w-12 h-12 rounded-full object-cover border border-slate-200 shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm shrink-0">
                  {user.name ? user.name.slice(0, 2).toUpperCase() : "U"}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <h2 className="text-sm font-bold text-slate-800 truncate">
                  {user.name}
                </h2>
                <div className="flex items-center text-xs text-slate-500 mt-1 truncate">
                  <IconMail size={14} className="mr-1 shrink-0 text-slate-400" />
                  <span className="truncate">{user.email}</span>
                </div>
                <div className="flex items-center text-xs text-slate-500 mt-1">
                  <IconCalendar size={14} className="mr-1 shrink-0" />
                  <span>Bergabung {formatDate(user.created_at)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UsersPage;
