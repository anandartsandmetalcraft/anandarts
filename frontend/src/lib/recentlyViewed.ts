const STORAGE_KEY = "anand-arts-recently-viewed-v1";
const MAX_IDS = 12;

function safeParseIds(value: string | null): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((v) => String(v)).filter(Boolean);
  } catch {
    return [];
  }
}

export function getRecentlyViewedIds(): string[] {
  if (typeof window === "undefined") return [];
  return safeParseIds(window.localStorage.getItem(STORAGE_KEY)).slice(0, MAX_IDS);
}

export function pushRecentlyViewedId(id: string | number): void {
  if (typeof window === "undefined") return;

  const nextId = String(id);
  const current = getRecentlyViewedIds();
  const next = [nextId, ...current.filter((x) => x !== nextId)].slice(0, MAX_IDS);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

