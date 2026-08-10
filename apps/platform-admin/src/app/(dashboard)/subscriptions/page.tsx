"use client";

import React, { useEffect,  useState } from "react";
import Link from "next/link";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Subscription } from "@/mock/mockData";
import { CreditCard, Eye, RefreshCw, Calendar } from "lucide-react";

export default function SubscriptionsListPage() {

  const [data, setData] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/subscriptions")
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

  const columns: Column<Subscription>[] = [
    {
      header: "المدرسة المشتركة",
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#1769E0]/10 text-[#1769E0] flex items-center justify-center font-bold">
            <CreditCard className="w-4 h-4" />
          </div>
          <span className="font-bold text-[#13233A]">{row.schoolName}</span>
        </div>
      ),
    },
    {
      header: "الباقة المفتوحة",
      accessor: (row) => <StatusBadge variant="info">{row.planName}</StatusBadge>,
    },
    {
      header: "تاريخ البدء والانتهاء",
      accessor: (row) => (
        <div className="flex flex-col text-xs font-mono">
          <span>البدء: {row.startDate}</span>
          <span className="text-[#16A461] font-bold">الانتهاء: {row.endDate}</span>
        </div>
      ),
    },
    {
      header: "المبلغ السنوي المقبوض",
      accessor: (row) => (
        <span className="font-mono text-xs font-bold text-[#103B75]" suppressHydrationWarning>{row.amount.toLocaleString("en-US")} ر.س</span>
      ),
    },
    {
      header: "التجديد التلقائي",
      accessor: (row) => (
        <StatusBadge variant={row.autoRenew ? "success" : "neutral"}>
          {row.autoRenew ? "مفعل" : "معطل"}
        </StatusBadge>
      ),
    },
    {
      header: "الحالة",
      accessor: (row) => (
        <StatusBadge variant={row.status === "نشط" ? "success" : "warning"}>{row.status}</StatusBadge>
      ),
    },
    {
      header: "الإجراءات",
      accessor: (row) => (
        <Link href={`/subscriptions/${row.id}`}>
          <Button variant="ghost" size="sm" icon={<Eye className="w-4 h-4 text-[#1769E0]" />}>
            تفاصيل الاشتراك
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6 text-right">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#13233A]">سجل اشتراكات المدارس (SaaS Subscriptions)</h1>
          <p className="text-xs text-[#66758A] mt-0.5">
            متابعة تواريخ انتهاء الاشتراك والتجديد التلقائي وحالات التحصيل السنوي
          </p>
        </div>
      </div>

      <DataTable columns={columns} data={data} searchPlaceholder="ابحث باسم المدرسة أو الباقة..." />
    </div>
  );
}
