"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { schoolBusesApi } from "@/lib/api";
import { ArrowRight, Download, Bus as BusIcon, Users } from "lucide-react";

export default function BusesCapacityReportPage() {
  const router = useRouter();
  const [buses, setBuses] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchBuses = async () => {
      try {
        setLoading(true);
        const res = await schoolBusesApi.getBuses(1, 100);
        setBuses(res.items || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchBuses();
  }, []);

  const columns: Column<any>[] = [
    {
      header: "رقم الحافلة والطراز",
      accessor: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-[#13233A]">حافلة {row.number}</span>
          <span className="text-[10px] text-[#66758A]">{row.type}</span>
        </div>
      ),
    },
    {
      header: "سعة المقاعد الكلية",
      accessor: (row) => <span className="font-mono text-xs font-bold text-[#13233A]">{row.capacity} راكب</span>,
    },
    {
      header: "الطلاب الموزعون حالياً",
      accessor: (row) => (
        <span className="font-mono text-xs font-bold text-[#1769E0]">{row.assignedStudentsCount} طالب</span>
      ),
    },
    {
      header: "المقاعد الشاغرة المتبقية",
      accessor: (row) => (
        <span className="font-mono text-xs font-bold text-[#16A461]">{row.capacity - row.assignedStudentsCount} مقعد</span>
      ),
    },
    {
      header: "نسبة استغلال السعة",
      accessor: (row) => {
        const pct = Math.round((row.assignedStudentsCount / row.capacity) * 100);
        return (
          <StatusBadge variant={pct >= 90 ? "warning" : "success"}>
            {pct}% مستغلة
          </StatusBadge>
        );
      },
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
            <h1 className="text-xl font-bold text-[#13233A]">تقرير استغلال سعة الحافلات</h1>
            <p className="text-xs text-[#66758A]">تحليل توزيع الطلاب على الأسطول وإبراز المقاعد المتاحة</p>
          </div>
        </div>
        <Button variant="outline" size="sm" icon={<Download className="w-4 h-4" />}>
          تصدير التقرير
        </Button>
      </div>

      {loading ? (
        <div className="p-8 text-center text-[#66758A]">جاري التحميل...</div>
      ) : (
        <DataTable columns={columns} data={buses} searchPlaceholder="ابحث برقم الحافلة..." />
      )}
    </div>
  );
}

