"use client";

import React, { useEffect,  useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FeatureFlag } from "@/mock/mockData";
import { Sliders, ToggleRight, ToggleLeft, Settings2 } from "lucide-react";

export default function FeaturesPage() {

  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/features")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch data");
        return res.json();
      })
      .then((data) => {
        setFlags(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>جاري التحميل...</div>;
  if (error) return <div className="text-red-500">حدث خطأ: {error}</div>;

  const toggleFlag = (id: string) => {
    setFlags((prev) =>
      prev.map((f) => (f.id === id ? { ...f, enabledGlobal: !f.enabledGlobal } : f))
    );
  };

  return (
    <div className="space-y-6 text-right max-w-5xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#13233A]">إدارة ميزات المنصة العامة (Global Feature Flags)</h1>
          <p className="text-xs text-[#66758A] mt-0.5">
            التحكم في الميزات المتوفرة عبر خطط SaaS وتحديد المستويات الفنية
          </p>
        </div>
        <Link href="/features/customize">
          <Button variant="secondary" icon={<Settings2 className="w-4 h-4" />}>
            تخصيص استثناءات لمدارس محددة
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {flags.map((flag) => (
          <Card key={flag.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5">
            <div className="space-y-1.5">
              <div className="flex items-center gap-3">
                <Sliders className="w-5 h-5 text-[#1769E0]" />
                <h3 className="text-base font-bold text-[#13233A]">{flag.name}</h3>
                <StatusBadge variant={flag.enabledGlobal ? "success" : "neutral"}>
                  {flag.enabledGlobal ? "مفعلة عالمياً" : "معطلة"}
                </StatusBadge>
              </div>
              <p className="text-xs text-[#66758A]">{flag.description}</p>
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[11px] text-[#66758A]">الباقات المخولة:</span>
                {flag.plansAllowed.map((p, idx) => (
                  <StatusBadge key={idx} variant="info" className="text-[10px]">
                    {p}
                  </StatusBadge>
                ))}
              </div>
            </div>

            <button onClick={() => toggleFlag(flag.id)} className="text-[#1769E0] hover:opacity-80">
              {flag.enabledGlobal ? (
                <ToggleRight className="w-9 h-9 text-[#1769E0]" />
              ) : (
                <ToggleLeft className="w-9 h-9 text-[#66758A]" />
              )}
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}
