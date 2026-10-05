"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  IconNews,
  IconUserCheck,
  IconUsers,
  IconUser,
  IconX,
} from "@tabler/icons-react";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function SidebarComponent({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const filter = searchParams?.get("filter");

  const isAllPosts = pathname === "/" && filter !== "my";
  const isMyPosts = pathname === "/" && filter === "my";
  const isUsers = pathname.startsWith("/users");
  const isProfile = pathname.startsWith("/profile");

  const navItems = [
    {
      label: "Semua Postingan",
      href: "/",
      active: isAllPosts,
      icon: <IconNews size={20} />,
    },
    {
      label: "Postingan Saya",
      href: "/?filter=my",
      active: isMyPosts,
      icon: <IconUserCheck size={20} />,
    },
    {
      label: "Daftar Pengguna",
      href: "/users",
      active: isUsers,
      icon: <IconUsers size={20} />,
    },
    {
      label: "Profil Saya",
      href: "/profile",
      active: isProfile,
      icon: <IconUser size={20} />,
    },
  ];

  const content = (
    <div className="flex flex-col h-full py-4">
      <nav className="space-y-1.5 px-3 flex-1" aria-label="Navigasi sidebar">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            onClick={onClose}
            className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition ${
              item.active
                ? "bg-blue-50 text-blue-700 font-semibold shadow-xs"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <span className={item.active ? "text-blue-600" : "text-slate-400"}>
              {item.icon}
            </span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="px-4 pt-4 border-t border-slate-100 text-xs text-slate-400">
        <p>Delcom Posts v1.0</p>
        <p>© 2026 Institut Teknologi Del</p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:block w-64 shrink-0 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)]">
        {content}
      </aside>

      {/* Mobile drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={onClose}
            aria-hidden="true"
          />
          <div className="fixed inset-y-0 left-0 w-72 bg-white shadow-2xl z-50 flex flex-col">
            <div className="px-4 py-4 flex items-center justify-between border-b border-slate-100">
              <span className="font-bold text-slate-800 text-lg">Menu Utama</span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Tutup menu"
                className="p-1 rounded-lg text-slate-500 hover:bg-slate-100"
              >
                <IconX size={20} />
              </button>
            </div>
            {content}
          </div>
        </div>
      )}
    </>
  );
}

export default SidebarComponent;
