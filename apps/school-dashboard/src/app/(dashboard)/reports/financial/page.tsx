"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Card, StatsCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Download, DollarSign, CreditCard, CheckCircle2 } from "lucide-react";

export default function FinancialReportPage() {
  const router = useRouter();

  return (
    <div className="space-y-6 text-right max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" onClick={() => router.back()} icon={<ArrowRight className="w-4 h-4" />}>
            العودة
          </Button>
          <div>
            <h1 className="text-xl font-bold text-[#13233A]">التقرير المالي والمتحصلات</h1>
            <p className="text-xs text-[#66758A]">كشف حساب الاشتراكات والرسوم المقبوضة والمتبقية</p>
          </div>
        </div>
        <Button variant="outline" size="sm" icon={<Download className="w-4 h-4" />}>
          تصدير التقرير المالي
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard title="إجمالي المستهدف" value="1,800,000 ر.س" icon={<DollarSign className="w-5 h-5" />} color="#1769E0" />
        <StatsCard title="المبالغ المحصلة" value="1,680,000 ر.س" icon={<CheckCircle2 className="w-5 h-5" />} color="#16A461" />
        <StatsCard title="المبالغ المتأخرة" value="120,000 ر.س" icon={<CreditCard className="w-5 h-5" />} color="#E5484D" />
      </div>

      <Card className="space-y-4">
        <h3 className="text-sm font-bold text-[#13233A]">توزيع وسائل التسديد المتبعة</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-[#F5F8FC] rounded-xl space-y-1">
            <span className="text-[#66758A]">بطاقة مدى / ائتمان:</span>
            <span className="font-bold text-sm block font-mono text-[#1769E0]">68% (1,142,400 ر.س)</span>
          </div>
          <div className="p-4 bg-[#F5F8FC] rounded-xl space-y-1">
            <span className="text-[#66758A]">تحويل بنكي مباشر:</span>
            <span className="font-bold text-sm block font-mono text-[#103B75]">24% (403,200 ر.س)</span>
          </div>
          <div className="p-4 bg-[#F5F8FC] rounded-xl space-y-1">
            <span className="text-[#66758A]">تحصيل نقدي:</span>
            <span className="font-bold text-sm block font-mono text-[#12AFA5]">8% (134,400 ر.س)</span>
          </div>
        </div>
      </Card>
    </div>
  );
}

