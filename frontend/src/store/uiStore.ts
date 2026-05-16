import { create } from "zustand";

interface UIStore {
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isAuthOpen: boolean;
  setIsAuthOpen: (open: boolean) => void;
  isAdminSidebarCollapsed: boolean;
  setIsAdminSidebarCollapsed: (collapsed: boolean) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  isCartOpen: false,
  setIsCartOpen: (isCartOpen) => set({ isCartOpen }),
  isAuthOpen: false,
  setIsAuthOpen: (isAuthOpen) => set({ isAuthOpen }),
  isAdminSidebarCollapsed: false,
  setIsAdminSidebarCollapsed: (isAdminSidebarCollapsed) => set({ isAdminSidebarCollapsed }),
}));
