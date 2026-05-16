"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, User as UserIcon, LogOut, Package, Truck, CheckCircle, Clock, X, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from 'next/link';
import { toast } from "sonner";
import { signOut } from "next-auth/react";
 
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";
import { getUserOrders } from "@/actions/orders";
import { updateProfile } from "@/actions/user";
import { OrderTracking } from "@/components/ui/order-tracking";
 
export default function AccountPage() {
  const router = useRouter();
  const { user, isLoggedIn, logout } = useAuthStore();
  const { setIsAuthOpen } = useUIStore();
  const [hasMounted, setHasMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'orders' | 'profile'>('orders');
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal States
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showTracking, setShowTracking] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    if (!isLoggedIn) {
      setIsAuthOpen(true);
    }
  }, [isLoggedIn, setIsAuthOpen]);
 
  // Profile editing state
  const [profileData, setProfileData] = useState({ 
    firstName: "", 
    lastName: "",
    email: "", 
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
 
  // Fetch real order history
  useEffect(() => {
    if (isLoggedIn) {
      const fetchOrders = async () => {
        setIsLoading(true);
        const o = await getUserOrders();
        setOrders(o);
        setIsLoading(false);
      };

      const syncOrders = () => {
        void fetchOrders();
      };

      syncOrders();
      const interval = window.setInterval(syncOrders, 20000);
      window.addEventListener("focus", syncOrders);
      document.addEventListener("visibilitychange", syncOrders);

      return () => {
        window.clearInterval(interval);
        window.removeEventListener("focus", syncOrders);
        document.removeEventListener("visibilitychange", syncOrders);
      };
    }
  }, [isLoggedIn]);
 
  // Sync profile data on user load
  useEffect(() => {
    if (user) {
      setProfileData({ 
        firstName: user.firstName || "", 
        lastName: user.lastName || "",
        email: user.email || "", 
      });
    }
  }, [user]);
 
  if (!hasMounted) {
    return null;
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-brand-cream)]">
        <div className="text-center">
          <ShieldCheck size={48} className="mx-auto mb-6 text-[#8B8375]" />
          <p className="font-ui text-xs font-bold uppercase tracking-widest text-[#8B8375]">Opening Login...</p>
        </div>
      </div>
    );
  }
 
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    const result = await updateProfile(profileData);
    setIsUpdating(false);
 
    if (result.success) {
      toast.success("Profile updated.");
      setIsEditing(false);
      router.refresh();
    } else {
      toast.error(result.error);
    }
  };
 
  return (
    <main className="min-h-screen bg-[var(--color-brand-cream)] pt-32 pb-24 border-t border-black/5">
      <div className="max-w-[1320px] mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Sidebar */}
          <aside className="w-full lg:w-64 space-y-12">
            <h1 className="font-display text-5xl text-[var(--color-brand-char)]">My Account</h1>
            
            <nav className="flex flex-col gap-6">
               <button 
                  onClick={() => setActiveTab('orders')}
                  className={`flex items-center gap-4 font-ui text-sm uppercase tracking-widest font-bold transition-all ${activeTab === 'orders' ? 'text-[var(--color-brand-red)] pl-4 border-l-4 border-[var(--color-brand-red)]' : 'text-[#8B8375] hover:text-black'}`}
               >
                  <ShoppingBag size={18} />
                  Orders
               </button>
               <button 
                  onClick={() => setActiveTab('profile')}
                  className={`flex items-center gap-4 font-ui text-sm uppercase tracking-widest font-bold transition-all ${activeTab === 'profile' ? 'text-[var(--color-brand-red)] pl-4 border-l-4 border-[var(--color-brand-red)]' : 'text-[#8B8375] hover:text-black'}`}
               >
                  <UserIcon size={18} />
                  Profile
               </button>
               <button 
                  onClick={async () => {
                    logout();
                    await signOut({ callbackUrl: '/' });
                  }}
                  className="flex items-center gap-4 font-ui text-sm uppercase tracking-widest font-bold text-[#8B8375] hover:text-[var(--color-brand-red)] pt-6 border-t border-black/5"
               >
                  <LogOut size={18} />
                  Log out
               </button>
            </nav>
          </aside>
 
          {/* Main Content */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {activeTab === 'orders' ? (
                <motion.div 
                  key="orders"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-[#8B8375]">
                      <Loader2 className="animate-spin mb-4" size={40} />
                      <span className="font-ui text-xs font-bold uppercase tracking-widest">Loading your orders...</span>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="bg-white rounded-[32px] p-20 text-center border border-black/5 shadow-sm">
                      <ShoppingBag size={48} className="mx-auto text-black/10 mb-8" />
                      <h3 className="font-display text-2xl mb-4">No Orders Yet</h3>
                      <Link href="/collections" className="bg-black text-white px-10 py-4 rounded-full font-ui text-[10px] font-bold uppercase tracking-widest">Shop Now</Link>
                    </div>
                  ) : orders.map((order) => (
                    <div key={order.id} className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-black/5">
                      <div className="p-6 md:p-8 flex items-center justify-between border-b border-black/5 bg-gray-50/50">
                        <div className="flex items-center gap-3 text-green-600">
                          <CheckCircle size={18} />
                          <span className="font-ui text-xs font-bold uppercase tracking-widest">Order {order.status}</span>
                        </div>
                        <div className="flex gap-4">
                           <button 
                             onClick={() => { setSelectedOrder(order); setShowTracking(true); }}
                             className="bg-[var(--color-brand-red)] text-white font-ui text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-sm"
                           >
                             Track Order
                           </button>
                           <button 
                             onClick={() => { setSelectedOrder(order); setShowDetails(true); }}
                             className="bg-[var(--color-brand-char)] text-white font-ui text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-sm"
                           >
                             View Details
                           </button>
                        </div>
                      </div>
                      
                      <div className="p-8 grid md:grid-cols-2 gap-12">
                        <div className="space-y-6">
                           <div className="grid grid-cols-2 gap-y-4">
                              <span className="text-[#8B8375] font-ui text-xs uppercase tracking-widest">Order ID</span>
                              <span className="font-display text-lg">{order.orderNumber}</span>
                              
                              <span className="text-[#8B8375] font-ui text-xs uppercase tracking-widest">Order Date</span>
                              <span className="font-display text-lg">{new Date(order.createdAt).toLocaleDateString("en-IN", { month: "long", day: "numeric", year: "numeric" })}</span>
                              
                              <span className="text-[#8B8375] font-ui text-xs uppercase tracking-widest">Order Total</span>
                              <span className="font-display text-lg text-[var(--color-brand-gold)]">₹{(order.total / 100).toLocaleString("en-IN")}</span>
                           </div>
 
                           <div className="flex gap-4 items-center">
                              <span className="font-ui text-[11px] font-bold uppercase tracking-widest text-[#8B8375]">Delivery Status</span>
                              <div className="flex-1 h-px bg-black/5" />
                           </div>

                           {(order.shippingCarrier || order.trackingId) && (
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                               <div className="p-4 rounded-2xl bg-[#F8F5EE] border border-black/5">
                                 <p className="font-ui text-[9px] uppercase tracking-widest text-[#8B8375] mb-1">Courier Partner</p>
                                 <p className="font-display text-lg text-[var(--color-brand-char)]">{order.shippingCarrier || "Assigned after shipment"}</p>
                               </div>
                               <div className="p-4 rounded-2xl bg-[#F8F5EE] border border-black/5">
                                 <p className="font-ui text-[9px] uppercase tracking-widest text-[#8B8375] mb-1">Tracking ID</p>
                                 <p className="font-display text-lg text-[var(--color-brand-char)] break-all">{order.trackingId || "Pending"}</p>
                               </div>
                             </div>
                           )}

                           <div className="flex justify-between items-center px-2">
                             {[
                               { l: 'Order Placed', i: Clock, a: true },
                               { l: 'Confirmed', i: CheckCircle, a: order.status === 'PAID' },
                               { l: 'Shipped', i: Truck, a: order.status === 'SHIPPED' || order.status === 'DELIVERED' },
                               { l: 'Delivered', i: Package, a: order.status === 'DELIVERED' }
                             ].map((s, idx) => (
                               <div key={idx} className="flex flex-col items-center gap-2">
                                 <div className={`w-8 h-8 rounded-full flex items-center justify-center ${s.a ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                                    <s.i size={14} />
                                 </div>
                                 <span className="text-[9px] font-bold uppercase tracking-tighter text-[#8B8375]">{s.l}</span>
                               </div>
                             ))}
                           </div>
                        </div>
 
                        <div className="space-y-6">
                           <span className="font-ui text-[11px] font-bold uppercase tracking-widest text-[#8B8375]">Items ({order.items.length})</span>
                           {order.items.map((item: any, id: number) => (
                             <div key={id} className="flex gap-6 items-center group">
                               <div className="w-16 h-20 relative rounded-lg overflow-hidden bg-[#E8E1D5]">
                                 {/* Map items to product properties */}
                                 <Image src={item.img || "/placeholder.jpg"} alt={item.name} fill className="object-cover" />
                               </div>
                               <div>
                                 <h4 className="font-display text-lg text-[var(--color-brand-char)] leading-tight">{item.name}</h4>
                                 <p className="font-ui text-[9px] text-[#8B8375] uppercase tracking-widest mt-1">QTY: {item.quantity}</p>
                                 <p className="font-display text-sm text-[var(--color-brand-gold)]">₹{(item.total / 100).toLocaleString("en-IN")}</p>
                               </div>
                             </div>
                           ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  key="profile"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-black/5 max-w-2xl"
                >
                   <div className="flex justify-between items-end mb-12">
                      <div>
                        <h3 className="font-display text-3xl mb-1 text-[var(--color-brand-char)]">Your Profile</h3>
                        <p className="font-ui text-xs uppercase tracking-[0.2em] text-[#8B8375]">Personal & Shipping Information</p>
                      </div>
                      {!isEditing && (
                        <button 
                          onClick={() => setIsEditing(true)}
                          className="font-ui text-[11px] font-bold uppercase tracking-widest text-[var(--color-brand-red)] hover:underline"
                        >
                          Edit Information
                        </button>
                      )}
                   </div>
 
                   <form onSubmit={handleUpdateProfile} className="space-y-8">
                      <div className="grid md:grid-cols-2 gap-8">
                         <div className="space-y-1">
                            <label className="font-ui text-[10px] uppercase font-bold tracking-widest text-[var(--color-brand-red)]">First Name</label>
                            {isEditing ? (
                              <input required value={profileData.firstName} onChange={(e) => setProfileData({...profileData, firstName: e.target.value})} className="w-full border-b border-black/10 py-2 outline-none font-display text-lg bg-transparent" />
                            ) : (
                              <p className="font-display text-xl">{user?.firstName}</p>
                            )}
                         </div>
                         <div className="space-y-1">
                            <label className="font-ui text-[10px] uppercase font-bold tracking-widest text-[var(--color-brand-red)]">Last Name</label>
                            {isEditing ? (
                              <input required value={profileData.lastName} onChange={(e) => setProfileData({...profileData, lastName: e.target.value})} className="w-full border-b border-black/10 py-2 outline-none font-display text-lg bg-transparent" />
                            ) : (
                              <p className="font-display text-xl">{user?.lastName}</p>
                            )}
                         </div>
                      </div>
 
                      <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-1">
                           <label className="font-ui text-[10px] uppercase font-bold tracking-widest text-[var(--color-brand-red)]">Mobile Number</label>
                           <p className="font-display text-xl opacity-50">+91 {user?.phone}</p>
                        </div>
                        <div className="space-y-1">
                           <label className="font-ui text-[10px] uppercase font-bold tracking-widest text-[var(--color-brand-red)]">Email</label>
                           {isEditing ? (
                             <input required type="email" value={profileData.email} onChange={(e) => setProfileData({...profileData, email: e.target.value})} className="w-full border-b border-black/10 py-2 outline-none font-display text-lg bg-transparent" />
                           ) : (
                             <p className="font-display text-xl">{user?.email || 'Not set'}</p>
                           )}
                        </div>
                      </div>
 
                      {isEditing && (
                        <div className="flex gap-6 pt-6">
                           <button 
                             disabled={isUpdating}
                             type="submit" 
                             className="bg-black text-white font-ui text-xs font-bold uppercase tracking-widest px-10 py-5 rounded-full hover:bg-[var(--color-brand-red)] transition-all shadow-xl disabled:opacity-50"
                           >
                            {isUpdating ? 'Updating...' : 'Save Changes'}
                           </button>
                           <button type="button" onClick={() => setIsEditing(false)} className="font-ui text-xs font-bold uppercase tracking-widest text-[#8B8375] hover:text-black transition-all">
                            Cancel
                           </button>
                        </div>
                      )}
                      
                      {!isEditing && (
                        <div className="p-8 bg-[#FDF5E6] rounded-3xl border border-black/5">
                           <p className="font-ui text-[10px] text-[#A67C00] leading-relaxed uppercase tracking-[0.05em]">Your email is used to send order confirmations and shipping updates. Please keep it up to date.</p>
                        </div>
                      )}
                   </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
 
        </div>
      </div>
 
      {/* Global Modals */}
      <AnimatePresence>
        {showTracking && selectedOrder && (
          <TrackingModal order={selectedOrder} onClose={() => setShowTracking(false)} />
        )}
        {showDetails && selectedOrder && (
          <OrderDetailsModal order={selectedOrder} onClose={() => setShowDetails(false)} />
        )}
      </AnimatePresence>
    </main>
  );
}
 
function Loader2({ className, size }: { className: string, size: number }) {
  return (
    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className={className}>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-loader-2"><path d="M12 2v4"/><path d="m16.2 7.8 2.9-2.9"/><path d="M18 12h4"/><path d="m16.2 16.2 2.9 2.9"/><path d="M12 18v4"/><path d="m4.9 19.1 2.9-2.9"/><path d="M2 12h4"/><path d="m4.9 4.9 2.9 2.9"/></svg>
    </motion.div>
  );
}
 
// Modals - Refined for Real Data
function TrackingModal({ order, onClose }: { order: any, onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-2xl bg-white rounded-[32px] overflow-hidden shadow-2xl">
        <div className="p-8 md:p-12">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="font-display text-2xl text-[var(--color-brand-char)] uppercase tracking-tight">Order Tracking</h3>
              <p className="font-ui text-[10px] font-bold uppercase tracking-[0.2em] text-[#8B8375] mt-1">Order #{order.orderNumber}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors text-black/40"><X size={24} /></button>
          </div>
           <div className="relative">
             <div className="pt-4">
               <OrderTracking 
                  steps={[
                    { name: 'Order Placed', timestamp: new Date(order.createdAt).toLocaleDateString(), isCompleted: true },
                    { name: 'Paid / Confirmed', timestamp: order.status !== 'CREATED' ? 'Verified' : 'Pending', isCompleted: order.status !== 'CREATED' },
                    { name: 'Shipped', timestamp: order.status === 'SHIPPED' || order.status === 'DELIVERED' ? 'In Transit' : 'Pending', isCompleted: order.status === 'SHIPPED' || order.status === 'DELIVERED' },
                    { name: 'Delivered', timestamp: order.status === 'DELIVERED' ? 'Complete' : 'Pending', isCompleted: order.status === 'DELIVERED' }
                  ]}
               />
             </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
 
function OrderDetailsModal({ order, onClose }: { order: any, onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-4xl bg-[var(--color-brand-cream)] rounded-[32px] overflow-hidden shadow-2xl flex flex-col md:flex-row">
        
        {/* Left Side: Summary & Billing */}
        <div className="w-full md:w-2/3 bg-white p-8 md:p-12 overflow-y-auto max-h-[80vh] no-scrollbar">
          <div className="flex justify-between items-start mb-12">
            <div>
               <h3 className="font-display text-3xl text-[var(--color-brand-char)]">Order Invoice</h3>
               <p className="font-ui text-[10px] font-bold uppercase tracking-[0.2em] text-[#8B8375] mt-1">Order #: {order.orderNumber}</p>
            </div>
            <button onClick={onClose} className="md:hidden p-2 hover:bg-black/5 rounded-full transition-colors text-black/40"><X size={24} /></button>
          </div>
 
             <div className="space-y-8">
             {order.items.map((item: any, id: number) => (
                <div key={id} className="flex gap-6 items-center">
                   <div className="w-20 h-24 relative rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0">
                      <Image src={item.img || "/placeholder.jpg"} alt={item.name} fill className="object-cover" />
                   </div>
                   <div className="flex-1">
                      <h4 className="font-ui text-xs font-bold uppercase tracking-widest text-[var(--color-brand-char)] leading-tight">{item.name}</h4>
                      <p className="font-display text-xl mt-1">₹{(item.price / 100).toLocaleString("en-IN")}</p>
                      <p className="font-ui text-[10px] text-[#8B8375] uppercase tracking-widest mt-2">Quantity: {item.quantity}</p>
                   </div>
                </div>
             ))}
          </div>
 
          <div className="mt-12 pt-12 border-t border-black/5 space-y-4">
             <div className="flex justify-between font-ui text-[11px] font-bold uppercase tracking-widest text-[#8B8375]">
                <span>Order Subtotal</span>
                <span>₹{(order.subtotal / 100).toLocaleString("en-IN")}</span>
             </div>
             <div className="flex justify-between font-ui text-[11px] font-bold uppercase tracking-widest text-[#8B8375]">
                <span>GST (18%)</span>
                <span>₹{(order.tax / 100).toLocaleString("en-IN")}</span>
             </div>
             <div className="flex justify-between font-display text-3xl text-[var(--color-brand-char)] pt-6 border-t border-black/10 mt-6">
                <span>Total Price</span>
                <span>₹{(order.total / 100).toLocaleString("en-IN")}</span>
             </div>
          </div>
        </div>
 
        {/* Right Side: Destination Snapshot */}
        <div className="w-full md:w-1/3 p-8 md:p-12 flex flex-col justify-between">
           <button onClick={onClose} className="hidden md:block self-end p-2 hover:bg-black/5 rounded-full transition-colors text-black/40"><X size={24} /></button>
           
           <div className="space-y-12">
              <div>
                 <h4 className="font-ui text-[10px] font-bold uppercase tracking-[0.2em] text-[#8B8375] mb-6 border-b border-black/5 pb-2">Customer Details</h4>
                 <div className="font-display text-xl space-y-1">
                    <p>{order.address?.firstName} {order.address?.lastName}</p>
                    <p className="text-xs text-[#8B8375] font-ui uppercase tracking-widest">{order.address?.phone}</p>
                 </div>
              </div>
 
              <div>
                 <h4 className="font-ui text-[10px] font-bold uppercase tracking-[0.2em] text-[#8B8375] mb-6 border-b border-black/5 pb-2">Shipping Address</h4>
                 <div className="font-ui text-xs text-[var(--color-brand-char)] leading-relaxed space-y-1">
                    <p>{order.address?.houseNo}</p>
                    <p>{order.address?.street}</p>
                    <p>{order.address?.city}, {order.address?.postalCode}</p>
                    <p className="font-bold uppercase tracking-widest mt-4">{order.address?.country}</p>
                 </div>
              </div>
           </div>
 
          <div className="pt-12 text-center">
              <ShieldCheck size={40} className="mx-auto text-[var(--color-brand-gold)] opacity-30 mb-4" />
              <p className="font-ui text-[9px] font-bold uppercase tracking-[0.15em] text-[#8B8375]">100% Quality Guaranteed</p>
           </div>
        </div>
      </motion.div>
    </div>
  );
}
