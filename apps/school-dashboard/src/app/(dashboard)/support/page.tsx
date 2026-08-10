"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TextInput, SelectInput } from "@/components/ui/input";
import { schoolSupportApi } from "@/lib/api";
import { HelpCircle, Plus, Send, MessageSquare } from "lucide-react";

export default function TechSupportPage() {
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("أعطال الـ GPS");
  const [description, setDescription] = useState("");

  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const data = await schoolSupportApi.getTickets();
        setTickets(data.items || []);
      } catch (err) {
        setError("فشل جلب تذاكر الدعم");
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowNewTicket(false);
    }, 800);
  };

  return (
    <div className="space-y-6 text-right max-w-5xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#13233A]">الدعم الفني وتذاكر الخدمة</h1>
          <p className="text-xs text-[#66758A] mt-0.5">التواصل الفوري مع طاقم دعم منصة النقل المدرسي ومتابعة تذاكر الصيانة</p>
        </div>
        <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={() => setShowNewTicket(!showNewTicket)}>
          فتح تذكرة دعم جديدة
        </Button>
      </div>

      {showNewTicket && (
        <Card className="space-y-4 border-[#1769E0]">
          <h3 className="text-sm font-bold text-[#13233A]">إنشاء تذكرة دعم جديدة</h3>
          <form onSubmit={handleCreateTicket} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectInput
                label="تصنيف المشكلة"
                options={[
                  { label: "أعطال الـ GPS والأجهزة", value: "أعطال الـ GPS" },
                  { label: "استفسارات الفواتير والاشتراك", value: "استفسارات الفواتير" },
                  { label: "طلب إضافة حافلات جديدة", value: "إضافة حافلات جديدة" },
                  { label: "دعم فني عام بالمنظومة", value: "دعم فني عام" },
                ]}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
              <TextInput
                label="عنوان المشكلة"
                placeholder="أدخل عنواناً مختصراً..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5 text-right">
              <label className="text-xs font-bold text-[#13233A]">وصف وتفاصيل التذكرة</label>
              <textarea
                rows={3}
                className="w-full bg-white border border-[#E3EAF3] text-[#13233A] text-sm rounded-xl p-3 outline-none focus:border-[#1769E0]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={() => setShowNewTicket(false)}>
                إلغاء
              </Button>
              <Button type="submit" variant="primary" icon={<Send className="w-4 h-4" />} isLoading={isLoading}>
                إرسال التذكرة
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Ticket History */}
      <div className="space-y-4">
        {loading && <div className="text-center p-4">جاري التحميل...</div>}
        {error && <div className="text-center p-4 text-red-500">{error}</div>}
        {!loading && !error && tickets.length === 0 && <div className="text-center p-4">لا توجد تذاكر دعم</div>}
        {!loading && !error && tickets.map((tkt) => (
          <Card key={tkt.id} className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E3EAF3] pb-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#103B75]">{tkt.ticketNumber}</span>
                <h3 className="text-sm font-bold text-[#13233A]">{tkt.subject}</h3>
              </div>
              <StatusBadge variant={tkt.status === "قيد المعالجة" ? "warning" : "success"}>
                {tkt.status}
              </StatusBadge>
            </div>
            <p className="text-xs text-[#66758A] leading-relaxed">{tkt.description}</p>
            <div className="p-3 bg-[#F5F8FC] rounded-xl text-xs space-y-1">
              <span className="font-bold text-[#1769E0] flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5" /> آخر رد من دعم المنصة:
              </span>
              <span className="text-[#13233A] block">{tkt.lastReply}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

