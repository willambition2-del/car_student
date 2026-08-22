"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserPlus, Lock, Mail, RefreshCw, AlertCircle } from "lucide-react";
import { platformUsersApi, UserProfile } from "@/lib/api";

export default function PlatformUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await platformUsersApi.getUsers();
      if (data && data.items) {
        setUsers(data.items);
      }
    } catch {
      // Offline / error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const columns: Column<any>[] = [
    {
      header: "اسم مستخدم المنصة",
      accessor: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-[#13233A]">{row.fullName || row.name}</span>
          <span className="text-[10px] text-[#66758A] flex items-center gap-1 font-mono">
            <Mail className="w-3 h-3 text-[#1769E0]" /> {row.email}
          </span>
        </div>
      ),
    },
    {
      header: "رقم الجوال",
      accessor: (row) => <span className="font-mono text-xs font-bold text-[#103B75]">{row.phone || "غير محدد"}</span>,
    },
    {
      header: "الدور بالنظام",
      accessor: (row) => <StatusBadge variant="info">{row.role}</StatusBadge>,
    },
    {
      header: "آخر تسجيل دخول",
      accessor: (row) => <span className="font-mono text-xs text-[#66758A]">{row.lastLoginAt || row.lastLogin || "اليوم"}</span>,
    },
    {
      header: "الحالة",
      accessor: (row) => (
        <StatusBadge variant={row.isActive !== false ? "success" : "error"}>
          {row.isActive !== false ? "نشط" : "معطل"}
        </StatusBadge>
      ),
    },
    {
      header: "الإجراءات",
      accessor: () => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            تعديل
          </Button>
          <Button variant="outline" size="sm" className="text-[#E5484D]">
            تعطيل
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 text-right">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#13233A]">مستخدمو ومسؤولو لوحة مالك المنصة</h1>
          <p className="text-xs text-[#66758A] mt-0.5">إدارة حسابات مهندسي ومدراء المنظومة والتحكم بالصلاحيات السيادية</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchUsers} isLoading={isLoading} icon={<RefreshCw className="w-4 h-4" />}>
            تحديث
          </Button>
          <Link href="/roles">
            <Button variant="secondary" icon={<Lock className="w-4 h-4" />}>
              إدارة الصلاحيات والأدوار
            </Button>
          </Link>
          <Button variant="primary" icon={<UserPlus className="w-4 h-4" />}>
            إضافة مدير منصة جديد
          </Button>
        </div>
      </div>

      <DataTable columns={columns} data={users} searchPlaceholder="ابحث باسم المستخدم أو البريد..." />
    </div>
  );
}
