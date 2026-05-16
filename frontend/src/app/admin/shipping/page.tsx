import React from "react";
import { Truck, Package, Clock, MapPin } from "lucide-react";

export default function AdminShippingPage() {
  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-6 lg:flex-row justify-between items-start lg:items-end">
        <div>
          <h2 className="font-display text-4xl text-[var(--color-brand-char)]">Shipping</h2>
          <p className="font-ui text-sm text-[#8B8375] mt-3 max-w-2xl">
            Track delivery performance, manage carriers, and keep shipping moving smoothly.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {[
          { title: "Pending", value: "12", icon: Clock, color: "bg-blue-50 text-blue-700" },
          { title: "In Transit", value: "34", icon: Truck, color: "bg-green-50 text-green-700" },
          { title: "Delivered", value: "128", icon: MapPin, color: "bg-purple-50 text-purple-700" },
          { title: "Carriers", value: "5", icon: Package, color: "bg-orange-50 text-orange-700" },
        ].map((card) => (
          <div key={card.title} className="rounded-[32px] bg-white p-8 shadow-sm border border-black/5 flex items-start gap-4">
            <div className={`p-3 rounded-3xl ${card.color}`}>
              <card.icon size={24} />
            </div>
            <div>
              <p className="font-ui text-[10px] uppercase tracking-widest text-[#8B8375]">{card.title}</p>
              <p className="font-display text-3xl text-[var(--color-brand-char)] mt-3">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[40px] p-8 shadow-sm border border-black/5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h3 className="font-display text-2xl text-[var(--color-brand-char)]">Carrier Performance</h3>
            <p className="font-ui text-sm text-[#8B8375] mt-2">Review the latest shipping providers and delivery reliability.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: "DHL", status: "Reliable", rate: "98%" },
            { name: "ShipRocket", status: "Good", rate: "92%" },
            { name: "Blue Dart", status: "Pending", rate: "88%" },
          ].map((carrier) => (
            <div key={carrier.name} className="rounded-[24px] border border-black/5 p-6">
              <p className="font-display text-lg text-[var(--color-brand-char)]">{carrier.name}</p>
              <p className="font-ui text-sm text-[#8B8375] mt-2">{carrier.status}</p>
              <p className="font-display text-3xl text-[var(--color-brand-char)] mt-4">{carrier.rate}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

