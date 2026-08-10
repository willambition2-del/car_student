"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { schoolStudentsApi } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  User,
  Phone,
  Bus,
  MapPin,
  CreditCard,
  History,
  ArrowRight,
  Edit,
  MapPinCheck,
  Calendar,
} from "lucide-react";

export default function StudentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"overview" | "guardian" | "bus">("overview");

  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const id = Array.isArray(params.id) ? params.id[0] : params.id;
        if (!id) return;
        const data = await schoolStudentsApi.getStudent(id);
        setStudent(data);
      } catch (err) {
        setError("فشل جلب بيانات الطالب");
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, [params.id]);

  if (loading) return <div className="p-8 text-center">جاري التحميل...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!student) return <div className="p-8 text-center">لم يتم العثور على الطالب</div>;

  return (
    <div className="space-y-6 text-right max-w-5xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" onClick={() => router.back()} icon={<ArrowRight className="w-4 h-4" />}>
            العودة
          </Button>
          <div>
            <h1 className="text-xl font-bold text-[#13233A]">{student.name}</h1>
            <p className="text-xs text-[#66758A]">
              رمز الطالب: <span className="font-mono font-bold text-[#103B75]">{student.code}</span> | {student.grade}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/students/${student.id}/history`}>
            <Button variant="outline" size="sm" icon={<History className="w-4 h-4" />}>
              سجل الرحلات
            </Button>
          </Link>
          <Link href={`/students/new?edit=${student.id}`}>
            <Button variant="primary" size="sm" icon={<Edit className="w-4 h-4" />}>
              تعديل البيانات
            </Button>
          </Link>
        </div>
      </div>

      {/* Top Main Student Profile Summary Card */}
      <Card className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#1769E0]/10 text-[#1769E0] flex items-center justify-center font-bold text-xl shrink-0">
            <User className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-[#13233A]">{student.name}</h2>
              <StatusBadge variant={student.status === "نشط" ? "success" : "warning"}>
                {student.status}
              </StatusBadge>
            </div>
            <div className="text-xs text-[#66758A]">
              {student.grade} - الشعبة ({student.section})
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 border-t md:border-t-0 md:border-r border-[#E3EAF3] pt-4 md:pt-0 md:pr-6">
          <div className="text-right">
            <span className="text-[11px] text-[#66758A] block">الحافلة والمسار</span>
            <span className="text-xs font-bold text-[#1769E0]">حافلة {student.busNumber}</span>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-[#66758A] block">رسوم النقل</span>
            <StatusBadge variant={student.subscriptionStatus === "مدفوع" ? "success" : "warning"}>
              {student.subscriptionStatus}
            </StatusBadge>
          </div>
        </div>
      </Card>

      {/* Tabs Navigation Header */}
      <div className="flex items-center gap-2 border-b border-[#E3EAF3] pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 rounded-xl transition-colors ${
            activeTab === "overview" ? "bg-[#1769E0] text-white" : "text-[#66758A] hover:bg-[#F5F8FC]"
          }`}
        >
          نظرة عامة ومحطات النقل
        </button>
        <button
          onClick={() => setActiveTab("guardian")}
          className={`px-4 py-2 rounded-xl transition-colors ${
            activeTab === "guardian" ? "bg-[#1769E0] text-white" : "text-[#66758A] hover:bg-[#F5F8FC]"
          }`}
        >
          بيانات ولي الأمر
        </button>
      </div>

      {/* Tab 1: Overview & Transport Details */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="space-y-4">
            <h3 className="text-sm font-bold text-[#13233A] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#1769E0]" /> نقاط الصعود والنزول السكنية
            </h3>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#F5F8FC] rounded-xl space-y-1">
                <span className="text-[#66758A] block text-[11px]">نقطة الصعود (المنزل):</span>
                <span className="font-bold text-[#13233A]">{student.pickupPoint}</span>
              </div>
              <div className="p-3 bg-[#F5F8FC] rounded-xl space-y-1">
                <span className="text-[#66758A] block text-[11px]">نقطة النزول (المدرسة):</span>
                <span className="font-bold text-[#13233A]">{student.dropoffPoint}</span>
              </div>
              <div className="flex items-center gap-2 text-[#16A461] font-bold text-[11px]">
                <MapPinCheck className="w-4 h-4" /> الموقع السكني معتمد ومربوط بنظام الإحداثيات GPS
              </div>
            </div>
          </Card>

          <Card className="space-y-4">
            <h3 className="text-sm font-bold text-[#13233A] flex items-center gap-2">
              <Bus className="w-4 h-4 text-[#12AFA5]" /> تفاصيل خط المسار والحافلة
            </h3>
            <div className="space-y-2 text-xs text-[#13233A]">
              <div className="flex items-center justify-between py-1.5 border-b border-[#E3EAF3]">
                <span className="text-[#66758A]">رقم الحافلة:</span>
                <span className="font-bold text-[#1769E0]">حافلة {student.busNumber}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-[#E3EAF3]">
                <span className="text-[#66758A]">اسم المسار المعتمد:</span>
                <span>{student.routeName}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-[#E3EAF3]">
                <span className="text-[#66758A]">السائق المسؤول:</span>
                <span>إبراهيم السعيد (0504433221)</span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-[#66758A]">المشرفة المرافقة:</span>
                <span>أمينة الحامد (0551122334)</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Tab 2: Guardian Details */}
      {activeTab === "guardian" && (
        <Card className="space-y-4 max-w-xl">
          <h3 className="text-sm font-bold text-[#13233A]">معلومات ولي الأمر المعتمدة للتواصل</h3>
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-[#F5F8FC] rounded-xl flex items-center justify-between">
              <span className="text-[#66758A]">الاسم:</span>
              <span className="font-bold text-[#13233A]">{student.guardianName}</span>
            </div>
            <div className="p-3 bg-[#F5F8FC] rounded-xl flex items-center justify-between">
              <span className="text-[#66758A]">رقم الجوال:</span>
              <span className="font-bold text-[#103B75] font-mono">{student.guardianPhone}</span>
            </div>
            <Button variant="primary" size="sm" icon={<Phone className="w-4 h-4" />}>
              إجراء اتصال مباشر بولي الأمر
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
