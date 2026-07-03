"use client";
import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { X, Smartphone, Mail, ShieldCheck, Truck, Star } from "lucide-react";
import { signIn } from "next-auth/react";
import { useAuthStore } from "@/store/authStore";
import { requestOTP, verifyOTPAndLogin } from "@/actions/authPhone";
import { toast } from "sonner";
 
interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}
 
export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const router = useRouter();
  const login = useAuthStore(state => state.login);
  const [entryMode, setEntryMode] = useState<"phone" | "email">("phone");
  
const [step, setStep] = useState<'phone' | 'phone-check' | 'otp' | 'detailed-signup' | 'success'>('phone');
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]); // Standard 6-digit OTP
  const [isLoading, setIsLoading] = useState(false);
  const [phoneExists, setPhoneExists] = useState(false);
  const [otpAttempts, setOtpAttempts] = useState(0);
  const [lastOtpRequest, setLastOtpRequest] = useState<number>(0);
  
  const [signupData, setSignupData] = useState({ 
    firstName: "", 
    lastName: "",
    email: "", 
    houseNo: "", 
    street: "",
    locality: "",
    city: "", 
    state: "",
    postalCode: "", 
    country: "India",
    phone: ""
  });

  // Rate limiting: 1 OTP request per 30 seconds
  const RateLimit = {
    OTP_COOLDOWN: 30000, // 30 seconds
    MAX_ATTEMPTS: 5
  };

  // Mock function to check if phone exists in DB (logic only)
  const checkPhoneExists = async (phoneNum: string): Promise<boolean> => {
    // This would be replaced with actual DB query
    // For now, return false to allow registration
    // When DB is connected, add API call here:
    // const result = await fetch('/api/auth/check-phone', { method: 'POST', body: JSON.stringify({ phone: phoneNum }) });
    // return result.json().exists;
    
    console.log(`[DB Query] Checking if phone ${phoneNum} exists...`);
    return false; // Placeholder - no DB connected yet
  };
  
  const handlePhoneCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    }
    
    setIsLoading(true);
    const exists = await checkPhoneExists(phone);
    setIsLoading(false);
    
    if (exists) {
      setPhoneExists(true);
      toast.error("This phone number is already registered. Please sign in.");
      return;
    }
    
    setPhoneExists(false);
    setStep('phone-check');
  };

  const handleContinueToSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Rate limiting check
    const now = Date.now();
    if (now - lastOtpRequest < RateLimit.OTP_COOLDOWN) {
      toast.error(`Please wait before requesting another OTP.`);
      return;
    }

    if (otpAttempts >= RateLimit.MAX_ATTEMPTS) {
      toast.error("Too many OTP requests. Please try again later.");
      return;
    }
    
    setIsLoading(true);
    const result = await requestOTP(phone);
    setIsLoading(false);
 
    if (result.success) {
      setLastOtpRequest(now);
      setOtpAttempts(otpAttempts + 1);
      setStep('otp');
      toast.success(result.success);
    } else {
      toast.error(result.error);
    }
  };
 
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) {
      toast.error("OTP must be 6 digits.");
      return;
    }
 
    setIsLoading(true);
    const result = (await verifyOTPAndLogin(phone, code)) as any;
    setIsLoading(false);
 
    if (result.success) {
       if (result.isNewUser) {
          setSignupData(prev => ({ ...prev, phone }));
          setStep('detailed-signup');
       } else {
          // Existing user
          if (result.user) {
            login(result.user);
          }
          router.refresh();
          setStep('success');
       }
    } else {
       toast.error(result.error || "OTP is incorrect.");
    }
  };
 
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!signupData.firstName || !signupData.lastName || !signupData.email) {
      toast.error("Please fill in all required fields.");
      return;
    }
    
    if (!signupData.houseNo || !signupData.street || !signupData.locality || !signupData.city || !signupData.postalCode) {
      toast.error("Please provide complete shipping address.");
      return;
    }
    
    setIsLoading(true);
    // In production, call updateProfile action here to save to DB
    // For now, simulate the state update
    login({ ...signupData, phone });
    setIsLoading(false);
    setStep('success');
  };

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter your email and password.");
      return;
    }

    setIsLoading(true);
    await signIn("admin-credentials", {
      email,
      password,
      redirect: true,
      redirectTo: "/admin",
    });
    setIsLoading(false);
  };
 
  if (!isOpen) return null;
 
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />
 
        {/* Modal Content */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-4xl max-h-[95vh] bg-[#11100D] rounded-[32px] overflow-hidden flex flex-col md:flex-row shadow-[0_40px_100px_rgba(0,0,0,0.8)] border border-white/5"
        >
          {/* Left Side: Brand & Perks */}
          <div className="w-full md:w-[45%] bg-[#1A1208] p-6 md:p-10 flex flex-col items-center justify-center text-center relative overflow-hidden shrink-0">
             {/* Decorative glow */}
             <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(184,134,11,0.1)_0%,_transparent_100%)] opacity-50" />
             
             <div className="relative z-10 space-y-8 md:space-y-12 py-4">
                <div className="flex flex-col items-center gap-4 md:gap-6">
                   <Image
                      src="/Logo3.png"
                      alt="Anand Arts Logo"
                      width={60}
                      height={60}
                      className="rounded-lg md:w-[80px] md:h-[80px]"
                      priority
                   />
                   <p className="font-ui text-xs md:text-sm text-[var(--color-brand-cream)]/60 leading-relaxed text-center hidden md:block">
                      Login to unlock exciting offers on handcrafted temple idols and metal art.
                   </p>
                </div>
 
                <div className="hidden md:grid gap-6">
                   {[
                      { i: Truck, t: "Fast Shipping", d: "Secure delivery to your address" },
                      { i: ShieldCheck, t: "Quality Guaranteed", d: "Authentic handcrafted products" },
                      { i: Star, t: "Customer Support", d: "Help whenever you need it" }
                   ].map((item, id) => (
                      <div key={id} className="flex items-center gap-4 text-left p-4 rounded-2xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-all">
                         <div className="w-10 h-10 rounded-full bg-[var(--color-brand-gold)]/20 flex items-center justify-center text-[var(--color-brand-gold)]">
                            <item.i size={20} />
                         </div>
                         <div>
                            <h4 className="font-ui text-[11px] font-bold uppercase tracking-widest text-white">{item.t}</h4>
                            <p className="font-ui text-[10px] text-white/50">{item.d}</p>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          </div>
 
          {/* Right Side: Form Area */}
          <div className="flex-1 bg-white p-6 md:p-12 flex flex-col items-center justify-center relative overflow-y-auto">
             <button onClick={onClose} className="absolute top-8 right-8 p-2 hover:bg-black/5 rounded-full transition-colors text-black/40 z-30">
                <X size={24} />
             </button>
 
             <div className="w-full max-w-sm">
                <AnimatePresence mode="wait">
                   {step === 'phone' && (
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                         <h3 className="font-display text-3xl text-black mb-2 text-center md:text-left">Sign In or Create Account</h3>
                         <p className="font-ui text-[11px] font-bold uppercase tracking-widest text-[#8B8375] mb-10 text-center md:text-left">Sign in with your phone number to unlock offers</p>

                         <div className="flex gap-2 mb-8 rounded-full bg-[#F7F1E7] p-1">
                           <button
                             type="button"
                             onClick={() => setEntryMode("phone")}
                             className={`flex-1 rounded-full px-4 py-3 font-ui text-[11px] font-bold uppercase tracking-widest transition-all ${entryMode === "phone" ? "bg-black text-white" : "text-[#8B8375]"}`}
                           >
                             Phone OTP
                           </button>
                         </div>

                         {entryMode === "phone" ? (
                           <form onSubmit={handlePhoneCheck} className="space-y-8">
                              <div className="relative border-b-2 border-black/10 focus-within:border-[var(--color-brand-red)] transition-colors py-3 flex items-center gap-4">
                                 <span className="font-display text-xl text-black/40">+91</span>
                                 <input 
                                    type="tel" 
                                    required 
                                    maxLength={10}
                                    placeholder="Enter Mobile Number" 
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full bg-transparent outline-none font-display text-2xl text-black placeholder:text-black/10 tracking-[0.1em]" 
                                 />
                              </div>
                              <button 
                                disabled={isLoading}
                                className="w-full bg-black text-white font-ui text-[13px] font-bold uppercase tracking-[0.2em] py-5 rounded-full hover:bg-[var(--color-brand-red)] transition-all shadow-xl disabled:opacity-50"
                              >
                                 {isLoading ? 'Checking...' : 'Check Number'}
                              </button>
                           </form>
                         ) : null}
                      </motion.div>
                   )}

                   {step === 'phone-check' && (
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                         <h3 className="font-display text-3xl text-black mb-2">Create Your Account</h3>
                         <p className="font-ui text-[11px] font-bold uppercase tracking-widest text-[#8B8375] mb-10">Phone: +91 {phone}</p>
                         
                         <form onSubmit={handleContinueToSignup} className="space-y-6">
                            <p className="font-ui text-sm text-[#8B8375] text-center mb-6">We'll send you an OTP to verify your number and collect your details.</p>
                            
                            <button 
                              disabled={isLoading}
                              className="w-full bg-[var(--color-brand-red)] text-white font-ui text-[13px] font-bold uppercase tracking-[0.2em] py-5 rounded-full hover:bg-black transition-all shadow-xl disabled:opacity-50"
                            >
                               {isLoading ? 'Sending OTP...' : 'Send OTP & Proceed'}
                            </button>
                            
                            <button 
                              type="button"
                              onClick={() => { setPhone(""); setStep('phone'); }}
                              className="w-full text-[#8B8375] font-ui text-xs font-bold uppercase tracking-widest py-3 rounded-full hover:bg-black/5 transition-all"
                            >
                               Change Number
                            </button>
                         </form>
                      </motion.div>
                   )}
 
                   {step === 'otp' && (
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                         <h3 className="font-display text-3xl text-black mb-2">Verify Your Number</h3>
                         <p className="font-ui text-sm text-[#8B8375] mb-10">Enter the OTP sent to <span className="font-bold text-black">+91 {phone}</span></p>
                         
                         <form onSubmit={handleOtpSubmit} className="space-y-8">
                            <div className="flex gap-2 justify-between">
                               {otp.map((digit, id) => (
                                  <input 
                                     key={id} 
                                     type="text" 
                                     maxLength={1} 
                                     value={digit}
                                     id={`otp-${id}`}
                                     onChange={(e) => {
                                        const val = e.target.value;
                                        if (isNaN(Number(val)) && val !== "") return;
                                        
                                        const newOtp = [...otp];
                                        newOtp[id] = val;
                                        setOtp(newOtp);
                                        
                                        if (val && id < 5) {
                                           document.getElementById(`otp-${id + 1}`)?.focus();
                                        }
                                     }}
                                     onKeyDown={(e) => {
                                        if (e.key === "Backspace" && !otp[id] && id > 0) {
                                           document.getElementById(`otp-${id - 1}`)?.focus();
                                        }
                                     }}
                                     className="w-12 h-16 text-center font-display text-3xl border-b-2 border-black/10 focus:border-[var(--color-brand-red)] outline-none transition-all bg-transparent"
                                  />
                               ))}
                            </div>
                            <button 
                              disabled={isLoading}
                              className="w-full bg-black text-white font-ui text-[13px] font-bold uppercase tracking-[0.2em] py-5 rounded-full hover:bg-[var(--color-brand-red)] transition-all disabled:opacity-50"
                            >
                               {isLoading ? 'Verifying...' : 'Verify OTP'}
                            </button>
                            <p className="text-center">
                              <button 
                                type="button"
                                onClick={async () => {
                                  setIsLoading(true);
                                  const result = await requestOTP(phone);
                                  setIsLoading(false);
                                  if (result.success) {
                                    toast.success("OTP resent");
                                  } else {
                                    toast.error(result.error);
                                  }
                                }}
                                className="font-ui text-[10px] uppercase font-bold tracking-widest text-[var(--color-brand-red)] hover:underline"
                              >
                                Resend OTP
                              </button>
                            </p>
                         </form>
                      </motion.div>
                   )}
 
                   {step === 'detailed-signup' && (
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                         <h3 className="font-display text-2xl text-black mb-4">Complete Your Profile</h3>
                         <p className="font-ui text-xs text-[#8B8375] mb-6">Provide your details and shipping address.</p>
                         
                         <form onSubmit={handleSignupSubmit} className="space-y-4 max-h-[55vh] overflow-y-auto pr-4">
                             {/* Personal Info */}
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2"><label className="font-ui text-[9px] font-bold uppercase tracking-widest text-[#8B8375] ml-2">First Name</label><input required type="text" value={signupData.firstName} onChange={(e) => setSignupData({...signupData, firstName: e.target.value})} className="w-full bg-[#FAF9F6] border border-black/5 px-5 py-3 rounded-xl outline-none font-ui text-sm" /></div>
                                <div className="space-y-2"><label className="font-ui text-[9px] font-bold uppercase tracking-widest text-[#8B8375] ml-2">Last Name</label><input required type="text" value={signupData.lastName} onChange={(e) => setSignupData({...signupData, lastName: e.target.value})} className="w-full bg-[#FAF9F6] border border-black/5 px-5 py-3 rounded-xl outline-none font-ui text-sm" /></div>
                             </div>
 
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2"><label className="font-ui text-[9px] font-bold uppercase tracking-widest text-[#8B8375] ml-2">Mobile Number</label><input readOnly value={`+91 ${signupData.phone}`} className="w-full bg-[#FAF9F6]/50 border border-black/5 px-5 py-3 rounded-xl outline-none font-ui text-sm text-[#8B8375] cursor-not-allowed" /></div>
                                <div className="space-y-2"><label className="font-ui text-[9px] font-bold uppercase tracking-widest text-[#8B8375] ml-2">Email Address</label><input required type="email" value={signupData.email} onChange={(e) => setSignupData({...signupData, email: e.target.value})} className="w-full bg-[#FAF9F6] border border-black/5 px-5 py-3 rounded-xl outline-none font-ui text-sm" /></div>
                             </div>
 
                             {/* Shipping Address */}
                             <div className="border-t border-black/5 pt-6 mt-6">
                               <h4 className="font-ui text-[9px] uppercase font-bold tracking-widest text-[#8B8375] mb-4 ml-2">Shipping Details</h4>
                               
                               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                  <div className="space-y-2"><label className="font-ui text-[9px] font-bold uppercase tracking-widest text-[#8B8375] ml-2">House No.</label><input required type="text" value={signupData.houseNo} onChange={(e) => setSignupData({...signupData, houseNo: e.target.value})} className="w-full bg-[#FAF9F6] border border-black/5 px-5 py-3 rounded-xl outline-none font-ui text-sm" /></div>
                                  <div className="space-y-2"><label className="font-ui text-[9px] font-bold uppercase tracking-widest text-[#8B8375] ml-2">Street</label><input required type="text" value={signupData.street} onChange={(e) => setSignupData({...signupData, street: e.target.value})} className="w-full bg-[#FAF9F6] border border-black/5 px-5 py-3 rounded-xl outline-none font-ui text-sm" /></div>
                               </div>
 
                               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                  <div className="space-y-2"><label className="font-ui text-[9px] font-bold uppercase tracking-widest text-[#8B8375] ml-2">Locality</label><input required type="text" value={signupData.locality} onChange={(e) => setSignupData({...signupData, locality: e.target.value})} className="w-full bg-[#FAF9F6] border border-black/5 px-5 py-3 rounded-xl outline-none font-ui text-sm" /></div>
                                  <div className="space-y-2"><label className="font-ui text-[9px] font-bold uppercase tracking-widest text-[#8B8375] ml-2">Landmark</label><input type="text" value={(signupData as any).landmark || ""} onChange={(e) => setSignupData({...signupData, landmark: e.target.value} as any)} className="w-full bg-[#FAF9F6] border border-black/5 px-5 py-3 rounded-xl outline-none font-ui text-sm" /></div>
                               </div>
 
                               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                                  <div className="space-y-2"><label className="font-ui text-[9px] font-bold uppercase tracking-widest text-[#8B8375] ml-2">City</label><input required type="text" value={signupData.city} onChange={(e) => setSignupData({...signupData, city: e.target.value})} className="w-full bg-[#FAF9F6] border border-black/5 px-5 py-3 rounded-xl outline-none font-ui text-sm" /></div>
                                  <div className="space-y-2"><label className="font-ui text-[9px] font-bold uppercase tracking-widest text-[#8B8375] ml-2">State</label><input required type="text" value={signupData.state} onChange={(e) => setSignupData({...signupData, state: e.target.value})} className="w-full bg-[#FAF9F6] border border-black/5 px-5 py-3 rounded-xl outline-none font-ui text-sm" /></div>
                                  <div className="space-y-2"><label className="font-ui text-[9px] font-bold uppercase tracking-widest text-[#8B8375] ml-2">ZIP</label><input required type="text" value={signupData.postalCode} onChange={(e) => setSignupData({...signupData, postalCode: e.target.value})} className="w-full bg-[#FAF9F6] border border-black/5 px-5 py-3 rounded-xl outline-none font-ui text-sm" /></div>
                               </div>
 
                               <div className="space-y-2 mb-2">
                                  <label className="font-ui text-[9px] font-bold uppercase tracking-widest text-[#8B8375] ml-2">Country</label>
                                  <div className="relative">
                                     <select value={signupData.country} onChange={(e) => setSignupData({...signupData, country: e.target.value})} className="w-full bg-[#FAF9F6] border border-black/5 px-5 py-3 rounded-xl outline-none appearance-none cursor-pointer font-ui text-sm">
                                        <option value="India">India 🇮🇳</option>
                                        <option value="USA">United States 🇺🇸</option>
                                        <option value="UK">United Kingdom 🇬🇧</option>
                                        <option value="UAE">United Arab Emirates 🇦🇪</option>
                                        <option value="Japan">Japan 🇯🇵</option>
                                        <option value="France">France 🇫🇷</option>
                                        <option value="Australia">Australia 🇦🇺</option>
                                        <option value="Canada">Canada 🇨🇦</option>
                                        <option value="Singapore">Singapore 🇸🇬</option>
                                        <option value="Germany">Germany 🇩🇪</option>
                                        <option value="Other">Other Country</option>
                                     </select>
                                     <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-black/40">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                                     </div>
                                  </div>
                               </div>
                             </div>

                            <div className="flex gap-3 pt-6 mt-6 border-t border-black/10">
                               <button 
                                 disabled={isLoading}
                                 type="submit" 
                                 className="flex-1 bg-[var(--color-brand-red)] text-white font-ui text-xs font-bold uppercase tracking-widest py-3 rounded-full hover:bg-black transition-all disabled:opacity-50"
                               >
                                  {isLoading ? 'Creating...' : 'Complete Signup'}
                               </button>
                               <button 
                                 disabled={isLoading}
                                 type="button" 
                                 onClick={() => { setOtp(["", "", "", "", "", ""]); setStep('otp'); }}
                                 className="flex-1 text-[#8B8375] font-ui text-xs font-bold uppercase tracking-widest py-3 rounded-full hover:bg-black/5 transition-all disabled:opacity-50"
                               >
                                  Back
                               </button>
                            </div>
                         </form>
                      </motion.div>
                   )}
 
                   {step === 'success' && (
                      <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
                         <div className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-8 text-green-600">
                            <ShieldCheck size={48} strokeWidth={1} />
                         </div>
                         <h3 className="font-display text-3xl text-black mb-4 uppercase tracking-widest">Success!</h3>
                         <p className="font-ui text-base text-[#8B8375] leading-relaxed mb-10">
                            You are now signed in to Anand Arts. <br/> Redirecting to your account...
                         </p>
                         <button 
                            onClick={() => { onClose(); router.refresh(); }}
                            className="bg-black text-white font-ui text-xs font-bold uppercase tracking-widest px-12 py-5 rounded-full hover:bg-[var(--color-brand-gold)] transition-all"
                         >
                            Go to Account
                         </button>
                      </motion.div>
                   )}
                </AnimatePresence>
             </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
