"use client";

import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Bus, DollarSign, Clock, FileText, ArrowRight, Download } from "lucide-react";

export default function ReportsHubPage() {
  const reportCards = [
    {
      title: "تقرير انضباط ومواعيد الرحلات",
      description: "تحليل دقيق لأوقات انطلاق الحافلات والوصول ونسب التأخير المروري.",
      href: "/reports/trips",
      icon: <Clock className="w-6 h-6 text-[#1769E0]" />,
    },
    {
      title: "تقرير استغلال سعة الحافلات والطلاب",
      description: "إحصائيات استيعاب المقاعد والطلاب الموزعين وغير الموزعين بالمسارات.",
      href: "/reports/buses",
      icon: <Bus className="w-6 h-6 text-[#12AFA5]" />,
    },
    {
      title: "التقرير المالي والمتحصلات",
      description: "بيانات التحصيل المالي والمبالغ المتبقية والاشتراكات المتأخرة.",
      href: "/reports/financial",
      icon: <DollarSign className="w-6 h-6 text-[#16A461]" />,
    },
  ];

  return (
    <div className="space-y-6 text-right">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#13233A]">مركز التقارير والإحصائيات والتحليلات</h1>
          <p className="text-xs text-[#66758A] mt-0.5">
            استخراج وتصدير التقارير الميدانية والمالية الشاملة لخدمة النقل المدرسي
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reportCards.map((rc, idx) => (
          <Card key={idx} className="space-y-4 hover:border-[#1769E0] transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-[#F5F8FC] flex items-center justify-center">
              {rc.icon}
            </div>
            <h3 className="text-base font-bold text-[#13233A]">{rc.title}</h3>
            <p className="text-xs text-[#66758A] leading-relaxed">{rc.description}</p>
            <div className="pt-2">
              <Link href={rc.href}>
                <Button variant="outline" size="sm" className="w-full">
                  عرض التقرير والتصدير
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

