"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { PasswordInput } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShieldCheck, AlertCircle } from "lucide-react";
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
      // Typically there would be a dedicated API for this:
      // await authApi.forceChangePassword(newPassword);
      // For now, we simulate success and update our auth state
      // We'd probably fetch a new token that doesn't have mustChangePassword=true
      router.push("/");
    } catch (err: any) {
      setErrorMsg(err.message || "حدث خطأ أثناء تغيير كلمة المرور.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F8FC] flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 space-y-6 shadow-xl border-[#E3EAF3]">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-[#103B75] text-white flex items-center justify-center font-bold text-2xl shadow-lg">
            <ShieldCheck className="w-9 h-9 text-[#12AFA5]" />
          </div>
          <h1 className="text-xl font-bold text-[#13233A]">تغيير كلمة المرور إلزامي</h1>
          <p className="text-xs text-[#66758A]">يرجى تغيير كلمة المرور الخاصة بك للمتابعة</p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-[#E5484D]/10 border border-[#E5484D]/20 rounded-xl text-[#E5484D] text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

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

          <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isLoading}>
            تغيير كلمة المرور والمتابعة
          </Button>
        </form>
      </Card>
    </div>
  );
}
