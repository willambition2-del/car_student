"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { schoolBusesApi, schoolStudentsApi } from "@/lib/api";
import { Card, StatsCard } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bus as BusIcon, UserCheck, Shield, Users, ArrowRight, UserPlus, Phone, Route } from "lucide-react";

export default function BusDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const [bus, setBus] = useState<any>(null);
  const [assignedStudents, setAssignedStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = Array.isArray(params.id) ? params.id[0] : params.id;
        if (id) {
          const busData = await schoolBusesApi.getBus(id);
          setBus(busData);
          
          const res = await schoolStudentsApi.getStudents(1, 1000);
          const students = res.items || [];
          setAssignedStudents(students.filter((s: any) => s.busNumber === busData.number));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [params.id]);

  if (loading) return <div>جاري التحميل...</div>;
  if (!bus) return <div>لم يتم العثور على الحافلة</div>;

  return (
    <div className="space-y-6 text-right max-w-5xl mx-auto">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" onClick={() => router.back()} icon={<ArrowRight className="w-4 h-4" />}>
            العودة
          </Button>
          <div>
            <h1 className="text-xl font-bold text-[#13233A]">تفاصيل حافلة رقم {bus.number}</h1>
            <p className="text-xs text-[#66758A]">
              رقم اللوحة: <span className="font-mono font-bold text-[#103B75]">{bus.plateNumber}</span> | {bus.type}
            </p>
          </div>
        </div>
        <Link href={`/buses/${bus.id}/assign`}>
          <Button variant="primary" size="sm" icon={<UserPlus className="w-4 h-4" />}>
            إدارة توزيع الطلاب ({bus.assignedStudentsCount}/{bus.capacity})
          </Button>
        </Link>
      </div>

      {/* Bus Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard
          title="حمولة المقاعد"
          value={`${bus.assignedStudentsCount} / ${bus.capacity}`}
          subtitle={`المتبقي ${bus.capacity - bus.assignedStudentsCount} مقعد`}
          icon={<Users className="w-5 h-5" />}
          color="#1769E0"
        />
        <StatsCard
          title="الفحص الفني"
          value="مفحوصة ومعتمدة"
          subtitle={`آخر صيانة: ${bus.lastSyncTime}`}
          icon={<Route className="w-5 h-5" />}
          color="#16A461"
        />
        <StatsCard
          title="الحالة التشغيلية"
          value={bus.status}
          subtitle="جاهزة للعمل الميداني"
          icon={<BusIcon className="w-5 h-5" />}
          color="#103B75"
        />
      </div>

      {/* Crew Info & Assigned Students */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Crew Box */}
        <Card className="space-y-4 md:col-span-1">
          <h3 className="text-sm font-bold text-[#13233A]">طاقم العمل الميداني</h3>
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-[#F5F8FC] rounded-xl space-y-1">
              <span className="text-[#66758A] block">السائق المسؤول:</span>
              <span className="font-bold text-[#13233A]">{bus.driverName}</span>
              <span className="font-mono text-[11px] text-[#1769E0] block">{bus.driverPhone}</span>
            </div>
            <div className="p-3 bg-[#F5F8FC] rounded-xl space-y-1">
              <span className="text-[#66758A] block">المشرفة المرافقة:</span>
              <span className="font-bold text-[#13233A]">{bus.supervisorName}</span>
              <span className="font-mono text-[11px] text-[#12AFA5] block">{bus.supervisorPhone}</span>
            </div>
          </div>
        </Card>

        {/* Assigned Students List */}
        <Card className="space-y-4 md:col-span-2">
          <div className="flex items-center justify-between border-b border-[#E3EAF3] pb-2">
            <h3 className="text-sm font-bold text-[#13233A]">الطلاب المسجلون بالحافلة ({assignedStudents.length})</h3>
            <Link href={`/buses/${bus.id}/assign`} className="text-xs font-bold text-[#1769E0] hover:underline">
              تعديل التوزيع
            </Link>
          </div>
          <div className="space-y-2">
            {assignedStudents.map((st) => (
              <div key={st.id} className="p-3 bg-[#F5F8FC] rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-[#13233A] block">{st.name}</span>
                  <span className="text-[10px] text-[#66758A]">{st.grade} - {st.pickupPoint}</span>
                </div>
                <StatusBadge variant="info">{st.status}</StatusBadge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
