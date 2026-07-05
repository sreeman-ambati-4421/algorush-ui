import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { updateSchedule } from "@/lib/tradeApi";

// Mirrors app/api/trade/route.ts -- server-side only, never exposes
// TRADE_API_SECRET to the browser. The initial schedule/runs read happens
// server-side in the schedule page itself; this route only handles saving.
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await req.json();
  try {
    const result = await updateSchedule(body);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 502 });
  }
}
