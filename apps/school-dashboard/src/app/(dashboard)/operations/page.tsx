"use client";

import React, { useState } from "react";
import { MapSetupPanel } from "@/components/ui/map-setup";
import { SearchInput, SelectInput } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bus as BusIcon, User, Navigation, Phone, MapPin, X, Shield, RefreshCw } from "lucide-react";
import { schoolStudentsApi, schoolBusesApi } from "@/lib/api";

export default function OperationsCenterPage() {
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [selectedBus, setSelectedBus] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedZone, setSelectedZone] = useState("الكل");
  const [students, setStudents] = useState<any[]>([]);
  const [buses, setBuses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [studentsRes, busesRes] = await Promise.all([
          schoolStudentsApi.getStudents(1, 100),
          schoolBusesApi.getBuses(1, 100)
        ]);
        setStudents(studentsRes.items || []);
        setBuses(busesRes.items || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-8 text-center text-[#66758A]">جاري التحميل...</div>;

  const filteredStudents = students.filter(
    (st) => (st.name || "").includes(searchQuery) || (st.busNumber || "").includes(searchQuery)
  );

  return (
    <div className="space-y-6 text-right">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#13233A]">مركز الرقابة والتشغيل المباشر</h1>
          <p className="text-xs text-[#66758A] mt-0.5">
            تتبع لحظي لأسطول الحافلات المدرسية والطلاب المحطة بالمحطة عبر خرائط GPS
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" icon={<RefreshCw className="w-4 h-4" />}>
            تحديث البيانات Live
          </Button>
        </div>
      </div>

      {/* Main Operations Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Side: Interactive Map & Map Controls */}
        <div className="lg:col-span-3 space-y-4">
          {/* Top Filter Toolbar */}
          <div className="bg-white p-4 rounded-2xl border border-[#E3EAF3] flex flex-wrap items-center justify-between gap-3 shadow-xs">
            <div className="w-full sm:w-64">
              <SearchInput
                placeholder="ابحث باسم الطالب أو رقم الحافلة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <SelectInput
                options={[
                  { label: "جميع المناطق", value: "الكل" },
                  { label: "شمال الرياض", value: "شمال" },
                  { label: "وسط الرياض", value: "وسط" },
                ]}
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
              />
            </div>
          </div>

          {/* Interactive Map Canvas Panel */}
          <MapSetupPanel
            title="خريطة التتبع المباشر لمدارس المستقبل الأهلية"
            subtitle="عرض المواقع المباشرة لـ 18 حافلة و 480 طالب مسجل"
            selectedStudentName={selectedStudent?.name}
            selectedBusNumber={selectedBus?.number}
          />
        </div>

        {/* Right Side: Bus & Student Nodes Drawer List */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-[#13233A]">الأسطول الميداني</h3>

          {/* Inspection Drawer for Selected Student Node */}
          {selectedStudent ? (
            <Card className="border-[#1769E0] bg-[#1769E0]/5 space-y-3 relative">
              <button
                onClick={() => setSelectedStudent(null)}
                className="absolute top-3 left-3 text-[#66758A] hover:text-[#13233A]"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1769E0] text-white flex items-center justify-center font-bold">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#13233A]">{selectedStudent.name}</h4>
                  <span className="text-xs text-[#66758A]">{selectedStudent.grade}</span>
                </div>
              </div>
              <div className="space-y-1.5 text-xs border-t border-[#E3EAF3] pt-3 text-[#13233A]">
                <div>
                  <span className="text-[#66758A]">حافلة رقم: </span>
                  <span className="font-bold">{selectedStudent.busNumber}</span>
                </div>
                <div>
                  <span className="text-[#66758A]">المسار: </span>
                  <span>{selectedStudent.routeName}</span>
                </div>
                <div>
                  <span className="text-[#66758A]">نقطة الصعود: </span>
                  <span>{selectedStudent.pickupPoint}</span>
                </div>
                <div>
                  <span className="text-[#66758A]">ولي الأمر: </span>
                  <span>
                    {selectedStudent.guardianName} ({selectedStudent.guardianPhone})
                  </span>
                </div>
                <div className="pt-2 flex items-center justify-between">
                  <StatusBadge variant={selectedStudent.status === "نشط" ? "success" : "warning"}>
                    {selectedStudent.status}
                  </StatusBadge>
                  <Button variant="outline" size="sm" icon={<Phone className="w-3.5 h-3.5" />}>
                    اتصال بولي الأمر
                  </Button>
                </div>
              </div>
            </Card>
          ) : selectedBus ? (
            <Card className="border-[#12AFA5] bg-[#12AFA5]/5 space-y-3 relative">
              <button
                onClick={() => setSelectedBus(null)}
                className="absolute top-3 left-3 text-[#66758A] hover:text-[#13233A]"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#12AFA5] text-white flex items-center justify-center font-bold">
                  <BusIcon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#13233A]">حافلة رقم {selectedBus.number}</h4>
                  <span className="text-xs text-[#66758A]">اللوحة: {selectedBus.plateNumber}</span>
                </div>
              </div>
              <div className="space-y-1.5 text-xs border-t border-[#E3EAF3] pt-3 text-[#13233A]">
                <div>
                  <span className="text-[#66758A]">السائق: </span>
                  <span className="font-bold">
                    {selectedBus.driverName} ({selectedBus.driverPhone})
                  </span>
                </div>
                <div>
                  <span className="text-[#66758A]">المشرفة: </span>
                  <span>
                    {selectedBus.supervisorName} ({selectedBus.supervisorPhone})
                  </span>
                </div>
                <div>
                  <span className="text-[#66758A]">الحمولة الحالية: </span>
                  <span className="font-bold text-[#1769E0]">
                    {selectedBus.assignedStudentsCount} / {selectedBus.capacity} طالب
                  </span>
                </div>
              </div>
            </Card>
          ) : (
            <div className="p-4 bg-[#F5F8FC] border border-[#E3EAF3] rounded-2xl text-xs text-[#66758A] text-center">
              اضغط على أي طالب أو حافلة لمعاينة تفاصيل التتبع والاتصال المباشر.
            </div>
          )}

          {/* Fleet Buses & Students Selector List */}
          <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
            <span className="text-xs font-bold text-[#66758A]">الحافلات النشطة</span>
            {buses.map((bus) => (
              <div
                key={bus.id}
                onClick={() => {
                  setSelectedBus(bus);
                  setSelectedStudent(null);
                }}
                className="p-3 bg-white border border-[#E3EAF3] hover:border-[#1769E0] rounded-xl cursor-pointer flex items-center justify-between text-xs transition-colors"
              >
                <div className="flex items-center gap-2">
                  <BusIcon className="w-4 h-4 text-[#1769E0]" />
                  <span className="font-bold text-[#13233A]">حافلة {bus.number}</span>
                </div>
                <StatusBadge variant={bus.status === "نشط" ? "success" : "warning"}>{bus.status}</StatusBadge>
              </div>
            ))}

            <span className="text-xs font-bold text-[#66758A] block pt-2">الطلاب المسجلون</span>
            {filteredStudents.map((st) => (
              <div
                key={st.id}
                onClick={() => {
                  setSelectedStudent(st);
                  setSelectedBus(null);
                }}
                className="p-3 bg-white border border-[#E3EAF3] hover:border-[#1769E0] rounded-xl cursor-pointer flex items-center justify-between text-xs transition-colors"
              >
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[#12AFA5]" />
                  <span className="font-bold text-[#13233A] truncate max-w-[140px]">{st.name}</span>
                </div>
                <span className="text-[10px] text-[#66758A]">باص {st.busNumber}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

