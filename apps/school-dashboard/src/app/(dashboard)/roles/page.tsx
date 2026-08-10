"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Lock, Check, X, Shield } from "lucide-react";

export default function RolesPermissionsPage() {
  const router = useRouter();

  const roles = [
    {
      name: "مدير النقل المدرسي",
      description: "صلاحية كاملة لجميع وظائف النقل والإعدادات وتوزيع الحافلات والتقارير.",
      permissions: { view: true, create: true, edit: true, delete: true, financial: true, dispatch: true },
    },
    {
      name: "موظف إدخال واستقبال",
      description: "صلاحية تسجيل الطلاب وتحديث العناوين وإخطارات الغياب بدون صلاحيات مالية.",
      permissions: { view: true, create: true, edit: true, delete: false, financial: false, dispatch: false },
    },
    {
      name: "المحاسب المالي",
      description: "وصول خاص لإصدار سندات القبض والتقرير المالي والاشتراكات.",
      permissions: { view: true, create: false, edit: false, delete: false, financial: true, dispatch: false },
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
            <h1 className="text-xl font-bold text-[#13233A]">مصفوفة الأدوار والصلاحيات المدرسية</h1>
            <p className="text-xs text-[#66758A]">تخصيص مستويات الوصول والوظائف لكل دور وظيفي بالمنظومة</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {roles.map((r, idx) => (
          <Card key={idx} className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#E3EAF3] pb-2">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#1769E0]" />
                <h3 className="text-sm font-bold text-[#13233A]">{r.name}</h3>
              </div>
              <Button variant="ghost" size="sm">
                تعديل الصلاحيات
              </Button>
            </div>
            <p className="text-xs text-[#66758A]">{r.description}</p>
            <div className="flex flex-wrap gap-2 pt-2 text-[11px]">
              <span className={`px-2 py-1 rounded-md font-bold ${r.permissions.view ? "bg-[#16A461]/10 text-[#16A461]" : "bg-[#E3EAF3] text-[#66758A]"}`}>
                عرض البيانات {r.permissions.view ? "✓" : "✕"}
              </span>
              <span className={`px-2 py-1 rounded-md font-bold ${r.permissions.create ? "bg-[#16A461]/10 text-[#16A461]" : "bg-[#E3EAF3] text-[#66758A]"}`}>
                إضافة وسجلات جديدة {r.permissions.create ? "✓" : "✕"}
              </span>
              <span className={`px-2 py-1 rounded-md font-bold ${r.permissions.edit ? "bg-[#16A461]/10 text-[#16A461]" : "bg-[#E3EAF3] text-[#66758A]"}`}>
                التعديل والتحرير {r.permissions.edit ? "✓" : "✕"}
              </span>
              <span className={`px-2 py-1 rounded-md font-bold ${r.permissions.financial ? "bg-[#16A461]/10 text-[#16A461]" : "bg-[#E3EAF3] text-[#66758A]"}`}>
                الوصول للتقارير المالية {r.permissions.financial ? "✓" : "✕"}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

