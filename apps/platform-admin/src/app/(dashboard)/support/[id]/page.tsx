"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HelpCircle, ArrowRight, Send, CheckCircle2, MessageSquare } from "lucide-react";

export default function SupportTicketDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setReplyText("");
    }, 800);
  };

  return (
    <div className="space-y-6 text-right max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" onClick={() => router.back()} icon={<ArrowRight className="w-4 h-4" />}>
            العودة
          </Button>
          <div>
            <h1 className="text-xl font-bold text-[#13233A]">تذكرة دعم: TKT-2026-0089</h1>
            <p className="text-xs text-[#66758A]">مدارس المستقبل الأهلية | التصنيف: ترقية حدود الباقة</p>
          </div>
        </div>
        <StatusBadge variant="warning">قيد المعالجة</StatusBadge>
      </div>

      <Card className="space-y-4">
        <h3 className="text-sm font-bold text-[#13233A]">سجل محادثة التذكرة الميدانية</h3>
        <div className="space-y-3 text-xs">
          <div className="p-4 bg-[#F5F8FC] rounded-2xl space-y-1">
            <span className="font-bold text-[#1769E0] block">أحمد المحمد (مدير المدرسة):</span>
            <p className="text-[#13233A]">
              السلام عليكم، نود إضافة 5 حافلات جديدة فوق السعة الاستيعابية المتاحة بالباقة الاحترافية الحالي (20 حافلة)،
              نرجو إفادتنا بتكلفة التعديل وتفعيل الميزة.
            </p>
          </div>

          <div className="p-4 bg-[#103B75]/10 rounded-2xl space-y-1 border border-[#103B75]/20">
            <span className="font-bold text-[#103B75] block">مهند الخالد (مهندس دعم المنصة):</span>
            <p className="text-[#13233A]">
              أهلاً بكم، تمت مراجعة الطلب ويمكن إضافة حافلات إضافية بقيمة 200 ر.س شهرياً لكل حافلة. تم تجهيز السند.
            </p>
          </div>
        </div>

        <form onSubmit={handleSendReply} className="space-y-3 pt-2">
          <div className="flex flex-col gap-1.5 text-right">
            <label className="text-xs font-bold text-[#13233A]">كتابة رد الدعم الفني للمدرسة</label>
            <textarea
              rows={3}
              className="w-full bg-white border border-[#E3EAF3] text-[#13233A] text-sm rounded-xl p-3 outline-none focus:border-[#1769E0]"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="اكتب ردك هنا..."
              required
            />
          </div>
          <div className="flex justify-between items-center">
            <Button type="button" variant="outline" size="sm" icon={<CheckCircle2 className="w-4 h-4 text-[#16A461]" />}>
              إغلاق التذكرة كمحلولة
            </Button>
            <Button type="submit" variant="primary" icon={<Send className="w-4 h-4" />} isLoading={isLoading}>
              إرسال الرد للمدرسة
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
