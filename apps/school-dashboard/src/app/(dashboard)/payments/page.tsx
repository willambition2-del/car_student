"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/ui/card";
import { schoolFinancialApi } from "@/lib/api";
import { CreditCard, Receipt, Plus, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";

export default function PaymentsListPage() {
  const [fees, setFees] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchFees = async () => {
    setIsLoading(true);
    try {
      const data = await schoolFinancialApi.getFees();
      if (data && data.items) {
        setFees(data.items);
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFees();
  }, []);

  const columns: Column<any>[] = [
    {
      header: "رقم الرسوم",
      accessor: (row) => <span className="font-mono text-xs font-bold text-[#103B75]">{row.id}</span>,
    },
    {
      header: "اسم الطالب والمرحلة",
      accessor: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-[#13233A]">{row.studentName}</span>
          <span className="text-[10px] text-[#66758A]">{row.grade} ({row.feeType})</span>
        </div>
      ),
    },
    {
      header: "المبلغ المستحق والمدفوع",
      accessor: (row) => (
        <div className="flex flex-col font-mono text-xs" suppressHydrationWarning>
          <span className="font-bold text-[#16A461]">{row.paidAmount.toLocaleString("en-US")} ر.س</span>
          {row.remainingAmount > 0 && (
            <span className="text-[10px] text-[#E5484D]">متبقي {row.remainingAmount.toLocaleString("en-US")} ر.س</span>
          )}
        </div>
      ),
    },
    {
      header: "تاريخ الاستحقاق",
      accessor: (row) => (
        <span className="font-mono text-xs text-[#66758A]">
          {row.dueDate ? new Date(row.dueDate).toLocaleDateString('ar-SA') : 'مستحق'}
        </span>
      ),
    },
    {
      header: "الحالة المالية",
      accessor: (row) => (
        <StatusBadge variant={row.status === "مكتمل" ? "success" : row.status === "جزئي" ? "warning" : "error"}>
          {row.status}
        </StatusBadge>
      ),
    },
    {
      header: "الإجراءات",
      accessor: (row) => (
        <Link href="/payments/receipts">
          <Button variant="ghost" size="sm" icon={<Receipt className="w-4 h-4 text-[#1769E0]" />}>
            عرض السندات
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6 text-right">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#13233A]">رسوم النقل المدرسي والمقبوضات</h1>
          <p className="text-xs text-[#66758A] mt-0.5">
            إدارة اشتراكات النقل، تسجيل التحصيلات البنكية، وإصدار سندات القبض المعتمدة
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchFees} isLoading={isLoading} icon={<RefreshCw className="w-4 h-4" />}>
            تحديث
          </Button>
          <Link href="/payments/receipts">
            <Button variant="primary" icon={<Plus className="w-4 h-4" />}>
              تسجيل دفعة وسند جديد
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard title="إجمالي التحصيلات المدفوعة" value="1,680,000 ر.س" icon={<CheckCircle2 className="w-5 h-5" />} color="#16A461" />
        <StatsCard title="الرسوم المستحقة المتبقية" value="120,000 ر.س" icon={<CreditCard className="w-5 h-5" />} color="#F2A31B" />
        <StatsCard title="الاشتراكات المتأخرة" value="14 اشتراكًا" icon={<AlertCircle className="w-5 h-5" />} color="#E5484D" />
      </div>

      <DataTable columns={columns} data={fees} searchPlaceholder="ابحث برقم الرسوم، الطالب، أو الفئة..." />
    </div>
  );
}

