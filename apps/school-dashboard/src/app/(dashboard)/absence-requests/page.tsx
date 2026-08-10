"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { schoolAbsenceRequestsApi } from "@/lib/api";
import { Eye, RefreshCw } from "lucide-react";

export default function AbsenceRequestsListPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const data = await schoolAbsenceRequestsApi.getRequests();
      if (data && data.items) {
        setRequests(data.items);
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const columns: Column<any>[] = [
    {
      header: "رقم الإشعار",
      accessor: (row) => <span className="font-mono text-[#103B75] font-bold">{row.requestNumber || row.id}</span>,
    },
    {
      header: "اسم الطالب",
      accessor: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-[#13233A]">{row.studentName}</span>
          <span className="text-[10px] text-[#66758A]">{row.guardianName} ({row.guardianPhone})</span>
        </div>
      ),
    },
    {
      header: "نوع الغياب",
      accessor: (row) => <StatusBadge variant="warning">{row.absenceType}</StatusBadge>,
    },
    {
      header: "الفترة الزمنية",
      accessor: (row) => (
        <span className="font-mono text-xs text-[#13233A]">
          {new Date(row.startDate).toLocaleDateString('ar-SA')} إلى {row.endDate ? new Date(row.endDate).toLocaleDateString('ar-SA') : 'يوم واحد'}
        </span>
      ),
    },
    {
      header: "السبب",
      accessor: (row) => <span className="text-xs text-[#66758A]">{row.reason || "ظرف خاص"}</span>,
    },
    {
      header: "الحالة",
      accessor: (row) => (
        <StatusBadge
          variant={
            row.status === "مقبول" || row.rawStatus === "APPROVED"
              ? "success"
              : row.status === "جديد" || row.rawStatus === "PENDING"
              ? "warning"
              : "error"
          }
        >
          {row.status || row.rawStatus}
        </StatusBadge>
      ),
    },
    {
      header: "الإجراءات",
      accessor: (row) => (
        <Link href={`/absence-requests/${row.id}`}>
          <Button variant="ghost" size="sm" icon={<Eye className="w-4 h-4 text-[#1769E0]" />}>
            تفاصيل الطلب
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6 text-right">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#13233A]">إدارة طلبات غياب الطلاب</h1>
          <p className="text-xs text-[#66758A] mt-0.5">
            متابعة إخطارات الغياب والاستلام الشخصي المقدمة قبل انطلاق الرحلة لتنبيه المشرفة
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchRequests} isLoading={isLoading} icon={<RefreshCw className="w-4 h-4" />}>
          تحديث
        </Button>
      </div>

      <DataTable columns={columns} data={requests} searchPlaceholder="ابحث باسم الطالب أو رقم الإشعار..." />
    </div>
  );
}

