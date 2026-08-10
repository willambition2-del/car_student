"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { schoolBusesApi, schoolStudentsApi } from "@/lib/api";

type Student = any;
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/badge";
import { ArrowRight, UserPlus, UserMinus, AlertTriangle, CheckCircle2, Users } from "lucide-react";

export default function BusStudentAssignPage() {
  const params = useParams();
  const router = useRouter();

  const [bus, setBus] = useState<any>(null);
  const [assignedList, setAssignedList] = useState<Student[]>([]);
  const [unassignedList, setUnassignedList] = useState<Student[]>([]);
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
          
          setAssignedList(students.filter((s: any) => s.busNumber === busData.number));
          setUnassignedList(students.filter((s: any) => s.busNumber !== busData.number));
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

  const [searchQuery, setSearchQuery] = useState("");
  const capacity = bus.capacity;
  const isFull = assignedList.length >= capacity;

  const handleAddStudent = (student: Student) => {
    if (isFull) return;
    setUnassignedList((prev) => prev.filter((s) => s.id !== student.id));
    setAssignedList((prev) => [...prev, { ...student, busNumber: bus.number }]);
  };

  const handleRemoveStudent = (student: Student) => {
    setAssignedList((prev) => prev.filter((s) => s.id !== student.id));
    setUnassignedList((prev) => [...prev, { ...student, busNumber: "غير مخصص" }]);
  };

  return (
    <div className="space-y-6 text-right max-w-5xl mx-auto">
      {/* Header Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" onClick={() => router.back()} icon={<ArrowRight className="w-4 h-4" />}>
            العودة
          </Button>
          <div>
            <h1 className="text-xl font-bold text-[#13233A]">توزيع الطلاب - حافلة رقم {bus.number}</h1>
            <p className="text-xs text-[#66758A]">إضافة ونقل الطلاب وضبط سعة المقاعد المتاحة بحافلات المدرسة</p>
          </div>
        </div>
        <Button variant="primary" size="sm" onClick={() => router.push(`/buses/${bus.id}`)}>
          حفظ وتأكيد التوزيع
        </Button>
      </div>

      {/* Capacity Indicator Bar */}
      <Card className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="flex items-center gap-2 text-[#13233A]">
            <Users className="w-4 h-4 text-[#1769E0]" /> سعة المقاعد المستغلة: {assignedList.length} / {capacity}
          </span>
          <span className={isFull ? "text-[#E5484D]" : "text-[#16A461]"}>
            {isFull ? "الحافلة مكتملة العدد بالكامل" : `متبقي ${capacity - assignedList.length} مقاعد شاغرة`}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 bg-[#E3EAF3] rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${isFull ? "bg-[#E5484D]" : "bg-[#1769E0]"}`}
            style={{ width: `${Math.min((assignedList.length / capacity) * 100, 100)}%` }}
          />
        </div>

        {isFull && (
          <div className="p-3 bg-[#E5484D]/10 border border-[#E5484D]/20 rounded-xl text-xs text-[#E5484D] font-bold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            تحذير: وصلت الحافلة للحد الأقصى للمقاعد ({capacity} راكب). لا يمكن إضافة المزيد تجنبًا للتكدس.
          </div>
        )}
      </Card>

      {/* Two Column Selector Transfer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Currently Assigned Students */}
        <Card className="space-y-4">
          <h3 className="text-sm font-bold text-[#13233A] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#16A461]" /> الطلاب الحاليون بالحافلة ({assignedList.length})
          </h3>
          <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
            {assignedList.map((st) => (
              <div
                key={st.id}
                className="p-3 bg-[#F5F8FC] border border-[#E3EAF3] rounded-xl flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-[#13233A] block">{st.name}</span>
                  <span className="text-[10px] text-[#66758A]">{st.grade}</span>
                </div>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleRemoveStudent(st)}
                  icon={<UserMinus className="w-3.5 h-3.5" />}
                >
                  إزالة
                </Button>
              </div>
            ))}
          </div>
        </Card>

        {/* Right Column: Unassigned / Available Students */}
        <Card className="space-y-4">
          <h3 className="text-sm font-bold text-[#13233A] flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-[#1769E0]" /> طلاب غير مخصصين أو متاحون للنقل ({unassignedList.length})
          </h3>
          <SearchInput
            placeholder="ابحث بالطالب..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
            {unassignedList.map((st) => (
              <div
                key={st.id}
                className="p-3 bg-white border border-[#E3EAF3] rounded-xl flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-[#13233A] block">{st.name}</span>
                  <span className="text-[10px] text-[#66758A]">{st.pickupPoint}</span>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  disabled={isFull}
                  onClick={() => handleAddStudent(st)}
                  icon={<UserPlus className="w-3.5 h-3.5" />}
                >
                  تخصيص
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
