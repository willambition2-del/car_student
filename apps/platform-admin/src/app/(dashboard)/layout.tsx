import React from "react";
import { PlatformLayout } from "@/components/layout/platform-layout";

export default function DashboardLayoutWrapper({ children }: { children: React.ReactNode }) {
  return <PlatformLayout>{children}</PlatformLayout>;
}
