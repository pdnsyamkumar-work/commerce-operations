import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@/lib/store";

export async function GET() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("commerce_session")?.value;
  const user = userId ? db.getUser(userId) : null;

  return NextResponse.json({ user });
}
