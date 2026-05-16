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
  FileText, 
  Calendar,
  CreditCard,
  ChevronDown,
  Download,
  CheckCircle2,
  X,
  Printer
} from "lucide-react";

interface InvoiceItem {
  id: string;
  name: string;
  details: string;
  rate: number;
  quantity: number;
  hsn: string;
}

export default function CreateInvoicePage() {
  const [invoiceType, setInvoiceType] = useState<"POS" | "WEB">("POS");
  const [invoiceNo, setInvoiceNo] = useState("#AAS001");
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', name: '', details: '', rate: 0, quantity: 1, hsn: '74199930' }
  ]);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [isSameAddress, setIsSameAddress] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [contactNo, setContactNo] = useState("+91 84318 38722");

  // Auto-generate non-editable ID based on type
  useEffect(() => {
    const prefix = invoiceType === "POS" ? "AAS" : "AAW";
    const random = Math.floor(Math.random() * 900) + 100;
    setInvoiceNo(`#${prefix}${random}`);
  }, [invoiceType]);

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
  const gst = subTotal * 0.125; 
  const discountAmount = (subTotal * discountPercent) / 100;
  const grandTotal = subTotal + gst + shipping - discountAmount;

  const formatRupee = (val: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  };

  const handleDownload = () => {
    window.print();
  };

  return (
    <div className="space-y-4 pb-32 font-ui text-[13px] print:p-0 print:space-y-0">
      <style jsx global>{`
        @media print {
          @page { size: A4; margin: 0 !important; }
          body { -webkit-print-color-adjust: exact; margin: 0 !important; padding: 0 !important; }
          html, body { height: 100%; border: 1px solid transparent; }
          .admin-sidebar, .admin-topbar, .bypass-alert, .no-print, header, footer { display: none !important; }
          .print-compact { padding: 15mm !important; margin: 0 !important; }
        }
      `}</style>
      
      {/* Dashboard Toggle - Hidden on print */}
      <div className="flex justify-between items-center no-print px-4 py-2 bg-white rounded-xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
           <h1 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider">Invoice Studio</h1>
           <div className="h-4 w-[1px] bg-slate-200"></div>
           <div className="flex bg-slate-100 p-1 rounded-lg">
              <button onClick={() => setInvoiceType("POS")} className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all ${invoiceType === "POS" ? "bg-white text-blue-500 shadow-sm" : "text-slate-400"}`}>POS</button>
              <button onClick={() => setInvoiceType("WEB")} className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all ${invoiceType === "WEB" ? "bg-white text-blue-500 shadow-sm" : "text-slate-400"}`}>Website</button>
           </div>
        </div>
        <div className="flex items-center gap-2">
           <button onClick={handleDownload} className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest"><Printer size={14}/> Print</button>
           <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest"><Save size={14}/> Save</button>
        </div>
      </div>

      <div className="bg-white rounded-[8px] border border-slate-100 shadow-sm overflow-hidden print:border-none print:shadow-none print-compact">
         
         {/* Part 1: Unified Header (Logo Left, Info Right) */}
         <div className="p-8 pb-4 grid grid-cols-2 gap-4 items-start border-b border-slate-50 print:p-0 print:border-none">
            <div className="space-y-4">
               <div className="relative h-16 w-64 mb-4">
                  <Image src="/Logo3.png" alt="Anand Arts Logo" fill className="object-contain object-left" priority />
               </div>
               <div className="text-[12px] text-slate-500 font-bold leading-tight">
                  2/4, 10th 'A, Laxmi Narayanpuram,<br/>
                  Srirampura, Bengaluru, 560021
               </div>
            </div>

            <div className="text-right space-y-1">
               <div className="mb-4">
                  <p className="text-[16px] font-black text-[#0F172A] uppercase tracking-tighter">INVOICE</p>
                  <p className="text-[14px] font-bold text-blue-500">{invoiceNo}</p>
                  <p className="text-[10px] font-bold text-slate-400">{new Date().toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
               </div>
               <p className="text-[11px] text-slate-500 font-bold"><span className="text-slate-300 uppercase text-[9px] mr-1">GST:</span> 29PTJPS2898B1ZQ</p>
               <p className="text-[11px] text-slate-500 font-bold">anandartsandmetalcraft@gmail.com</p>
               <div className="flex justify-end items-center gap-1">
                  <span className="text-slate-300 font-bold text-[9px] uppercase no-print">Mobile:</span>
                  <input value={contactNo} onChange={e => setContactNo(e.target.value)} className="bg-transparent font-bold text-slate-500 outline-none w-32 text-right text-[11px]" />
               </div>
               <div className="pt-1 flex justify-end">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest ${grandTotal > 0 ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}>
                     Status: Paid
                  </span>
               </div>
            </div>
         </div>

         {/* Part 2: Address Row (Side by Side) */}
         <div className="px-8 py-4 grid grid-cols-2 gap-10 border-b border-slate-50 print:py-2 print:border-none">
            <div className="space-y-2">
               <p className="text-[10px] font-black uppercase tracking-widest text-[#0F172A]">Billing To:</p>
               <input placeholder="Full Name / Company" className="w-full font-bold text-[#0F172A] text-[13px] outline-none" />
               <textarea placeholder="Complete Address" rows={2} className="w-full text-slate-500 text-[12px] outline-none resize-none leading-tight" />
               <input placeholder="Phone: +91" className="w-full text-slate-400 text-[11px] outline-none" />
            </div>
            <div className="space-y-2">
               <div className="flex items-center gap-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#0F172A]">Shipping To:</p>
                  <button onClick={() => setIsSameAddress(!isSameAddress)} className="text-[8px] font-bold uppercase px-1.5 py-0.5 bg-slate-50 text-slate-400 rounded no-print hover:bg-blue-50 hover:text-blue-500 transition-colors">Same as Billing?</button>
               </div>
               <div className={isSameAddress ? "opacity-30 print:opacity-100" : "opacity-100"}>
                  <input placeholder="Full Name / Receiver" className="w-full font-bold text-[#0F172A] text-[13px] outline-none" />
                  <textarea placeholder="Delivery Address" rows={2} className="w-full text-slate-500 text-[12px] outline-none resize-none leading-tight" />
                  <input placeholder="Phone: +91" className="w-full text-slate-400 text-[11px] outline-none" />
               </div>
            </div>
         </div>

         {/* Part 3: Items Table */}
         <div className="px-8 py-4 print:p-0 print:pt-4">
            <table className="w-full">
               <thead>
                  <tr className="border-b-2 border-slate-900/5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                     <th className="py-3 text-left w-10">#</th>
                     <th className="py-3 text-left">Description</th>
                     <th className="py-3 text-center w-24">Rate</th>
                     <th className="py-3 text-center w-16">Qty</th>
                     <th className="py-3 text-right w-24">Amount</th>
                     <th className="py-3 w-10 no-print"></th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {items.map((item, idx) => (
                     <tr key={item.id} className="group">
                        <td className="py-4 text-[11px] font-bold text-slate-300">{idx + 1}</td>
                        <td className="py-4">
                           <input value={item.name} onChange={e => updateItem(item.id, 'name', e.target.value)} placeholder="Product Name" className="w-full font-bold text-[13px] text-[#0F172A] outline-none" />
                           <div className="flex items-center gap-4 mt-1">
                              <input value={item.details} onChange={e => updateItem(item.id, 'details', e.target.value)} placeholder="Specifications" className="flex-1 text-[11px] text-slate-400 outline-none" />
                              <div className="flex items-center gap-1">
                                 <span className="text-[9px] font-black text-slate-200">HSN</span>
                                 <input value={item.hsn} onChange={e => updateItem(item.id, 'hsn', e.target.value)} className="w-20 text-[10px] font-bold text-slate-400 outline-none" />
                              </div>
                           </div>
                        </td>
                        <td className="py-4 text-center">
                           <input type="number" value={item.rate} onChange={e => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)} className="w-full text-center font-bold text-[#0F172A] text-[13px] outline-none" />
                        </td>
                        <td className="py-4 text-center">
                           <input type="number" value={item.quantity} onChange={e => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)} className="w-full text-center font-bold text-[#0F172A] text-[13px] outline-none" />
                        </td>
                        <td className="py-4 text-right font-bold text-[#0F172A] text-[13px]">
                           {formatRupee(item.rate * item.quantity)}
                        </td>
                        <td className="py-4 text-right no-print">
                           <button onClick={() => removeItem(item.id)} className="text-rose-400 opacity-0 group-hover:opacity-100"><X size={14}/></button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
            
            <button onClick={addItem} className="mt-4 flex items-center gap-1 text-[10px] font-black uppercase text-blue-500 no-print underline underline-offset-4 decoration-2">
               <Plus size={14}/> Add New Item Row
            </button>

            {/* Part 4: Footer Grid (Summaries & Signature) */}
            <div className="mt-8 grid grid-cols-2 gap-10 items-end">
               <div className="space-y-4">
                  <div className="p-4 bg-slate-50/50 rounded-lg border border-slate-100 print:bg-white print:border-none print:p-0">
                     <p className="text-[9px] font-black uppercase tracking-widest text-slate-300 mb-2">Payment Instruction:</p>
                     <div className="flex items-center gap-2 mb-3">
                        <span className="text-[10px] font-bold text-slate-500">Method:</span>
                        <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className="bg-white border border-slate-200 rounded px-2 py-1 text-[11px] font-bold text-blue-600 outline-none print:bg-transparent print:border-none">
                           <option>Cash</option>
                           <option>UPI / PhonePe</option>
                           <option>Card Payment</option>
                           <option>Netbanking</option>
                        </select>
                     </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed italic">
                        All invoices are due within 7 days. Products may vary slightly due to their handmade nature.
                      </p>
                  </div>
                  <div className="hidden print:block pt-10">
                     <div className="w-48 border-t border-slate-900/10 pt-2">
                        <p className="text-[9px] font-black uppercase text-slate-400">Authorized Signature</p>
                        <p className="text-[12px] font-bold text-[#0F172A] italic">For Anand Arts</p>
                     </div>
                  </div>
               </div>

               <div className="space-y-2">
                  <div className="flex justify-between items-center text-[11px] font-bold text-slate-400 px-2 py-1">
                     <span>SUB TOTAL (Excl. Tax)</span>
                     <span>{formatRupee(subTotal)}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] font-bold text-slate-400 px-2 py-1 border-b border-dashed border-slate-100">
                     <span>GST (12.5%)</span>
                     <span>{formatRupee(gst)}</span>
                  </div>
                  <div className="flex justify-between items-center px-2 py-1">
                     <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-rose-500 uppercase">Discount (%)</span>
                        <input type="number" value={discountPercent} onChange={e => setDiscountPercent(parseFloat(e.target.value) || 0)} className="w-10 text-right font-black text-rose-500 text-[11px] bg-rose-50/50 rounded no-print" />
                     </div>
                     <span className="text-[11px] font-bold text-rose-500">-{formatRupee(discountAmount)}</span>
                  </div>
                  <div className="flex justify-between items-center px-2 py-1 text-[11px] font-bold text-slate-400">
                     <span>SHIPPING</span>
                     <input type="number" value={shipping} onChange={e => setShipping(parseFloat(e.target.value) || 0)} className="w-16 text-right outline-none no-print border-b border-slate-100" />
                     <span className="hidden print:inline">{formatRupee(shipping)}</span>
                  </div>
                  <div className="flex justify-between items-center bg-[#0F172A] p-4 rounded-xl text-white mt-4 shadow-xl print:bg-white print:text-black print:border-t-2 print:border-slate-900 print:rounded-none print:px-0">
                     <span className="text-[11px] font-black uppercase tracking-wider">Grand Total</span>
                     <span className="text-[20px] font-black">{formatRupee(grandTotal)}</span>
                  </div>
               </div>
            </div>
         </div>
      </div>
      
      <p className="text-center no-print text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-10">
         Anand Arts | Professional Billing Suite v2.0
      </p>
    </div>
  );
}
