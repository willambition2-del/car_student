"use client";

import React, { useState } from "react";
import { TextInput, SelectInput } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Settings, Save, ShieldCheck, Database, DollarSign } from "lucide-react";

export default function PlatformSettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [platformName, setPlatformName] = useState("منصة النقل المدرسي SaaS");
  const [supportEmail, setSupportEmail] = useState("support@schooltransport-saas.com");
  const [vatRate, setVatRate] = useState("15");
  const [trialDays, setTrialDays] = useState("14");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="space-y-6 text-right max-w-4xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-[#13233A]">إعدادات مالك المنظومة العامة (Platform Settings)</h1>
        <p className="text-xs text-[#66758A] mt-0.5">ضبط إعدادات الضرائب، مهلة التجربة المجانية، والبريد المعتمد</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="space-y-4">
          <div className="flex items-center gap-2 border-b border-[#E3EAF3] pb-3 font-bold text-sm text-[#103B75]">
            <Settings className="w-4 h-4 text-[#1769E0]" /> البيانات السيادية والمالية
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              label="اسم المنظومة الرسمي"
              value={platformName}
              onChange={(e) => setPlatformName(e.target.value)}
              required
            />
            <TextInput
              label="بريد الدعم الفني الرئيسي"
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              required
            />
            <TextInput
              label="نسبة ضريبة القيمة المضافة (%)"
              value={vatRate}
              onChange={(e) => setVatRate(e.target.value)}
              required
            />
            <TextInput
              label="مدة الفترة التجريبية الافتراضية (أيام)"
              value={trialDays}
              onChange={(e) => setTrialDays(e.target.value)}
              required
            />
          </div>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" variant="primary" icon={<Save className="w-4 h-4" />} isLoading={isLoading}>
            حفظ الإعدادات السيادية
          </Button>
        </div>
      </form>
    </div>
  );
}
