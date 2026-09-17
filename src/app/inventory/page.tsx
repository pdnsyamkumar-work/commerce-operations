import type { Metadata } from "next";
import { CommerceWorkspace } from "@/components/commerce-workspace";

export const metadata: Metadata = {
  title: "Inventory | Commerce Operations",
  description:
    "Monitor stock levels, low-stock warnings, and warehouse imports.",
};

export default function InventoryRoutePage() {
  return <CommerceWorkspace initialView="Inventory" />;
}
