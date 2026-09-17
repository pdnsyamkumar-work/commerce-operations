import type { Metadata } from "next";
import { CommerceWorkspace } from "@/components/commerce-workspace";

export const metadata: Metadata = {
  title: "Products | Commerce Operations",
  description: "Manage product catalog, inventory records, and actions.",
};

export default function ProductsRoutePage() {
  return <CommerceWorkspace initialView="Products" />;
}
