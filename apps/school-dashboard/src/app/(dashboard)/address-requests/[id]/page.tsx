"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { schoolAddressRequestsApi } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TextInput, SelectInput } from "@/components/ui/input";
import { MapSetupPanel } from "@/components/ui/map-setup";
import { MapPin, ArrowRight, CheckCircle2, XCircle, Bus as BusIcon, AlertCircle } from "lucide-react";

export default function AddressRequestReviewPage() {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [proposedBus, setProposedBus] = useState("304");
  const [responseNotes, setResponseNotes] = useState("تمت دراسة الموقع الجديد بالمسار وتأكيد إمكانية النقل بنفس الباقة.");
  const [req, setReq] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReq = async () => {
      try {
        const id = Array.isArray(params.id) ? params.id[0] : params.id;
        if (id) {
          const res = await schoolAddressRequestsApi.getRequest(id);
          setReq(res);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReq();
  }, [params.id]);

  if (loading) return <div>جاري التحميل...</div>;
  if (!req) return <div>لم يتم العثور على الطلب</div>;

  const handleAction = (status: "مقبول" | "مرفوض") => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push("/address-requests");
    }, 800);
  };

  return (
    <div className="space-y-6 text-right max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" onClick={() => router.back()} icon={<ArrowRight className="w-4 h-4" />}>
            العودة
          </Button>
          <div>
            <h1 className="text-xl font-bold text-[#13233A]">مراجعة طلب نقل سكن: {req.studentName}</h1>
            <p className="text-xs text-[#66758A]">
              ولي الأمر: {req.guardianName} ({req.guardianPhone}) | نوع التغيير: {req.requestType}
            </p>
          </div>
        </div>
        <StatusBadge variant="warning">{req.status}</StatusBadge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Address Comparison Panel */}
        <Card className="space-y-4">
          <h3 className="text-sm font-bold text-[#13233A] flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#1769E0]" /> مقارنة المواقع الفنية
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-[#F5F8FC] rounded-xl space-y-1 border border-[#E3EAF3]">
              <span className="text-[#66758A] block">العنوان الحالي المعتمد:</span>
              <span className="font-bold text-[#13233A]">{req.oldAddress}</span>
              <span className="text-[10px] text-[#66758A] block">الحافلة الحالية: {req.currentBus}</span>
            </div>

            <div className="p-3 bg-[#1769E0]/5 rounded-xl space-y-1 border border-[#1769E0]/20">
              <span className="text-[#1769E0] font-bold block">العنوان الجديد المطلوب:</span>
              <span className="font-bold text-[#13233A]">{req.newAddress}</span>
              <span className="text-[10px] text-[#103B75] block font-mono">
                فارق المسافة الإضافية: +{req.distanceDeltaKm} كم
              </span>
            </div>

            <div className="p-3 bg-[#F5F8FC] rounded-xl space-y-1">
              <span className="text-[#66758A] block">السبب المرفوع من ولي الأمر:</span>
              <span className="text-[#13233A]">{req.reason}</span>
            </div>
          </div>
        </Card>

        {/* Map Setup Comparison */}
        <MapSetupPanel title="تطابق إحداثيات الموقع الجديد" subtitle="نطاق تغطية الحافلات القريبة" />
      </div>

      {/* Decision Controls */}
      <Card className="space-y-4">
        <h3 className="text-sm font-bold text-[#13233A]">اتخاذ القرار وإعادة تخصيص الحافلة</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectInput
            label="إعادة تخصيص الحافلة والمسار"
            options={[
              { label: "حافلة رقم 304 - حي حطين (شمال)", value: "304" },
              { label: "حافلة رقم 205 - حي الياسمين (أ)", value: "205" },
            ]}
            value={proposedBus}
            onChange={(e) => setProposedBus(e.target.value)}
          />
          <TextInput
            label="تاريخ سريان العنوان الجديد"
            value={req.effectiveDate}
            readOnly
          />
        </div>

        <TextInput
          label="ملاحظات رد الإدارة لولي الأمر"
          value={responseNotes}
          onChange={(e) => setResponseNotes(e.target.value)}
        />

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            variant="danger"
            size="md"
            onClick={() => handleAction("مرفوض")}
            isLoading={isLoading}
            icon={<XCircle className="w-4 h-4" />}
          >
            رفض الطلب
          </Button>
          <Button
            variant="primary"
            size="lg"
            onClick={() => handleAction("مقبول")}
            isLoading={isLoading}
            icon={<CheckCircle2 className="w-4 h-4" />}
          >
            قبول وتطبيق العنوان الجديد
          </Button>
        </div>
      </Card>
    </div>
  );
}
