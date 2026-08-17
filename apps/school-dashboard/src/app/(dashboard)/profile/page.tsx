"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TextInput, PasswordInput } from "@/components/ui/input";
import { User, Lock, LogOut, ShieldCheck, Save } from "lucide-react";
import { authApi } from "@/lib/api";

export default function ProfileSecurityPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }, 800);
  };

  const handleLogout = async () => {
    await authApi.logout();
    router.push("/login");
  };

  return (
    <div className="space-y-6 text-right max-w-4xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-[#13233A]">الملف الشخصي وأمان الحساب</h1>
        <p className="text-xs text-[#66758A] mt-0.5">تحديث كلمة المرور وإجراءات أمان الجلسة الحالية</p>
      </div>

      {/* User Info Header Card */}
      <Card className="flex items-center justify-between p-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#1769E0]/10 text-[#1769E0] flex items-center justify-center font-bold text-xl">
            <User className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#13233A]">أحمد المحمد</h2>
            <span className="text-xs text-[#66758A]">مدير النقل المدرسي - مدارس المستقبل الأهلية</span>
          </div>
        </div>
        <Button variant="danger" size="sm" icon={<LogOut className="w-4 h-4" />} onClick={handleLogout}>
          تسجيل الخروج
        </Button>
      </Card>

      {/* Password Change Form */}
      <Card className="space-y-4">
        <h3 className="text-sm font-bold text-[#13233A] flex items-center gap-2 border-b border-[#E3EAF3] pb-2">
          <Lock className="w-4 h-4 text-[#1769E0]" /> تغيير كلمة المرور
        </h3>

        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
          <PasswordInput
            label="كلمة المرور الحالية"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
          <PasswordInput
            label="كلمة المرور الجديدة"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <PasswordInput
            label="تأكيد كلمة المرور الجديدة"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <Button type="submit" variant="primary" icon={<Save className="w-4 h-4" />} isLoading={isLoading}>
            تحديث كلمة المرور
          </Button>
        </form>
      </Card>
    </div>
  );
}

