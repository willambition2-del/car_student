"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  Navigation,
  Users,
  UserCheck,
  Bus,
  UserCog,
  Shield,
  Route,
  Clock,
  MapPin,
  CalendarX,
  CreditCard,
  Bell,
  BarChart3,
  UserPlus,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  School,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

export const navItems: NavItem[] = [
  { title: "الرئيسية", href: "/dashboard", icon: <Home className="w-5 h-5" /> },
  { title: "مركز التشغيل", href: "/operations", icon: <Navigation className="w-5 h-5" /> },
  { title: "الطلاب", href: "/students", icon: <Users className="w-5 h-5" /> },
  { title: "أولياء الأمور", href: "/guardians", icon: <UserCheck className="w-5 h-5" /> },
  { title: "الباصات", href: "/buses", icon: <Bus className="w-5 h-5" /> },
  { title: "السائقون", href: "/drivers", icon: <UserCog className="w-5 h-5" /> },
  { title: "المشرفات", href: "/supervisors", icon: <Shield className="w-5 h-5" /> },
  { title: "المسارات", href: "/routes", icon: <Route className="w-5 h-5" /> },
  { title: "الرحلات", href: "/trips", icon: <Clock className="w-5 h-5" /> },
  { title: "طلبات تغيير العنوان", href: "/address-requests", icon: <MapPin className="w-5 h-5" /> },
  { title: "طلبات الغياب", href: "/absence-requests", icon: <CalendarX className="w-5 h-5" /> },
  { title: "رسوم النقل", href: "/payments", icon: <CreditCard className="w-5 h-5" /> },
  { title: "الإشعارات", href: "/notifications", icon: <Bell className="w-5 h-5" /> },
  { title: "التقارير", href: "/reports", icon: <BarChart3 className="w-5 h-5" /> },
  { title: "المستخدمون والصلاحيات", href: "/users", icon: <UserPlus className="w-5 h-5" /> },
  { title: "الإعدادات", href: "/settings", icon: <Settings className="w-5 h-5" /> },
  { title: "الدعم الفني", href: "/support", icon: <HelpCircle className="w-5 h-5" /> },
];

export const AppSidebar: React.FC = () => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "h-screen sticky top-0 bg-[#103B75] text-white flex flex-col border-l border-[#103B75]/20 shadow-lg transition-all duration-300 z-30",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Sidebar Header Brand */}
      <div className="h-16 border-b border-white/10 flex items-center justify-between px-4">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#1769E0] text-white flex items-center justify-center font-bold text-lg shadow-xs">
              <School className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold truncate">منصة النقل المدرسي</span>
              <span className="text-[10px] text-white/70">مدارس المستقبل</span>
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors mx-auto"
        >
          {collapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 group relative",
                isActive
                  ? "bg-[#1769E0] text-white shadow-sm font-bold"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              )}
            >
              <div className={cn("transition-transform group-hover:scale-110", isActive && "text-white")}>
                {item.icon}
              </div>
              {!collapsed && <span className="truncate">{item.title}</span>}

              {/* Tooltip on Collapsed */}
              {collapsed && (
                <div className="absolute right-full mr-2 hidden group-hover:block bg-[#13233A] text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-md whitespace-nowrap z-50">
                  {item.title}
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </aside>
  );
};
