"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowRight, CheckCircle2, RefreshCw } from "lucide-react";

interface TechErrorRow {
  id: string;
  code: string;
  service: string;
  message: string;
  count: number;
  lastOccurred: string;
  status: "حرج" | "تحذير" | "محلول";
}

export default function SystemErrorsPage() {
  const router = useRouter();

  const errors: TechErrorRow[] = [
    {
      id: "err-1",
      code: "SOCKET_TIMEOUT_504",
      service: "Socket.IO Live Tracking Gateway",
      message: "انقطاع اتصالات التتبع الفوري للحافلة 108 مؤقتاً بسبب التغطية",
      count: 3,
      lastOccurred: "2026-08-01 10:42",
      status: "تحذير",
    },
  ];

  const columns: Column<TechErrorRow>[] = [
    {
      header: "رمز الاستثناء والخدمة",
      accessor: (row) => (
        <div className="flex flex-col">
          <span className="font-mono text-xs font-bold text-[#E5484D]">{row.code}</span>
          <span className="text-[10px] text-[#66758A]">{row.service}</span>
        </div>
      ),
    },
    {
      header: "وصف التنبيه البرمجي",
      accessor: (row) => <span className="text-xs text-[#13233A] font-medium">{row.message}</span>,
    },
    {
      header: "التكرار والتاريخ",
      accessor: (row) => (
        <div className="flex flex-col text-xs font-mono">
          <span>{row.count} مرات</span>
          <span className="text-[10px] text-[#66758A]">{row.lastOccurred}</span>
        </div>
      ),
    },
    {
      header: "الحالة",
      accessor: (row) => (
        <StatusBadge variant={row.status === "حرج" ? "error" : "warning"}>{row.status}</StatusBadge>
      ),
    },
  ];

  return (
    <div className="space-y-6 text-right max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" onClick={() => router.back()} icon={<ArrowRight className="w-4 h-4" />}>
            العودة
          </Button>
          <div>
            <h1 className="text-xl font-bold text-[#13233A]">سجل البلاغات والاستثناءات البرمجية</h1>
            <p className="text-xs text-[#66758A]">رصد الأخطاء الفنية وسرعة المعالجة</p>
          </div>
        </div>
      </div>

      <DataTable columns={columns} data={errors} searchPlaceholder="ابحث برمز الخطأ أو اسم الخدمة..." />
    </div>
  );
}
