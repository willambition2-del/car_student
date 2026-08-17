"use client";

import { SchoolTenant } from "@/mock/mockData";
import React, { useEffect,  useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { TextInput, SelectInput } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { School, ArrowRight, Save } from "lucide-react";
import { platformSchoolsApi } from "@/lib/api";

export default function EditSchoolTenantPage() {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

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

  const [name, setName] = useState(school.name);
  const [city, setCity] = useState(school.city);
  const [managerName, setManagerName] = useState(school.managerName);
  const [managerPhone, setManagerPhone] = useState(school.managerPhone);
  const [email, setEmail] = useState(school.email);
  const [status, setStatus] = useState(school.status);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      router.push(`/schools/${school.id}`);
    }, 800);
  };

  return (
    <div className="space-y-6 text-right max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#13233A]">تعديل بيانات مدرسة: {school.name}</h1>
          <p className="text-xs text-[#66758A] mt-0.5">تحديث بيانات الاتصال وحالة الاشتراك بالنظام</p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => router.back()} icon={<ArrowRight className="w-4 h-4" />}>
          العودة
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              label="اسم المدرسة الرسمي"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <SelectInput
              label="المدينة"
              options={[
                { label: "الرياض", value: "الرياض" },
                { label: "جدة", value: "جدة" },
                { label: "الدمام", value: "الدمام" },
              ]}
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <TextInput
              label="المدير المسؤول"
              value={managerName}
              onChange={(e) => setManagerName(e.target.value)}
              required
            />
            <TextInput
              label="الجوال المباشر"
              value={managerPhone}
              onChange={(e) => setManagerPhone(e.target.value)}
              required
            />
            <TextInput
              label="البريد الإلكتروني"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <SelectInput
              label="الحالة التشغيلية"
              options={[
                { label: "نشطة", value: "نشطة" },
                { label: "تجربة مجانية", value: "تجربة مجانية" },
                { label: "متوقفة", value: "متوقفة" },
              ]}
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
            />
          </div>
        </Card>

        <div className="flex items-center justify-end gap-3">
          <Button variant="secondary" onClick={() => router.back()}>
            إلغاء
          </Button>
          <Button type="submit" variant="primary" icon={<Save className="w-4 h-4" />} isLoading={isLoading}>
            حفظ التعديلات
          </Button>
        </div>
      </form>
    </div>
  );
}
