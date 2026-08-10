"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Lock } from "lucide-react";

export default function PlatformRolesPage() {
  const router = useRouter();

  const roles = [
    {
      name: "مالك المنظومة (Super Admin)",
      description: "صلاحية سيادية كاملة على كافة المدارس، الباقات، الفواتير، وسجلات التدقيق الفني.",
      permissions: ["التحكم بالمدارس", "إصدار الفواتير", "تعديل الباقات", "الوصول لسجلات Audit Logs"],
    },
    {
      name: "مهندس دعم وتسليم المدارس",
      description: "صلاحية تهيئة بيئات المدارس ومتابعة التذاكر والدعم الفني بدون صلاحيات مالية.",
      permissions: ["تهيئة البيئات", "متابعة التذاكر", "تعديل الميزات الفردية"],
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
            <h1 className="text-xl font-bold text-[#13233A]">أدوار وصلاحيات مالك المنصة (Platform Roles)</h1>
            <p className="text-xs text-[#66758A]">مصفوفة الصلاحيات الخاصة بطاقم إدارة وتشغيل المنظومة</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {roles.map((r, idx) => (
          <Card key={idx} className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#E3EAF3] pb-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#1769E0]" />
                <h3 className="text-sm font-bold text-[#13233A]">{r.name}</h3>
              </div>
              <Button variant="ghost" size="sm">
                تعديل الصلاحيات
              </Button>
            </div>
            <p className="text-xs text-[#66758A]">{r.description}</p>
            <div className="flex flex-wrap gap-2 pt-2 text-[11px]">
              {r.permissions.map((p, pIdx) => (
                <span key={pIdx} className="px-2 py-1 bg-[#16A461]/10 text-[#16A461] rounded-md font-bold">
                  {p} ✓
                </span>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
