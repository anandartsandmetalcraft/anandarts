"use client";
import React, { useState, useEffect, useMemo } from "react";
import { 
  Search, 
  MapPin, 
  User, 
  ShoppingBag, 
  ChevronRight, 
  Truck, 
  MoreVertical, 
  CheckCircle2, 
  Clock, 
  Map, 
  MessageSquare,
  ArrowLeft,
  Calendar,
  Package,
  Ban
} from "lucide-react";
import { getAllAdminOrders } from "@/actions/admin";
import { syncShiprocketStatusesAction, schedulePickupAction } from "@/actions/tracking";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value / 100);
}

export default function ShippingListPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [search, setSearch] = useState("");

  const fetchOrders = async () => {
    const res = await getAllAdminOrders();
    if (res.success) setOrders(res.orders || []);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleSync = async () => {
    setIsSyncing(true);
    toast.loading("Syncing with Shiprocket...");
    try {
      const res = await syncShiprocketStatusesAction();
      if (res.success) {
        toast.success(`Sync complete. ${res.updatedCount} orders updated.`);
        await fetchOrders();
      } else {
        toast.error(res.error || "Failed to sync");
      }
    } catch (e) {
      toast.error("An error occurred during sync");
    } finally {
      setIsSyncing(false);
      toast.dismiss();
    }
  };

  const handleSchedulePickup = async () => {
    if (!activeOrder) return;
    setIsScheduling(true);
    toast.loading("Assigning courier & scheduling pickup...");
    try {
      const res = await schedulePickupAction(activeOrder.id);
      if (res.success) {
        toast.success(`Pickup scheduled! Courier: ${res.courier}, AWB: ${res.awb}`);
        await fetchOrders();
      } else {
        toast.error(res.error || "Failed to schedule pickup");
      }
    } catch (e) {
      toast.error("An error occurred while scheduling");
    } finally {
      setIsScheduling(false);
      toast.dismiss();
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(o => 
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) || 
      `${o.user.firstName} ${o.user.lastName}`.toLowerCase().includes(search.toLowerCase())
    );
  }, [orders, search]);

  const activeOrder = filteredOrders[selectedIdx];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DELIVERED': return 'bg-emerald-50 text-emerald-500 border-emerald-100';
      case 'SHIPPED': return 'bg-blue-50 text-blue-500 border-blue-100';
      case 'OUT_FOR_DELIVERY': return 'bg-amber-50 text-amber-500 border-amber-100';
      case 'CONFIRMED': return 'bg-indigo-50 text-indigo-500 border-indigo-100';
      case 'PAID': return 'bg-purple-50 text-purple-500 border-purple-100';
      case 'CANCELLED': return 'bg-rose-50 text-rose-500 border-rose-100';
      default: return 'bg-slate-50 text-slate-400 border-slate-100';
    }
  };

  const getStatusText = (status: string) => {
     if (status === 'PAID') return "Processed";
     if (status === 'CONFIRMED') return "Confirmed";
     if (status === 'SHIPPED') return "Shipped";
     if (status === 'OUT_FOR_DELIVERY') return "Out for Delivery";
     return status.charAt(0) + status.slice(1).toLowerCase();
  };

  const statuses = ["Order Process", "Confirmed", "Order Shipped", "Out Of Delivery", "Delivered"];
  const currentStatusIdx = activeOrder ? (
    activeOrder.status === 'DELIVERED' ? 4 : 
    activeOrder.status === 'OUT_FOR_DELIVERY' ? 3 : 
    activeOrder.status === 'SHIPPED' ? 2 : 
    activeOrder.status === 'CONFIRMED' ? 1 : 0
  ) : 0;

  return (
    <div className="flex flex-col lg:flex-row gap-8 min-h-[calc(100vh-200px)]">
      
      {/* Sidebar List */}
      <aside className="w-full lg:w-[380px] flex flex-col gap-6">
         <div className="bg-white rounded-[32px] border border-slate-100 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-display text-xl font-bold text-[#0F172A]">Shipping List</h2>
              <button 
                onClick={handleSync}
                disabled={isSyncing}
                className="text-[10px] font-bold uppercase tracking-widest text-blue-500 hover:bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 transition-colors disabled:opacity-50"
              >
                {isSyncing ? 'Syncing...' : 'Sync Tracker'}
              </button>
            </div>
            <div className="relative group">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#0F172A] transition-colors" size={16} />
               <input 
                 value={search}
                 onChange={e => { setSearch(e.target.value); setSelectedIdx(0); }}
                 placeholder="Search for..." 
                 className="w-full bg-slate-50/50 border border-slate-100 pl-11 pr-4 py-3.5 rounded-2xl font-ui text-xs outline-none focus:ring-2 ring-slate-100" 
               />
            </div>
         </div>

         <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar max-h-[700px]">
            {isLoading ? (
               Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-32 bg-white/50 rounded-3xl border border-slate-100 animate-pulse" />
               ))
            ) : filteredOrders.map((order, i) => (
               <button 
                 key={order.id}
                 onClick={() => setSelectedIdx(i)}
                 className={`w-full text-left p-6 rounded-[32px] border transition-all duration-300 relative group overflow-hidden ${selectedIdx === i ? 'bg-white border-blue-500 shadow-xl shadow-blue-500/5' : 'bg-white/60 border-slate-100 hover:bg-white hover:border-slate-200 shadow-sm'}`}
               >
                  {selectedIdx === i && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500" />}
                  <div className="flex justify-between items-start mb-4">
                     <h3 className="font-display font-bold text-[#0F172A] group-hover:text-blue-500 transition-colors">
                        {order.shippingCarrier || 'Anand Arts Logistics'}
                     </h3>
                     <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border ${getStatusBadge(order.status)}`}>
                        {getStatusText(order.status)}
                     </span>
                  </div>
                  <div className="space-y-1.5">
                     <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Track ID: {order.trackingId || 'TBA'}</p>
                     <p className="text-[10px] text-slate-400">Date: {new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                  </div>
                  <div className="mt-4 flex justify-end">
                     <div className="text-[10px] font-bold uppercase tracking-widest text-[#0F172A] flex items-center gap-1 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all">
                        View <ChevronRight size={14} />
                     </div>
                  </div>
               </button>
            ))}
         </div>
      </aside>

      {/* Detail View */}
      <main className="flex-1">
         <AnimatePresence mode="wait">
            {!activeOrder ? (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col items-center justify-center p-12 bg-white rounded-[40px] border border-slate-100 shadow-sm">
                  <Truck size={48} className="text-slate-100 mb-4" />
                  <p className="font-ui text-[10px] font-bold uppercase tracking-widest text-slate-400">Select a shipment to view details</p>
               </motion.div>
            ) : (
               <motion.div 
                 key={activeOrder.id}
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 className="space-y-10"
               >
                  {/* Shipping Header Card */}
                  <div className="bg-white rounded-[40px] border border-slate-100 p-10 shadow-sm relative overflow-hidden group">
                     <div className="absolute right-0 top-0 w-32 h-32 bg-slate-50 rounded-bl-[100px] -z-0 opacity-50 transition-all group-hover:scale-110" />
                     <div className="relative z-10">
                        <div className="flex justify-between items-center mb-10">
                           <h2 className="font-display text-2xl font-bold text-[#0F172A]">Shipping Details</h2>
                           <div className="text-right">
                              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Order Date</p>
                              <p className="text-sm font-bold text-[#0F172A] mt-1">{new Date(activeOrder.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                           </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                           <div className="bg-purple-50/50 rounded-[32px] border border-purple-100 p-6 flex items-start gap-4">
                              <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-purple-500 shadow-sm shrink-0">
                                 <ShoppingBag size={18} />
                              </div>
                              <div>
                                 <h4 className="font-display font-bold text-[#0F172A] text-sm">Order Info</h4>
                                 <div className="mt-2 space-y-1">
                                    <p className="text-[10px] text-slate-500">ID: {activeOrder.orderNumber}</p>
                                    <p className="text-[10px] text-slate-500">Total: {formatMoney(activeOrder.total)}</p>
                                    <p className="text-[10px] text-slate-500">Date: {new Date(activeOrder.createdAt).toLocaleDateString()}</p>
                                 </div>
                              </div>
                           </div>
                           <div className="bg-amber-50/50 rounded-[32px] border border-amber-100 p-6 flex items-start gap-4">
                              <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-amber-500 shadow-sm shrink-0">
                                 <MapPin size={18} />
                              </div>
                              <div>
                                 <h4 className="font-display font-bold text-[#0F172A] text-sm">Shipping Address</h4>
                                 <div className="mt-2 space-y-1 text-[10px] text-slate-500 leading-relaxed">
                                    <p>{activeOrder.address.street}, {activeOrder.address.city}</p>
                                    <p>{activeOrder.address.state} - {activeOrder.address.postalCode}</p>
                                    <p>PH: {activeOrder.user.phone}</p>
                                 </div>
                              </div>
                           </div>
                           <div className="bg-emerald-50/50 rounded-[32px] border border-emerald-100 p-6 flex items-start gap-4">
                              <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-emerald-500 shadow-sm shrink-0">
                                 <User size={18} />
                              </div>
                              <div>
                                 <h4 className="font-display font-bold text-[#0F172A] text-sm">Customer Info</h4>
                                 <div className="mt-2 space-y-1">
                                    <p className="text-[10px] text-slate-500 font-bold">{activeOrder.user.firstName} {activeOrder.user.lastName}</p>
                                    <p className="text-[10px] text-slate-500">{activeOrder.user.email}</p>
                                    <p className="text-[10px] text-slate-500 mt-1">PH: {activeOrder.user.phone}</p>
                                 </div>
                              </div>
                           </div>
                        </div>

                        {/* Order Status Stepper */}
                        <div className="relative pt-6">
                           <h3 className="font-display font-bold text-[#0F172A] mb-12">Order Status</h3>
                           <div className="relative">
                              <div className="absolute top-5 left-10 right-10 h-1 bg-slate-100 -z-0" />
                              <div 
                                 className="absolute top-5 left-10 h-1 bg-emerald-500 transition-all duration-1000 -z-0" 
                                 style={{ width: `${(currentStatusIdx / 4) * 100}%` }}
                              />
                              <div className="grid grid-cols-5 gap-4 relative z-10">
                                 {statuses.map((s, i) => (
                                    <div key={i} className="flex flex-col items-center text-center">
                                       <div className={`h-10 w-10 rounded-full flex items-center justify-center border-4 border-white shadow-md transition-all duration-500 ${i <= currentStatusIdx ? 'bg-emerald-500 text-white' : 'bg-white text-slate-200 border-slate-50'}`}>
                                          {i <= currentStatusIdx ? <CheckCircle2 size={20} /> : <div className="h-1.5 w-1.5 rounded-full bg-slate-200" />}
                                       </div>
                                       <div className="mt-6 space-y-1">
                                          <h4 className={`text-[10px] font-bold uppercase tracking-widest ${i <= currentStatusIdx ? 'text-[#0F172A]' : 'text-slate-300'}`}>{s}</h4>
                                          <p className="text-[9px] text-slate-400">2026</p>
                                       </div>
                                    </div>
                                 ))}
                              </div>
                           </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-3 mt-16 pt-10 border-t border-slate-50">
                           {activeOrder.status === 'CONFIRMED' && activeOrder.shiprocketShipmentId && !activeOrder.trackingId && (
                             <button 
                               onClick={handleSchedulePickup}
                               disabled={isScheduling}
                               className="px-6 py-3 bg-indigo-50 text-indigo-500 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-100 transition-all disabled:opacity-50"
                             >
                               <Package size={14}/> {isScheduling ? 'Scheduling...' : 'Schedule Pickup'}
                             </button>
                           )}
                           <button className="px-6 py-3 bg-blue-50 text-blue-500 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-blue-100 transition-all"><MapPin size={14}/> Change Address</button>
                           <button className="px-6 py-3 bg-rose-50 text-rose-500 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-rose-100 transition-all"><Ban size={14}/> Cancel Order</button>
                        </div>
                     </div>
                  </div>

                  {/* Sub Content Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div 
                        className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm h-64 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-blue-500/30 transition-all"
                        onClick={() => window.open(`/track-order?id=${activeOrder.orderNumber}`, '_blank')}
                     >
                        <div className="h-14 w-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform">
                           <Map size={24} />
                        </div>
                        <h4 className="font-display font-bold text-[#0F172A]">View Tracking Map</h4>
                        <p className="text-xs text-slate-400 mt-2">Real-time GPS coordinate synchronization.</p>
                     </div>
                     <div className="bg-[#0F172A] rounded-[40px] p-8 shadow-sm h-64 flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-black transition-all">
                        <div className="h-14 w-14 bg-[#D4AF37] rounded-2xl flex items-center justify-center text-white mb-6 group-hover:rotate-12 transition-transform">
                           <MessageSquare size={24} />
                        </div>
                        <h4 className="font-display font-bold text-white uppercase tracking-widest text-sm">Online Chat Support</h4>
                        <p className="text-xs text-white/40 mt-2">Connected to logistics helpdesk.</p>
                     </div>
                  </div>
               </motion.div>
            )}
         </AnimatePresence>
      </main>
    </div>
  );
}
