"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { ArrowRight, Save, ToggleLeft, ToggleRight, RefreshCw } from "lucide-react";
import { schoolSettingsApi } from "@/lib/api";

const defaultFeaturesList = [
  { key: "address_change", nameAr: "طلبات تغيير العنوان السكني", isEnabled: true },
  { key: "offline_sync", nameAr: "المزامنة الميدانية بدون إنترنت (Offline Sync)", isEnabled: true },
  { key: "absence_requests", nameAr: "طلبات الغياب المسبق والإشعار", isEnabled: true },
  { key: "financial_module", nameAr: "وحدة الرسوم والتحصيل المالي", isEnabled: true },
];

export default function FeatureSettingsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [features, setFeatures] = useState<any[]>(defaultFeaturesList);

  const fetchFeatures = async () => {
    setIsFetching(true);
    try {
      const data = await schoolSettingsApi.getEnabledFeatures();
      if (data && data.length > 0) {
        setFeatures(data);
      }
    } catch {
      // Fallback
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchFeatures();
  }, []);

  const toggleFeature = (key: string) => {
    setFeatures((prev) =>
      prev.map((f) => (f.key === key ? { ...f, isEnabled: !f.isEnabled } : f))
    );
  };

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push("/settings");
    }, 600);
  };

  return (
    <div className="space-y-6 text-right max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" onClick={() => router.back()} icon={<ArrowRight className="w-4 h-4" />}>
            العودة
          </Button>
          <div>
            <h1 className="text-xl font-bold text-[#13233A]">تخصيص ميزات المنصة (Feature Flags)</h1>
            <p className="text-xs text-[#66758A]">عرض وتخصيص الميزات المفعّلة بحسب باقة واحتياج المدرسة</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchFeatures} isLoading={isFetching} icon={<RefreshCw className="w-4 h-4" />}>
            تحديث
          </Button>
          <Button variant="primary" size="sm" onClick={handleSave} isLoading={isLoading} icon={<Save className="w-4 h-4" />}>
            حفظ الميزات
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {features.map((f) => (
          <Card key={f.key} className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#13233A]">{f.nameAr || f.name || f.key}</h3>
                <StatusBadge variant={f.isEnabled ? "success" : "neutral"}>
                  {f.isEnabled ? "مفعّلة" : "معطّلة"}
                </StatusBadge>
              </div>
              <p className="text-xs text-[#66758A]">رمز الميزة المعتمد بالنظام: <code className="font-mono bg-[#F5F8FC] px-1 rounded">{f.key}</code></p>
            </div>
            <button onClick={() => toggleFeature(f.key)} className="text-[#1769E0] hover:opacity-80">
              {f.isEnabled ? (
                <ToggleRight className="w-8 h-8 text-[#1769E0]" />
              ) : (
                <ToggleLeft className="w-8 h-8 text-[#66758A]" />
              )}
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}

