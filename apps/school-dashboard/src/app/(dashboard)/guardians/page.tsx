"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { schoolGuardiansApi } from "@/lib/api";
import { Eye, Phone, Plus, Mail, RefreshCw } from "lucide-react";

export default function GuardiansListPage() {
  const [guardians, setGuardians] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchGuardians = async () => {
    setIsLoading(true);
    try {
      const data = await schoolGuardiansApi.getGuardians();
      if (data && data.items && data.items.length > 0) {
        setGuardians(data.items);
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGuardians();
  }, []);

  const columns: Column<any>[] = [
    {
      header: "اسم ولي الأمر",
      accessor: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-[#13233A]">{row.fullName || row.name}</span>
          <span className="text-[10px] text-[#66758A] flex items-center gap-1 font-mono">
            <Mail className="w-3 h-3 text-[#1769E0]" /> {row.email || 'غير مدخل'}
          </span>
        </div>
      ),
    },
    {
      header: "رقم الجوال",
      accessor: (row) => <span className="font-mono text-xs font-bold text-[#103B75]">{row.phone}</span>,
    },
    {
      header: "الأبناء المسجلون",
      accessor: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-[#1769E0]">{row.studentsCount || 0} أبناء</span>
          <span className="text-[10px] text-[#66758A]">{row.studentsNames || 'غير محدد'}</span>
        </div>
      ),
    },
    {
      header: "تطبيق ولي الأمر",
      accessor: (row) => <StatusBadge variant="success">{row.appAccessStatus || "مُفعّل"}</StatusBadge>,
    },
    {
      header: "الإجراءات",
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <Link href={`/guardians/${row.id}`}>
            <Button variant="ghost" size="sm" icon={<Eye className="w-4 h-4 text-[#1769E0]" />}>
              ملف الحساب
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
          <h1 className="text-xl font-bold text-[#13233A]">سجل أولياء الأمور</h1>
          <p className="text-xs text-[#66758A] mt-0.5">
            إدارة حسابات أولياء الأمور المعتمدة وربط الأبناء وعرض المدفوعات والطلبات
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchGuardians} isLoading={isLoading} icon={<RefreshCw className="w-4 h-4" />}>
            تحديث
          </Button>
          <Button variant="primary" icon={<Plus className="w-4 h-4" />}>
            ربط ولي أمر جديد
          </Button>
        </div>
      </div>

      <DataTable columns={columns} data={guardians} searchPlaceholder="ابحث باسم ولي الأمر، الجوال، أو البريد..." />
    </div>
  );
}

