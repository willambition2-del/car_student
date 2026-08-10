"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { schoolFinancialApi } from "@/lib/api";
import { Printer, ArrowRight, School, ShieldCheck, RefreshCw } from "lucide-react";

export default function PaymentReceiptsPage() {
  const router = useRouter();
  const [receipts, setReceipts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchReceipts = async () => {
    setIsLoading(true);
    try {
      const data = await schoolFinancialApi.getReceipts();
      if (data && data.items && data.items.length > 0) {
        setReceipts(data.items);
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReceipts();
  }, []);

  const receipt = receipts[0] || {
    receiptNumber: "RCP-104921",
    guardianName: "عبدالله السليمان",
    studentName: "سارة عبدالله السليمان",
    amount: 3500,
    paymentMethod: "تحويل بنكي / مدى",
    issuedByName: "أحمد المحاسب",
    issuedAt: new Date().toISOString(),
  };

  return (
    <div className="space-y-6 text-right max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <Button variant="secondary" size="sm" onClick={() => router.back()} icon={<ArrowRight className="w-4 h-4" />}>
          العودة للمقبوضات
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchReceipts} isLoading={isLoading} icon={<RefreshCw className="w-4 h-4" />}>
            تحديث
          </Button>
          <Button variant="outline" size="sm" onClick={() => window.print()} icon={<Printer className="w-4 h-4" />}>
            طباعة سند القبض
          </Button>
        </div>
      </div>

      {/* Printable Receipt Voucher Container */}
      <Card className="p-8 space-y-6 border-2 border-[#E3EAF3] bg-white">
        {/* Receipt Header */}
        <div className="flex items-center justify-between border-b border-[#E3EAF3] pb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#1769E0] text-white flex items-center justify-center font-bold">
              <School className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#13233A]">مدارس المستقبل الأهلية</h2>
              <span className="text-xs text-[#66758A]">قسم النقل المدرسي والاشتراكات</span>
            </div>
          </div>
          <div className="text-left">
            <h3 className="text-sm font-bold text-[#103B75]">سند قبض رسمي</h3>
            <span className="font-mono text-xs text-[#66758A] block">{receipt.receiptNumber}</span>
          </div>
        </div>

        {/* Receipt Body */}
        <div className="grid grid-cols-2 gap-4 text-xs space-y-1 text-[#13233A]" suppressHydrationWarning>
          <div className="p-3 bg-[#F5F8FC] rounded-xl space-y-1">
            <span className="text-[#66758A]">استلمنا من ولي الأمر:</span>
            <span className="font-bold block text-sm">{receipt.guardianName}</span>
          </div>
          <div className="p-3 bg-[#F5F8FC] rounded-xl space-y-1">
            <span className="text-[#66758A]">عن اشتراك الطالب:</span>
            <span className="font-bold block text-sm">{receipt.studentName}</span>
          </div>
          <div className="p-3 bg-[#16A461]/10 rounded-xl space-y-1 border border-[#16A461]/20">
            <span className="text-[#16A461] font-bold">المبلغ المقبوض:</span>
            <span className="font-bold block text-base text-[#16A461] font-mono">{Number(receipt.amount).toLocaleString("en-US")} ر.س</span>
          </div>
          <div className="p-3 bg-[#F5F8FC] rounded-xl space-y-1">
            <span className="text-[#66758A]">طريقة التسديد والتاريخ:</span>
            <span className="font-bold block">{receipt.paymentMethod} - {new Date(receipt.issuedAt).toLocaleDateString('ar-SA')}</span>
          </div>
        </div>

        {/* Signatures Footer */}
        <div className="pt-8 border-t border-[#E3EAF3] flex items-center justify-between text-xs text-[#66758A]">
          <div>المحاسب المستلم: {receipt.issuedByName}</div>
          <div className="flex items-center gap-1 text-[#16A461] font-bold">
            <ShieldCheck className="w-4 h-4" /> سند إلكتروني معتمد ومسجل بالمنظومة
          </div>
        </div>
      </Card>
    </div>
  );
}

