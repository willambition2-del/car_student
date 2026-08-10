"use client";

import React from "react";
import Link from "next/link";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Plus, Send } from "lucide-react";

interface BroadcastItem {
  id: string;
  title: string;
  targetTenants: string;
  sentAt: string;
  deliveredCount: number;
  status: "تم الإرسال" | "مجدول";
}

export default function PlatformNotificationsPage() {
  const broadcasts: BroadcastItem[] = [
    {
      id: "bc-1",
      title: "تحديث أمني وإضافة ميزة المزامنة الميدانية بدون إنترنت",
      targetTenants: "جميع المدارس المشتركة",
      sentAt: "2026-08-01 08:00",
      deliveredCount: 24,
      status: "تم الإرسال",
    },
    {
      id: "bc-2",
      title: "إشعار صيانة دورية مجدولة لخوادم المنظومة",
      targetTenants: "المدارس ذات الباقة الاحترافية",
      sentAt: "2026-08-05 02:00 (مجدول)",
      deliveredCount: 14,
      status: "مجدول",
    },
  ];

  const columns: Column<BroadcastItem>[] = [
    {
      header: "عنوان البث والإشعار",
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#1769E0]" />
          <span className="font-bold text-[#13233A]">{row.title}</span>
        </div>
      ),
    },
    {
      header: "المدارس المستهدفة",
      accessor: (row) => <StatusBadge variant="info">{row.targetTenants}</StatusBadge>,
    },
    {
      header: "تاريخ الإرسال",
      accessor: (row) => <span className="font-mono text-xs text-[#66758A]">{row.sentAt}</span>,
    },
    {
      header: "الاستلام والتسليم",
      accessor: (row) => (
        <span className="font-mono text-xs font-bold text-[#16A461]">{row.deliveredCount} مدرسة</span>
      ),
    },
    {
      header: "الحالة",
      accessor: (row) => (
        <StatusBadge variant={row.status === "تم الإرسال" ? "success" : "warning"}>{row.status}</StatusBadge>
      ),
    },
  ];

  return (
    <div className="space-y-6 text-right">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#13233A]">البث والتنبيهات العامة للمدارس (Global Broadcasts)</h1>
          <p className="text-xs text-[#66758A] mt-0.5">إرسال التحديثات والتنبيهات المباشرة إلى لوحات تحكم المدارس المستضافة</p>
        </div>
        <Link href="/notifications/new">
          <Button variant="primary" icon={<Plus className="w-4 h-4" />}>
            إنشاء إعلان وبث جديد
          </Button>
        </Link>
      </div>

      <DataTable columns={columns} data={broadcasts} searchPlaceholder="ابحث بعنوان الإعلان..." />
    </div>
  );
}
