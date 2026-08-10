"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { schoolAddressRequestsApi } from "@/lib/api";
import { Eye, RefreshCw, MapPin } from "lucide-react";

export default function AddressRequestsListPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const data = await schoolAddressRequestsApi.getRequests();
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
      header: "رقم الطلب",
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
      header: "العنوان الحالي",
      accessor: (row) => <span className="text-xs text-[#66758A]">{row.oldAddress || "السكن القديم"}</span>,
    },
    {
      header: "العنوان الجديد المطلوب",
      accessor: (row) => (
        <span className="font-bold text-[#1769E0] flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-[#1769E0]" /> {row.newAddress || "السكن الجديد"}
        </span>
      ),
    },
    {
      header: "تاريخ الطلب",
      accessor: (row) => <span className="font-mono text-xs text-[#66758A]">{new Date(row.createdAt).toLocaleDateString('ar-SA')}</span>,
    },
    {
      header: "حالة المراجعة",
      accessor: (row) => (
        <StatusBadge
          variant={
            row.status === "مقبول" || row.rawStatus === "APPROVED"
              ? "success"
              : row.status === "جديد" || row.rawStatus === "NEW"
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
        <Link href={`/address-requests/${row.id}`}>
          <Button variant="outline" size="sm" icon={<Eye className="w-4 h-4" />}>
            مراجعة واتخاذ القرار
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6 text-right">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#13233A]">طلبات تغيير العنوان السكني</h1>
          <p className="text-xs text-[#66758A] mt-0.5">
            مراجعة طلبات نقل سكن الطلاب المقدمة من أولياء الأمور وإعادة تخصيص الحافلة المناسبة
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchRequests} isLoading={isLoading} icon={<RefreshCw className="w-4 h-4" />}>
          تحديث
        </Button>
      </div>

      <DataTable columns={columns} data={requests} searchPlaceholder="ابحث باسم الطالب، العنوان، أو رقم الطلب..." />
    </div>
  );
}

