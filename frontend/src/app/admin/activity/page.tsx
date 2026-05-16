"use client";

import { useEffect, useMemo, useState, type ComponentType } from "react";
import Link from "next/link";
import { ArrowUpRight, Clock3, History, RefreshCw, ShoppingBag, Truck, FileText, CreditCard, XCircle } from "lucide-react";
import { motion } from "framer-motion";

import { getAdminActivityFeed } from "@/actions/activity";

const FILTERS = ["All", "Orders", "Shipping", "Invoices", "Payments"] as const;

const ICON_MAP: Record<string, ComponentType<{ size?: number; className?: string }>> = {
  ORDER_CREATED: ShoppingBag,
  ORDER_PAID: CreditCard,
  ORDER_CANCELLED: XCircle,
  ORDER_UPDATED: History,
  SHIPPING_CREATED: Truck,
  SHIPPING_UPDATED: Truck,
  INVOICE_CREATED: FileText,
  INVOICE_SENT: FileText,
  PAYMENT_FAILED: XCircle,
};

const COLOR_MAP: Record<string, string> = {
  ORDER_CREATED: "bg-blue-50 text-blue-600 border-blue-100",
  ORDER_PAID: "bg-emerald-50 text-emerald-600 border-emerald-100",
  ORDER_CANCELLED: "bg-rose-50 text-rose-600 border-rose-100",
  ORDER_UPDATED: "bg-slate-50 text-slate-600 border-slate-100",
  SHIPPING_CREATED: "bg-purple-50 text-purple-600 border-purple-100",
  SHIPPING_UPDATED: "bg-purple-50 text-purple-600 border-purple-100",
  INVOICE_CREATED: "bg-amber-50 text-amber-600 border-amber-100",
  INVOICE_SENT: "bg-amber-50 text-amber-600 border-amber-100",
  PAYMENT_FAILED: "bg-rose-50 text-rose-600 border-rose-100",
};

export default function AdminActivityPage() {
  const [activities, setActivities] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<(typeof FILTERS)[number]>("All");

  const loadActivity = async () => {
    setIsLoading(true);
    const res = await getAdminActivityFeed(100);
    setActivities(res.activities ?? []);
    setUnreadCount(res.unreadCount ?? 0);
    setIsLoading(false);
  };

  useEffect(() => {
    void loadActivity();
  }, []);

  const filteredActivities = useMemo(() => {
    if (activeFilter === "All") return activities;
    return activities.filter((activity) => {
      if (activeFilter === "Orders") return activity.type.startsWith("ORDER_");
      if (activeFilter === "Shipping") return activity.type.startsWith("SHIPPING_");
      if (activeFilter === "Invoices") return activity.type.startsWith("INVOICE_");
      if (activeFilter === "Payments") return activity.type.startsWith("PAYMENT_");
      return true;
    });
  }, [activities, activeFilter]);

  const summary = useMemo(() => ({
    orders: activities.filter((item) => item.type.startsWith("ORDER_")).length,
    shipping: activities.filter((item) => item.type.startsWith("SHIPPING_")).length,
    invoices: activities.filter((item) => item.type.startsWith("INVOICE_")).length,
    payments: activities.filter((item) => item.type.startsWith("PAYMENT_")).length,
  }), [activities]);

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Admin</span>
            <ArrowUpRight size={12} className="text-slate-300" />
            <span className="text-slate-700 font-bold uppercase tracking-widest text-[10px]">Activity Log</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-[#0F172A]">Live Activity History</h1>
          <p className="mt-2 text-sm text-slate-500 max-w-2xl">
            Track new orders, shipping updates, invoice events, and payment changes in one place.
          </p>
        </div>

        <button
          onClick={() => void loadActivity()}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#0F172A] px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-white shadow-lg transition hover:bg-black"
        >
          <RefreshCw size={14} />
          Refresh Feed
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Unread", value: unreadCount, icon: Clock3, color: "text-amber-600 bg-amber-50 border-amber-100" },
          { label: "Orders", value: summary.orders, icon: ShoppingBag, color: "text-blue-600 bg-blue-50 border-blue-100" },
          { label: "Shipping", value: summary.shipping, icon: Truck, color: "text-purple-600 bg-purple-50 border-purple-100" },
          { label: "Invoices", value: summary.invoices, icon: FileText, color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
        ].map((card) => (
          <div key={card.label} className={`rounded-[28px] border ${card.color} p-6 shadow-sm bg-white`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">{card.label}</p>
                <p className="mt-3 font-display text-3xl font-bold text-[#0F172A]">{card.value}</p>
              </div>
              <div className="h-11 w-11 rounded-2xl bg-white/80 flex items-center justify-center shadow-sm">
                <card.icon size={18} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-[32px] border border-slate-100 bg-white p-6 md:p-8 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-[#0F172A]">History Feed</h2>
            <p className="mt-1 text-sm text-slate-500">A chronological record of everything that matters to operations.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all ${
                  activeFilter === filter ? "bg-[#0F172A] text-white shadow-sm" : "bg-slate-50 text-slate-500 hover:text-[#0F172A]"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 space-y-4">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-24 animate-pulse rounded-[24px] bg-slate-50" />
            ))
          ) : filteredActivities.length > 0 ? (
            filteredActivities.map((activity) => {
              const Icon = ICON_MAP[activity.type] || History;
              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group flex flex-col gap-4 rounded-[28px] border border-slate-100 p-5 md:flex-row md:items-start md:justify-between hover:border-slate-200 hover:shadow-md transition-all"
                >
                  <div className="flex gap-4">
                    <div className={`mt-1 h-12 w-12 rounded-2xl border flex items-center justify-center ${COLOR_MAP[activity.type] || "bg-slate-50 text-slate-600 border-slate-100"}`}>
                      <Icon size={18} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-display text-lg font-bold text-[#0F172A]">{activity.title}</h3>
                        {!activity.isRead && (
                          <span className="rounded-full bg-rose-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-rose-600">
                            New
                          </span>
                        )}
                      </div>
                      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-500">{activity.description}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        <span>{activity.type.replaceAll("_", " ")}</span>
                        <span className="h-1 w-1 rounded-full bg-slate-300" />
                        <span>{new Date(activity.createdAt).toLocaleString("en-IN", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-start md:self-auto">
                    <span className={`rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest ${COLOR_MAP[activity.type] || "bg-slate-50 text-slate-500 border-slate-100"}`}>
                      {activity.type.replaceAll("_", " ")}
                    </span>
                    {activity.href && (
                      <Link href={activity.href} className="rounded-full bg-slate-50 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-[#0F172A]">
                        Open
                      </Link>
                    )}
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="rounded-[28px] border border-dashed border-slate-200 bg-slate-50/40 px-6 py-16 text-center">
              <History size={42} className="mx-auto text-slate-200" />
              <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">No activity records found</p>
              <p className="mt-2 text-sm text-slate-500">New orders, shipping updates, and invoice events will appear here automatically.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
