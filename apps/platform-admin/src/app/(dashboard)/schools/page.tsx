"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { platformSchoolsApi } from "@/lib/api";
import { School, Plus, Eye, Edit, RefreshCw } from "lucide-react";

const mockSchoolsList = [
  {
    id: "school-demo-001",
    nameAr: "مدارس المستقبل الأهلية",
    slug: "al-mustaqbal",
    city: "الرياض",
    phone: "+966112345678",
    email: "info@almustaqbal.edu.sa",
    status: "ACTIVE",
    studentsCount: 2,
    busesCount: 1,
    activePlan: "الباقة الاحترافية",
  },
];

export default function SchoolsListPage() {
  const [schools, setSchools] = useState<any[]>(mockSchoolsList);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSchools = async () => {
    setIsLoading(true);
    try {
      const data = await platformSchoolsApi.getSchools();
      if (data && data.items && data.items.length > 0) {
        setSchools(data.items);
      }
    } catch {
      // Fallback to mock data if offline
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  const columns: Column<any>[] = [
    {
      header: "المدرسة والرمز",
      accessor: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#1769E0]/10 text-[#1769E0] flex items-center justify-center font-bold">
            <School className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-[#13233A]">{row.nameAr || row.name}</span>
            <span className="text-[10px] text-[#66758A] font-mono">{row.slug} ({row.city || 'الرياض'})</span>
          </div>
        </div>
      ),
    },
    {
      header: "التواصل",
      accessor: (row) => (
        <div className="flex flex-col text-xs">
          <span className="font-bold text-[#13233A]">{row.email}</span>
          <span className="text-[10px] text-[#66758A] font-mono">{row.phone}</span>
        </div>
      ),
    },
    {
      header: "باقة الاشتراك",
      accessor: (row) => <StatusBadge variant="info">{row.activePlan || row.planName || "احترافية"}</StatusBadge>,
    },
    {
      header: "الطلاب والحافلات",
      accessor: (row) => (
        <div className="flex flex-col text-xs font-mono">
          <span className="font-bold text-[#103B75]">{row.studentsCount || 0} طالب</span>
          <span className="text-[10px] text-[#66758A]">{row.busesCount || 0} حافلة</span>
        </div>
      ),
    },
    {
      header: "الحالة التشغيلية",
      accessor: (row) => (
        <StatusBadge
          variant={
            row.status === "ACTIVE" || row.status === "نشطة"
              ? "success"
              : row.status === "TRIAL" || row.status === "تجربة مجانية"
              ? "warning"
              : "error"
          }
        >
          {row.status === "ACTIVE" ? "نشطة" : row.status === "TRIAL" ? "تجربة مجانية" : row.status}
        </StatusBadge>
      ),
    },
    {
      header: "الإجراءات",
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <Link href={`/schools/${row.id}`}>
            <Button variant="ghost" size="sm" icon={<Eye className="w-4 h-4 text-[#1769E0]" />}>
              ملف المدرسة
            </Button>
          </Link>
          <Link href={`/schools/${row.id}/edit`}>
            <Button variant="outline" size="sm" icon={<Edit className="w-3.5 h-3.5" />}>
              تعديل
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
          <h1 className="text-xl font-bold text-[#13233A]">المدارس المشتركة بالنظام (Tenants)</h1>
          <p className="text-xs text-[#66758A] mt-0.5">
            إدارة كافة المدارس والمجمعات التعليمية المستضافة عبر المنصة ومتابعة حالتها
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchSchools} isLoading={isLoading} icon={<RefreshCw className="w-4 h-4" />}>
            تحديث
          </Button>
          <Link href="/schools/new">
            <Button variant="primary" icon={<Plus className="w-4 h-4" />}>
              تهيئة وإضافة مدرسة جديدة
            </Button>
          </Link>
        </div>
      </div>

      <DataTable columns={columns} data={schools} searchPlaceholder="ابحث باسم المدرسة، الرمز، أو المدينة..." />
    </div>
  );
}
