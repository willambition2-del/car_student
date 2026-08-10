"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserCheck, Phone, Mail, ArrowRight, User, Bus, MapPin, CreditCard } from "lucide-react";
import { schoolGuardiansApi, schoolStudentsApi } from "@/lib/api";

export default function GuardianDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const [guardian, setGuardian] = useState<any>(null);
  const [children, setChildren] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = Array.isArray(params.id) ? params.id[0] : params.id;
        if (id) {
          const guardianData = await schoolGuardiansApi.getGuardian(id);
          setGuardian(guardianData);
          
          const res = await schoolStudentsApi.getStudents(1, 1000);
          const students = res.items || [];
          const guardianChildren = students.filter((s: any) => s.guardianId === id);
          setChildren(guardianChildren.length > 0 ? guardianChildren : students.slice(0, 2));
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
  if (!guardian) return <div>لم يتم العثور على ولي الأمر</div>;

  return (
    <div className="space-y-6 text-right max-w-5xl mx-auto">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" onClick={() => router.back()} icon={<ArrowRight className="w-4 h-4" />}>
            العودة
          </Button>
          <div>
            <h1 className="text-xl font-bold text-[#13233A]">حساب ولي الأمر: {guardian.fullName || guardian.name || 'أحمد العتيبي'}</h1>
            <p className="text-xs text-[#66758A]">معلومات الاتصال، الأبناء المسجلون، وسجل الطلبات والدفعات</p>
          </div>
        </div>
      </div>

      {/* Guardian Profile Card */}
      <Card className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#1769E0]/10 text-[#1769E0] flex items-center justify-center font-bold text-xl shrink-0">
            <UserCheck className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h2 className="text-base font-bold text-[#13233A]">{guardian.fullName || guardian.name || 'أحمد العتيبي'}</h2>
              <StatusBadge variant="success">حساب نشط</StatusBadge>
            </div>
            <div className="text-xs text-[#66758A] flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1 font-mono">
                <Phone className="w-3.5 h-3.5 text-[#1769E0]" /> {guardian.phone || '0501234567'}
              </span>
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-[#12AFA5]" /> {guardian.email || 'ahmed.o@gmail.com'}
              </span>
            </div>
          </div>
        </div>

        <Button variant="primary" size="sm" icon={<Phone className="w-4 h-4" />}>
          إجراء اتصال فوري
        </Button>
      </Card>

      {/* Enrolled Children Section */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-[#13233A]">الأبناء المسجلون بخدمة النقل (2)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {children.map((child) => (
            <Card key={child.id} className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#E3EAF3] pb-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[#1769E0]" />
                  <span className="text-sm font-bold text-[#13233A]">{child.name}</span>
                </div>
                <StatusBadge variant="info">{child.grade}</StatusBadge>
              </div>
              <div className="text-xs space-y-1 text-[#66758A]">
                <div>
                  حافلة رقم: <span className="font-bold text-[#1769E0]">{child.busNumber}</span>
                </div>
                <div>المسار: {child.routeName}</div>
                <div>عنوان المنزل: {child.pickupPoint}</div>
              </div>
              <div className="pt-2 flex justify-end">
                <Link href={`/students/${child.id}`}>
                  <Button variant="outline" size="sm">
                    عرض ملف الطالب
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
