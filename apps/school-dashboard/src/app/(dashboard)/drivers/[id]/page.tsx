"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserCog, Phone, ArrowRight, ShieldCheck, AlertTriangle, Bus as BusIcon } from "lucide-react";

export default function DriverDetailsPage() {
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
            <h1 className="text-xl font-bold text-[#13233A]">ملف السائق: إبراهيم السعيد</h1>
            <p className="text-xs text-[#66758A]">سجل السلامة المرورية، الوثائق، والبلاغات الطارئة</p>
          </div>
        </div>
      </div>

      <Card className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#103B75]/10 text-[#103B75] flex items-center justify-center font-bold text-xl shrink-0">
            <UserCog className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h2 className="text-base font-bold text-[#13233A]">إبراهيم السعيد</h2>
              <StatusBadge variant="success">نشط بالخدمة</StatusBadge>
            </div>
            <div className="text-xs text-[#66758A] flex flex-wrap items-center gap-4">
              <span className="font-mono">الجوال: 0504433221</span>
              <span className="font-mono">رخصة القيادة: DL-9081234</span>
            </div>
          </div>
        </div>

        <Button variant="primary" size="sm" icon={<Phone className="w-4 h-4" />}>
          اتصال بالسائق
        </Button>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="space-y-3">
          <h3 className="text-sm font-bold text-[#13233A] flex items-center gap-2">
            <BusIcon className="w-4 h-4 text-[#1769E0]" /> الحافلة والمسار الحالي
          </h3>
          <div className="text-xs space-y-2 text-[#13233A]">
            <div className="flex justify-between border-b border-[#E3EAF3] pb-1.5">
              <span className="text-[#66758A]">الحافلة:</span>
              <span className="font-bold text-[#1769E0]">حافلة رقم 205</span>
            </div>
            <div className="flex justify-between border-b border-[#E3EAF3] pb-1.5">
              <span className="text-[#66758A]">المسار:</span>
              <span>مسار حي الياسمين (أ)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#66758A]">المشرفة المرافقة:</span>
              <span>أمينة الحامد</span>
            </div>
          </div>
        </Card>

        <Card className="space-y-3">
          <h3 className="text-sm font-bold text-[#13233A] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#16A461]" /> حالة الفحوصات والوثائق
          </h3>
          <div className="text-xs space-y-2 text-[#13233A]">
            <div className="flex justify-between border-b border-[#E3EAF3] pb-1.5">
              <span className="text-[#66758A]">صلاحية رخصة القيادة:</span>
              <span className="text-[#16A461] font-bold">سارية حتى 2028-05-12</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#66758A]">السجل الجنائي والسلامة:</span>
              <span className="text-[#16A461] font-bold">معتمد وخالٍ من المخالفات</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
