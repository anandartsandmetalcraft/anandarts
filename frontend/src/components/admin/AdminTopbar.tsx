"use client";

import { useEffect, useState, type ComponentType } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, Maximize2, Settings, ChevronDown, UserCircle, LayoutGrid, Clock, History, ShoppingBag, Truck, FileText, CreditCard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "next-auth/react";
import { getAdminActivityFeed, markActivitiesRead } from "@/actions/activity";

export default function AdminTopbar() {
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [activities, setActivities] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const loadActivities = async () => {
    const res = await getAdminActivityFeed(6);
    setActivities(res.activities ?? []);
    setUnreadCount(res.unreadCount ?? 0);
  };

  useEffect(() => {
    void loadActivities();
    const interval = window.setInterval(() => {
      void loadActivities();
    }, 20000);

    return () => window.clearInterval(interval);
  }, []);

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => console.error(err));
    } else {
      document.exitFullscreen();
    }
  };

  const handleNotificationToggle = async () => {
    const nextOpen = !showNotifications;
    setShowNotifications(nextOpen);
    setShowProfileMenu(false);

    if (nextOpen) {
      const unreadIds = activities.filter((activity) => !activity.isRead).map((activity) => activity.id);
      if (unreadIds.length > 0) {
        await markActivitiesRead(unreadIds);
        await loadActivities();
      }
    }
  };

  const activityIconMap: Record<string, ComponentType<{ size?: number; className?: string }>> = {
    ORDER_CREATED: ShoppingBag,
    ORDER_PAID: CreditCard,
    ORDER_CANCELLED: History,
    ORDER_UPDATED: History,
    SHIPPING_CREATED: Truck,
    SHIPPING_UPDATED: Truck,
    INVOICE_CREATED: FileText,
    INVOICE_SENT: FileText,
    PAYMENT_FAILED: CreditCard,
  };

  const activityColorMap: Record<string, string> = {
    ORDER_CREATED: "text-blue-600 bg-blue-50",
    ORDER_PAID: "text-emerald-600 bg-emerald-50",
    ORDER_CANCELLED: "text-rose-600 bg-rose-50",
    ORDER_UPDATED: "text-slate-600 bg-slate-50",
    SHIPPING_CREATED: "text-purple-600 bg-purple-50",
    SHIPPING_UPDATED: "text-purple-600 bg-purple-50",
    INVOICE_CREATED: "text-amber-600 bg-amber-50",
    INVOICE_SENT: "text-amber-600 bg-amber-50",
    PAYMENT_FAILED: "text-rose-600 bg-rose-50",
  };

  return (
    <div className="mb-10 px-2 lg:px-0">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 rounded-full bg-[#0F172A]/5 px-3 py-1 font-ui text-[9px] font-bold uppercase tracking-[0.2em] text-[#0F172A]/60 border border-[#0F172A]/10">
              <Clock size={12} strokeWidth={2.5} />
              {new Date().toLocaleDateString("en-IN", { weekday: "long", month: "short", day: "numeric" })}
            </span>
            <div className="h-4 w-px bg-slate-200" />
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 font-ui text-[9px] font-bold uppercase tracking-[0.2em] text-emerald-700 border border-emerald-100">
              <div className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
              Live System
            </span>
          </div>
          <div className="mt-4">
            <h1 className="font-display text-4xl font-bold tracking-tight text-[#0F172A]">Welcome back, Admin</h1>
            <p className="mt-2 max-w-2xl text-sm font-medium text-slate-500 leading-relaxed">
              Managing the catalog at <span className="text-[#D4AF37] font-bold">Anand Arts</span>. Overview of the store performance.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end lg:self-center">
          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 rounded-[24px] bg-white p-1.5 shadow-sm border border-slate-100">
            <button
              type="button"
              onClick={handleFullscreen}
              className="h-10 w-10 flex items-center justify-center rounded-2xl text-slate-500 hover:bg-slate-50 hover:text-[#0F172A] transition-all"
              title="Fullscreen Mode"
            >
              <Maximize2 size={18} strokeWidth={1.5} />
            </button>
            <button
              type="button"
              className="h-10 w-10 flex items-center justify-center rounded-2xl text-slate-500 hover:bg-slate-50 hover:text-[#0F172A] transition-all"
              title="System Settings"
            >
              <Settings size={18} strokeWidth={1.5} />
            </button>
            <div className="relative">
              <button
                type="button"
                onClick={handleNotificationToggle}
                className={`h-10 w-10 flex items-center justify-center rounded-2xl transition-all relative ${showNotifications ? 'bg-[#0F172A] text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <Bell size={18} strokeWidth={1.5} />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 min-w-4 h-4 px-1 rounded-full bg-rose-500 border-2 border-white text-[9px] leading-none text-white flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-full z-50 mt-4 w-80 overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-2xl"
                  >
                    <div className="bg-[#0F172A] p-6 text-white relative">
                       <h3 className="font-display text-lg font-bold">Notifications</h3>
                       <p className="text-[10px] uppercase tracking-widest text-slate-400 mt-1">Recent system alerts</p>
                       <div className="absolute top-6 right-6 p-1.5 rounded-full bg-white/10">
                          <LayoutGrid size={14} />
                       </div>
                    </div>
                    <div className="p-2 space-y-1 max-h-[420px] overflow-y-auto">
                      {activities.length > 0 ? activities.map((activity) => {
                        const Icon = activityIconMap[activity.type] || History;
                        return (
                          <Link
                            key={activity.id}
                            href={activity.href || "/admin/activity"}
                            className="group flex gap-3 p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100"
                          >
                            <div className={`mt-0.5 h-10 w-10 rounded-2xl flex items-center justify-center ${activityColorMap[activity.type] || "text-slate-600 bg-slate-50"}`}>
                              <Icon size={18} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-3">
                                <p className="text-xs font-bold text-[#0F172A] truncate">{activity.title}</p>
                                {!activity.isRead && <span className="h-2 w-2 rounded-full bg-rose-500 shrink-0" />}
                              </div>
                              <p className="mt-1 text-xs text-slate-500 leading-relaxed line-clamp-2">{activity.description}</p>
                              <p className="mt-3 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                                {new Date(activity.createdAt).toLocaleString("en-IN", { hour: "numeric", minute: "2-digit", day: "numeric", month: "short" })}
                              </p>
                            </div>
                          </Link>
                        );
                      }) : (
                        <div className="p-8 text-center text-slate-400">
                          <History size={36} className="mx-auto mb-3 text-slate-200" />
                          <p className="text-xs font-bold uppercase tracking-widest">No activity yet</p>
                        </div>
                      )}
                    </div>
                    <div className="border-t border-slate-100 p-3">
                      <Link href="/admin/activity" className="block w-full rounded-2xl bg-slate-50 p-4 text-center text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-[#0F172A] transition-colors">
                        View Full Activity Log
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="h-8 w-px bg-slate-200 mx-2" />

          {/* Profile Menu */}
          <div className="relative">
            <button
              onClick={() => {
                setShowProfileMenu((v) => !v);
                setShowNotifications(false);
              }}
              className="group flex items-center gap-3 rounded-[24px] bg-white pr-4 pl-1.5 py-1.5 shadow-sm border border-slate-100 hover:border-[#D4AF37]/50 hover:shadow-md transition-all active:scale-95"
            >
              <div className="h-10 w-10 rounded-full bg-[#0F172A] border border-white/10 flex items-center justify-center text-white text-xs font-bold overflow-hidden">
                 <UserCircle size={24} strokeWidth={1} />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-[11px] font-bold text-[#0F172A] uppercase tracking-widest leading-none">Admin</p>
                <p className="text-[10px] text-slate-400 font-medium mt-1">Master Account</p>
              </div>
              <ChevronDown size={14} className={`text-slate-300 transition-transform duration-300 group-hover:text-[#D4AF37] ${showProfileMenu ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {showProfileMenu && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-full z-50 mt-4 w-56 overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-2xl p-2"
                >
                  {[
                    { label: 'Admin Profile', href: '/admin/account' },
                    { label: 'Dashboard Home', href: '/admin' },
                    { label: 'View Store', href: '/collections' },
                  ].map((link) => (
                    <Link 
                      key={link.label}
                      href={link.href} 
                      className="block rounded-xl px-4 py-3 text-xs font-bold text-slate-600 hover:bg-[#0F172A] hover:text-white transition-all uppercase tracking-widest"
                    >
                      {link.label}
                    </Link>
                  ))}
                  <div className="h-px bg-slate-100 my-2" />
                  <button
                    onClick={async () => {
                      await signOut({ redirect: false });
                      router.replace("/admin-login");
                    }}
                    className="w-full text-left rounded-xl px-4 py-3 text-xs font-bold text-rose-500 hover:bg-rose-50 transition-all uppercase tracking-widest"
                  >
                    Sign Out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
