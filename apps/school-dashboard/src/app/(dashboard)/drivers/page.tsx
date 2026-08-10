"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { schoolDriversApi } from "@/lib/api";
import { UserCog, Eye, Phone, Plus, RefreshCw } from "lucide-react";

export default function DriversListPage() {
  const [drivers, setDrivers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDrivers = async () => {
    setIsLoading(true);
    try {
      const data = await schoolDriversApi.getDrivers();
      if (data && data.items) {
        setDrivers(data.items);
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const columns: Column<any>[] = [
    {
      header: "اسم السائق",
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#103B75]/10 text-[#103B75] flex items-center justify-center font-bold">
            <UserCog className="w-4 h-4" />
          </div>
          <span className="font-bold text-[#13233A]">{row.fullName || row.name}</span>
        </div>
      ),
    },
    {
      header: "رقم الجوال المباشر",
      accessor: (row) => <span className="font-mono text-xs font-bold text-[#1769E0]">{row.phone}</span>,
    },
    {
      header: "رقم رخصة القيادة",
      accessor: (row) => <span className="font-mono text-xs text-[#66758A]">{row.licenseNumber || 'غير مدخل'}</span>,
    },
    {
      header: "الحافلة المخصصة",
      accessor: (row) => <span className="font-bold text-[#103B75]">{row.assignedBusNumber ? `حافلة ${row.assignedBusNumber}` : 'غير معين'}</span>,
    },
    {
      header: "رقم اللوحة",
      accessor: (row) => <span className="font-mono text-xs text-[#66758A]">{row.assignedBusPlate || 'غير مدخل'}</span>,
    },
    {
      header: "حساب التطبيق",
      accessor: (row) => (
        <StatusBadge variant={row.appAccessStatus === "مُفعّل" ? "success" : "neutral"}>
          {row.appAccessStatus || "مُفعّل"}
        </StatusBadge>
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
          <Link href={`/drivers/${row.id}`}>
            <Button variant="ghost" size="sm" icon={<Eye className="w-4 h-4 text-[#1769E0]" />}>
              الملف والنشاط
            </Button>
          </Link>
          <Button variant="outline" size="sm" icon={<Phone className="w-3.5 h-3.5" />}>
            اتصال
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 text-right">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#13233A]">طاقم السائقين المعتمدين</h1>
          <p className="text-xs text-[#66758A] mt-0.5">
            إدارة بيانات رخص القيادة والحافلات المخصصة وسجلات السلامة والبلاغات
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchDrivers} isLoading={isLoading} icon={<RefreshCw className="w-4 h-4" />}>
            تحديث
          </Button>
          <Link href="/drivers/new">
            <Button variant="primary" icon={<Plus className="w-4 h-4" />}>
              إضافة سائق جديد
            </Button>
          </Link>
        </div>
      </div>

      <DataTable columns={columns} data={drivers} searchPlaceholder="ابحث باسم السائق، الرخصة، أو الجوال..." />
    </div>
  );
}

