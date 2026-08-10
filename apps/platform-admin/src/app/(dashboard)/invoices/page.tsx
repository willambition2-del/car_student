"use client";

import React, { useEffect,  useState } from "react";
import Link from "next/link";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlatformInvoice } from "@/mock/mockData";
import { Receipt, Eye, Printer, Download } from "lucide-react";

export default function InvoicesListPage() {

  const [data, setData] = useState<PlatformInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/invoices")
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

  const columns: Column<PlatformInvoice>[] = [
    {
      header: "رقم الفاتورة",
      accessor: (row) => (
        <span className="font-mono text-xs font-bold text-[#103B75]">{row.invoiceNumber}</span>
      ),
    },
    {
      header: "المدرسة والمباعة",
      accessor: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-[#13233A]">{row.schoolName}</span>
          <span className="text-[10px] text-[#66758A]">{row.planName}</span>
        </div>
      ),
    },
    {
      header: "المبلغ الإجمالي (شامل ضريبة 15%)",
      accessor: (row) => (
        <div className="flex flex-col font-mono text-xs" suppressHydrationWarning>
          <span className="font-bold text-[#16A461]">{row.total.toLocaleString("en-US")} ر.س</span>
          <span className="text-[10px] text-[#66758A]">الأساسي: {row.amount.toLocaleString("en-US")} + ضريبة: {row.tax.toLocaleString("en-US")}</span>
        </div>
      ),
    },
    {
      header: "تاريخ الإصدار والاستحقاق",
      accessor: (row) => (
        <div className="flex flex-col text-xs font-mono">
          <span>الإصدار: {row.issueDate}</span>
          <span className="text-[#66758A]">الاستحقاق: {row.dueDate}</span>
        </div>
      ),
    },
    {
      header: "حالة الفاتورة",
      accessor: (row) => (
        <StatusBadge variant={row.status === "مدفوعة" ? "success" : "warning"}>{row.status}</StatusBadge>
      ),
    },
    {
      header: "الإجراءات",
      accessor: (row) => (
        <Link href={`/invoices/${row.id}`}>
          <Button variant="ghost" size="sm" icon={<Eye className="w-4 h-4 text-[#1769E0]" />}>
            عرض الفاتورة الضريبية
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6 text-right">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#13233A]">سجل الفواتير الضريبية والمقبوضات (SaaS Invoices)</h1>
          <p className="text-xs text-[#66758A] mt-0.5">
            إصدار الفواتير الإلكترونية المعتمدة لمدارس المنظومة ومتابعة ضريبة القيمة المضافة 15%
          </p>
        </div>
      </div>

      <DataTable columns={columns} data={data} searchPlaceholder="ابحث برقم الفاتورة أو اسم المدرسة..." />
    </div>
  );
}
