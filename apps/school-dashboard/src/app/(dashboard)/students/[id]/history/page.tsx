"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { schoolStudentsApi } from "@/lib/api";
import { Card, StatsCard } from "@/components/ui/card";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, CheckCircle2, XCircle, Clock } from "lucide-react";

interface HistoryRecord {
  id: string;
  date: string;
  tripType: "رحلة الصباح" | "رحلة العودة";
  status: "صعد" | "وصل" | "غائب" | "نزل";
  boardTime: string;
  arrivalTime: string;
  supervisorName: string;
  stopName: string;
}

export default function StudentTripHistoryPage() {
  const params = useParams();
  const router = useRouter();

  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const id = Array.isArray(params.id) ? params.id[0] : params.id;
        if (!id) return;
        const data = await schoolStudentsApi.getStudent(id);
        setStudent(data);
      } catch (err) {
        setError("فشل جلب بيانات الطالب");
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, [params.id]);

  if (loading) return <div className="p-8 text-center">جاري التحميل...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!student) return <div className="p-8 text-center">لم يتم العثور على الطالب</div>;

  const historyData: HistoryRecord[] = [
    {
      id: "rec-1",
      date: "2026-08-01",
      tripType: "رحلة الصباح",
      status: "صعد",
      boardTime: "06:48 ص",
      arrivalTime: "07:22 ص",
      supervisorName: "أمينة الحامد",
      stopName: "حي الياسمين - شارع 14",
    },
    {
      id: "rec-2",
      date: "2026-07-31",
      tripType: "رحلة العودة",
      status: "نزل",
      boardTime: "01:15 م",
      arrivalTime: "01:45 م",
      supervisorName: "أمينة الحامد",
      stopName: "حي الياسمين - شارع 14",
    },
    {
      id: "rec-3",
      date: "2026-07-31",
      tripType: "رحلة الصباح",
      status: "صعد",
      boardTime: "06:50 ص",
      arrivalTime: "07:25 ص",
      supervisorName: "أمينة الحامد",
      stopName: "حي الياسمين - شارع 14",
    },
    {
      id: "rec-4",
      date: "2026-07-30",
      tripType: "رحلة الصباح",
      status: "غائب",
      boardTime: "-",
      arrivalTime: "-",
      supervisorName: "أمينة الحامد",
      stopName: "حي الياسمين - شارع 14",
    },
  ];

  const columns: Column<HistoryRecord>[] = [
    {
      header: "التاريخ",
      accessor: (row) => <span className="font-bold text-[#13233A] font-mono">{row.date}</span>,
    },
    {
      header: "نوع الرحلة",
      accessor: "tripType",
    },
    {
      header: "حالة الطالب",
      accessor: (row) => (
        <StatusBadge
          variant={row.status === "غائب" ? "error" : row.status === "صعد" || row.status === "نزل" ? "success" : "info"}
        >
          {row.status}
        </StatusBadge>
      ),
    },
    {
      header: "وقت الصعود",
      accessor: (row) => <span className="font-mono text-xs">{row.boardTime}</span>,
    },
    {
      header: "وقت الوصول للمدرسة",
      accessor: (row) => <span className="font-mono text-xs">{row.arrivalTime}</span>,
    },
    {
      header: "المشرفة المرافقة",
      accessor: "supervisorName",
    },
    {
      header: "المحطة المسجلة",
      accessor: "stopName",
    },
  ];

  return (
    <div className="space-y-6 text-right max-w-5xl mx-auto">
      {/* Header Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" onClick={() => router.back()} icon={<ArrowRight className="w-4 h-4" />}>
            العودة لبيانات الطالب
          </Button>
          <div>
            <h1 className="text-xl font-bold text-[#13233A]">سجل رحلات الطالب: {student.name}</h1>
            <p className="text-xs text-[#66758A]">
              سجل تفصيلي لأوقات الصعود والنزول ونسبة الحضور اليومية في الحافلة
            </p>
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard
          title="إجمالي الرحلات المسجلة"
          value="48 رحلة"
          icon={<Clock className="w-5 h-5" />}
          color="#1769E0"
        />
        <StatsCard
          title="نسبة الانضباط بالصعود"
          value="96%"
          icon={<CheckCircle2 className="w-5 h-5" />}
          color="#16A461"
        />
        <StatsCard
          title="عدد أيام الغياب"
          value="2 يوم"
          icon={<XCircle className="w-5 h-5" />}
          color="#E5484D"
        />
      </div>

      {/* History Data Table */}
      <DataTable columns={columns} data={historyData} searchPlaceholder="ابحث بالتاريخ أو نوع الرحلة..." />
    </div>
  );
}
