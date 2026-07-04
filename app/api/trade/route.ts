import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { placeTrade } from "@/lib/tradeApi";

// The only endpoint allowed to reach the trade service -- runs server-side on
// Vercel, attaches the signed-in user's email as requested_by for the audit
// trail in trade_orders, and never exposes TRADE_API_SECRET to the browser.
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const demoMode = !process.env.GOOGLE_CLIENT_ID;
  if (!session?.user?.email && !demoMode) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await req.json();
  try {
    const result = await placeTrade({ ...body, requested_by: session?.user?.email ?? "demo-user@local" });
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 502 });
  }
}
