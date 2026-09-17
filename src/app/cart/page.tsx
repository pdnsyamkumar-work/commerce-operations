import type { Metadata } from "next";
import { CommerceWorkspace } from "@/components/commerce-workspace";

export const metadata: Metadata = {
  title: "Cart | Commerce Operations",
  description: "Validate cart contents and quantity changes.",
};

export default function CartRoutePage() {
  return <CommerceWorkspace initialView="Cart" />;
}
