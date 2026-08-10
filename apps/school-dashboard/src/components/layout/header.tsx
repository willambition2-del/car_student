"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SearchInput } from "../ui/input";
import { Bell, User, School, Sparkles } from "lucide-react";
import { StatusBadge } from "../ui/badge";

export const AppHeader: React.FC = () => {
  const pathname = usePathname();

  const getBreadcrumbTitle = () => {
    if (pathname === "/dashboard") return "الرئيسية";
    if (pathname === "/operations") return "مركز التشغيل المباشر";
    if (pathname.startsWith("/students")) return "إدارة الطلاب";
    if (pathname.startsWith("/guardians")) return "أولياء الأمور";
    if (pathname.startsWith("/buses")) return "أسطول الحافلات";
    if (pathname.startsWith("/drivers")) return "طاقم السائقين";
    if (pathname.startsWith("/supervisors")) return "طاقم المشرفات";
    if (pathname.startsWith("/routes")) return "مسارات النقل";
    if (pathname.startsWith("/trips")) return "جدول الرحلات";
    if (pathname.startsWith("/address-requests")) return "طلبات تغيير العنوان";
    if (pathname.startsWith("/absence-requests")) return "طلبات الغياب";
    if (pathname.startsWith("/payments")) return "رسوم النقل والتسديد";
    if (pathname.startsWith("/notifications")) return "مركز الإشعارات";
    if (pathname.startsWith("/reports")) return "التقارير الإحصائية";
    if (pathname.startsWith("/users") || pathname.startsWith("/roles")) return "المستخدمون والصلاحيات";
    if (pathname.startsWith("/settings")) return "إعدادات المدرسة";
    if (pathname.startsWith("/support")) return "الدعم الفني والتذاكر";
    if (pathname.startsWith("/profile")) return "الملف الشخصي";
    return "لوحة تحكم المدرسة";
  };

  return (
    <header className="h-16 bg-white border-b border-[#E3EAF3] sticky top-0 z-20 px-6 flex items-center justify-between gap-4">
      {/* Left Area: Breadcrumbs */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-xs text-[#66758A]">
          <Link href="/dashboard" className="hover:text-[#1769E0] font-semibold">
            لوحة المدرسة
          </Link>
          <span>/</span>
          <span className="font-bold text-[#13233A]">{getBreadcrumbTitle()}</span>
        </div>
      </div>

      {/* Center Search */}
      <div className="hidden md:block w-72">
        <SearchInput placeholder="بحث عام في الطلاب، الحافلات، والمسارات..." />
      </div>

      {/* Right User & Actions Area */}
      <div className="flex items-center gap-3">
        <StatusBadge variant="success" className="hidden lg:inline-flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#16A461]" /> الباقة المتقدمة
        </StatusBadge>

        <Link
          href="/notifications"
          className="relative p-2 rounded-xl bg-[#F5F8FC] hover:bg-[#E3EAF3] text-[#13233A] transition-colors"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#E5484D]" />
        </Link>

        <div className="h-8 w-px bg-[#E3EAF3]" />

        <Link href="/profile" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
          <div className="w-9 h-9 rounded-full bg-[#1769E0]/10 text-[#1769E0] flex items-center justify-center font-bold text-sm">
            <User className="w-5 h-5" />
          </div>
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs font-bold text-[#13233A]">أحمد المحمد</span>
            <span className="text-[10px] text-[#66758A]">مدير النقل المدرسي</span>
          </div>
        </Link>
      </div>
    </header>
  );
};
