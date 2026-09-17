import type { Metadata } from "next";
import { CommerceWorkspace } from "@/components/commerce-workspace";

export const metadata: Metadata = {
  title: "Reports | Commerce Operations",
  description: "Operational reviews, compliance metrics, and status tracking.",
};

export default function ReportsRoutePage() {
  return <CommerceWorkspace initialView="Reports" />;
}
