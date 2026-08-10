"use client";

import React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { schoolRoutesApi, schoolStudentsApi } from "@/lib/api";
import { Card, StatsCard } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapSetupPanel } from "@/components/ui/map-setup";
import { Route, MapPin, Clock, Users, ArrowRight, UserPlus, Bus as BusIcon } from "lucide-react";

export default function RouteDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [route, setRoute] = React.useState<any>(null);
  const [routeStudents, setRouteStudents] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (!params?.id) return;
        const fetchedRoute = await schoolRoutesApi.getRoute(params.id);
        setRoute(fetchedRoute);
        const studentsRes = await schoolStudentsApi.getStudents(1, 100);
        setRouteStudents(studentsRes.items.filter((s: any) => s.busNumber === fetchedRoute.busNumber));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [params?.id]);

  if (loading) return <div className="p-8 text-center text-[#66758A]">جاري التحميل...</div>;
  if (!route) return <div className="p-8 text-center text-red-500">حدث خطأ أثناء جلب المسار</div>;

  return (
    <div className="space-y-6 text-right max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" onClick={() => router.back()} icon={<ArrowRight className="w-4 h-4" />}>
            العودة
          </Button>
          <div>
            <h1 className="text-xl font-bold text-[#13233A]">تفاصيل {route.name}</h1>
            <p className="text-xs text-[#66758A]">المنطقة: {route.zone} | النوع: {route.type}</p>
          </div>
        </div>
        <Link href={`/routes/${route.id}/assign`}>
          <Button variant="primary" size="sm" icon={<UserPlus className="w-4 h-4" />}>
            توزيع الطلاب على المحطات
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard
          title="الطلاب المسجلون"
          value={`${route.studentsCount} طالب`}
          subtitle={`الحافلة ${route.busNumber}`}
          icon={<Users className="w-5 h-5" />}
          color="#1769E0"
        />
        <StatsCard
          title="عدد المحطات"
          value={`${route.stopsCount} مواقف`}
          subtitle="توقفات تجميع مبرمجة"
          icon={<MapPin className="w-5 h-5" />}
          color="#12AFA5"
        />
        <StatsCard
          title="الزمن والمسافة"
          value={`${route.estimatedTimeMinutes} دقيقة`}
          subtitle={`المسافة الكلية ${route.distanceKm} كم`}
          icon={<Clock className="w-5 h-5" />}
          color="#103B75"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Stops Order Timeline */}
        <Card className="space-y-4">
          <h3 className="text-sm font-bold text-[#13233A] flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#1769E0]" /> التسلسل الزمني للمحطات
          </h3>
          <div className="space-y-3 relative border-r-2 border-[#1769E0]/20 mr-3 pr-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-[#13233A]">محطة 1: حي الياسمين - المربع 4</span>
              <span className="text-[10px] text-[#66758A] block font-mono">06:45 ص | 8 طلاب صاعدين</span>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold text-[#13233A]">محطة 2: تقاطع شارع العليا</span>
              <span className="text-[10px] text-[#66758A] block font-mono">07:00 ص | 12 طالب صاعدين</span>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold text-[#16A461]">الوصول: مدارس المستقبل الأهلية</span>
              <span className="text-[10px] text-[#66758A] block font-mono">07:25 ص | تفريغ جميع الطلاب</span>
            </div>
          </div>
        </Card>

        {/* Map Preview Panel */}
        <MapSetupPanel title={`خريطة مسار ${route.name}`} subtitle="تتبع النودز والمحطات" />
      </div>
    </div>
  );
}
