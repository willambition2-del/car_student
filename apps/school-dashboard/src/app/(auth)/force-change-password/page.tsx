"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { PasswordInput } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { School, ShieldCheck, AlertCircle } from "lucide-react";
import { authApi } from "@/lib/api";

export default function ForceChangePasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (newPassword !== confirmPassword) {
      setErrorMsg("كلمات المرور غير متطابقة.");
      return;
    }

    if (newPassword.length < 8) {
      setErrorMsg("كلمة المرور يجب أن تكون 8 أحرف على الأقل.");
      return;
    }

    setIsLoading(true);

    try {
      // Mock API call
      // await authApi.forceChangePassword(newPassword);
      router.push("/dashboard");
    } catch (err: any) {
      setErrorMsg(err.message || "حدث خطأ أثناء تغيير كلمة المرور.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F8FC] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-[#E3EAF3] rounded-3xl p-8 shadow-sm space-y-6 text-right">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#1769E0] text-white flex items-center justify-center shadow-md">
            <School className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold text-[#13233A] tracking-tight">تغيير كلمة المرور إلزامي</h1>
          <p className="text-xs text-[#66758A]">يجب عليك تغيير كلمة المرور للمتابعة للنظام</p>
        </div>

        {/* Error Alert Box */}
        {errorMsg && (
          <div className="p-3.5 bg-[#E5484D]/10 border border-[#E5484D]/20 text-[#E5484D] text-xs font-semibold rounded-xl text-right flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
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

          <Button type="submit" variant="primary" size="lg" className="w-full mt-2" isLoading={isLoading}>
            تغيير كلمة المرور والمتابعة
          </Button>
        </form>

        {/* Footer Guarantee */}
        <div className="pt-4 border-t border-[#E3EAF3] flex items-center justify-center gap-2 text-xs text-[#66758A]">
          <ShieldCheck className="w-4 h-4 text-[#16A461]" />
          <span>حساب مدرسي آمن ومشفّر بشهادة SSL المعتمدة</span>
        </div>
      </div>
    </div>
  );
}
