"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { TextInput, SelectInput } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapSetupPanel } from "@/components/ui/map-setup";
import { ArrowRight, Save, Route, Plus, Trash2, MapPin } from "lucide-react";

export default function NewRoutePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [routeName, setRouteName] = useState("مسار حي الملقا وحطين");
  const [routeType, setRouteType] = useState("صباحي");
  const [zone, setZone] = useState("شمال الرياض");
  const [busNumber, setBusNumber] = useState("205");

  const [stops, setStops] = useState([
    { id: 1, name: "محطة 1 - شارع أَنَس بن مالك", time: "06:30 ص" },
    { id: 2, name: "محطة 2 - تقاطع الملك فهد", time: "06:40 ص" },
    { id: 3, name: "محطة 3 - مدارس المستقبل الأهلية", time: "07:15 ص" },
  ]);

  const handleAddStop = () => {
    setStops((prev) => [
      ...prev,
      { id: Date.now(), name: `محطة جديدة (${prev.length + 1})`, time: "06:50 ص" },
    ]);
  };

  const handleRemoveStop = (id: number) => {
    setStops((prev) => prev.filter((s) => s.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      router.push("/routes");
    }, 800);
  };

  return (
    <div className="space-y-6 text-right max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#13233A]">محرر ومصمم مسارات النقل</h1>
          <p className="text-xs text-[#66758A] mt-0.5">تحديد نقاط التجمع ومحطات الصعود والجدول الزمني التقديري</p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => router.back()} icon={<ArrowRight className="w-4 h-4" />}>
          العودة
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="space-y-4">
          <div className="flex items-center gap-2 border-b border-[#E3EAF3] pb-3 font-bold text-sm text-[#103B75]">
            <Route className="w-4 h-4 text-[#1769E0]" /> بيانات المسار الأساسية
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              label="اسم المسار الرسمي"
              placeholder="مثال: مسار حي الياسمين (أ)"
              value={routeName}
              onChange={(e) => setRouteName(e.target.value)}
              required
            />
            <SelectInput
              label="نوع المسار"
              options={[
                { label: "صباحي", value: "صباحي" },
                { label: "مسائي", value: "مسائي" },
                { label: "مزدوج", value: "مزدوج" },
              ]}
              value={routeType}
              onChange={(e) => setRouteType(e.target.value)}
            />
            <TextInput
              label="المنطقة الجغرافية"
              placeholder="مثال: شمال الرياض"
              value={zone}
              onChange={(e) => setZone(e.target.value)}
              required
            />
            <SelectInput
              label="الحافلة المخصصة"
              options={[
                { label: "حافلة رقم 205", value: "205" },
                { label: "حافلة رقم 108", value: "108" },
                { label: "حافلة رقم 304", value: "304" },
              ]}
              value={busNumber}
              onChange={(e) => setBusNumber(e.target.value)}
            />
          </div>
        </Card>

        {/* Stops Order Editor & Map Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#E3EAF3] pb-2">
              <h3 className="text-sm font-bold text-[#13233A] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#1769E0]" /> ترتيب المحطات والجدول الزمني
              </h3>
              <Button type="button" variant="outline" size="sm" onClick={handleAddStop} icon={<Plus className="w-3.5 h-3.5" />}>
                إضافة محطة
              </Button>
            </div>

            <div className="space-y-3">
              {stops.map((stop, idx) => (
                <div key={stop.id} className="p-3 bg-[#F5F8FC] rounded-xl flex items-center justify-between text-xs gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#1769E0] text-white flex items-center justify-center font-bold text-[11px]">
                      {idx + 1}
                    </span>
                    <span className="font-bold text-[#13233A]">{stop.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[#66758A] text-[11px]">{stop.time}</span>
                    {stops.length > 1 && (
                      <button type="button" onClick={() => handleRemoveStop(stop.id)} className="text-[#E5484D] hover:opacity-80">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Interactive Map Preview Box */}
          <MapSetupPanel
            title="معاينة مسار الخط الجغرافي"
            subtitle="عرض محطات الصعود بالترتيب وموقع المدرسة"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="secondary" onClick={() => router.back()}>
            إلغاء
          </Button>
          <Button type="submit" variant="primary" icon={<Save className="w-4 h-4" />} isLoading={isLoading}>
            حفظ واعتماد المسار
          </Button>
        </div>
      </form>
    </div>
  );
}

