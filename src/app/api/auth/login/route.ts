import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/store";

const sessionCookie = "commerce_session";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { email?: string; password?: string };
  const user = db.authenticateUser(body.email ?? "", body.password ?? "");

  if (!user) {
    return NextResponse.json(
      { message: "Invalid email or password." },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ user });
  response.cookies.set(sessionCookie, user.id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return response;
}
