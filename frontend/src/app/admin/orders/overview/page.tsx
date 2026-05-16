import { redirect } from "next/navigation";
import { getLatestAdminOrder, getAllAdminOrders } from "@/actions/admin";
import { ShoppingBag, Clock, CheckCircle, Truck, Ban, Package, Search, ChevronDown, Filter } from "lucide-react";
import Link from "next/link";

export default async function AdminOrdersOverviewPage() {
  const response = await getLatestAdminOrder();

  // If we have orders, redirect to the most recent one for the "Overview" experience
  if (response.success && response.order) {
    redirect(`/admin/orders/${response.order.id}`);
  }

  // Pure Business Empty State
  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold font-display text-[#0F172A]">Analytical Overview</h1>
        <p className="text-sm text-slate-500 font-ui text-[11px] uppercase tracking-widest">Global Order Statistics</p>
      </div>

      {/* Metrics Row (Inactive State) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 opacity-30">
        {[
          { label: "New Orders", val: 0, icon: ShoppingBag, color: "text-blue-500", bg: "bg-blue-50" },
          { label: "Pending", val: 0, icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
          { label: "Delivered", val: 0, icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-50" },
          { label: "In Transit", val: 0, icon: Truck, color: "text-purple-500", bg: "bg-purple-50" },
          { label: "Cancelled", val: 0, icon: Ban, color: "text-rose-500", bg: "bg-rose-50" },
        ].map((m, i) => (
          <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col gap-4">
            <div className={`h-12 w-12 rounded-2xl ${m.bg} flex items-center justify-center ${m.color}`}>
               <m.icon size={24} />
            </div>
            <div>
              <h4 className="font-display text-2xl font-bold text-[#0F172A]">{m.val}</h4>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">{m.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 p-12 shadow-sm min-h-[500px] flex flex-col items-center justify-center text-center">
         <div className="h-20 w-20 bg-slate-50 rounded-[32px] flex items-center justify-center text-slate-100 mb-8">
            <Package size={40} />
         </div>
         <h2 className="text-2xl font-bold text-[#0F172A] mb-2 font-display">No Order Activity Detected</h2>
         <p className="text-slate-400 text-sm max-w-sm font-ui leading-relaxed">
            Your analytical overview will automatically populate with real-time data once customers begin placing orders. 
         </p>
         <Link href="/admin/orders" className="mt-8 px-10 py-4 bg-[#0F172A] text-white rounded-2xl text-[11px] font-bold uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all">
            Browse Records
         </Link>
      </div>

    </div>
  );
}
