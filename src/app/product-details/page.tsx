import type { Metadata } from "next";
import { CommerceWorkspace } from "@/components/commerce-workspace";

export const metadata: Metadata = {
  title: "Product Details | Commerce Operations",
  description: "Inspect pricing, stock, status, and product actions.",
};

export default function ProductDetailsRoutePage() {
  return <CommerceWorkspace initialView="Product Details" />;
}
