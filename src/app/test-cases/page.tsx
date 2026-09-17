import type { Metadata } from "next";
import { CommerceWorkspace } from "@/components/commerce-workspace";

export const metadata: Metadata = {
  title: "Test Cases | Commerce Operations",
  description: "QA automation catalog with 100% coverage scenarios.",
};

export default function TestCasesRoutePage() {
  return <CommerceWorkspace initialView="Test Cases" />;
}
