"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AuditLog } from "@/mock/mockData";
import { History, Eye, ShieldAlert } from "lucide-react";

export default function AuditLogListPage() {

  const [data, setData] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/audit")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch data");
        return res.json();
      })
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>جاري التحميل...</div>;
  if (error) return <div className="text-red-500">حدث خطأ: {error}</div>;

  const columns: Column<AuditLog>[] = [
    {
      header: "تاريخ ووقت الإجراء",
      accessor: (row) => <span className="font-mono text-xs font-bold text-[#13233A]">{row.timestamp}</span>,
    },
    {
      header: "الإجراء المنفذ",
      accessor: (row) => <span className="font-bold text-[#1769E0] text-xs">{row.action}</span>,
    },
    {
      header: "المستخدم المنفذ",
      accessor: (row) => <span className="text-xs text-[#103B75]">{row.user}</span>,
    },
    {
      header: "المدرسة المتأثرة",
      accessor: (row) => <span className="text-xs text-[#66758A]">{row.schoolName || "كل المنظومة"}</span>,
    },
    {
      header: "عنوان IP الجهاز",
      accessor: (row) => <span className="font-mono text-xs text-[#66758A]">{row.ipAddress}</span>,
    },
    {
      header: "الإجراءات",
      accessor: (row) => (
        <Link href={`/audit/${row.id}`}>
          <Button variant="ghost" size="sm" icon={<Eye className="w-4 h-4 text-[#1769E0]" />}>
            تفاصيل الأثر الأمني
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6 text-right">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#13233A]">سجل التغييرات والتدقيق الأمني (System Audit Log)</h1>
          <p className="text-xs text-[#66758A] mt-0.5">
            توثيق كافة التعديلات والتغييرات السيادية المنفذة على البيئات والباقات
          </p>
        </div>
      </div>

      <DataTable columns={columns} data={data} searchPlaceholder="ابحث بالإجراء، المستخدم، أو الـ IP..." />
    </div>
  );
}
