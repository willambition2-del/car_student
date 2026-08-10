"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HelpCircle, Eye, MessageSquare } from "lucide-react";

interface TicketItem {
  id: string;
  ticketNumber: string;
  schoolName: string;
  subject: string;
  category: string;
  priority: "عالية" | "متوسطة" | "عادية";
  status: "قيد المعالجة" | "مفتوحة" | "مغلقة";
  createdAt: string;
}

export default function PlatformSupportListPage() {
  const tickets: TicketItem[] = [
    {
      id: "tkt-501",
      ticketNumber: "TKT-2026-0089",
      schoolName: "مدارس المستقبل الأهلية",
      subject: "طلب إضافة 5 حافلات جديدة فوق سعة الباقة الحالية",
      category: "ترقية حدود الباقة",
      priority: "عالية",
      status: "قيد المعالجة",
      createdAt: "2026-08-01 09:12",
    },
    {
      id: "tkt-502",
      ticketNumber: "TKT-2026-0074",
      schoolName: "مدارس الإبداع الحديثة",
      subject: "استفسار بخصوص ضبط إشعارات تطبيق أجهزة الآيفون",
      category: "دعم فني وتطبيقات",
      priority: "عادية",
      status: "مفتوحة",
      createdAt: "2026-07-30 14:20",
    },
  ];

  const columns: Column<TicketItem>[] = [
    {
      header: "رقم التذكرة",
      accessor: (row) => <span className="font-mono text-xs font-bold text-[#103B75]">{row.ticketNumber}</span>,
    },
    {
      header: "المدرسة المرفوعة منها",
      accessor: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-[#13233A]">{row.schoolName}</span>
          <span className="text-[10px] text-[#66758A]">{row.category}</span>
        </div>
      ),
    },
    {
      header: "موضوع التذكرة",
      accessor: (row) => <span className="font-bold text-[#1769E0] text-xs">{row.subject}</span>,
    },
    {
      header: "الأولوية",
      accessor: (row) => (
        <StatusBadge variant={row.priority === "عالية" ? "error" : "info"}>{row.priority}</StatusBadge>
      ),
    },
    {
      header: "الحالة",
      accessor: (row) => (
        <StatusBadge variant={row.status === "مغلقة" ? "success" : "warning"}>{row.status}</StatusBadge>
      ),
    },
    {
      header: "الإجراءات",
      accessor: (row) => (
        <Link href={`/support/${row.id}`}>
          <Button variant="ghost" size="sm" icon={<Eye className="w-4 h-4 text-[#1769E0]" />}>
            متابعة الردود
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6 text-right">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#13233A]">مركز تذاكر الدعم الفني للمدارس</h1>
          <p className="text-xs text-[#66758A] mt-0.5">استقبال واستجابة طلبات الدعم المرفوعة من مدراء المدارس</p>
        </div>
      </div>

      <DataTable columns={columns} data={tickets} searchPlaceholder="ابحث برقم التذكرة أو اسم المدرسة..." />
    </div>
  );
}
