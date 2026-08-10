"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { schoolRoutesApi, schoolStudentsApi } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/badge";
import { ArrowRight, UserPlus, UserMinus, CheckCircle2, MapPin } from "lucide-react";

export default function RouteStudentAssignPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [route, setRoute] = useState<any>(null);
  const [assignedList, setAssignedList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (!params?.id) return;
        const fetchedRoute = await schoolRoutesApi.getRoute(params.id);
        setRoute(fetchedRoute);
        // Note: We might ideally filter on the server side, but since the mock did it on the client,
        // we'll fetch a batch of students or use the backend if it supported busNumber filtering.
        // Assuming we fetch all and filter or the backend returns them in a proper way.
        const studentsRes = await schoolStudentsApi.getStudents(1, 100);
        setAssignedList(studentsRes.items.filter((s: any) => s.busNumber === fetchedRoute.busNumber));
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
            <h1 className="text-xl font-bold text-[#13233A]">توزيع طلاب {route.name}</h1>
            <p className="text-xs text-[#66758A]">ربط الطلاب بمحطات التجمع الواقعة ضمن النطاق الجغرافي للمسار</p>
          </div>
        </div>
        <Button variant="primary" size="sm" onClick={() => router.push(`/routes/${route.id}`)}>
          حفظ وتأكيد التوزيع
        </Button>
      </div>

      <Card className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#E3EAF3] pb-2">
          <h3 className="text-sm font-bold text-[#13233A] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#16A461]" /> الطلاب المخصصون بالمسار ({assignedList.length})
          </h3>
        </div>
        <div className="space-y-2">
          {assignedList.map((st) => (
            <div key={st.id} className="p-3 bg-[#F5F8FC] rounded-xl flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-[#13233A] block">{st.name}</span>
                <span className="text-[10px] text-[#66758A]">{st.pickupPoint}</span>
              </div>
              <StatusBadge variant="info">مخصص بـ حافلة {st.busNumber}</StatusBadge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
