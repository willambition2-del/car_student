"use client";

import { Subscription } from "@/mock/mockData";
import React, { useEffect,  useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreditCard, ArrowRight, RefreshCw, Calendar, CheckCircle2 } from "lucide-react";

export default function SubscriptionDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [sub, setSub] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/subscriptions/${params.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch data");
        return res.json();
      })
      .then((data) => {
        setSub(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [params.id]);

  if (loading) return <div>جاري التحميل...</div>;
  if (error) return <div className="text-red-500">حدث خطأ: {error}</div>;
  if (!sub) return <div>لم يتم العثور على البيانات</div>;

  const handleExtend = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push("/subscriptions");
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
            <h1 className="text-xl font-bold text-[#13233A]">اشتراك: {sub.schoolName}</h1>
            <p className="text-xs text-[#66758A]">الباقة: {sub.planName}</p>
          </div>
        </div>
        <StatusBadge variant="success">{sub.status}</StatusBadge>
      </div>

      <Card className="space-y-4">
        <h3 className="text-sm font-bold text-[#13233A]">بيانات دورة الفوترة والتجديد</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-[#F5F8FC] rounded-xl space-y-1">
            <span className="text-[#66758A]">تاريخ بداية الاشتراك:</span>
            <span className="font-bold text-[#13233A] block font-mono">{sub.startDate}</span>
          </div>
          <div className="p-3 bg-[#F5F8FC] rounded-xl space-y-1">
            <span className="text-[#66758A]">تاريخ نهاية الاشتراك الحالي:</span>
            <span className="font-bold text-[#16A461] block font-mono">{sub.endDate}</span>
          </div>
          <div className="p-3 bg-[#F5F8FC] rounded-xl space-y-1">
            <span className="text-[#66758A]">المبلغ السنوي المقبوض:</span>
            <span className="font-bold text-[#103B75] block font-mono text-sm" suppressHydrationWarning>{sub.amount.toLocaleString("en-US")} ر.س</span>
          </div>
          <div className="p-3 bg-[#F5F8FC] rounded-xl space-y-1">
            <span className="text-[#66758A]">حالة التجديد التلقائي:</span>
            <span className="font-bold text-[#1769E0] block">{sub.autoRenew ? "مفعل (بطاقة مدى)" : "معطل"}</span>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="primary" icon={<RefreshCw className="w-4 h-4" />} onClick={handleExtend} isLoading={isLoading}>
            تمديد الاشتراك لمدة سنة إضافية
          </Button>
        </div>
      </Card>
    </div>
  );
}
