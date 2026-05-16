"use client";

import { ExpandingSearchDock } from "@/components/ui/expanding-search-dock-shadcnui";

export default function DemoPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-8">
      <div className="flex flex-col items-center gap-8">
        <h1 className="text-3xl font-display text-[var(--color-brand-char)]">Search Component Demo</h1>
        <ExpandingSearchDock onSearch={(q) => alert(`Searching for: ${q}`)} />
      </div>
    </div>
  );
}
