"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PlatformInvoice } from "@/mock/mockData";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Printer, ArrowRight, ShieldCheck, Receipt } from "lucide-react";
import { platformInvoicesApi } from "@/lib/api";

export default function InvoiceDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const [inv, setInv] = useState<PlatformInvoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    platformInvoicesApi.getInvoice(params.id as string)
      .then((data) => {
        setInv(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [params.id]);

  if (loading) return <div>جاري التحميل...</div>;
  if (error) return <div className="text-red-500">حدث خطأ: {error}</div>;
  if (!inv) return <div>لم يتم العثور على البيانات</div>;

  return (
    <div className="space-y-6 text-right max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <Button variant="secondary" size="sm" onClick={() => router.back()} icon={<ArrowRight className="w-4 h-4" />}>
          العودة للفواتير
        </Button>
        <Button variant="outline" size="sm" onClick={() => window.print()} icon={<Printer className="w-4 h-4" />}>
          طباعة الفاتورة الضريبية
        </Button>
      </div>

      <Card className="p-8 space-y-6 border-2 border-[#E3EAF3] bg-white">
        {/* Invoice Header */}
        <div className="flex items-center justify-between border-b border-[#E3EAF3] pb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#103B75] text-white flex items-center justify-center font-bold">
              <ShieldCheck className="w-7 h-7 text-[#12AFA5]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#13233A]">شركة منصة النقل المدرسي SaaS</h2>
              <span className="text-xs text-[#66758A]">الرقم الضريبي: 309812345600003</span>
            </div>
          </div>
          <div className="text-left">
            <h3 className="text-sm font-bold text-[#1769E0]">فاتورة ضريبية رسمية</h3>
            <span className="font-mono text-xs text-[#66758A] block">{inv.invoiceNumber}</span>
          </div>
        </div>

        {/* Invoice Target Details */}
        <div className="grid grid-cols-2 gap-4 text-xs space-y-1">
          <div className="p-3 bg-[#F5F8FC] rounded-xl space-y-1">
            <span className="text-[#66758A]">فاتورة موجهة إلى:</span>
            <span className="font-bold block text-sm text-[#13233A]">{inv.schoolName}</span>
          </div>
          <div className="p-3 bg-[#F5F8FC] rounded-xl space-y-1">
            <span className="text-[#66758A]">الوصف والباقة:</span>
            <span className="font-bold block text-sm text-[#13233A]">{inv.planName}</span>
          </div>
        </div>

        {/* Financial Breakdown Table */}
        <div className="space-y-2 text-xs" suppressHydrationWarning>
          <div className="flex justify-between p-3 bg-[#F5F8FC] rounded-xl font-mono">
            <span className="text-[#66758A]">المبلغ الأساسي (قبل الضريبة):</span>
            <span className="font-bold text-[#13233A]">{inv.amount.toLocaleString("en-US")} ر.س</span>
          </div>
          <div className="flex justify-between p-3 bg-[#F5F8FC] rounded-xl font-mono">
            <span className="text-[#66758A]">ضريبة القيمة المضافة (15%):</span>
            <span className="font-bold text-[#103B75]">{inv.tax.toLocaleString("en-US")} ر.س</span>
          </div>
          <div className="flex justify-between p-4 bg-[#16A461]/10 rounded-xl border border-[#16A461]/20 font-mono text-sm">
            <span className="font-bold text-[#16A461]">المبلغ الإجمالي المستحق:</span>
            <span className="font-bold text-[#16A461]">{inv.total.toLocaleString("en-US")} ر.س</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
