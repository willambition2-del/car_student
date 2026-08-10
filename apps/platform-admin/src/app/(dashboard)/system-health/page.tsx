"use client";

import React from "react";
import Link from "next/link";
import { Card, StatsCard } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity, Server, Database, Cpu, HardDrive, AlertTriangle, ShieldCheck } from "lucide-react";

export default function SystemHealthPage() {
  const services = [
    { name: "NestJS Backend API Gateway", status: "سليم 99.99%", latency: "42ms", icon: <Server className="w-5 h-5 text-[#1769E0]" /> },
    { name: "PostgreSQL Multi-Tenant DB Cluster", status: "سليم 99.98%", latency: "14ms", icon: <Database className="w-5 h-5 text-[#16A461]" /> },
    { name: "Redis Realtime Cache & Sessions", status: "سليم 100%", latency: "2ms", icon: <Cpu className="w-5 h-5 text-[#12AFA5]" /> },
    { name: "Socket.IO Real-time Events Gateway (Trip & Boarding)", status: "نشط 100%", latency: "18ms", icon: <Activity className="w-5 h-5 text-[#103B75]" /> },
  ];

  return (
    <div className="space-y-6 text-right max-w-5xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#13233A]">صحة الخوادم والخدمات الدقيقة (System Health)</h1>
          <p className="text-xs text-[#66758A] mt-0.5">متابعة الأداء الحي لقواعد البيانات، الـ API، وسرعة الاستجابة</p>
        </div>
        <Link href="/system-health/errors">
          <Button variant="secondary" icon={<AlertTriangle className="w-4 h-4 text-[#E5484D]" />}>
            سجل الاستثناءات والبلاغات البرمجية
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((srv, idx) => (
          <Card key={idx} className="flex items-center justify-between p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F5F8FC] flex items-center justify-center">
                {srv.icon}
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-[#13233A]">{srv.name}</h3>
                <span className="text-[10px] text-[#66758A] block font-mono">زمن الاستجابة: {srv.latency}</span>
              </div>
            </div>
            <StatusBadge variant="success">{srv.status}</StatusBadge>
          </Card>
        ))}
      </div>
    </div>
  );
}
