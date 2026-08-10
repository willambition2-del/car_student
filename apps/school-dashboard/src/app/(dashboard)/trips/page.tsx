"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { schoolTripsApi } from "@/lib/api";
import { Eye, Calendar, RefreshCw } from "lucide-react";

export default function TripsListPage() {
  const [trips, setTrips] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTrips = async () => {
    setIsLoading(true);
    try {
      const data = await schoolTripsApi.getTrips();
      if (data && data.items) {
        setTrips(data.items);
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const columns: Column<any>[] = [
    {
      header: "رقم الرحلة",
      accessor: (row) => (
        <span className="font-mono text-xs font-bold text-[#103B75]">{row.tripNumber || row.id}</span>
      ),
    },
    {
      header: "نوع الرحلة والتاريخ",
      accessor: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-[#13233A]">{row.tripType}</span>
          <span className="text-[10px] text-[#66758A] flex items-center gap-1 font-mono">
            <Calendar className="w-3 h-3 text-[#1769E0]" /> {new Date(row.createdAt).toLocaleDateString('ar-SA')}
          </span>
        </div>
      ),
    },
    {
      header: "الحافلة والمسار",
      accessor: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-[#1769E0]">حافلة {row.busNumber}</span>
          <span className="text-[10px] text-[#66758A]">{row.routeName}</span>
        </div>
      ),
    },
    {
      header: "الطاقم الميداني",
      accessor: (row) => (
        <div className="flex flex-col text-xs">
          <span>سائق: {row.driverName}</span>
          <span className="text-[10px] text-[#66758A]">مشرفة: {row.supervisorName}</span>
        </div>
      ),
    },
    {
      header: "حالة صعود الطلاب",
      accessor: (row) => (
        <div className="flex items-center gap-1 font-bold text-xs text-[#13233A]">
          <span>{row.boardedCount || 0}</span> / <span>{row.totalStudents || 0} طالب</span>
        </div>
      ),
    },
    {
      header: "الحالة التشغيلية",
      accessor: (row) => (
        <StatusBadge
          variant={
            row.status === "مكتملة" || row.rawStatus === "COMPLETED"
              ? "success"
              : row.status === "قيد التنفيذ" || row.rawStatus === "STARTED"
              ? "info"
              : "neutral"
          }
        >
          {row.status || row.rawStatus}
        </StatusBadge>
      ),
    },
    {
      header: "الإجراءات",
      accessor: (row) => (
        <Link href={`/trips/${row.id}`}>
          <Button variant="ghost" size="sm" icon={<Eye className="w-4 h-4 text-[#1769E0]" />}>
            متابعة الخط الزمني
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6 text-right">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#13233A]">سجل وجدول الرحلات اليومية</h1>
          <p className="text-xs text-[#66758A] mt-0.5">
            متابعة مسار الرحلات الصباحية والعودة والتحقق من التوقيت وأعداد الطلاب
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchTrips} isLoading={isLoading} icon={<RefreshCw className="w-4 h-4" />}>
          تحديث
        </Button>
      </div>

      <DataTable columns={columns} data={trips} searchPlaceholder="ابحث برقم الرحلة، الحافلة، أو المسار..." />
    </div>
  );
}

