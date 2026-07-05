import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { addFunds } from "@/lib/tradeApi";

// Mirrors app/api/trade/route.ts -- the only endpoint allowed to reach the
// trade service's /add-funds, runs server-side on Vercel, attaches the
// signed-in user's email as requested_by, never exposes TRADE_API_SECRET to
// the browser.
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await req.json();
  try {
    const result = await addFunds({ ...body, requested_by: session.user.email });
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 502 });
  }
}
