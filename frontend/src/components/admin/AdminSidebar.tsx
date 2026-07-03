"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { 
  BarChart3, 
  ShoppingBag, 
  Truck, 
  LogOut, 
  ArrowLeft, 
  Package, 
  Tag, 
  CreditCard, 
  User, 
  Users,
  Menu, 
  X, 
  ChevronDown,
  Sparkles,
  ShieldCheck,
  Compass,
  LayoutGrid,
  History
} from "lucide-react";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { useUIStore } from "@/store/uiStore";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

const MENU_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: Compass },
  {
    label: "Products",
    href: "/admin/products",
    icon: ShoppingBag,
    subItems: [
      { label: "List View", href: "/admin/products" },
      { label: "Overview", href: "/admin/products/overview" },
      { label: "Create Product", href: "/admin/products/new" },
      { label: "Categories", href: "/admin/categories" },
    ],
  },
  {
    label: "Orders",
    href: "/admin/orders",
    icon: Truck,
    subItems: [
      { label: "Order List", href: "/admin/orders" },
      { label: "Order Overview", href: "/admin/orders/overview" },
    ],
  },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { 
    label: "Shipping", 
    href: "/admin/shipping", 
    icon: Package,
    subItems: [
      { label: "Shipping List", href: "/admin/shipping/list" },
      { label: "Shipments", href: "/admin/shipping/shipments" },
    ],
  },
  { label: "Coupons", href: "/admin/coupons", icon: Sparkles },
  { 
    label: "Invoices", 
    href: "/admin/invoices", 
    icon: CreditCard,
    subItems: [
      { label: "List View", href: "/admin/invoices" },
      { label: "Overview", href: "/admin/invoices/overview" },
      { label: "Create Invoice", href: "/admin/invoices/new" },
    ],
  },
  { label: "Activity Log", href: "/admin/activity", icon: History },
  { label: "Account", href: "/admin/account", icon: User },
];

