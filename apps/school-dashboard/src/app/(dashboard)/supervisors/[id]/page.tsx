"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Phone, ArrowRight, Bus as BusIcon, RefreshCw, CheckCircle2 } from "lucide-react";

export default function SupervisorDetailsPage() {
  const params = useParams();
  const router = useRouter();

  return (
    <div className="space-y-6 text-right max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" onClick={() => router.back()} icon={<ArrowRight className="w-4 h-4" />}>
            العودة
          </Button>
          <div>
            <h1 className="text-xl font-bold text-[#13233A]">ملف المشرفة: أمينة الحامد</h1>
            <p className="text-xs text-[#66758A]">بيانات التكليف، حالة تطبيق المشرفة الميداني، وسجل العمليات اليومية</p>
          </div>
        </div>
      </div>

      <Card className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#12AFA5]/10 text-[#12AFA5] flex items-center justify-center font-bold text-xl shrink-0">
            <Shield className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h2 className="text-base font-bold text-[#13233A]">أمينة الحامد</h2>
              <StatusBadge variant="success">نشطة بالرحلة الحالية</StatusBadge>
            </div>
            <div className="text-xs text-[#66758A] flex items-center gap-4">
              <span className="font-mono">الجوال: 0551122334</span>
              <span>الحافلة المخصصة: حافلة 205</span>
            </div>
          </div>
        </div>

        <Button variant="primary" size="sm" icon={<Phone className="w-4 h-4" />}>
          اتصال بالمشرفة
        </Button>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="space-y-3">
          <h3 className="text-sm font-bold text-[#13233A] flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-[#1769E0]" /> حالة المزامنة الميدانية والتطبيق
          </h3>
          <div className="text-xs space-y-2 text-[#13233A]">
            <div className="flex justify-between border-b border-[#E3EAF3] pb-1.5">
              <span className="text-[#66758A]">حالة الاتصال بالسيرفر:</span>
              <span className="text-[#16A461] font-bold">متصل ومباشر (Online)</span>
            </div>
            <div className="flex justify-between border-b border-[#E3EAF3] pb-1.5">
              <span className="text-[#66758A]">العمليات غير المتزامنة المعلقة:</span>
              <span className="font-bold text-[#103B75]">0 عمليات</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#66758A]">إصدار تطبيق المشرفة:</span>
              <span className="font-mono text-[#66758A]">v1.0.4 (Flutter Mobile)</span>
            </div>
          </div>
        </Card>

        <Card className="space-y-3">
          <h3 className="text-sm font-bold text-[#13233A] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#16A461]" /> ملخص رحلة اليوم
          </h3>
          <div className="text-xs space-y-2 text-[#13233A]">
            <div className="flex justify-between border-b border-[#E3EAF3] pb-1.5">
              <span className="text-[#66758A]">رحلة الصباح:</span>
              <span className="text-[#16A461] font-bold">مكتملة - صعد 24/26 طالب</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#66758A]">رحلة العودة:</span>
              <span className="text-[#1769E0] font-bold">مجدولة - الساعة 01:15 م</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
