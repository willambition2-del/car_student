"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { schoolNotificationsApi } from "@/lib/api";
import { Plus, RefreshCw } from "lucide-react";

export default function NotificationsListPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const data = await schoolNotificationsApi.getNotifications();
      if (data && data.items) {
        setNotifications(data.items);
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const columns: Column<any>[] = [
    {
      header: "عنوان الإشعار",
      accessor: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-[#13233A]">{row.title}</span>
          <span className="text-[10px] text-[#66758A] line-clamp-1">{row.body}</span>
        </div>
      ),
    },
    {
      header: "الفئة المستهدفة",
      accessor: (row) => <StatusBadge variant="info">{row.recipientGroup}</StatusBadge>,
    },
    {
      header: "تاريخ الإرسال",
      accessor: (row) => (
        <span className="font-mono text-xs text-[#66758A]">
          {new Date(row.createdAt).toLocaleString('ar-SA')}
        </span>
      ),
    },
    {
      header: "عدد المستلمين",
      accessor: (row) => (
        <span className="font-mono text-xs font-bold text-[#16A461]">
          {row.sentCount || 1} مستلم
        </span>
      ),
    },
    {
      header: "الحالة",
      accessor: (row) => <StatusBadge variant="success">{row.status}</StatusBadge>,
    },
  ];

  return (
    <div className="space-y-6 text-right">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#13233A]">مركز الإشعارات والتنبيهات المدرسية</h1>
          <p className="text-xs text-[#66758A] mt-0.5">
            بث التنبيهات الجماعية لأولياء الأمور وطواقم الحافلات ومتابعة شارات القراءة
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchNotifications} isLoading={isLoading} icon={<RefreshCw className="w-4 h-4" />}>
            تحديث
          </Button>
          <Link href="/notifications/new">
            <Button variant="primary" icon={<Plus className="w-4 h-4" />}>
              إنشاء إشعار جديد
            </Button>
          </Link>
        </div>
      </div>

      <DataTable columns={columns} data={notifications} searchPlaceholder="ابحث بعنوان الإشعار أو الفئة..." />
    </div>
  );
}

