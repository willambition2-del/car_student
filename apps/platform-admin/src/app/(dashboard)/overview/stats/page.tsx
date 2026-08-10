"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Card, StatsCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { ArrowRight, BarChart3, PieChart, Globe } from "lucide-react";

export default function SchoolsStatsPage() {
  const router = useRouter();

  return (
    <div className="space-y-6 text-right max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" onClick={() => router.back()} icon={<ArrowRight className="w-4 h-4" />}>
            العودة
          </Button>
          <div>
            <h1 className="text-xl font-bold text-[#13233A]">إحصائيات الانتشار الجغرافي وباقات المنظومة</h1>
            <p className="text-xs text-[#66758A]">تحليل التوزيع الجغرافي للمدارس ومعدلات تجديد الاشتراكات</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="space-y-4">
          <h3 className="text-sm font-bold text-[#13233A] flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#1769E0]" /> الانتشار بحسب المدن الرئيسية
          </h3>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between border-b border-[#E3EAF3] pb-2">
              <span className="text-[#66758A]">الرياض:</span>
              <span className="font-bold text-[#103B75]">12 مدرسة (50%)</span>
            </div>
            <div className="flex justify-between border-b border-[#E3EAF3] pb-2">
              <span className="text-[#66758A]">جدة والمنطقة الغربية:</span>
              <span className="font-bold text-[#103B75]">7 مدارس (29%)</span>
            </div>
            <div className="flex justify-between border-b border-[#E3EAF3] pb-2">
              <span className="text-[#66758A]">الدمام والشرقية:</span>
              <span className="font-bold text-[#103B75]">5 مدارس (21%)</span>
            </div>
          </div>
        </Card>

        <Card className="space-y-4">
          <h3 className="text-sm font-bold text-[#13233A] flex items-center gap-2">
            <PieChart className="w-4 h-4 text-[#12AFA5]" /> توزيع المدارس بحسب باقات SaaS
          </h3>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between border-b border-[#E3EAF3] pb-2">
              <span className="text-[#66758A]">الباقة الاحترافية (Pro):</span>
              <span className="font-bold text-[#16A461]">14 مدرسة (58%)</span>
            </div>
            <div className="flex justify-between border-b border-[#E3EAF3] pb-2">
              <span className="text-[#66758A]">الباقة الأساسية (Basic):</span>
              <span className="font-bold text-[#1769E0]">6 مدارس (25%)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#66758A]">الفترة التجريبية (Trial):</span>
              <span className="font-bold text-[#F2A31B]">4 مدارس (17%)</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
