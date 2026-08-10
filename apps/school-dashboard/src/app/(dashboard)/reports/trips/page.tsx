"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { schoolReportsApi } from "@/lib/api";
import { ArrowRight, Download, FileText, RefreshCw } from "lucide-react";

export default function TripsDetailedReportPage() {
  const router = useRouter();
  const [report, setReport] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchReport = async () => {
    setIsLoading(true);
    try {
      const data = await schoolReportsApi.getTripsReport();
      if (data) {
        setReport(data);
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const reportData = report?.chartData || [
    { day: "الأحد", trips: 14, onTime: 14 },
    { day: "الإثنين", trips: 14, onTime: 13 },
    { day: "الثلاثاء", trips: 14, onTime: 14 },
    { day: "الأربعاء", trips: 14, onTime: 12 },
    { day: "الخميس", trips: 14, onTime: 14 },
  ];

  const columns: Column<any>[] = [
    {
      header: "اليوم",
      accessor: (row) => <span className="font-bold text-[#13233A]">{row.day}</span>,
    },
    {
      header: "إجمالي الرحلات المخططة",
      accessor: (row) => <span className="font-mono text-xs font-bold text-[#1769E0]">{row.trips} رحلات</span>,
    },
    {
      header: "الرحلات المنتظمة في الموعد",
      accessor: (row) => <span className="font-mono text-xs font-bold text-[#16A461]">{row.onTime} رحلة</span>,
    },
    {
      header: "نسبة الالتزام بالجدول",
      accessor: (row) => (
        <StatusBadge variant="success">
          {Math.round((row.onTime / (row.trips || 1)) * 100)}%
        </StatusBadge>
      ),
    },
  ];

  return (
    <div className="space-y-6 text-right max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" onClick={() => router.back()} icon={<ArrowRight className="w-4 h-4" />}>
            العودة
          </Button>
          <div>
            <h1 className="text-xl font-bold text-[#13233A]">تقرير انضباط ومواعيد الرحلات</h1>
            <p className="text-xs text-[#66758A]">تحليل دقيق لأوقات انطلاق الحافلات والوصول بالمدرسة</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchReport} isLoading={isLoading} icon={<RefreshCw className="w-4 h-4" />}>
            تحديث
          </Button>
          <Button variant="outline" size="sm" icon={<Download className="w-4 h-4" />}>
            تصدير Excel
          </Button>
          <Button variant="primary" size="sm" icon={<FileText className="w-4 h-4" />}>
            تصدير PDF
          </Button>
        </div>
      </div>

      <DataTable columns={columns} data={reportData} searchPlaceholder="ابحث باليوم..." />
    </div>
  );
}

