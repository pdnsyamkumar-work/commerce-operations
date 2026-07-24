import { NextResponse } from "next/server";
import { db } from "@/lib/store";

export async function GET() {
  return NextResponse.json({ products: db.listProducts() });
}

export async function POST(request: Request) {
  const body = await request.json();
  const requiredFields = [
    "productCode",
    "name",
    "category",
    "price",
    "stock",
    "status",
  ] as const;
  const missingField = requiredFields.find(
    (field) => body[field] === undefined || body[field] === "",
  );

  if (missingField) {
    return NextResponse.json(
      { message: `Missing required field: ${missingField}` },
      { status: 400 },
    );
  }

  const product = db.createProduct({
    id: String(body.productCode),
    productCode: String(body.productCode),
    name: String(body.name),
    category: String(body.category),
    price: Number(body.price),
    stock: Number(body.stock),
    status: body.status === "Draft" ? "Draft" : "Active",
    images: Array.isArray(body.images) ? body.images.map(String) : [],
  });

  if ("error" in product) {
    return NextResponse.json({ message: product.error }, { status: 409 });
  }

  return NextResponse.json({ product }, { status: 201 });
}
