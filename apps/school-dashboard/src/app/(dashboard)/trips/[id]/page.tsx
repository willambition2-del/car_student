"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { schoolTripsApi } from "@/lib/api";
import { Card, StatsCard } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapSetupPanel } from "@/components/ui/map-setup";
import { Clock, CheckCircle2, UserCheck, XCircle, ArrowRight, Bus as BusIcon, AlertTriangle } from "lucide-react";

export default function TripDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const id = Array.isArray(params.id) ? params.id[0] : params.id;
        if (!id) return;
        const data = await schoolTripsApi.getTrip(id);
        setTrip(data);
      } catch (err) {
        setError("فشل جلب بيانات الرحلة");
      } finally {
        setLoading(false);
      }
    };
    fetchTrip();
  }, [params.id]);

  if (loading) return <div className="p-8 text-center">جاري التحميل...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!trip) return <div className="p-8 text-center">لم يتم العثور على الرحلة</div>;

  return (
    <div className="space-y-6 text-right max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" onClick={() => router.back()} icon={<ArrowRight className="w-4 h-4" />}>
            العودة
          </Button>
          <div>
            <h1 className="text-xl font-bold text-[#13233A]">الخط الزمني للرحلة: {trip.tripNumber}</h1>
            <p className="text-xs text-[#66758A]">
              حافلة رقم {trip.busNumber} | المسار: {trip.routeName}
            </p>
          </div>
        </div>
        <StatusBadge variant={trip.status === "مكتملة" ? "success" : "info"}>{trip.status}</StatusBadge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatsCard title="المتوقع حضورهم" value={`${trip.expectedStudents} طالب`} icon={<Clock className="w-5 h-5" />} color="#1769E0" />
        <StatsCard title="صعدوا الحافلة" value={`${trip.boardedStudents} طالب`} icon={<CheckCircle2 className="w-5 h-5" />} color="#16A461" />
        <StatsCard title="الطلاب الغائبون" value={`${trip.absentStudents} طالب`} icon={<XCircle className="w-5 h-5" />} color="#E5484D" />
        <StatsCard title="تم تفريغهم بالمدرسة" value={`${trip.arrivedStudents} طالب`} icon={<UserCheck className="w-5 h-5" />} color="#103B75" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Timeline Events Column */}
        <Card className="space-y-4">
          <h3 className="text-sm font-bold text-[#13233A] flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#1769E0]" /> الأحداث والمحطات الزمنية
          </h3>
          <div className="space-y-4 relative border-r-2 border-[#1769E0] mr-3 pr-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-[#13233A]">06:45 ص - انطلاق الحافلة من الموقف</span>
              <span className="text-[10px] text-[#66758A] block">السائق إبراهيم السعيد / المشرفة أمينة الحامد</span>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold text-[#13233A]">06:58 ص - الوصول للمحطة الأولى (حي الياسمين)</span>
              <span className="text-[10px] text-[#16A461] font-bold block">تم تسجيل صعود 12 طالب بنجاح عبر التطبيق</span>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold text-[#103B75]">07:22 ص - الوصول للبوابة الشرقية للمدرسة</span>
              <span className="text-[10px] text-[#16A461] font-bold block">تأكيد توثيق تفريغ الحافلة كاملاً وتأمين سلامة الطلاب</span>
            </div>
          </div>
        </Card>

        <MapSetupPanel title={`تتبع موقع رحلة حافلة ${trip.busNumber}`} subtitle="موقع الحافلة الحي والمسار" />
      </div>
    </div>
  );
}
