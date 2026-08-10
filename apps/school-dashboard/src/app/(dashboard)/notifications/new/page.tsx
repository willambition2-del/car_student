"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { TextInput, SelectInput } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Send, Bell, Smartphone } from "lucide-react";

export default function NewNotificationPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("تنبيه بشأن موعد الانطلاق الصباحي");
  const [body, setBody] = useState("يرجى التأكد من تواجد الطالب في محطة الصعود قبل 5 دقائق من الوقت المعتمد.");
  const [targetGroup, setTargetGroup] = useState("جميع أولياء الأمور");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      router.push("/notifications");
    }, 800);
  };

  return (
    <div className="space-y-6 text-right max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#13233A]">صانع الإشعارات الجماعية</h1>
          <p className="text-xs text-[#66758A] mt-0.5">صياغة وبث الرسائل والتنبيهات المباشرة لتطبيقات الموبايل</p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => router.back()} icon={<ArrowRight className="w-4 h-4" />}>
          العودة
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Form Inputs Column */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Card className="space-y-4">
            <SelectInput
              label="الفئة المستهدفة بالإشعار"
              options={[
                { label: "جميع أولياء الأمور", value: "جميع أولياء الأمور" },
                { label: "سائقي الحافلات", value: "سائقي الحافلات" },
                { label: "المشرفات الميدانيات", value: "المشرفات الميدانيات" },
                { label: "حافلة رقم 205 فقط", value: "حافلة 205" },
              ]}
              value={targetGroup}
              onChange={(e) => setTargetGroup(e.target.value)}
            />

            <TextInput
              label="عنوان الإشعار الرئيسي"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <div className="flex flex-col gap-1.5 text-right">
              <label className="text-xs font-bold text-[#13233A]">نص الرسالة التفصيلي</label>
              <textarea
                rows={4}
                className="w-full bg-white border border-[#E3EAF3] text-[#13233A] text-sm rounded-xl p-3 outline-none focus:border-[#1769E0]"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                required
              />
            </div>

            <Button type="submit" variant="primary" size="lg" className="w-full" icon={<Send className="w-4 h-4" />} isLoading={isLoading}>
              إرسال وبث الإشعار الآن
            </Button>
          </Card>
        </form>

        {/* Live Mobile Notification Preview Simulation */}
        <Card className="space-y-4 bg-[#F5F8FC] border-2 border-[#E3EAF3]">
          <h3 className="text-sm font-bold text-[#13233A] flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-[#1769E0]" /> معاينة التنبيه على هاتف ولي الأمر
          </h3>

          <div className="p-4 bg-white border border-[#E3EAF3] rounded-2xl shadow-md space-y-2 text-right">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#1769E0] text-white flex items-center justify-center font-bold text-[10px]">
                  <Bell className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-[#13233A]">تطبيق النقل المدرسي</span>
              </div>
              <span className="text-[10px] text-[#66758A]">الآن</span>
            </div>
            <h4 className="text-xs font-bold text-[#103B75]">{title || "عنوان الإشعار"}</h4>
            <p className="text-xs text-[#66758A] leading-relaxed">{body || "نص الرسالة الإشعارية..."}</p>
          </div>
        </Card>
      </div>
    </div>
  );
}

