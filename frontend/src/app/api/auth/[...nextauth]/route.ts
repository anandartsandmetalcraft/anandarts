import { handlers } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  console.log("[Auth] GET request to:", req.url);
  try {
    const res = await handlers.GET(req);
    return res;
  } catch (error) {
    console.error("[Auth] GET error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  console.log("[Auth] POST request to:", req.url);
  try {
    const res = await handlers.POST(req);
    return res;
  } catch (error) {
    console.error("[Auth] POST error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
