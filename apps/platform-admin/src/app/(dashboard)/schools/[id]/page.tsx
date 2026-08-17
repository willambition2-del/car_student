"use client";

import { SchoolTenant } from "@/mock/mockData";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { Card, StatsCard } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { School, Edit, ArrowRight, ShieldAlert, KeyRound, Globe, Users, Bus as BusIcon, CreditCard } from "lucide-react";
import { platformSchoolsApi } from "@/lib/api";

export default function SchoolDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const [school, setSchool] = useState<SchoolTenant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    platformSchoolsApi.getSchool(params.id as string)
      .then((data) => {
        setSchool(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [params.id]);

  if (loading) return <div>جاري التحميل...</div>;
  if (error) return <div className="text-red-500">حدث خطأ: {error}</div>;
  if (!school) return <div>لم يتم العثور على البيانات</div>;

  return (
    <div className="space-y-6 text-right max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" onClick={() => router.back()} icon={<ArrowRight className="w-4 h-4" />}>
            العودة
          </Button>
          <div>
            <h1 className="text-xl font-bold text-[#13233A]">{school.name}</h1>
            <p className="text-xs text-[#66758A]">رمز التعريف: {school.code} | النطاق الفرعي: {school.code.toLowerCase()}.schooltransport-saas.com</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/schools/${school.id}/edit`}>
            <Button variant="outline" size="sm" icon={<Edit className="w-4 h-4" />}>
              تعديل بيانات البيئة
            </Button>
          </Link>
          <Button variant="danger" size="sm" icon={<ShieldAlert className="w-4 h-4" />}>
            إيقاف مؤقت للخدمة
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard title="عدد الطلاب المسجلين" value={`${school.studentsCount} طالب`} subtitle="السعة المتاحة: 500 طالب" icon={<Users className="w-5 h-5" />} color="#1769E0" />
        <StatsCard title="عدد الحافلات المتصلة" value={`${school.busesCount} حافلة`} subtitle="السعة المتاحة: 20 حافلة" icon={<BusIcon className="w-5 h-5" />} color="#12AFA5" />
        <StatsCard title="الإيراد الشهري المقبوض" value={`${school.monthlyRevenue.toLocaleString()} ر.س`} subtitle="الباقة الاحترافية" icon={<CreditCard className="w-5 h-5" />} color="#16A461" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="space-y-3">
          <h3 className="text-sm font-bold text-[#13233A] flex items-center gap-2">
            <School className="w-4 h-4 text-[#1769E0]" /> بيانات الاشتراك والمدير المسؤول
          </h3>
          <div className="text-xs space-y-2 text-[#13233A]">
            <div className="flex justify-between border-b border-[#E3EAF3] pb-1.5">
              <span className="text-[#66758A]">المدير المسؤول:</span>
              <span className="font-bold">{school.managerName}</span>
            </div>
            <div className="flex justify-between border-b border-[#E3EAF3] pb-1.5">
              <span className="text-[#66758A]">الجوال المباشر:</span>
              <span className="font-mono">{school.managerPhone}</span>
            </div>
            <div className="flex justify-between border-b border-[#E3EAF3] pb-1.5">
              <span className="text-[#66758A]">البريد الإلكتروني:</span>
              <span className="font-mono">{school.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#66758A]">تاريخ انتهاء الاشتراك:</span>
              <span className="font-mono text-[#16A461] font-bold">{school.subscriptionEndDate}</span>
            </div>
          </div>
        </Card>

        <Card className="space-y-3">
          <h3 className="text-sm font-bold text-[#13233A] flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-[#103B75]" /> إجراءات الأمان والدعم السريع
          </h3>
          <div className="space-y-2 text-xs">
            <Button variant="outline" size="sm" className="w-full justify-start" icon={<KeyRound className="w-4 h-4" />}>
              إعادة إرسال رابط تعيين كلمة المرور للمدير
            </Button>
            <Button variant="secondary" size="sm" className="w-full justify-start" icon={<Globe className="w-4 h-4" />}>
              فحص الربط البرمجي للنطاق الفرعي (DNS Check)
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
