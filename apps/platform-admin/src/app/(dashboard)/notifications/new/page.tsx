"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { TextInput, SelectInput } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Bell, ArrowRight, Send } from "lucide-react";

export default function NewPlatformBroadcastPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("تحديث جديد لإدارة المسارات الخريطة");
  const [body, setBody] = useState("تم إطلاق الميزة الجديدة لتحسين دقة مواقع الحافلات باللغتين العربية والإنجليزية.");
  const [target, setTarget] = useState("جميع المدارس المشتركة");

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
          <h1 className="text-xl font-bold text-[#13233A]">صانع التنبيهات والبث الجماعي (Broadcast Builder)</h1>
          <p className="text-xs text-[#66758A] mt-0.5">بث الرسائل الإدارية الهامة لجميع المدارس المستضافة</p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => router.back()} icon={<ArrowRight className="w-4 h-4" />}>
          العودة
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="space-y-4">
          <SelectInput
            label="المدارس المستهدفة بالبث"
            options={[
              { label: "جميع المدارس المشتركة (24 مدرسة)", value: "جميع المدارس المشتركة" },
              { label: "المدارس ذات الباقة الاحترافية فقط", value: "الباقة الاحترافية" },
              { label: "مدارس التجربة المجانية فقط", value: "التجربة المجانية" },
            ]}
            value={target}
            onChange={(e) => setTarget(e.target.value)}
          />

          <TextInput
            label="عنوان الإعلان الرئيسي"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="flex flex-col gap-1.5 text-right">
            <label className="text-xs font-bold text-[#13233A]">محتوى التنبيه التفصيلي</label>
            <textarea
              rows={4}
              className="w-full bg-white border border-[#E3EAF3] text-[#13233A] text-sm rounded-xl p-3 outline-none focus:border-[#1769E0]"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
            />
          </div>
        </Card>

        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => router.back()}>
            إلغاء
          </Button>
          <Button type="submit" variant="primary" icon={<Send className="w-4 h-4" />} isLoading={isLoading}>
            بث الإعلان لجميع المدارس
          </Button>
        </div>
      </form>
    </div>
  );
}
