"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { StatsCard, Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { platformOverviewApi } from "@/lib/api";
import { School, DollarSign, Users, Bus as BusIcon, TrendingUp, Plus, RefreshCw } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function PlatformOverviewPage() {
  const [overview, setOverview] = useState<any>({
    totalSchools: 1,
    activeSchools: 1,
    trialSchools: 0,
    suspendedSchools: 0,
    totalStudents: 2,
    totalBuses: 1,
    monthlyRecurringRevenue: 50000,
  });
  const [chartData, setChartData] = useState<any[]>([
    { month: "يناير", mrr: 210000 },
    { month: "فبراير", mrr: 230000 },
    { month: "مارس", mrr: 245000 },
    { month: "أبريل", mrr: 260000 },
    { month: "مايو", mrr: 275000 },
    { month: "يونيو", mrr: 284000 },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [ovData, statsData] = await Promise.all([
        platformOverviewApi.getOverview(),
        platformOverviewApi.getStats(),
      ]);
      if (ovData) setOverview(ovData);
      if (statsData && statsData.mrrGrowth) setChartData(statsData.mrrGrowth);
    } catch {
      // Fallback to initial state
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-6 text-right">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#13233A]">لوحة الإشراف العامة لمالك المنصة</h1>
          <p className="text-xs text-[#66758A] mt-0.5">
            متابعة أداء المدارس المستضافة، الإيراد التكراري الشهري (MRR)، ونمو المنظومة
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchData} isLoading={isLoading} icon={<RefreshCw className="w-4 h-4" />}>
            تحديث
          </Button>
          <Link href="/overview/stats">
            <Button variant="secondary" icon={<TrendingUp className="w-4 h-4" />}>
              إحصائيات النمو التفصيلية
            </Button>
          </Link>
          <Link href="/schools/new">
            <Button variant="primary" icon={<Plus className="w-4 h-4" />}>
              إضافة مدرسة جديدة
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatsCard
          title="إجمالي المدارس المستضافة"
          value={`${overview.totalSchools} مدرسة`}
          subtitle={`${overview.activeSchools} نشطة | ${overview.trialSchools} تجريبية`}
          icon={<School className="w-5 h-5" />}
          color="#1769E0"
        />
        <StatsCard
          title="الإيراد التكراري الشهري (MRR)"
          value={`${Number(overview.monthlyRecurringRevenue || 0).toLocaleString("en-US")} ر.س`}
          subtitle="+12% مقارنة بالشهر السابق"
          icon={<DollarSign className="w-5 h-5" />}
          color="#16A461"
        />
        <StatsCard
          title="إجمالي الطلاب المنقولين"
          value={`${Number(overview.totalStudents || 0).toLocaleString("en-US")} طالب`}
          subtitle="عبر جميع المدارس"
          icon={<Users className="w-5 h-5" />}
          color="#103B75"
        />
        <StatsCard
          title="إجمالي أسطول الحافلات"
          value={`${overview.totalBuses} حافلة`}
          subtitle="مجهزة ومتصلة بالتطبيق"
          icon={<BusIcon className="w-5 h-5" />}
          color="#12AFA5"
        />
      </div>

      {/* MRR Growth Chart Section */}
      <Card className="space-y-4">
        <h3 className="text-sm font-bold text-[#13233A] flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[#16A461]" /> منحنى نمو الإيراد التكراري الشهري (MRR Growth)
        </h3>
        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E3EAF3" />
              <XAxis dataKey="month" stroke="#66758A" fontSize={12} />
              <YAxis stroke="#66758A" fontSize={12} />
              <Tooltip />
              <Area type="monotone" dataKey="mrr" stroke="#16A461" fill="#16A461" fillOpacity={0.15} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
