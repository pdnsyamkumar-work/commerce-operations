import type { Metadata } from "next";
import { CommerceWorkspace } from "@/components/commerce-workspace";

export const metadata: Metadata = {
  title: "Support | Commerce Operations",
  description: "Customer service escalation and support ticket submission.",
};

export default function SupportRoutePage() {
  return <CommerceWorkspace initialView="Support" />;
}
