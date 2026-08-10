"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { SelectInput } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { Settings2, ArrowRight, Save, ToggleLeft, ToggleRight } from "lucide-react";

export default function SchoolFeatureCustomizePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState("sch-102");

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push("/features");
    }, 800);
  };

  return (
    <div className="space-y-6 text-right max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" onClick={() => router.back()} icon={<ArrowRight className="w-4 h-4" />}>
            العودة
          </Button>
          <div>
            <h1 className="text-xl font-bold text-[#13233A]">تخصيص استثناءات لمدرسة محددة</h1>
            <p className="text-xs text-[#66758A]">منح أو تقييد ميزات خاصة لخارج باقة الاشتراك الرسمية</p>
          </div>
        </div>
        <Button variant="primary" size="sm" onClick={handleSave} isLoading={isLoading} icon={<Save className="w-4 h-4" />}>
          حفظ الاستثناءات
        </Button>
      </div>

      <Card className="space-y-4">
        <SelectInput
          label="اختر المدرسة المعنية بالاستثناء"
          options={[
            { label: "مدارس الإبداع الحديثة (تجربة مجانية)", value: "sch-102" },
            { label: "مدارس المستقبل الأهلية (الاحترافية)", value: "sch-101" },
          ]}
          value={selectedSchool}
          onChange={(e) => setSelectedSchool(e.target.value)}
        />

        <div className="space-y-3 pt-2">
          <div className="p-4 bg-[#F5F8FC] rounded-xl flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-[#13233A] block">تفعيل تتبع الـ GPS التجريبي</span>
              <span className="text-[11px] text-[#66758A]">منح ميزة التتبع المباشر لهذه المدرسة خلال الفترة التجريبية</span>
            </div>
            <ToggleRight className="w-8 h-8 text-[#1769E0] cursor-pointer" />
          </div>
        </div>
      </Card>
    </div>
  );
}
