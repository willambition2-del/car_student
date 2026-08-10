import React from "react";
import { PlatformSidebar } from "./sidebar";
import { PlatformHeader } from "./header";

export function PlatformLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#F5F8FC]">
      <PlatformSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <PlatformHeader />
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
