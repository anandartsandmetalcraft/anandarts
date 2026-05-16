"use client";

import { useUIStore } from "@/store/uiStore";

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const { isAdminSidebarCollapsed } = useUIStore();

  return (
    <main 
      className={`flex-1 min-h-screen overflow-y-auto print:ml-0 print:overflow-visible transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isAdminSidebarCollapsed ? "lg:ml-20" : "lg:ml-64"
      }`}
    >
      {children}
    </main>
  );
}
