"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { TextInput } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PackageCheck, ArrowRight, Save, Check } from "lucide-react";

export default function NewPlanPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("المؤسسية (Enterprise)");
  const [priceMonthly, setPriceMonthly] = useState("6500");
  const [priceAnnual, setPriceAnnual] = useState("65000");
  const [maxStudents, setMaxStudents] = useState("1500");
  const [maxBuses, setMaxBuses] = useState("50");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      router.push("/plans");
    }, 800);
  };

  return (
    <div className="space-y-6 text-right max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#13233A]">منشئ ومحرر باقات التسعير</h1>
          <p className="text-xs text-[#66758A] mt-0.5">تحديد الرسوم الشهرية والسنوية والقيود التشغيلية للباقة</p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => router.back()} icon={<ArrowRight className="w-4 h-4" />}>
          العودة
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="space-y-4">
          <div className="flex items-center gap-2 border-b border-[#E3EAF3] pb-3 font-bold text-sm text-[#103B75]">
            <PackageCheck className="w-4 h-4 text-[#1769E0]" /> بيانات الباقة والتسعير
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              label="اسم الباقة"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <TextInput
              label="السعر الشهري (ر.س)"
              value={priceMonthly}
              onChange={(e) => setPriceMonthly(e.target.value)}
              required
            />
            <TextInput
              label="السعر السنوي (ر.س)"
              value={priceAnnual}
              onChange={(e) => setPriceAnnual(e.target.value)}
              required
            />
            <TextInput
              label="الحد الأقصى للطلاب"
              value={maxStudents}
              onChange={(e) => setMaxStudents(e.target.value)}
              required
            />
            <TextInput
              label="الحد الأقصى للحافلات"
              value={maxBuses}
              onChange={(e) => setMaxBuses(e.target.value)}
              required
            />
          </div>
        </Card>

        <div className="flex items-center justify-end gap-3">
          <Button variant="secondary" onClick={() => router.back()}>
            إلغاء
          </Button>
          <Button type="submit" variant="primary" icon={<Save className="w-4 h-4" />} isLoading={isLoading}>
            حفظ واعتماد الباقة
          </Button>
        </div>
      </form>
    </div>
  );
}
