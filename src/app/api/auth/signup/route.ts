import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/store";

const sessionCookie = "commerce_session";
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    name?: string;
    email?: string;
    storeName?: string;
    password?: string;
  };

  const name = body.name?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const storeName = body.storeName?.trim() ?? "";
  const password = body.password ?? "";

  if (!name || !email || !storeName || !password) {
    return NextResponse.json(
      { message: "All sign-up fields are required." },
      { status: 400 },
    );
  }

  if (!emailPattern.test(email)) {
    return NextResponse.json(
      { message: "Enter a valid work email address." },
      { status: 400 },
    );
  }

  if (password.length < 8) {
    return NextResponse.json(
      { message: "Password must be at least 8 characters long." },
      { status: 400 },
    );
  }

  const result = db.createUser({ name, email, storeName, password });

  if ("error" in result) {
    const existingUser = db.authenticateUser(email, password);

    if (!existingUser) {
      return NextResponse.json({ message: result.error }, { status: 409 });
    }

    const response = NextResponse.json({
      user: existingUser,
      message: "Existing account found. Signed in successfully.",
    });
    response.cookies.set(sessionCookie, existingUser.id, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    return response;
  }

  const response = NextResponse.json({ user: result.user }, { status: 201 });
  response.cookies.set(sessionCookie, result.user.id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return response;
}
