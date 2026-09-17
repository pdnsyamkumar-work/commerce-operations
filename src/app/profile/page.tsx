import type { Metadata } from "next";
import { CommerceWorkspace } from "@/components/commerce-workspace";

export const metadata: Metadata = {
  title: "Profile | Commerce Operations",
  description: "Account credentials, avatar updates, and operator settings.",
};

export default function ProfileRoutePage() {
  return <CommerceWorkspace initialView="Profile" />;
}
