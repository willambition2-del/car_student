"use client";

import { Plan } from "@/mock/mockData";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { PackageCheck, Plus, Check, Edit, Users, Bus as BusIcon } from "lucide-react";

export default function PlansListPage() {

  const [data, setData] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/plans")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch data");
        return res.json();
      })
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>جاري التحميل...</div>;
  if (error) return <div className="text-red-500">حدث خطأ: {error}</div>;

  return (
    <div className="space-y-6 text-right max-w-5xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#13233A]">باقات اشتراك المنظومة (SaaS Pricing Tiers)</h1>
          <p className="text-xs text-[#66758A] mt-0.5">
            توصيف وتعديل خطط التسعير والحدود الاستيعابية للمدارس والميزات المرفقة
          </p>
        </div>
        <Link href="/plans/new">
          <Button variant="primary" icon={<Plus className="w-4 h-4" />}>
            إنشاء باقة جديدة
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.map((plan) => (
          <Card key={plan.id} className="space-y-4 border-2 relative overflow-hidden">
            {plan.isPopular && (
              <div className="bg-[#1769E0] text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl absolute top-0 left-0">
                الأكثر مبيعاً
              </div>
            )}
            <div className="flex items-center justify-between border-b border-[#E3EAF3] pb-3">
              <div className="flex items-center gap-2">
                <PackageCheck className="w-5 h-5 text-[#1769E0]" />
                <h3 className="text-base font-bold text-[#13233A]">{plan.name}</h3>
              </div>
              <StatusBadge variant="info">{plan.activeSubscribersCount} مدرسة مشتركة</StatusBadge>
            </div>

            <div className="flex items-baseline gap-2 font-mono" suppressHydrationWarning>
              <span className="text-2xl font-bold text-[#103B75]">{plan.priceMonthly.toLocaleString("en-US")} ر.س</span>
              <span className="text-xs text-[#66758A]">/ شهرياً ({plan.priceAnnual.toLocaleString("en-US")} ر.س سنوياً)</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs p-3 bg-[#F5F8FC] rounded-xl">
              <div className="flex items-center gap-1.5 text-[#13233A]">
                <Users className="w-4 h-4 text-[#1769E0]" />
                <span>الحد الأقصى للطلاب: <strong>{plan.maxStudents} طالب</strong></span>
              </div>
              <div className="flex items-center gap-1.5 text-[#13233A]">
                <BusIcon className="w-4 h-4 text-[#12AFA5]" />
                <span>الحافلات: <strong>{plan.maxBuses} حافلة</strong></span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <span className="font-bold text-[#13233A] block">الميزات والخصائص المضمنة:</span>
              {plan.features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2 text-[#66758A]">
                  <Check className="w-4 h-4 text-[#16A461] shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <Link href="/plans/new">
                <Button variant="outline" size="sm" className="w-full" icon={<Edit className="w-4 h-4" />}>
                  تعديل خطة التسعير والحدود
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
