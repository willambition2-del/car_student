"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AuditLog } from "@/mock/mockData";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { History, ArrowRight, ShieldCheck, Terminal } from "lucide-react";

export default function AuditLogDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const [log, setLog] = useState<AuditLog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/audit/${params.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch data");
        return res.json();
      })
      .then((data) => {
        setLog(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [params.id]);

  if (loading) return <div>جاري التحميل...</div>;
  if (error) return <div className="text-red-500">حدث خطأ: {error}</div>;
  if (!log) return <div>لم يتم العثور على البيانات</div>;

  return (
    <div className="space-y-6 text-right max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" onClick={() => router.back()} icon={<ArrowRight className="w-4 h-4" />}>
            العودة
          </Button>
          <div>
            <h1 className="text-xl font-bold text-[#13233A]">تفاصيل الأثر الأمني: {log.id}</h1>
            <p className="text-xs text-[#66758A]">التاريخ: {log.timestamp} | الـ IP: {log.ipAddress}</p>
          </div>
        </div>
        <StatusBadge variant="info">مستوى عادي</StatusBadge>
      </div>

      <Card className="space-y-4">
        <h3 className="text-sm font-bold text-[#13233A] flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#1769E0]" /> بيانات العملية المنفذة
        </h3>
        <div className="space-y-3 text-xs">
          <div className="p-3 bg-[#F5F8FC] rounded-xl flex justify-between">
            <span className="text-[#66758A]">اسم المستخدم:</span>
            <span className="font-bold text-[#13233A]">{log.user}</span>
          </div>
          <div className="p-3 bg-[#F5F8FC] rounded-xl flex justify-between">
            <span className="text-[#66758A]">نوع الإجراء:</span>
            <span className="font-bold text-[#1769E0]">{log.action}</span>
          </div>
          <div className="p-3 bg-[#F5F8FC] rounded-xl space-y-1">
            <span className="text-[#66758A] block">التفاصيل والتأثير:</span>
            <span className="text-[#13233A] leading-relaxed">{log.details}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
