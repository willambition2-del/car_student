"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { schoolAbsenceRequestsApi } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarX, ArrowRight, CheckCircle2, XCircle, Phone } from "lucide-react";

export default function AbsenceRequestDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [req, setReq] = useState<any>(null);

  useEffect(() => {
    const fetchReq = async () => {
      try {
        const data = await schoolAbsenceRequestsApi.getRequest(params.id as string);
        setReq(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchReq();
  }, [params.id]);

  const handleAction = async (status: "معتمد" | "مرفوض") => {
    setIsLoading(true);
    try {
      if (status === "معتمد") {
        await schoolAbsenceRequestsApi.approveRequest(params.id as string);
      } else {
        await schoolAbsenceRequestsApi.rejectRequest(params.id as string, "مرفوض");
      }
      router.push("/absence-requests");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!req) return <div>جاري التحميل...</div>;

  return (
    <div className="space-y-6 text-right max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" onClick={() => router.back()} icon={<ArrowRight className="w-4 h-4" />}>
            العودة
          </Button>
          <div>
            <h1 className="text-xl font-bold text-[#13233A]">طلب غياب: {req.studentName}</h1>
            <p className="text-xs text-[#66758A]">
              الصف: {req.studentGrade} | تقديم: {req.submittedAt}
            </p>
          </div>
        </div>
        <StatusBadge variant="success">{req.status}</StatusBadge>
      </div>

      <Card className="space-y-4">
        <h3 className="text-sm font-bold text-[#13233A]">تفاصيل الإخطار بالغياب</h3>
        <div className="space-y-3 text-xs">
          <div className="p-3 bg-[#F5F8FC] rounded-xl flex items-center justify-between">
            <span className="text-[#66758A]">نوع الغياب:</span>
            <span className="font-bold text-[#13233A]">{req.absenceType}</span>
          </div>
          <div className="p-3 bg-[#F5F8FC] rounded-xl flex items-center justify-between">
            <span className="text-[#66758A]">نطاق التواريخ:</span>
            <span className="font-bold text-[#103B75] font-mono">
              {req.startDate} إلى {req.endDate}
            </span>
          </div>
          <div className="p-3 bg-[#F5F8FC] rounded-xl flex items-center justify-between">
            <span className="text-[#66758A]">خيار الاستلام الشخصي من المدرسة:</span>
            <span className="font-bold text-[#16A461]">{req.personalPickup ? "نعم (سأستلم الطالب شخصياً)" : "لا"}</span>
          </div>
          <div className="p-3 bg-[#F5F8FC] rounded-xl space-y-1">
            <span className="text-[#66758A] block">السبب المكتوب:</span>
            <span className="text-[#13233A]">{req.reason}</span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleAction("مرفوض")}
            isLoading={isLoading}
            icon={<XCircle className="w-4 h-4" />}
          >
            رفض الإخطار
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleAction("معتمد")}
            isLoading={isLoading}
            icon={<CheckCircle2 className="w-4 h-4" />}
          >
            اعتماد وإبلاغ المشرفة
          </Button>
        </div>
      </Card>
    </div>
  );
}