export default function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { isAdminSidebarCollapsed, setIsAdminSidebarCollapsed } = useUIStore();
  const [isOpen, setIsOpen] = useState(false);
  const [ordersOpen, setOrdersOpen] = useState(pathname.startsWith("/admin/orders"));
  const [productsOpen, setProductsOpen] = useState(pathname.startsWith("/admin/products") || pathname.startsWith("/admin/categories"));
  const [shippingOpen, setShippingOpen] = useState(pathname.startsWith("/admin/shipping"));
  const [invoicesOpen, setInvoicesOpen] = useState(pathname.startsWith("/admin/invoices"));

  const getMenuState = (label: string) => {
    if (label === "Products") return productsOpen;
    if (label === "Orders") return ordersOpen;
    if (label === "Shipping") return shippingOpen;
    if (label === "Invoices") return invoicesOpen;
    return false;
  };

  const setMenuState = (label: string, val: boolean) => {
    if (label === "Products") setProductsOpen(val);
    if (label === "Orders") setOrdersOpen(val);
    if (label === "Shipping") setShippingOpen(val);
    if (label === "Invoices") setInvoicesOpen(val);
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#FBFAF5] border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <Link href="/admin" className="font-display text-xl font-semibold text-[#0F172A]">
          Anand Arts <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] ml-2">Admin</span>
        </Link>
        <button 
          onClick={() => setIsOpen(true)} 
          className="p-2.5 rounded-2xl bg-[#0F172A] text-white shadow-lg active:scale-95 transition-transform"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 transform bg-[#0F172A] text-white transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] border-r border-white/10 lg:translate-x-0 ${
          isAdminSidebarCollapsed ? "lg:w-20" : "lg:w-64"
        } ${isOpen ? "translate-x-0 w-72 max-w-[85vw] shadow-2xl" : "-translate-x-full"}`}
      >
        
        {/* Logo Section */}
        <div className={`flex items-center justify-between py-10 transition-all ${isAdminSidebarCollapsed ? "px-4 justify-center" : "px-8"}`}>
          <Link href="/collections" className="flex items-center gap-4 group">
            <div className="relative">
              <div className="absolute -inset-1 bg-[#D4AF37]/30 blur rounded-lg group-hover:bg-[#D4AF37]/50 transition-all"></div>
              <div className="relative bg-[#1E293B] p-2 rounded-lg border border-white/10">
                <Image
                  src="/Logo.png"
                  alt="Anand Arts Logo"
                  width={24}
                  height={24}
                  className="rounded-sm"
                  priority={true}
                />
              </div>
            </div>
            {!isAdminSidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
              >
                <h1 className="font-display text-lg font-bold leading-none tracking-tight">Anand Arts</h1>
                <p className="text-[9px] uppercase tracking-[0.3em] text-[#D4AF37] mt-1 font-semibold">Admin Panel</p>
              </motion.div>
            )}
          </Link>
          
          <button 
            className="lg:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70" 
            onClick={() => setIsOpen(false)}
          >
            <X size={18} />
          </button>

          {!isOpen && (
            <button 
              onClick={() => setIsAdminSidebarCollapsed(!isAdminSidebarCollapsed)}
              className="hidden lg:flex absolute -right-3 top-12 h-6 w-6 items-center justify-center rounded-full bg-[#D4AF37] text-[#0F172A] shadow-lg border-2 border-[#0F172A] hover:scale-110 transition-transform z-50"
            >
              {isAdminSidebarCollapsed ? <PanelLeftOpen size={12} /> : <PanelLeftClose size={12} />}
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto mt-4 custom-scrollbar">
          {MENU_ITEMS.map((item) => {
            const isSectionActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const isActive = pathname === item.href;

            if (item.subItems) {
              const menuOpen = getMenuState(item.label);
              const setMenuOpen = (val: boolean) => setMenuState(item.label, val);

              return (
                <div key={item.href} className="space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      if (isAdminSidebarCollapsed) {
                        setIsAdminSidebarCollapsed(false);
                        setMenuOpen(true);
                      } else {
                        setMenuOpen(!menuOpen);
                      }
                    }}
                    className={`flex w-full items-center gap-3 py-4 rounded-2xl font-ui text-[11px] font-bold uppercase tracking-[0.15em] transition-all group ${
                      isAdminSidebarCollapsed ? "px-0 justify-center" : "px-5 justify-between"
                    } ${isSectionActive ? "bg-white/5 text-[#D4AF37]" : "text-white/60 hover:text-white hover:bg-white/5"}`}
                  >
                    <span className={`flex items-center ${isAdminSidebarCollapsed ? "gap-0" : "gap-4"}`}>
                      <item.icon 
                        size={isAdminSidebarCollapsed ? 20 : 18} 
                        className={`${isSectionActive ? "text-[#D4AF37]" : "text-white/40 group-hover:text-white/60"} transition-colors`} 
                      />
                      {!isAdminSidebarCollapsed && <span>{item.label}</span>}
                    </span>
                    {!isAdminSidebarCollapsed && <ChevronDown size={14} className={`${menuOpen ? "rotate-180" : ""} transition-transform text-white/30`} />}
                  </button>
                  
                  <AnimatePresence>
                    {menuOpen && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-white/[0.02] rounded-2xl mb-2"
                      >
                        <div className="py-2 pl-12 pr-4 space-y-1 border-l border-white/10 ml-7 my-1">
                          {item.subItems.map((sub) => {
                            const isSubActive = pathname === sub.href;
                            return (
                              <Link
                                key={sub.href}
                                href={sub.href}
                                onClick={() => setIsOpen(false)}
                                className={`block rounded-xl px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${isSubActive ? "text-[#D4AF37]" : "text-white/40 hover:text-white/70"}`}
                              >
                                {sub.label}
                              </Link>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center rounded-2xl font-ui text-[11px] font-bold uppercase tracking-[0.15em] transition-all group relative ${
                  isAdminSidebarCollapsed ? "px-0 py-4 justify-center" : "px-5 py-4 gap-4"
                } ${isActive ? "bg-white/5 text-[#D4AF37]" : "text-white/60 hover:text-white hover:bg-white/5"}`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="sidebar-active"
                    className={`absolute inset-y-4 left-0 w-1 bg-[#D4AF37] rounded-r-full ${isAdminSidebarCollapsed ? "hidden" : ""}`}
                  />
                )}
                <item.icon 
                  size={isAdminSidebarCollapsed ? 20 : 18} 
                  className={`${isActive ? "text-[#D4AF37]" : "text-white/40 group-hover:text-white/60"} transition-colors`} 
                />
                {!isAdminSidebarCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className={`p-6 border-t border-white/5 space-y-3 mt-auto ${isAdminSidebarCollapsed ? "flex flex-col items-center" : ""}`}>
          <Link
            href="/collections"
            onClick={() => setIsOpen(false)}
            className={`flex items-center text-white/40 hover:text-[#D4AF37] transition-all font-ui text-[10px] font-bold uppercase tracking-[0.2em] ${
              isAdminSidebarCollapsed ? "px-0 py-3 justify-center" : "px-5 py-3 gap-4"
            }`}
          >
            <ArrowLeft size={isAdminSidebarCollapsed ? 20 : 16} /> 
            {!isAdminSidebarCollapsed && <span>Back to Store</span>}
          </Link>
          <button
            onClick={async () => {
              await signOut({ redirect: false });
              router.replace("/admin-login");
              setIsOpen(false);
            }}
            className={`w-full flex items-center text-rose-400 hover:bg-rose-500/10 rounded-2xl transition-all font-ui text-[10px] font-bold uppercase tracking-[0.2em] group ${
              isAdminSidebarCollapsed ? "px-0 py-4 justify-center" : "px-5 py-4 gap-4"
            }`}
          >
            <LogOut size={isAdminSidebarCollapsed ? 20 : 16} className="group-hover:translate-x-0.5 transition-transform" /> 
            {!isAdminSidebarCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" 
          onClick={() => setIsOpen(false)} 
        />
      )}
    </>
  );
}
