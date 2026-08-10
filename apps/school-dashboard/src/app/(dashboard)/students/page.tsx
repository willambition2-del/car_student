"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SelectInput } from "@/components/ui/input";
import { schoolStudentsApi } from "@/lib/api";
import { UserPlus, Eye, Edit, MapPinCheck, RefreshCw } from "lucide-react";

export default function StudentsListPage() {
  const [selectedGrade, setSelectedGrade] = useState("الكل");
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const data = await schoolStudentsApi.getStudents(1, 20, '', selectedGrade !== "الكل" ? selectedGrade : '');
      if (data && data.items && data.items.length > 0) {
        setStudents(data.items);
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [selectedGrade]);

  const columns: Column<any>[] = [
    {
      header: "رمز الطالب",
      accessor: (row) => <span className="font-mono text-[#103B75] font-bold">{row.schoolNumber || row.code}</span>,
    },
    {
      header: "اسم الطالب",
      accessor: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-[#13233A]">{row.fullName || row.name}</span>
          <span className="text-[10px] text-[#66758A]">{row.classSection || row.section}</span>
        </div>
      ),
    },
    {
      header: "الصف الدراسي",
      accessor: (row) => <span>{row.grade}</span>,
    },
    {
      header: "ولي الأمر",
      accessor: (row) => (
        <div className="flex flex-col">
          <span className="font-medium text-[#13233A]">{row.guardianName}</span>
          <span className="text-[11px] text-[#66758A] font-mono">{row.guardianPhone}</span>
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
      header: "الموقع السكني",
      accessor: (row) => (
        <span className="inline-flex items-center gap-1 text-[11px] text-[#16A461] font-bold">
          <MapPinCheck className="w-3.5 h-3.5" /> {row.neighborhood || "موقع معتمد"}
        </span>
      ),
    },
    {
      header: "حالة النقل",
      accessor: (row) => (
        <StatusBadge variant={row.status === "نشط" || row.isActive !== false ? "success" : "error"}>
          {row.status || (row.isActive ? "نشط" : "معطل")}
        </StatusBadge>
      ),
    },
    {
      header: "الإجراءات",
      accessor: (row) => (
        <div className="flex items-center gap-1">
          <Link href={`/students/${row.id}`}>
            <Button variant="ghost" size="sm" icon={<Eye className="w-4 h-4 text-[#1769E0]" />}>
              عرض
            </Button>
          </Link>
          <Link href={`/students/new?edit=${row.id}`}>
            <Button variant="ghost" size="sm" icon={<Edit className="w-4 h-4 text-[#66758A]" />}>
              تعديل
            </Button>
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 text-right">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#13233A]">سجل الطلاب والاشتراكات</h1>
          <p className="text-xs text-[#66758A] mt-0.5">
            إدارة كافة الطلاب المسجلين بخدمة النقل المدرسي وتأكيد مواقعهم وحافلاتهم
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchStudents} isLoading={isLoading} icon={<RefreshCw className="w-4 h-4" />}>
            تحديث
          </Button>
          <Link href="/students/new">
            <Button variant="primary" icon={<UserPlus className="w-4 h-4" />}>
              إضافة طالب جديد
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter Bar Controls */}
      <div className="bg-white p-4 rounded-2xl border border-[#E3EAF3] flex flex-wrap items-center gap-4 shadow-xs">
        <div className="w-48">
          <SelectInput
            label="تصفية حسب الصف"
            options={[
              { label: "جميع الصفوف", value: "الكل" },
              { label: "الصف الرابع", value: "الرابع" },
              { label: "الصف الثاني", value: "الثاني" },
            ]}
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
          />
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={students}
        searchPlaceholder="ابحث باسم الطالب، الرمز، أو رقم الجوال..."
      />
    </div>
  );
}

