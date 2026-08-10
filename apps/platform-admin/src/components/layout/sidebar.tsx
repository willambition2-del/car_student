"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  School,
  CreditCard,
  Receipt,
  Sliders,
  Users,
  HelpCircle,
  History,
  Activity,
  Bell,
  Settings,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  PackageCheck,
} from "lucide-react";

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

export function PlatformSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const navItems: NavItem[] = [
    { title: "نظرة عامة على المنصة", href: "/overview", icon: <LayoutDashboard className="w-5 h-5" /> },
    { title: "المدارس المشتركة (Tenants)", href: "/schools", icon: <School className="w-5 h-5" /> },
    { title: "باقات الاشتراك SaaS", href: "/plans", icon: <PackageCheck className="w-5 h-5" /> },
    { title: "سجل الاشتراكات", href: "/subscriptions", icon: <CreditCard className="w-5 h-5" /> },
    { title: "الفواتير والمتحصلات", href: "/invoices", icon: <Receipt className="w-5 h-5" /> },
    { title: "تخصيص الميزات (Feature Flags)", href: "/features", icon: <Sliders className="w-5 h-5" /> },
    { title: "مستخدمي لوحة المالك", href: "/users", icon: <Users className="w-5 h-5" /> },
    { title: "تذاكر الدعم الفني", href: "/support", icon: <HelpCircle className="w-5 h-5" /> },
    { title: "سجل التغييرات والتدقيق (Audit)", href: "/audit", icon: <History className="w-5 h-5" /> },
    { title: "صحة الخوادم والنظام", href: "/system-health", icon: <Activity className="w-5 h-5" /> },
    { title: "البث والإشعارات الجماعية", href: "/notifications", icon: <Bell className="w-5 h-5" /> },
    { title: "إعدادات مالك المنصة", href: "/settings", icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <aside
      className={cn(
        "bg-[#103B75] text-white flex flex-col justify-between transition-all duration-300 min-h-screen sticky top-0 border-l border-[#1769E0]/20 z-30 shrink-0",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex flex-col h-full">
        {/* Header Branding */}
        <div className="h-16 border-b border-white/10 flex items-center justify-between px-4">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-[#1769E0] text-white flex items-center justify-center font-bold text-lg">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="flex flex-col text-right">
                <span className="font-bold text-sm tracking-wide">مالك المنصة SaaS</span>
                <span className="text-[10px] text-[#12AFA5]">Platform Admin Hub</span>
              </div>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors mr-auto"
          >
            {collapsed ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation items list */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150",
                  isActive
                    ? "bg-[#1769E0] text-white shadow-md"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                )}
                title={collapsed ? item.title : undefined}
              >
                <span className="shrink-0">{item.icon}</span>
                {!collapsed && <span className="truncate">{item.title}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer Profile & Logout */}
        <div className="p-3 border-t border-white/10">
          <Link
            href="/profile"
            className={cn(
              "flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/10 transition-colors text-right",
              collapsed && "justify-center"
            )}
          >
            <div className="w-8 h-8 rounded-full bg-[#12AFA5] text-white flex items-center justify-center font-bold text-xs shrink-0">
              <User className="w-4 h-4" />
            </div>
            {!collapsed && (
              <div className="flex flex-col truncate">
                <span className="text-xs font-bold text-white">سليمان المنصور</span>
                <span className="text-[10px] text-white/60">مالك النظام (Super Admin)</span>
              </div>
            )}
          </Link>
        </div>
      </div>
    </aside>
  );
}
