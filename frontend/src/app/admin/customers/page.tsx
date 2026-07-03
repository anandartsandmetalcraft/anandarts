"use client";
import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { 
  Plus,
  Users, 
  Search, 
  MapPin, 
  CreditCard, 
  MoreVertical, 
  Clock, 
  X, 
  ChevronDown,
  Calendar,
  ShoppingBag,
  ArrowUpRight,
  Eye,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Mail,
  Phone,
  Globe,
  Award,
  TrendingUp,
  FileText
} from "lucide-react";
import { getAllAdminCustomers, getAdminCustomerById } from "@/actions/admin";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [spendFilter, setSpendFilter] = useState("All");
  const [orderFilter, setOrderFilter] = useState("All");
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchCustomers = async () => {
    setIsLoading(true);
    const res = await getAllAdminCustomers();
    if (res.success) {
      setCustomers(res.customers!);
    } else {
      toast.error(res.error || "Failed to load customers.");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Fetch full details when customer is selected
  useEffect(() => {
    if (!selectedCustomerId) {
      setSelectedCustomer(null);
      return;
    }

    const fetchDetails = async () => {
      setIsDetailLoading(true);
      const res = await getAdminCustomerById(selectedCustomerId);
      if (res.success) {
        setSelectedCustomer(res.customer);
      } else {
        toast.error(res.error || "Failed to load customer profile.");
        setSelectedCustomerId(null);
      }
      setIsDetailLoading(false);
    };

    fetchDetails();
  }, [selectedCustomerId]);

  // Overall metrics calculation
  const aggregateMetrics = useMemo(() => {
    const stats = {
      totalCount: customers.length,
      totalSpendPaise: 0,
      totalOrders: 0,
      highValueCount: 0, // customers with > 50,000 spend
    };

    customers.forEach(c => {
      stats.totalSpendPaise += c.totalSpend;
      stats.totalOrders += c.orderCount;
      if (c.totalSpend > 5000000) { // 50,000 INR
        stats.highValueCount++;
      }
    });

    const avgOrders = stats.totalCount > 0 ? (stats.totalOrders / stats.totalCount).toFixed(1) : "0.0";

    return {
      ...stats,
      avgOrders,
    };
  }, [customers]);

  const filteredCustomers = customers.filter(c => {
    const matchesSearch = 
      `${c.firstName} ${c.lastName}`.toLowerCase().includes(search.toLowerCase()) || 
      (c.email && c.email.toLowerCase().includes(search.toLowerCase())) ||
      (c.phone && c.phone.includes(search));

    // Spend filter logic
    let matchesSpend = true;
    if (spendFilter === "High") {
      matchesSpend = c.totalSpend >= 5000000; // >= 50,000 INR
    } else if (spendFilter === "Medium") {
      matchesSpend = c.totalSpend >= 1000000 && c.totalSpend < 5000000; // 10k - 50k INR
    } else if (spendFilter === "Low") {
      matchesSpend = c.totalSpend > 0 && c.totalSpend < 1000000; // < 10k INR
    } else if (spendFilter === "None") {
      matchesSpend = c.totalSpend === 0;
    }

    // Order frequency filter logic
    let matchesOrder = true;
    if (orderFilter === "Frequent") {
      matchesOrder = c.orderCount >= 5;
    } else if (orderFilter === "Occasional") {
      matchesOrder = c.orderCount >= 1 && c.orderCount < 5;
    } else if (orderFilter === "Inactive") {
      matchesOrder = c.orderCount === 0;
    }
    
    return matchesSearch && matchesSpend && matchesOrder;
  });

  // Calculate slice
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const paginatedCustomers = filteredCustomers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleDeleteCustomer = (id: string, name: string) => {
    if (confirm(`Permanently delete ${name}'s customer record?`)) {
      setCustomers(customers.filter(c => c.id !== id));
      toast.success("Customer record deleted successfully.");
    }
  };

  return (
    <div className="space-y-10 min-h-screen pb-20 font-ui text-sm">
      
      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Customers", val: aggregateMetrics.totalCount, icon: Users, color: "text-blue-500", bg: "bg-blue-50", desc: "Registered accounts" },
          { label: "Lifetime Spend", val: `₹ ${(aggregateMetrics.totalSpendPaise / 100).toLocaleString("en-IN")}`, icon: CreditCard, color: "text-emerald-500", bg: "bg-emerald-50", desc: "Total customer revenue" },
          { label: "Avg Orders / User", val: aggregateMetrics.avgOrders, icon: ShoppingBag, color: "text-amber-500", bg: "bg-amber-50", desc: "Purchase frequency rate" },
          { label: "Premium Collectors", val: aggregateMetrics.highValueCount, icon: Award, color: "text-purple-500", bg: "bg-purple-50", desc: "Spent > ₹50,000" },
        ].map((m, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col gap-4"
          >
            <div className="flex items-center justify-between">
              <div className={`h-12 w-12 rounded-2xl ${m.bg} flex items-center justify-center ${m.color}`}>
                 <m.icon size={24} />
              </div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{m.desc}</span>
            </div>
            <div>
              <h4 className="font-display text-2xl font-bold text-[#0F172A]">{m.val}</h4>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">{m.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Header & Filter Bar */}
      <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
           <div>
             <h2 className="font-display text-3xl font-bold text-[#0F172A]">Customer Directory</h2>
             <p className="text-xs text-slate-400 mt-1">Manage customer profiles, address books, and lifetime dynamic spend trackers.</p>
           </div>
           <div className="flex items-center gap-2">
             <span className="text-xs font-bold text-slate-400 mr-2">Customers</span>
             <ChevronRight size={14} className="text-slate-300" />
             <span className="text-xs font-bold text-slate-700">Customer List</span>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
           {/* Search */}
           <div className="relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#0F172A] transition-colors" size={18} />
              <input 
                value={search}
                onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
                placeholder="Search name, phone, email..." 
                className="w-full bg-slate-50/50 border border-slate-100 pl-14 pr-6 py-4 rounded-2xl font-ui text-sm outline-none focus:ring-2 ring-slate-100" 
              />
           </div>

           {/* Spend Bracket Filter */}
           <div className="relative">
              <select 
                value={spendFilter}
                onChange={e => { setSpendFilter(e.target.value); setCurrentPage(1); }}
                className="w-full bg-slate-50/50 border border-slate-100 px-6 py-4 rounded-2xl font-ui text-sm outline-none appearance-none font-bold text-[#0F172A]"
              >
                <option value="All">All Lifetime Spends</option>
                <option value="High">Premium (&gt;= ₹50k)</option>
                <option value="Medium">Standard (₹10k - ₹50k)</option>
                <option value="Low">Starter (&lt; ₹10k)</option>
                <option value="None">No Orders Placed</option>
              </select>
              <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={16} />
           </div>

           {/* Order Frequency Filter */}
           <div className="relative">
              <select 
                value={orderFilter}
                onChange={e => { setOrderFilter(e.target.value); setCurrentPage(1); }}
                className="w-full bg-slate-50/50 border border-slate-100 px-6 py-4 rounded-2xl font-ui text-sm outline-none appearance-none font-bold text-[#0F172A]"
              >
                <option value="All">All Order Ranges</option>
                <option value="Frequent">Loyal (5+ orders)</option>
                <option value="Occasional">Occasional (1-4 orders)</option>
                <option value="Inactive">Inactive (0 orders)</option>
              </select>
              <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={16} />
           </div>

           {/* Sync Button */}
           <button onClick={fetchCustomers} className="bg-[#0F172A] text-white rounded-2xl px-8 py-4 font-ui text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg shadow-black/10 hover:bg-black transition-all group">
              <SlidersHorizontal size={18} className="group-hover:rotate-180 transition-transform duration-500" /> Sync List
           </button>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-y border-slate-50">
                <th className="p-6 font-ui text-[10px] uppercase tracking-widest text-slate-400">Customer Details</th>
                <th className="p-6 font-ui text-[10px] uppercase tracking-widest text-slate-400">Contact Reference</th>
                <th className="p-6 font-ui text-[10px] uppercase tracking-widest text-slate-400">Default Region</th>
                <th className="p-6 font-ui text-[10px] uppercase tracking-widest text-slate-400">Orders</th>
                <th className="p-6 font-ui text-[10px] uppercase tracking-widest text-slate-400">Total Spend</th>
                <th className="p-6 font-ui text-[10px] uppercase tracking-widest text-slate-400">Created Date</th>
                <th className="p-6 font-ui text-[10px] uppercase tracking-widest text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
               {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={7} className="p-6 h-20 bg-slate-50/10" />
                    </tr>
                  ))
               ) : paginatedCustomers.map((cust) => {
                  const name = `${cust.firstName} ${cust.lastName}`;
                  const formattedSpend = `₹ ${(cust.totalSpend / 100).toLocaleString("en-IN")}`;
                  const formattedDate = new Date(cust.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
                  
                  return (
                    <tr key={cust.id} className="group hover:bg-slate-50/30 transition-colors">
                      <td className="p-6 flex items-center gap-4">
                        <div 
                          onClick={() => setSelectedCustomerId(cust.id)} 
                          className="h-11 w-11 rounded-full bg-slate-100 border border-slate-100 flex items-center justify-center text-[#0F172A] font-bold text-xs cursor-pointer ring-4 ring-transparent group-hover:ring-[#D4AF37]/10 transition-all overflow-hidden shrink-0"
                        >
                          {cust.image ? (
                            <img src={cust.image} alt={name} className="h-full w-full object-cover" />
                          ) : (
                            <span className="uppercase">{cust.firstName[0]}{cust.lastName[0]}</span>
                          )}
                        </div>
                        <div>
                          <p 
                            onClick={() => setSelectedCustomerId(cust.id)} 
                            className="text-sm font-bold text-[#0F172A] hover:text-[#D4AF37] cursor-pointer transition-colors"
                          >
                             {name}
                          </p>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">ID: {cust.id.substring(0, 10)}...</span>
                        </div>
                      </td>
                      <td className="p-6 text-xs text-slate-500">
                         <div className="flex flex-col gap-1">
                           {cust.email && (
                             <span className="flex items-center gap-1.5"><Mail size={12} className="text-slate-300" />{cust.email}</span>
                           )}
                           {cust.phone && (
                             <span className="flex items-center gap-1.5"><Phone size={12} className="text-slate-300" />{cust.phone}</span>
                           )}
                         </div>
                      </td>
                      <td className="p-6 text-xs font-semibold text-slate-600">
                         <div className="flex items-center gap-1">
                           <MapPin size={12} className="text-slate-300" />
                           {cust.city === "Not Provided" ? (
                             <span className="text-slate-400 italic">No address synced</span>
                           ) : (
                             <span>{cust.city}, {cust.state}</span>
                           )}
                         </div>
                      </td>
                      <td className="p-6">
                         <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${cust.orderCount > 0 ? 'bg-slate-100 text-[#0F172A]' : 'bg-slate-50 text-slate-400'}`}>
                            {cust.orderCount} Orders
                         </span>
                      </td>
                      <td className="p-6 font-display font-bold text-[#0F172A]">
                         {formattedSpend}
                      </td>
                      <td className="p-6 text-xs text-slate-400">
                         {formattedDate}
                      </td>
                      <td className="p-6 text-right">
                         <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => setSelectedCustomerId(cust.id)} 
                              className="h-10 w-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:bg-[#0F172A] hover:text-white transition-all shadow-sm"
                              title="View Customer Profile"
                            >
                               <Eye size={16} />
                            </button>
                            <button 
                              onClick={() => handleDeleteCustomer(cust.id, name)}
                              className="h-10 w-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-rose-300 hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                              title="Delete Record"
                            >
                               <Trash2 size={16} />
                            </button>
                         </div>
                      </td>
                    </tr>
                  );
               })}
            </tbody>
          </table>
          
          {filteredCustomers.length === 0 && !isLoading && (
            <div className="py-20 flex flex-col items-center justify-center text-center">
               <Users size={48} className="text-slate-100 mb-4" />
               <p className="font-ui text-xs font-bold uppercase tracking-widest text-slate-400">No matching customer accounts found</p>
            </div>
          )}
        </div>

        {/* Table Footer / Pagination */}
        <div className="pt-8 border-t border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4">
           <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              Showing <span className="text-[#0F172A]">{Math.min(filteredCustomers.length, (currentPage - 1) * itemsPerPage + 1)}</span> to <span className="text-[#0F172A]">{Math.min(filteredCustomers.length, currentPage * itemsPerPage)}</span> of <span className="text-[#0F172A]">{filteredCustomers.length}</span> items
           </div>
           
           <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-100 text-[10px] font-bold uppercase tracking-widest disabled:opacity-30 hover:bg-slate-50 transition-all"
              >
                 <ChevronLeft size={14} /> Previous
              </button>
              <div className="flex items-center">
                 {Array.from({ length: totalPages }).map((_, i) => (
                    <button 
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`h-10 w-10 rounded-xl text-[10px] font-bold transition-all ${currentPage === i + 1 ? 'bg-[#0F172A] text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}
                    >
                       {i + 1}
                    </button>
                 ))}
              </div>
              <button 
                 onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                 disabled={currentPage === totalPages || totalPages === 0}
                 className="flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-100 text-[10px] font-bold uppercase tracking-widest disabled:opacity-30 hover:bg-slate-50 transition-all"
              >
                 Next <ChevronRight size={14} />
              </button>
           </div>
        </div>
      </div>

      {/* Customer Detail Drawer Overlay */}
      <AnimatePresence>
        {selectedCustomerId && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCustomerId(null)}
              className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm"
            />

            {/* Slide-over Panel */}
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 200 }}
              className="fixed inset-y-0 right-0 z-[130] w-full max-w-2xl bg-[#FBFAF5] border-l border-slate-200 shadow-2xl flex flex-col overflow-hidden"
            >
              {isDetailLoading ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-4">
                  <div className="h-10 w-10 border-4 border-slate-200 border-t-[#D4AF37] rounded-full animate-spin" />
                  <p className="font-ui text-xs font-bold uppercase tracking-widest text-slate-400">Loading customer profile...</p>
                </div>
              ) : selectedCustomer ? (
                <>
                  {/* Drawer Header */}
                  <div className="p-8 border-b border-slate-100 bg-white flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-full bg-slate-100 border border-slate-100 flex items-center justify-center text-[#0F172A] font-bold text-lg overflow-hidden">
                        {selectedCustomer.image ? (
                          <img src={selectedCustomer.image} alt={selectedCustomer.firstName} className="h-full w-full object-cover" />
                        ) : (
                          <span className="uppercase">{selectedCustomer.firstName[0]}{selectedCustomer.lastName[0]}</span>
                        )}
                      </div>
                      <div>
                        <h3 className="font-display text-2xl font-bold text-[#0F172A]">{selectedCustomer.firstName} {selectedCustomer.lastName}</h3>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-[#D4AF37] mt-1">Customer Account Profile</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setSelectedCustomerId(null)} 
                      className="p-3 bg-slate-50 border border-slate-100 hover:bg-slate-100 rounded-full transition-all active:scale-95"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  {/* Drawer Scrollable Content */}
                  <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                    
                    {/* Metrics Grid */}
                    <div className="grid grid-cols-3 gap-4 bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
                      <div className="text-center p-2 border-r border-slate-50">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Total Spent</p>
                        <p className="mt-2 text-lg font-bold text-emerald-600">₹{(selectedCustomer.metrics.totalSpend / 100).toLocaleString("en-IN")}</p>
                      </div>
                      <div className="text-center p-2 border-r border-slate-50">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Orders</p>
                        <p className="mt-2 text-lg font-bold text-[#0F172A]">{selectedCustomer.metrics.orderCount} total</p>
                      </div>
                      <div className="text-center p-2">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Average Ticket</p>
                        <p className="mt-2 text-lg font-bold text-[#D4AF37]">₹{(selectedCustomer.metrics.avgOrderValue / 100).toLocaleString("en-IN")}</p>
                      </div>
                    </div>

                    {/* Detailed Metadata */}
                    <div className="space-y-4">
                      <h4 className="font-display text-base font-bold text-[#0F172A]">Contact Profile</h4>
                      <div className="grid grid-cols-2 gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                        <div className="space-y-1">
                          <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Email Address</p>
                          <a href={`mailto:${selectedCustomer.email}`} className="text-xs font-semibold text-blue-500 hover:underline flex items-center gap-1.5 mt-1">
                            <Mail size={12} /> {selectedCustomer.email || "No Email Bound"}
                          </a>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Mobile Phone</p>
                          {selectedCustomer.phone ? (
                            <a href={`tel:${selectedCustomer.phone}`} className="text-xs font-semibold text-[#0F172A] hover:underline flex items-center gap-1.5 mt-1">
                              <Phone size={12} /> {selectedCustomer.phone}
                            </a>
                          ) : (
                            <p className="text-xs text-slate-400 mt-1 italic">No phone synced</p>
                          )}
                        </div>
                        <div className="space-y-1 pt-3 border-t border-slate-50 col-span-2">
                          <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Account Registered On</p>
                          <div className="text-xs font-semibold text-slate-600 flex items-center gap-1.5 mt-1">
                            <Calendar size={12} /> {new Date(selectedCustomer.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Delivery Address Book */}
                    <div className="space-y-4">
                      <h4 className="font-display text-base font-bold text-[#0F172A]">Synced Addresses ({selectedCustomer.addresses.length})</h4>
                      <div className="space-y-3">
                        {selectedCustomer.addresses.map((addr: any) => (
                          <div key={addr.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4">
                            <div className="p-2.5 rounded-xl bg-slate-50 text-slate-400 shrink-0"><MapPin size={18} /></div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-3">
                                <span className="font-bold text-xs text-[#0F172A]">{addr.firstName} {addr.lastName}</span>
                                {addr.label && (
                                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[9px] font-bold uppercase tracking-wider text-slate-500">{addr.label}</span>
                                )}
                                {addr.isDefault && (
                                  <span className="px-2 py-0.5 rounded-md bg-amber-50 border border-amber-100 text-[9px] font-bold uppercase tracking-wider text-amber-600">Default</span>
                                )}
                              </div>
                              <p className="text-xs text-slate-500 leading-relaxed pt-1">
                                {addr.houseNo}, {addr.street}{addr.landmark ? `, Near ${addr.landmark}` : ""}, {addr.city}, {addr.state} - {addr.postalCode}
                              </p>
                              <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-1"><Phone size={10} /> Contact: {addr.phone}</p>
                            </div>
                          </div>
                        ))}
                        {selectedCustomer.addresses.length === 0 && (
                          <div className="bg-white/50 border border-dashed border-slate-200 p-8 text-center rounded-2xl text-slate-400">
                            <MapPin size={24} className="mx-auto mb-2 text-slate-300" />
                            <p className="text-[10px] font-bold uppercase tracking-widest">No addresses saved to profile book.</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Transaction History Ledger */}
                    <div className="space-y-4">
                      <h4 className="font-display text-base font-bold text-[#0F172A]">Transactions & Order Ledger</h4>
                      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                              <th className="p-4 font-ui text-[9px] uppercase tracking-widest text-slate-400">Ref</th>
                              <th className="p-4 font-ui text-[9px] uppercase tracking-widest text-slate-400">Date</th>
                              <th className="p-4 font-ui text-[9px] uppercase tracking-widest text-slate-400">Amount</th>
                              <th className="p-4 font-ui text-[9px] uppercase tracking-widest text-slate-400">Status</th>
                              <th className="p-4 font-ui text-[9px] uppercase tracking-widest text-slate-400 text-right">Invoices</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                            {selectedCustomer.orders.map((order: any) => (
                              <tr key={order.id} className="hover:bg-slate-50/20 transition-colors">
                                <td className="p-4">
                                  <Link href={`/admin/orders/${order.id}`} className="font-bold text-blue-500 hover:underline text-xs">
                                    {order.orderNumber}
                                  </Link>
                                </td>
                                <td className="p-4 text-xs text-slate-400">
                                  {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                </td>
                                <td className="p-4 font-display font-bold text-xs text-[#0F172A]">
                                  ₹{(order.total / 100).toLocaleString("en-IN")}
                                </td>
                                <td className="p-4">
                                  <span className={`px-2 py-0.5 rounded-md text-[8px] font-bold uppercase tracking-wider ${
                                    order.status === "PAID" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-slate-50 text-slate-500"
                                  }`}>
                                    {order.status}
                                  </span>
                                </td>
                                <td className="p-4 text-right">
                                  {order.invoice ? (
                                    <Link 
                                      href={`/admin/invoices/${order.invoice.id}`}
                                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-50 hover:bg-[#0F172A] hover:text-white transition-all text-[9px] font-bold uppercase tracking-widest text-slate-500 border border-slate-100"
                                    >
                                      <FileText size={10} /> View Invoice
                                    </Link>
                                  ) : (
                                    <span className="text-[10px] text-slate-300 italic">No dynamic invoice</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                            {selectedCustomer.orders.length === 0 && (
                              <tr>
                                <td colSpan={5} className="p-8 text-center text-slate-400">
                                  <p className="text-[10px] font-bold uppercase tracking-widest">No order transactions found.</p>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                  </div>

                  {/* Drawer Footer */}
                  <div className="p-8 border-t border-slate-100 bg-white flex flex-wrap justify-end gap-3 shrink-0">
                    <button 
                      onClick={() => setSelectedCustomerId(null)}
                      className="px-6 py-4 rounded-xl border border-slate-200 text-xs font-bold uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all active:scale-95"
                    >
                      Close Profile
                    </button>
                    
                    <Link
                      href={`/admin/invoices/new?name=${encodeURIComponent(`${selectedCustomer.firstName} ${selectedCustomer.lastName}`)}&phone=${encodeURIComponent(selectedCustomer.phone || "")}&email=${encodeURIComponent(selectedCustomer.email || "")}&address=${encodeURIComponent(
                        selectedCustomer.addresses[0] ? `${selectedCustomer.addresses[0].houseNo}, ${selectedCustomer.addresses[0].street}, ${selectedCustomer.addresses[0].city}, ${selectedCustomer.addresses[0].state} - ${selectedCustomer.addresses[0].postalCode}` : ""
                      )}`}
                      className="px-6 py-4 rounded-xl bg-[#D4AF37] text-[#0F172A] text-xs font-bold uppercase tracking-widest shadow-lg shadow-[#D4AF37]/20 hover:bg-[#F0D080] transition-all flex items-center gap-2 active:scale-95"
                    >
                      <Plus size={14} /> Create Invoice
                    </Link>

                    <button 
                      onClick={() => {
                        setSelectedCustomerId(null);
                        handleDeleteCustomer(selectedCustomer.id, `${selectedCustomer.firstName} ${selectedCustomer.lastName}`);
                      }}
                      className="px-6 py-4 rounded-xl bg-rose-500 text-white text-xs font-bold uppercase tracking-widest shadow-lg shadow-rose-500/20 hover:bg-rose-600 transition-all active:scale-[0.98]"
                    >
                      Deactivate Account
                    </button>
                  </div>
                </>
              ) : null}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
