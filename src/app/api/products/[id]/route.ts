import { NextResponse } from "next/server";
import { db } from "@/lib/store";

type Context = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, context: Context) {
  const { id } = await context.params;
  const product = db.getProduct(id);

  if (!product) {
    return NextResponse.json(
      { message: "Product not found." },
      { status: 404 },
    );
  }

  return NextResponse.json({ product });
}

export async function PUT(request: Request, context: Context) {
  const { id } = await context.params;
  const body = await request.json();
  const product = db.updateProduct(id, {
    ...(body.name !== undefined ? { name: String(body.name) } : {}),
    ...(body.category !== undefined ? { category: String(body.category) } : {}),
    ...(body.price !== undefined ? { price: Number(body.price) } : {}),
    ...(body.stock !== undefined ? { stock: Number(body.stock) } : {}),
    ...(body.status !== undefined
      ? { status: body.status === "Draft" ? "Draft" : "Active" }
      : {}),
    ...(body.images !== undefined && Array.isArray(body.images)
      ? { images: body.images.map(String) }
      : {}),
  });

  if (!product) {
    return NextResponse.json(
      { message: "Product not found." },
      { status: 404 },
    );
  }

  return NextResponse.json({ product });
}

export async function DELETE(_: Request, context: Context) {
  const { id } = await context.params;
  const deleted = db.deleteProduct(id);

  if (!deleted) {
    return NextResponse.json(
      { message: "Product not found." },
      { status: 404 },
    );
  }

  return NextResponse.json({ success: true });
}
