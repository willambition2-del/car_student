"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TextInput, PasswordInput } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShieldCheck, Mail, KeyRound, AlertCircle } from "lucide-react";
import { authApi } from "@/lib/api";

export default function PlatformLoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("owner@schooltransport-saas.com");
  const [password, setPassword] = useState("Owner@2026!Dev");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      await authApi.login(email, password, "Platform Admin Web Dashboard");
      router.push("/overview");
    } catch (err: any) {
      setErrorMsg(err.message || "فشل تسجيل الدخول. تحقق من البيانات المدخلة.");
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
          <h1 className="text-xl font-bold text-[#13233A]">لوحة التحكم الموحدة لمالك المنصة</h1>
          <p className="text-xs text-[#66758A]">بوابة الإدارة المركزية لمنظومة النقل المدرسي SaaS</p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-[#E5484D]/10 border border-[#E5484D]/20 rounded-xl text-[#E5484D] text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <TextInput
            label="البريد الإلكتروني لمالك المنصة"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            icon={<Mail className="w-4 h-4 text-[#66758A]" />}
          />

          <PasswordInput
            label="كلمة المرور"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-[#66758A] cursor-pointer">
              <input type="checkbox" className="rounded border-[#E3EAF3] text-[#1769E0]" defaultChecked />
              <span>تذكر هذا الجهاز</span>
            </label>
            <Link href="/forgot-password" className="text-[#1769E0] hover:underline font-bold">
              استعادة كلمة المرور
            </Link>
          </div>

          <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isLoading} icon={<KeyRound className="w-4 h-4" />}>
            الدخول المباشر للوحة المالك
          </Button>
        </form>
      </Card>
    </div>
  );
}
