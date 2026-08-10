"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { schoolBusesApi } from "@/lib/api";
import { Plus, Eye, Users, RefreshCw } from "lucide-react";

export default function BusesListPage() {
  const [buses, setBuses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBuses = async () => {
    setIsLoading(true);
    try {
      const data = await schoolBusesApi.getBuses();
      if (data && data.items) {
        setBuses(data.items);
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBuses();
  }, []);

  const columns: Column<any>[] = [
    {
      header: "رقم الحافلة",
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#1769E0]/10 text-[#1769E0] flex items-center justify-center font-bold text-xs">
            {row.busNumber || row.number}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-[#13233A]">حافلة {row.busNumber || row.number}</span>
            <span className="text-[10px] text-[#66758A]">{row.model} ({row.year})</span>
          </div>
        </div>
      ),
    },
    {
      header: "رقم اللوحة",
      accessor: (row) => <span className="font-mono text-xs font-bold text-[#103B75]">{row.plateNumber}</span>,
    },
    {
      header: "الحمولة والسعة",
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-[#1769E0]" />
          <span className="font-bold text-[#13233A]">
            سعة {row.capacity} راكب
          </span>
        </div>
      ),
    },
    {
      header: "السائق المسؤول",
      accessor: (row) => (
        <div className="flex flex-col">
          <span className="font-medium text-[#13233A]">{row.driverName}</span>
          <span className="text-[10px] text-[#66758A] font-mono">{row.driverPhone}</span>
        </div>
      ),
    },
    {
      header: "المشرفة المرافقة",
      accessor: (row) => (
        <div className="flex flex-col">
          <span className="font-medium text-[#13233A]">{row.supervisorName}</span>
          <span className="text-[10px] text-[#66758A] font-mono">{row.supervisorPhone}</span>
        </div>
      ),
    },
    {
      header: "الحالة التشغيلية",
      accessor: (row) => (
        <StatusBadge variant={row.status === "نشطة" || row.status === "ACTIVE" ? "success" : "error"}>{row.status}</StatusBadge>
      ),
    },
    {
      header: "الإجراءات",
      accessor: (row) => (
        <div className="flex items-center gap-1">
          <Link href={`/buses/${row.id}`}>
            <Button variant="ghost" size="sm" icon={<Eye className="w-4 h-4 text-[#1769E0]" />}>
              تفاصيل
            </Button>
          </Link>
          <Link href={`/buses/${row.id}/assign`}>
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
          <h1 className="text-xl font-bold text-[#13233A]">إدارة أسطول الحافلات المدرسية</h1>
          <p className="text-xs text-[#66758A] mt-0.5">
            متابعة سعة الحافلات والطواقم وسجل الصيانة وتأكيد حالة تتبع الـ GPS
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchBuses} isLoading={isLoading} icon={<RefreshCw className="w-4 h-4" />}>
            تحديث
          </Button>
          <Link href="/buses/new">
            <Button variant="primary" icon={<Plus className="w-4 h-4" />}>
              إضافة حافلة جديدة
            </Button>
          </Link>
        </div>
      </div>

      <DataTable columns={columns} data={buses} searchPlaceholder="ابحث برقم الحافلة، اللوحة، أو السائق..." />
    </div>
  );
}

