"use client";

import React, { useEffect, useState, Suspense } from "react";
import { getAccessToken } from "@/helpers/apiHelper";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { asyncSetProfile } from "@/features/users/states/action";
import NavbarComponent from "../components/NavbarComponent";
import SidebarComponent from "../components/SidebarComponent";

interface PostLayoutProps {
  children: React.ReactNode;
}

export function PostLayout({ children }: PostLayoutProps) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = getAccessToken();
    if (token && !user) {
      dispatch(asyncSetProfile());
    }
  }, [dispatch, user]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <NavbarComponent onToggleSidebar={() => setSidebarOpen(true)} />
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Suspense fallback={<div className="hidden md:block w-64 shrink-0 bg-white border-r border-slate-200" />}>
          <SidebarComponent
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        </Suspense>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          <Suspense fallback={null}>
            {children}
          </Suspense>
        </main>
      </div>
    </div>
  );
}

export default PostLayout;
