import React from "react";

export default function AdminAccountPage() {
  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-6 lg:flex-row justify-between items-start lg:items-end">
        <div>
          <h2 className="font-display text-4xl text-[var(--color-brand-char)]">Account Settings</h2>
          <p className="font-ui text-sm text-[#8B8375] mt-3 max-w-2xl">
            Manage your admin profile, email, and security settings in one place.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-[40px] p-8 shadow-sm border border-black/5 max-w-3xl">
        <div className="space-y-6">
          <div>
            <label className="font-ui text-[10px] uppercase tracking-widest text-[#8B8375]">Name</label>
            <input className="w-full mt-3 bg-[#FDF5E6]/50 border-none px-6 py-4 rounded-2xl font-ui text-sm outline-none" placeholder="Admin Name" defaultValue="Admin User" />
          </div>
          <div>
            <label className="font-ui text-[10px] uppercase tracking-widest text-[#8B8375]">Email</label>
            <input className="w-full mt-3 bg-[#FDF5E6]/50 border-none px-6 py-4 rounded-2xl font-ui text-sm outline-none" placeholder="admin@example.com" defaultValue="admin@example.com" />
          </div>
          <div>
            <label className="font-ui text-[10px] uppercase tracking-widest text-[#8B8375]">Phone</label>
            <input className="w-full mt-3 bg-[#FDF5E6]/50 border-none px-6 py-4 rounded-2xl font-ui text-sm outline-none" placeholder="+91 98765 43210" defaultValue="+91 98765 43210" />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <button className="w-full sm:w-auto rounded-full bg-[var(--color-brand-char)] px-8 py-4 text-white font-ui text-[11px] font-semibold uppercase tracking-widest hover:bg-black transition-all">
              Save changes
            </button>
            <p className="font-ui text-xs text-[#8B8375]">Changes are saved locally for now. Implement server-side update logic when ready.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

