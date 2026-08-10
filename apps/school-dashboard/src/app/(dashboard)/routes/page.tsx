"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { schoolRoutesApi } from "@/lib/api";
import { Route as RouteIcon, Plus, Eye, MapPin, RefreshCw } from "lucide-react";

export default function RoutesListPage() {
  const [routes, setRoutes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchRoutes = async () => {
    setIsLoading(true);
    try {
      const data = await schoolRoutesApi.getRoutes();
      if (data && data.items) {
        setRoutes(data.items);
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  const columns: Column<any>[] = [
    {
      header: "اسم المسار",
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#1769E0]/10 text-[#1769E0] flex items-center justify-center font-bold text-xs">
            <RouteIcon className="w-4 h-4" />
          </div>
          <span className="font-bold text-[#13233A]">{row.nameAr || row.name}</span>
        </div>
      ),
    },
    {
      header: "نوع المسار",
      accessor: (row) => <StatusBadge variant="info">{row.tripType}</StatusBadge>,
    },
    {
      header: "الحافلة المخصصة",
      accessor: (row) => <span className="font-bold text-[#103B75]">{row.busNumber ? `حافلة ${row.busNumber}` : 'غير موزع'}</span>,
    },
    {
      header: "السائق والمشرفة",
      accessor: (row) => (
        <div className="flex flex-col text-xs">
          <span className="font-medium text-[#13233A]">سائق: {row.driverName}</span>
          <span className="text-[#66758A]">مشرفة: {row.supervisorName}</span>
        </div>
      ),
    },
    {
      header: "عدد المحطات والطلاب",
      accessor: (row) => (
        <span className="font-medium text-[#13233A] flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-[#1769E0]" /> {row.stopsCount || 0} مواقف • {row.studentsCount || 0} طلاب
        </span>
      ),
    },
    {
      header: "المسافة والزمن التقديري",
      accessor: (row) => (
        <div className="flex flex-col text-xs font-mono">
          <span className="font-bold text-[#13233A]">{row.distanceKm} كم</span>
          <span className="text-[10px] text-[#66758A]">{row.estimatedDurationMinutes} دقيقة</span>
        </div>
      ),
    },
    {
      header: "الحالة",
      accessor: (row) => (
        <StatusBadge variant={row.status === "نشط" || row.status === "ACTIVE" ? "success" : "warning"}>{row.status}</StatusBadge>
      ),
    },
    {
      header: "الإجراءات",
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <Link href={`/routes/${row.id}`}>
            <Button variant="ghost" size="sm" icon={<Eye className="w-4 h-4 text-[#1769E0]" />}>
              تفاصيل المسار
            </Button>
          </Link>
          <Link href={`/routes/${row.id}/assign`}>
            <Button variant="outline" size="sm">
              توزيع الطلاب
            </Button>
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 text-right">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#13233A]">إدارة مسارات النقل المدرسي</h1>
          <p className="text-xs text-[#66758A] mt-0.5">
            تخطيط وإعادة تهيئة الخطوط والمحطات والأوقات التقديرية للوصول
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchRoutes} isLoading={isLoading} icon={<RefreshCw className="w-4 h-4" />}>
            تحديث
          </Button>
          <Link href="/routes/new">
            <Button variant="primary" icon={<Plus className="w-4 h-4" />}>
              إنشاء مسار جديد
            </Button>
          </Link>
        </div>
      </div>

      <DataTable columns={columns} data={routes} searchPlaceholder="ابحث باسم المسار أو المنطقة..." />
    </div>
  );
}

