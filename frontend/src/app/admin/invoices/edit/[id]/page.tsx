"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowLeft, 
  Send, 
  Save, 
  Plus, 
  Trash2, 
  Calendar,
  CreditCard,
  ChevronDown,
  Download,
  CheckCircle2,
  X,
  ChevronRight,
  Printer
} from "lucide-react";
import { useParams } from "next/navigation";
import { getAdminOrderById } from "@/actions/admin";

interface InvoiceItem {
  id: string;
  name: string;
  details: string;
  rate: number;
  quantity: number;
  hsn: string;
}

export default function EditInvoicePage() {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [invoiceType, setInvoiceType] = useState<"POS" | "WEB">("POS");
  const [invoiceNo, setInvoiceNo] = useState("");
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [billingInfo, setBillingInfo] = useState({ name: "", address: "", phone: "", gstin: "" });
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [gstPercent, setGstPercent] = useState(12.5);
  const [contactNo, setContactNo] = useState("+91 84318 38722");

  useEffect(() => {
    async function fetchInvoice() {
      if (!id) return;
      const res = await getAdminOrderById(id as string);
      if (res.success && res.order) {
        const order = res.order;
        const oNum = order.orderNumber ?? "";
        setInvoiceNo(oNum);
        setInvoiceType(oNum.startsWith("#AAW") ? "WEB" : "POS");
        setItems(order.items.map((item: any) => ({
          id: item.id,
          name: (item.product?.name || item.name) ?? "Unknown Product",
          details: (item.material || "Standard Art") ?? "",
          rate: item.price ?? 0,
          quantity: item.quantity ?? 1,
          hsn: "74199930" 
        })));
        
        const sub = order.items.reduce((acc: number, curr: any) => acc + (curr.price * curr.quantity), 0);
        const percent = sub > 0 ? (order.discount / sub) * 100 : 0;
        setDiscountPercent(Math.round(percent));
        
        setShipping(order.shippingCharge ?? 0);
        setBillingInfo({
          name: `${order.user.firstName ?? ""} ${order.user.lastName ?? ""}`,
          address: `${order.address.houseNo ?? ""}, ${order.address.street ?? ""}, ${order.address.city ?? ""}`,
          phone: order.user.phone ?? "",
          gstin: "29PTJPS2898B1ZQ"
        });
      }
      setIsLoading(false);
    }
    fetchInvoice();
  }, [id]);

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), name: '', details: '', rate: 0, quantity: 1, hsn: '74199930' }]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) setItems(items.filter(i => i.id !== id));
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  const subTotal = items.reduce((acc, curr) => acc + (curr.rate * curr.quantity), 0);
  const gst = subTotal * (gstPercent / 100);
  const discountAmount = (subTotal * discountPercent) / 100;
  const grandTotal = subTotal + gst + shipping - discountAmount;

  const formatRupee = (val: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  };

  if (isLoading) return <div className="p-20 text-center font-bold text-slate-400">Syncing with Registry...</div>;

  return (
    <div className="space-y-4 pb-32 font-ui text-[13px] print:p-0">
      <style jsx global>{`
        @media print {
          @page { size: A4; margin: 0 !important; }
          body { -webkit-print-color-adjust: exact; margin: 0 !important; padding: 0 !important; }
          html, body { height: 100%; border: none !important; }
          .admin-sidebar, .admin-topbar, .bypass-alert, .no-print, header, footer { display: none !important; }
          .print-compact { padding: 10mm !important; margin: 0 !important; border: none !important; }
        }
      `}</style>

      {/* Admin Action Header */}
      <div className="flex justify-between items-center no-print px-6 py-4 bg-white border border-slate-100 rounded-xl shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/admin/invoices" className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:bg-slate-100"><ArrowLeft size={16}/></Link>
          <h1 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider">Editor: {invoiceNo}</h1>
        </div>
        <div className="flex gap-2">
            <button onClick={() => window.print()} className="px-6 py-2.5 bg-blue-500 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest"><Printer size={16}/> Print</button>
            <button className="px-6 py-2.5 bg-[#0F172A] text-white rounded-lg text-[10px] font-bold uppercase tracking-widest"><Save size={16}/> Sync Cloud</button>
        </div>
      </div>

      <div className="bg-white rounded-[10px] border border-slate-100 overflow-hidden print-compact">
         
         {/* Consolidated Header Area */}
         <div className="p-8 pb-4 grid grid-cols-2 gap-4 items-start border-b border-slate-50 print:p-0 print:border-none">
            <div className="space-y-4">
               <div className="relative h-14 w-60 mb-2">
                  <Image src="/Logo3.png" alt="Anand Arts Logo" fill className="object-contain object-left" priority />
               </div>
               <div className="text-[11px] text-slate-500 font-bold leading-tight">
                  2/4, 10th 'A, Laxmi Narayanpuram,<br/>
                  Srirampura, Bengaluru, 560021
               </div>
            </div>

            <div className="text-right space-y-1">
                <div className="mb-2">
                  <p className="text-[20px] font-black text-[#0F172A] tracking-tight">TAX INVOICE</p>
                  <p className="text-[14px] font-bold text-blue-500">{invoiceNo}</p>
                  <p className="text-[10px] font-bold text-slate-400">Date: {new Date().toLocaleDateString('en-IN')}</p>
               </div>
               <p className="text-[11px] text-slate-500 font-bold"><span className="text-[9px] uppercase text-slate-300">GST:</span> 29PTJPS2898B1ZQ</p>
               <p className="text-[11px] text-slate-500 font-bold">anandartsandmetalcraft@gmail.com</p>
               <div className="flex justify-end gap-1">
                  <span className="text-slate-300 text-[9px] font-black uppercase no-print">Mob:</span>
                  <input value={contactNo} onChange={e => setContactNo(e.target.value)} className="w-32 text-right bg-transparent outline-none text-[11px] font-bold text-slate-500" />
               </div>
            </div>
         </div>

         {/* Compact Address Row */}
         <div className="px-8 py-4 grid grid-cols-2 gap-10 border-b border-slate-50 print:py-2">
            <div className="space-y-1">
               <p className="text-[9px] font-black uppercase tracking-widest text-slate-300">Bill To:</p>
               <input value={billingInfo.name} onChange={e => setBillingInfo({...billingInfo, name: e.target.value})} className="w-full font-bold text-[13px] outline-none" />
               <textarea value={billingInfo.address} onChange={e => setBillingInfo({...billingInfo, address: e.target.value})} rows={2} className="w-full text-slate-500 text-[11px] outline-none resize-none" />
               <input value={billingInfo.phone} onChange={e => setBillingInfo({...billingInfo, phone: e.target.value})} className="w-full text-slate-400 text-[11px] outline-none" />
            </div>
            <div className="space-y-1">
               <p className="text-[9px] font-black uppercase tracking-widest text-slate-300">Ship To:</p>
               <div className="flex flex-col">
                  <p className="font-bold text-[13px]">{billingInfo.name}</p>
                  <p className="text-slate-500 text-[11px] italic">Same as billing information</p>
               </div>
            </div>
         </div>

         {/* Items Table */}
         <div className="px-8 py-4 print:p-0">
            <table className="w-full border-collapse">
               <thead>
                  <tr className="border-b text-[10px] uppercase font-black tracking-widest text-slate-400">
                     <th className="py-2 text-left w-8">#</th>
                     <th className="py-2 text-left">Description</th>
                     <th className="py-2 text-center w-24">Rate</th>
                     <th className="py-2 text-center w-16">Qty</th>
                     <th className="py-2 text-right w-24">Sum</th>
                     <th className="py-2 w-8 no-print"></th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50 text-[12px]">
                  {items.map((item, idx) => (
                     <tr key={item.id} className="group">
                        <td className="py-3 text-slate-300 font-bold">{idx + 1}</td>
                         <td className="py-4">
                            <input 
                              value={item.name} 
                              onChange={e => updateItem(item.id, 'name', e.target.value)} 
                              className="w-full font-black text-[18px] text-[#0F172A] outline-none placeholder:text-slate-200 leading-tight uppercase tracking-tight" 
                              placeholder="PRODUCT NAME" 
                            />
                            <div className="flex items-center gap-3 mt-1.5 uppercase font-bold">
                               <input 
                                 value={item.details} 
                                 onChange={e => updateItem(item.id, 'details', e.target.value)} 
                                 className="flex-1 text-[11px] text-slate-500 outline-none placeholder:text-slate-300 tracking-wide" 
                                 placeholder="Material / Size Details" 
                               />
                               <div className="flex items-center gap-1.5 opacity-40">
                                  <span className="text-[9px] font-black text-slate-400">HSN</span>
                                  <input 
                                    value={item.hsn} 
                                    onChange={e => updateItem(item.id, 'hsn', e.target.value)} 
                                    className="w-20 text-[10px] text-slate-500 outline-none border-b border-slate-200" 
                                  />
                               </div>
                            </div>
                         </td>
                        <td className="py-3 text-center"><input type="number" value={item.rate} onChange={e => updateItem(item.id, 'rate', parseFloat(e.target.value))} className="w-full text-center font-bold outline-none" /></td>
                        <td className="py-3 text-center"><input type="number" value={item.quantity} onChange={e => updateItem(item.id, 'quantity', parseInt(e.target.value))} className="w-full text-center font-bold outline-none" /></td>
                        <td className="py-3 text-right font-bold text-blue-600">{formatRupee(item.rate * item.quantity)}</td>
                        <td className="py-3 no-print text-center"><button onClick={() => removeItem(item.id)} className="text-rose-400"><X size={14}/></button></td>
                     </tr>
                  ))}
               </tbody>
            </table>
            
            <button onClick={addItem} className="mt-4 text-[10px] font-black uppercase text-blue-500 no-print underline decoration-2 outline-none">+ Add Line</button>

            {/* Financial Summary */}
            <div className="mt-6 grid grid-cols-2 gap-10 items-end">
               <div className="space-y-4">
                   <div className="p-4 bg-slate-50 rounded-lg print:bg-white print:border-slate-100 print:border print:p-3">
                      <p className="text-[9px] font-black uppercase text-slate-400 mb-1 tracking-widest">Payment Method</p>
                      <div className="relative">
                        <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className="w-full bg-transparent font-bold text-[#0F172A] outline-none text-[12px] appearance-none cursor-pointer print:hidden">
                           <option>Cash</option>
                           <option>UPI / Transfer</option>
                           <option>Card Terminal</option>
                        </select>
                        <span className="hidden print:block font-bold text-[12px] text-[#0F172A]">{paymentMethod}</span>
                        <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none print:hidden" />
                      </div>
                   </div>
                  <div className="hidden print:block pt-6">
                     <div className="w-40 border-t border-slate-900/10 pt-1">
                        <p className="text-[9px] font-black text-slate-300 uppercase">Authorized</p>
                        <p className="text-[12px] font-bold italic text-slate-800">Anand Arts</p>
                     </div>
                  </div>
               </div>

               <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[11px] font-bold text-slate-400">
                     <span>SUBTOTAL</span>
                     <span>{formatRupee(subTotal)}</span>
                  </div>
                   <div className="flex justify-between items-center text-[11px] font-bold text-slate-400">
                      <div className="flex items-center gap-1">
                        <span>TAX (%)</span>
                        <input type="number" value={gstPercent} onChange={e => setGstPercent(parseFloat(e.target.value) || 0)} className="w-10 text-right bg-slate-50 rounded no-print outline-none text-blue-600" />
                        <span className="hidden print:inline-block">({gstPercent}%)</span>
                      </div>
                      <span>{formatRupee(gst)}</span>
                   </div>
                  <div className="flex justify-between items-center text-[11px] font-black text-rose-500">
                     <div className="flex items-center gap-1">
                        <span>DISCOUNT %</span>
                        <input value={discountPercent} onChange={e => setDiscountPercent(parseFloat(e.target.value) || 0)} className="w-8 text-right bg-rose-50 rounded no-print outline-none" />
                     </div>
                     <span>-{formatRupee(discountAmount)}</span>
                  </div>
                   <div className="flex justify-between items-center bg-[#0F172A] py-4 px-6 rounded-lg text-white mt-4 print:bg-white print:text-[#0F172A] print:border-t-2 print:border-[#0F172A] print:px-0">
                      <span className="text-[12px] font-black uppercase tracking-[0.2em]">Grand Total</span>
                      <span className="text-[24px] font-black">{formatRupee(grandTotal)}</span>
                   </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
