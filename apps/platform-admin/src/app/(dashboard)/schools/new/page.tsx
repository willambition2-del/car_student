"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { TextInput, SelectInput } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { School, ArrowRight, Save, ShieldCheck, Globe, CheckCircle2 } from "lucide-react";

export default function NewSchoolTenantPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [city, setCity] = useState("الرياض");
  const [managerName, setManagerName] = useState("");
  const [managerPhone, setManagerPhone] = useState("");
  const [email, setEmail] = useState("");
  const [plan, setPlan] = useState("plan-pro");
  const [maxStudents, setMaxStudents] = useState(500);
  const [maxBuses, setMaxBuses] = useState(10);
  const [managerPassword, setManagerPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      await fetch(process.env.NEXT_PUBLIC_API_URL + "/platform/schools/provision", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${document.cookie.split('token=')[1]?.split(';')[0]}`
        },
        body: JSON.stringify({
          school: {
            nameAr: name,
            slug: subdomain,
            city,
            plan,
            maxStudents,
            maxBuses
          },
          admin: {
            fullName: managerName,
            phone: managerPhone,
            email,
            password: managerPassword
          }
        })
      });
      router.push("/schools");
    } catch (err: any) {
      setErrorMsg(err.message || "حدث خطأ أثناء تأسيس المدرسة");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-right max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#13233A]">تهيئة مدرسة جديدة (Tenant Onboarding)</h1>
          <p className="text-xs text-[#66758A] mt-0.5">إنشاء قاعدة البيانات الخاصة بالمدرسة وحجز النطاق الفرعي</p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => router.back()} icon={<ArrowRight className="w-4 h-4" />}>
          العودة
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="space-y-4">
          <div className="flex items-center gap-2 border-b border-[#E3EAF3] pb-3 font-bold text-sm text-[#103B75]">
            <School className="w-4 h-4 text-[#1769E0]" /> بيئة المدرسة والنطاق الفرعي
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              label="اسم المدرسة أو المجمع التعليمي"
              placeholder="مثال: مدارس الأجيال العالمية"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <div className="flex flex-col gap-1.5 text-right">
              <label className="text-xs font-bold text-[#13233A]">النطاق الفرعي (Subdomain)</label>
              <div className="flex items-center bg-white border border-[#E3EAF3] rounded-xl overflow-hidden px-3 py-2">
                <span className="text-xs text-[#66758A] font-mono dir-ltr">.schooltransport-saas.com</span>
                <input
                  type="text"
                  placeholder="alajyal"
                  className="w-full text-left font-mono text-sm outline-none text-[#1769E0] font-bold dir-ltr pr-1"
                  value={subdomain}
                  onChange={(e) => setSubdomain(e.target.value)}
                  required
                />
              </div>
            </div>
            <SelectInput
              label="المدينة والمنطقة"
              options={[
                { label: "الرياض", value: "الرياض" },
                { label: "جدة", value: "جدة" },
                { label: "الدمام", value: "الدمام" },
                { label: "مكة المكرمة", value: "مكة المكرمة" },
              ]}
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <SelectInput
              label="باقة الاشتراك المخصصة"
              options={[
                { label: "الباقة الاحترافية (Professional) - 3,500 ر.س/شهر", value: "plan-pro" },
                { label: "الباقة الأساسية (Basic) - 1,500 ر.س/شهر", value: "plan-basic" },
              ]}
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
            />
            <TextInput
              label="الحد الأقصى للطلاب"
              type="number"
              value={maxStudents.toString()}
              onChange={(e) => setMaxStudents(parseInt(e.target.value) || 0)}
              required
            />
            <TextInput
              label="الحد الأقصى للحافلات"
              type="number"
              value={maxBuses.toString()}
              onChange={(e) => setMaxBuses(parseInt(e.target.value) || 0)}
              required
            />
          </div>
        </Card>

        <Card className="space-y-4">
          <div className="flex items-center gap-2 border-b border-[#E3EAF3] pb-3 font-bold text-sm text-[#103B75]">
            <ShieldCheck className="w-4 h-4 text-[#16A461]" /> حساب مدير المدرسة المسؤول
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <TextInput
              label="اسم المدير المسؤول"
              placeholder="مثال: د. عبد الله السالم"
              value={managerName}
              onChange={(e) => setManagerName(e.target.value)}
              required
            />
            <TextInput
              label="رقم الجوال المباشر"
              placeholder="050xxxxxxx"
              value={managerPhone}
              onChange={(e) => setManagerPhone(e.target.value)}
              required
            />
            <TextInput
              label="البريد الإلكتروني المعتمد"
              placeholder="admin@school.edu.sa"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="flex flex-col gap-1.5 text-right">
              <label className="text-xs font-bold text-[#13233A]">كلمة المرور المؤقتة</label>
              <input
                type="password"
                className="w-full text-right bg-white border border-[#E3EAF3] rounded-xl px-3 py-2 text-sm outline-none focus:border-[#1769E0]"
                value={managerPassword}
                onChange={(e) => setManagerPassword(e.target.value)}
                required
              />
            </div>
          </div>
        </Card>

        <div className="flex items-center justify-end gap-3">
          <Button variant="secondary" onClick={() => router.back()}>
            إلغاء
          </Button>
          <Button type="submit" variant="primary" icon={<Save className="w-4 h-4" />} isLoading={isLoading}>
            تهيئة وتفعيل بيئة المدرسة الآن
          </Button>
        </div>
      </form>
    </div>
  );
}
