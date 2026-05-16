"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { ArrowRight, Lock, ShieldCheck, Mail } from "lucide-react";
import { toast } from "sonner";

export default function AdminLoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "ADMIN") {
      router.replace("/admin");
    }
  }, [router, session?.user?.role, status]);

  const reason = searchParams.get("reason");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter your admin email and password.");
      return;
    }

    setIsSubmitting(true);
    const result = await signIn("admin-credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/admin",
    });
    setIsSubmitting(false);

    if (result?.error) {
      toast.error("Invalid admin credentials or insufficient access.");
      return;
    }

    toast.success("Welcome back.");
    router.replace("/admin");
    router.refresh();
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.18),transparent_35%),linear-gradient(180deg,#FBFAF5_0%,#F6F1E8_100%)] px-6 py-12">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-6xl items-center">
        <div className="grid w-full gap-8 overflow-hidden rounded-[36px] border border-[#0F172A]/10 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.12)] lg:grid-cols-[1.1fr_0.9fr]">
          <section className="relative flex flex-col justify-between overflow-hidden bg-[#0F172A] px-8 py-10 text-white md:px-12 md:py-14">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.08),transparent_30%)]" />
            <div className="relative z-10">
              <div className="flex items-center gap-4">
                <div className="relative h-14 w-14 overflow-hidden rounded-2xl bg-white/5 p-2 ring-1 ring-white/10">
                  <Image src="/Logo3.png" alt="Anand Arts" fill className="object-contain p-1" priority />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#D4AF37]">Admin Portal</p>
                  <h1 className="mt-2 font-display text-3xl font-bold">Anand Arts</h1>
                </div>
              </div>

              <div className="mt-16 max-w-md space-y-5">
                <p className="font-display text-4xl leading-tight md:text-5xl">
                  Secure access for authorized staff only.
                </p>
                <p className="text-sm leading-relaxed text-slate-300">
                  Use the registered admin email and password to manage products, orders, invoices, and shipping.
                </p>
              </div>
            </div>
          </section>

          <section className="flex items-center px-8 py-10 md:px-12 md:py-14">
            <div className="w-full max-w-md">
              <div className="mb-10">
                <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#D4AF37]">Sign In</p>
                <h2 className="mt-3 font-display text-3xl font-bold text-[#0F172A]">Admin Login</h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-500">
                  Enter the admin email and password stored in the database.
                </p>
              </div>

              {reason === "forbidden" && (
                <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-bold uppercase tracking-widest text-amber-900">
                  This account does not have admin access.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <label className="block">
                  <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">Email</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 font-ui text-sm outline-none transition-all placeholder:text-slate-300 focus:border-[#D4AF37] focus:bg-white"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">Password</span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 font-ui text-sm outline-none transition-all placeholder:text-slate-300 focus:border-[#D4AF37] focus:bg-white"
                  />
                </label>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-[#0F172A] px-6 py-4 font-ui text-[11px] font-bold uppercase tracking-[0.25em] text-white transition-all hover:bg-[#111827] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Signing in..." : "Enter Admin Panel"}
                  <ArrowRight size={16} />
                </button>
              </form>

              <p className="mt-8 text-center text-xs text-slate-400">
                Not an admin? <Link href="/collections" className="font-bold text-[#D4AF37] hover:underline">Back to store</Link>
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
