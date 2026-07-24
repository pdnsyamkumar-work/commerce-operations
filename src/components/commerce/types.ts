import type { Product } from "@/lib/store";

export type CommerceNavItem =
  | "Dashboard"
  | "Products"
  | "Inventory"
  | "Cart"
  | "Reports"
  | "Support"
  | "Profile"
  | "Product Details";
export type TaskLane = "todo" | "done";

export type ProductDraft = {
  productCode: string;
  name: string;
  category: string;
  price: string;
  stock: string;
  status: Product["status"];
  images: string[];
};

export type ProductFormErrors = Partial<Record<keyof ProductDraft, string>>;
