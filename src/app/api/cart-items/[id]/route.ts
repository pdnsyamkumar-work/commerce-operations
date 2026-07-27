import { NextResponse } from "next/server";
import { db } from "@/lib/store";

type Context = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, context: Context) {
  const { id } = await context.params;
  const body = await request.json();
  const quantity = Number(body.quantity);

  if (!quantity || quantity < 1) {
    return NextResponse.json(
      { message: "Quantity must be greater than zero." },
      { status: 400 },
    );
  }

  const item = db.updateCartItem(id, quantity);
  if (!item) {
    return NextResponse.json(
      { message: "Cart item not found." },
      { status: 404 },
    );
  }

  return NextResponse.json({ item });
}

export async function DELETE(_: Request, context: Context) {
  const { id } = await context.params;
  const deleted = db.deleteCartItem(id);

  if (!deleted) {
    return NextResponse.json(
      { message: "Cart item not found." },
      { status: 404 },
    );
  }

  return NextResponse.json({ success: true });
}
