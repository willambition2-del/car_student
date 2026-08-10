"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { TextInput, SelectInput } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { School, Save, Sliders, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { schoolSettingsApi } from "@/lib/api";

export default function SchoolSettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [schoolName, setSchoolName] = useState("مدارس المستقبل الأهلية");
  const [phone, setPhone] = useState("+966112345678");
  const [email, setEmail] = useState("info@almustaqbal.edu.sa");
  const [address, setAddress] = useState("حي النرجس، الرياض");
  const [morningStartTime, setMorningStartTime] = useState("06:30");
  const [returnStartTime, setReturnStartTime] = useState("13:00");

  const loadData = async () => {
    setIsFetching(true);
    try {
      const data = await schoolSettingsApi.getSettings();
      if (data && data.schoolInfo) {
        setSchoolName(data.schoolInfo.nameAr || schoolName);
        setPhone(data.schoolInfo.phone || phone);
        setEmail(data.schoolInfo.email || email);
        setAddress(data.schoolInfo.address || address);
      }
      if (data && data.settings) {
        if (data.settings.morning_start_time) setMorningStartTime(data.settings.morning_start_time);
        if (data.settings.return_start_time) setReturnStartTime(data.settings.return_start_time);
      }
    } catch {
      // Fallback to defaults if API offline
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      await schoolSettingsApi.updateSettings({
        morning_start_time: morningStartTime,
        return_start_time: returnStartTime,
      });
      setSuccessMsg("تم حفظ وتحديث إعدادات المدرسة بنجاح في قاعدة البيانات.");
    } catch (err: any) {
      setErrorMsg(err.message || "حدث خطأ أثناء حفظ الإعدادات.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-right max-w-4xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#13233A]">إعدادات ملف المدرسة والدوام</h1>
          <p className="text-xs text-[#66758A] mt-0.5">ضبط البيانات الرسمية وأوقات العمل والعملة بالمنظومة</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={loadData} isLoading={isFetching} icon={<RefreshCw className="w-4 h-4" />}>
            تحديث
          </Button>
          <Link href="/settings/features">
            <Button variant="secondary" icon={<Sliders className="w-4 h-4" />}>
              إعدادات ميزات المنصة (Feature Flags)
            </Button>
          </Link>
        </div>
      </div>

      {successMsg && (
        <div className="p-3.5 bg-[#16A461]/10 border border-[#16A461]/20 text-[#16A461] text-xs font-semibold rounded-xl text-right flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 bg-[#E5484D]/10 border border-[#E5484D]/20 text-[#E5484D] text-xs font-semibold rounded-xl text-right flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="space-y-4">
          <div className="flex items-center gap-2 border-b border-[#E3EAF3] pb-3 font-bold text-sm text-[#103B75]">
            <School className="w-4 h-4 text-[#1769E0]" /> الهوية والبيانات الرسمية
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              label="اسم المدرسة الرسمي"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              required
            />
            <TextInput
              label="رقم الهاتف والمباشر"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <TextInput
              label="البريد الإلكتروني المعتمد"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextInput
              label="العنوان والحي"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <TextInput
              label="وقت بداية الرحلة الصباحية"
              value={morningStartTime}
              onChange={(e) => setMorningStartTime(e.target.value)}
            />
            <TextInput
              label="وقت بداية رحلة العودة"
              value={returnStartTime}
              onChange={(e) => setReturnStartTime(e.target.value)}
            />
          </div>
        </Card>

        <div className="flex items-center justify-end">
          <Button type="submit" variant="primary" icon={<Save className="w-4 h-4" />} isLoading={isLoading}>
            حفظ إعدادات المدرسة
          </Button>
        </div>
      </form>
    </div>
  );
}

