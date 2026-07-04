import { redirect } from "next/navigation";
import { getAccounts } from "@/lib/db";

// Always live: account list and trading data change daily and are behind auth.
export const dynamic = "force-dynamic";

export default async function RootPage() {
  const accounts = await getAccounts();
  const first = accounts.find((a) => a.is_base) ?? accounts[0];
  if (!first) {
    return <main style={{ padding: 40 }}>No accounts found yet -- run the migration script first.</main>;
  }
  redirect(`/${first.userid}/momentum`);
}
