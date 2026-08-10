"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { schoolSupervisorsApi } from "@/lib/api";
import { Shield, Eye, Phone, Plus, RefreshCw } from "lucide-react";

export default function SupervisorsListPage() {
  const [supervisors, setSupervisors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSupervisors = async () => {
    setIsLoading(true);
    try {
      const data = await schoolSupervisorsApi.getSupervisors();
      if (data && data.items) {
        setSupervisors(data.items);
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSupervisors();
  }, []);

  const columns: Column<any>[] = [
    {
      header: "اسم المشرفة",
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#12AFA5]/10 text-[#12AFA5] flex items-center justify-center font-bold">
            <Shield className="w-4 h-4" />
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
      header: "الحافلة المخصصة",
      accessor: (row) => <span className="font-bold text-[#103B75]">{row.assignedBusNumber ? `حافلة ${row.assignedBusNumber}` : 'غير معينة'}</span>,
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
        <StatusBadge variant={row.status === "نشطة" || row.status === "ACTIVE" ? "success" : "warning"}>{row.status}</StatusBadge>
      ),
    },
    {
      header: "الإجراءات",
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <Link href={`/supervisors/${row.id}`}>
            <Button variant="ghost" size="sm" icon={<Eye className="w-4 h-4 text-[#1769E0]" />}>
              ملف المشرفة
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
          <h1 className="text-xl font-bold text-[#13233A]">طاقم المشرفات الميدانيات</h1>
          <p className="text-xs text-[#66758A] mt-0.5">
            إدارة مشرفات الحافلات ومتابعة حالة المزامنة الفورية لتطبيق الموبايل أثناء الرحلات
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchSupervisors} isLoading={isLoading} icon={<RefreshCw className="w-4 h-4" />}>
            تحديث
          </Button>
          <Link href="/supervisors/new">
            <Button variant="primary" icon={<Plus className="w-4 h-4" />}>
              إضافة مشرفة جديدة
            </Button>
          </Link>
        </div>
      </div>

      <DataTable columns={columns} data={supervisors} searchPlaceholder="ابحث باسم المشرفة، الحافلة، أو الجوال..." />
    </div>
  );
}

