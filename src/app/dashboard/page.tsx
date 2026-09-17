import type { Metadata } from "next";
import { CommerceWorkspace } from "@/components/commerce-workspace";

export const metadata: Metadata = {
  title: "Dashboard | Commerce Operations",
  description: "Executive operations summary, key metrics, and activity feeds.",
};

export default function DashboardRoutePage() {
  return <CommerceWorkspace initialView="Dashboard" />;
}
