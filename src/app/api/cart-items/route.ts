import { NextResponse } from "next/server";
import { db } from "@/lib/store";

export async function GET() {
  return NextResponse.json({ items: db.listCartItems() });
}

export async function POST(request: Request) {
  const body = await request.json();

  if (!body.productId || !body.quantity) {
    return NextResponse.json(
      { message: "productId and quantity are required." },
      { status: 400 },
    );
  }

  const result = db.createCartItem({
    productId: String(body.productId),
    quantity: Number(body.quantity),
  });

  if ("error" in result) {
    return NextResponse.json({ message: result.error }, { status: 404 });
  }

  return NextResponse.json({ item: result.item }, { status: 201 });
}
