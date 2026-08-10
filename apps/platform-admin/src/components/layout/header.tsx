"use client";

import React from "react";
import Link from "next/link";
import { SearchInput } from "@/components/ui/input";
import { Bell, Shield, Server, User } from "lucide-react";

export function PlatformHeader() {
  return (
    <header className="h-16 bg-white border-b border-[#E3EAF3] px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs">
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <SearchInput placeholder="ابحث باسم المدرسة، الاشتراك، أو الفاتورة..." className="bg-[#F5F8FC]" />
      </div>

      <div className="flex items-center gap-4">
        {/* System Health Pulse Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#16A461]/10 text-[#16A461] text-xs font-bold border border-[#16A461]/20">
          <span className="w-2 h-2 rounded-full bg-[#16A461] animate-ping" />
          <span>حالة النظام: 99.98% (سليم)</span>
        </div>

        {/* Global Notifications Bell */}
        <button className="relative p-2 rounded-xl bg-[#F5F8FC] hover:bg-[#E3EAF3] text-[#13233A] transition-colors">
          <Bell className="w-5 h-5 text-[#1769E0]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#E5484D] rounded-full" />
        </button>

        {/* Owner Profile Link */}
        <Link href="/profile" className="flex items-center gap-2 border-r border-[#E3EAF3] pr-4">
          <div className="w-8 h-8 rounded-full bg-[#103B75] text-white flex items-center justify-center font-bold text-xs">
            <User className="w-4 h-4" />
          </div>
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs font-bold text-[#13233A]">سليمان المنصور</span>
            <span className="text-[10px] text-[#66758A]">Super Admin</span>
          </div>
        </Link>
      </div>
    </header>
  );
}
