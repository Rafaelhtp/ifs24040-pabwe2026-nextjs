"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { asyncSetIsAuthLogout } from "@/features/auth/states/action";
import { showConfirmDialog } from "@/helpers/toolsHelper";
import {
  IconMenu2,
  IconLogout,
  IconUser,
  IconChevronDown,
} from "@tabler/icons-react";

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export function NavbarComponent({ onToggleSidebar }: NavbarProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    setDropdownOpen(false);
    const confirmed = await showConfirmDialog("Apakah Anda yakin ingin keluar dari aplikasi?");
    if (confirmed) {
      await dispatch(asyncSetIsAuthLogout());
      router.push("/auth/login");
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            aria-label="Buka menu navigasi"
            className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-hidden"
          >
            <IconMenu2 size={24} />
          </button>

          <Link href="/" className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center shadow-md shadow-blue-500/20">
              DP
            </div>
            <span className="font-extrabold text-lg text-slate-800 tracking-tight hidden sm:inline-block">
              Delcom Posts
            </span>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <button
              type="button"
              id="user-menu-button"
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2.5 p-1.5 rounded-xl hover:bg-slate-100 transition focus:outline-hidden"
            >
              {user?.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.photo}
                  alt={user?.name || "Profil"}
                  className="w-8 h-8 rounded-full object-cover border border-slate-200"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-semibold flex items-center justify-center text-xs border border-blue-200">
                  {user?.name ? user.name.slice(0, 2).toUpperCase() : "U"}
                </div>
              )}
              <span className="text-sm font-medium text-slate-700 hidden md:inline-block max-w-[120px] truncate">
                {user?.name || "Pengguna"}
              </span>
              <IconChevronDown size={16} className="text-slate-500 hidden md:inline-block" />
            </button>

            {dropdownOpen && (
              <div
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="user-menu-button"
                className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 z-40"
              >
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-xs text-slate-400 font-medium">Masuk sebagai</p>
                  <p className="text-sm font-semibold text-slate-800 truncate">{user?.name || "Pengguna"}</p>
                  <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                </div>

                <Link
                  href="/profile"
                  role="menuitem"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center space-x-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition"
                >
                  <IconUser size={16} className="text-slate-500" />
                  <span>Profil Saya</span>
                </Link>

                <button
                  type="button"
                  role="menuitem"
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition text-left"
                >
                  <IconLogout size={16} className="text-red-500" />
                  <span>Keluar</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default NavbarComponent;
