"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { StatsCard, Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Bus,
  Users,
  Navigation,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  ShieldAlert,
  Play,
} from "lucide-react";
import { schoolTripsApi, schoolAddressRequestsApi } from "@/lib/api";

export default function DashboardPage() {
  const [trips, setTrips] = useState<any[]>([]);
  const [addressRequests, setAddressRequests] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tripsData, addressRequestsData] = await Promise.all([
          schoolTripsApi.getTrips(1, 5),
          schoolAddressRequestsApi.getRequests(1, 5, "قيد المراجعة")
        ]);
        setTrips(tripsData?.items || []);
        setAddressRequests(addressRequestsData?.items || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6 text-right">
      {/* Header Welcome Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E3EAF3] shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-[#13233A]">مرحبًا بك، أحمد المحمد 👋</h1>
          <p className="text-xs text-[#66758A] mt-1">
            لوحة الرقابة والتشغيل اليومي لـ <span className="font-bold text-[#103B75]">مدارس المستقبل الأهلية</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/operations">
            <Button variant="primary" icon={<Navigation className="w-4 h-4" />}>
              مركز التشغيل المباشر
            </Button>
          </Link>
        </div>
      </div>

      {/* Overview Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="الرحلات النشطة اليوم"
          value="12 / 14"
          subtitle="رحلات صباحية في الطريق"
          icon={<Clock className="w-6 h-6" />}
          color="#1769E0"
        />
        <StatsCard
          title="الحافلات المشغلة"
          value="18"
          subtitle="من أصل 20 حافلة جاهزة"
          icon={<Bus className="w-6 h-6" />}
          color="#103B75"
        />
        <StatsCard
          title="الطلاب المنقولون"
          value="480"
          subtitle="مشتركون في خدمة النقل"
          icon={<Users className="w-6 h-6" />}
          color="#12AFA5"
        />
        <StatsCard
          title="طلبات تغيير العنوان"
          value="3"
          subtitle="تنتظر المراجعة الفنية"
          icon={<MapPin className="w-6 h-6" />}
          color="#F2A31B"
        />
      </div>

      {/* Middle Section: Active Trips & Recent Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Trips Live Progress */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#13233A]">الرحلات الجارية الآن</h3>
            <Link href="/trips" className="text-xs font-bold text-[#1769E0] hover:underline">
              عرض جميع الرحلات
            </Link>
          </div>

          <div className="space-y-3">
            {trips.length === 0 && <p className="text-sm text-gray-500">لا توجد رحلات جارية حالياً.</p>}
            {trips.map((trip) => (
              <Card key={trip.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#1769E0]/10 text-[#1769E0] flex items-center justify-center font-bold text-sm shrink-0">
                    {trip.busNumber}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-[#13233A]">{trip.routeName}</span>
                    <span className="text-xs text-[#66758A]">
                      السائق: {trip.driverName} | المشرفة: {trip.supervisorName}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="text-left sm:text-right">
                    <div className="text-xs font-bold text-[#13233A]">
                      {trip.boardedStudents} / {trip.expectedStudents} طالب صعدوا
                    </div>
                    <div className="text-[10px] text-[#66758A]">انطلقت {trip.startTime}</div>
                  </div>
                  <StatusBadge variant={trip.status === "مكتملة" ? "success" : "warning"}>
                    {trip.status}
                  </StatusBadge>
                  <Link href={`/trips/${trip.id}`}>
                    <Button variant="secondary" size="sm" icon={<ArrowUpRight className="w-4 h-4" />}>
                      تفاصيل
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions & System Health Widget */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-[#13233A]">الإشعارات والتنبيهات الميدانية</h3>

          <Card className="space-y-3 bg-[#F2A31B]/5 border-[#F2A31B]/30">
            <div className="flex items-center gap-2 text-[#F2A31B]">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h4 className="text-xs font-bold">تأخر رحلة حافلة رقم 108</h4>
            </div>
            <p className="text-xs text-[#66758A] leading-relaxed">
              تأخرت الحافلة 108 بمقدار 12 دقيقة بسبب ازدحام مروري بطريق العليا. المشرفة متابعة للوضع.
            </p>
            <div className="pt-1 flex items-center justify-between text-[11px] text-[#66758A]">
              <span>منذ 8 دقائق</span>
              <Link href="/trips/trp-102" className="text-[#1769E0] font-bold hover:underline">
                تتبع الحافلة ⬅️
              </Link>
            </div>
          </Card>

          <Card className="space-y-3">
            <h4 className="text-xs font-bold text-[#13233A]">طلبات تغيير العنوان الجديدة</h4>
            {addressRequests.length === 0 && <p className="text-xs text-[#66758A]">لا توجد طلبات جديدة.</p>}
            {addressRequests.slice(0, 2).map((req) => (
              <div key={req.id} className="p-3 bg-[#F5F8FC] rounded-xl space-y-1 text-xs">
                <div className="flex items-center justify-between font-bold text-[#13233A]">
                  <span>{req.studentName}</span>
                  <StatusBadge variant="warning">{req.status}</StatusBadge>
                </div>
                <div className="text-[11px] text-[#66758A]">إلى: {req.newAddress}</div>
              </div>
            ))}
            <Link href="/address-requests" className="block text-center text-xs font-bold text-[#1769E0] hover:underline pt-1">
              إدارة جميع الطلبات ({addressRequests.length})
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}

