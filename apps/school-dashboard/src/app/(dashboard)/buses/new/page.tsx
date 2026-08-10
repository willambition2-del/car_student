"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { TextInput, SelectInput } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Save, Bus as BusIcon, Shield } from "lucide-react";

export default function NewBusPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    number: "402",
    plateNumber: "ر س ط 4321",
    type: "تويوتا كوستار 30 راكب",
    capacity: 30,
    driverName: "إبراهيم السعيد",
    supervisorName: "أمينة الحامد",
    routeName: "مسار حي الياسمين (أ)",
    status: "نشط",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      router.push("/buses");
    }, 800);
  };

  return (
    <div className="space-y-6 text-right max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#13233A]">تسجيل حافلة جديدة بالأسطول</h1>
          <p className="text-xs text-[#66758A] mt-0.5">إدخال بيانات المركبة الرسمية والسعة وتعيين طاقم السائق والمشرفة</p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => router.back()} icon={<ArrowRight className="w-4 h-4" />}>
          العودة
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="space-y-4">
          <div className="flex items-center gap-2 border-b border-[#E3EAF3] pb-3 font-bold text-sm text-[#103B75]">
            <BusIcon className="w-4 h-4 text-[#1769E0]" /> بيانات الحافلة والسعة
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              label="رقم الحافلة الداخلي"
              placeholder="مثال: 402"
              value={formData.number}
              onChange={(e) => setFormData({ ...formData, number: e.target.value })}
              required
            />
            <TextInput
              label="رقم اللوحة الرسمية المرورية"
              placeholder="مثال: أ ب ج 1234"
              value={formData.plateNumber}
              onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })}
              required
            />
            <SelectInput
              label="نوع وطراز المركبة"
              options={[
                { label: "تويوتا كوستار 30 راكب", value: "تويوتا كوستار 30 راكب" },
                { label: "مرسيدس بنز 40 راكب", value: "مرسيدس بنز 40 راكب" },
                { label: "ميتسوبيشي روزا 26 راكب", value: "ميتسوبيشي روزا 26 راكب" },
              ]}
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            />
            <TextInput
              label="سعة المقاعد الكلية"
              type="number"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
              required
            />
          </div>
        </Card>

        <Card className="space-y-4">
          <div className="flex items-center gap-2 border-b border-[#E3EAF3] pb-3 font-bold text-sm text-[#103B75]">
            <Shield className="w-4 h-4 text-[#12AFA5]" /> طاقم الحافلة والمسار المعتمد
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectInput
              label="السائق المسؤول"
              options={[
                { label: "إبراهيم السعيد (0504433221)", value: "إبراهيم السعيد" },
                { label: "خالد بن عيسى (0541122998)", value: "خالد بن عيسى" },
                { label: "طارق الزهراني (0539988776)", value: "طارق الزهراني" },
              ]}
              value={formData.driverName}
              onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
            />
            <SelectInput
              label="المشرفة المرافقة"
              options={[
                { label: "أمينة الحامد (0551122334)", value: "أمينة الحامد" },
                { label: "نورة المطيري (0564455667)", value: "نورة المطيري" },
                { label: "فاطمة الشهري (0507766554)", value: "فاطمة الشهري" },
              ]}
              value={formData.supervisorName}
              onChange={(e) => setFormData({ ...formData, supervisorName: e.target.value })}
            />
          </div>
        </Card>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="secondary" onClick={() => router.back()}>
            إلغاء
          </Button>
          <Button type="submit" variant="primary" icon={<Save className="w-4 h-4" />} isLoading={isLoading}>
            حفظ الحافلة بالأسطول
          </Button>
        </div>
      </form>
    </div>
  );
}

