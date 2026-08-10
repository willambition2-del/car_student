"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { TextInput, SelectInput } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Save, User, Bus, MapPin } from "lucide-react";

export default function NewStudentPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    code: "STD-2026-09",
    grade: "الصف الثالث الابتدائي",
    section: "أ",
    guardianName: "",
    guardianPhone: "",
    guardianEmail: "",
    busNumber: "205",
    routeName: "مسار حي الياسمين (أ)",
    pickupPoint: "",
    dropoffPoint: "مدارس المستقبل - البوابة الشرقية",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      router.push("/students");
    }, 800);
  };

  return (
    <div className="space-y-6 text-right max-w-4xl mx-auto">
      {/* Back & Header Toolbar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#13233A]">تسجيل طالب جديد بخدمة النقل</h1>
          <p className="text-xs text-[#66758A] mt-0.5">
            إدخال البيانات الأكاديمية والنقلية وتخصيص الحافلة ومحطة الصعود والنزول
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => router.back()} icon={<ArrowRight className="w-4 h-4" />}>
          العودة للقائمة
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Academic Student Data */}
        <Card className="space-y-4">
          <div className="flex items-center gap-2 border-b border-[#E3EAF3] pb-3 font-bold text-sm text-[#103B75]">
            <User className="w-4 h-4 text-[#1769E0]" /> البيانات الأكاديمية والشخصية
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              label="اسم الطالب الرباعي"
              placeholder="مثال: عبد الله أحمد العتيبي"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <TextInput
              label="الرقم المدرسي الرسمي"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              required
            />
            <SelectInput
              label="الصف الدراسي"
              options={[
                { label: "الصف الأول الابتدائي", value: "الصف الأول الابتدائي" },
                { label: "الصف الثاني الابتدائي", value: "الصف الثاني الابتدائي" },
                { label: "الصف الثالث الابتدائي", value: "الصف الثالث الابتدائي" },
                { label: "الصف الخامس الابتدائي", value: "الصف الخامس الابتدائي" },
              ]}
              value={formData.grade}
              onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
            />
            <TextInput
              label="الشعبة"
              placeholder="مثال: أ"
              value={formData.section}
              onChange={(e) => setFormData({ ...formData, section: e.target.value })}
            />
          </div>
        </Card>

        {/* Section 2: Guardian Info */}
        <Card className="space-y-4">
          <div className="flex items-center gap-2 border-b border-[#E3EAF3] pb-3 font-bold text-sm text-[#103B75]">
            <User className="w-4 h-4 text-[#12AFA5]" /> بيانات ولي الأمر المعتمدة
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              label="اسم ولي الأمر"
              placeholder="مثال: أحمد العتيبي"
              value={formData.guardianName}
              onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
              required
            />
            <TextInput
              label="رقم الجوال المباشر"
              placeholder="0501234567"
              value={formData.guardianPhone}
              onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
              required
            />
          </div>
        </Card>

        {/* Section 3: Transport Assignment */}
        <Card className="space-y-4">
          <div className="flex items-center gap-2 border-b border-[#E3EAF3] pb-3 font-bold text-sm text-[#103B75]">
            <Bus className="w-4 h-4 text-[#1769E0]" /> تخصيص الحافلة ومحطات السكن
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectInput
              label="رقم الحافلة المخصصة"
              options={[
                { label: "حافلة رقم 205 - حي الياسمين", value: "205" },
                { label: "حافلة رقم 108 - حي النفل والندى", value: "108" },
                { label: "حافلة رقم 304 - حي حطين", value: "304" },
              ]}
              value={formData.busNumber}
              onChange={(e) => setFormData({ ...formData, busNumber: e.target.value })}
            />
            <TextInput
              label="عنوان الصعود (المنزل)"
              placeholder="مثال: حي الياسمين - شارع 14 - منزل 8"
              value={formData.pickupPoint}
              onChange={(e) => setFormData({ ...formData, pickupPoint: e.target.value })}
              required
            />
            <TextInput
              label="عنوان النزول (المدرسة)"
              value={formData.dropoffPoint}
              onChange={(e) => setFormData({ ...formData, dropoffPoint: e.target.value })}
            />
            <TextInput
              label="ملاحظات طبية أو سلوكية خاصة"
              placeholder="مثال: حساسية من الأطعمة أو مساعدة في الصعود..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>
        </Card>

        {/* Action Controls */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="secondary" onClick={() => router.back()}>
            إلغاء
          </Button>
          <Button type="submit" variant="primary" icon={<Save className="w-4 h-4" />} isLoading={isLoading}>
            حفظ وبيانات الطالب
          </Button>
        </div>
      </form>
    </div>
  );
}

