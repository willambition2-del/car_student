"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TextInput, PasswordInput } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { School, ShieldCheck, AlertCircle } from "lucide-react";
import { authApi } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("admin@almustaqbal.edu.sa");
  const [password, setPassword] = useState("Admin@2026!Dev");
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!identifier || !password) {
      setErrorMessage("يرجى إدخال البريد الإلكتروني وكلمة المرور.");
      return;
    }

    setIsLoading(true);

    try {
      await authApi.login(identifier, password, "School Dashboard Web");
      router.push("/dashboard");
    } catch (err: any) {
      setErrorMessage(err.message || "فشل تسجيل الدخول. يرجى التأكد من البيانات المدخلة.");
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
          <h1 className="text-xl font-bold text-[#13233A] tracking-tight">منصة إدارة النقل المدرسي</h1>
          <p className="text-xs text-[#66758A]">تسجيل الدخول إلى لوحة تحكم المدرسة</p>
        </div>

        {/* Error Alert Box */}
        {errorMessage && (
          <div className="p-3.5 bg-[#E5484D]/10 border border-[#E5484D]/20 text-[#E5484D] text-xs font-semibold rounded-xl text-right flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextInput
            label="البريد الإلكتروني"
            placeholder="أدخل بريدك المعتمد بالمنظومة..."
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />

          <PasswordInput
            label="كلمة المرور"
            placeholder="أدخل كلمة المرور..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 text-[#66758A] cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-[#E3EAF3] text-[#1769E0] focus:ring-[#1769E0]"
              />
              تذكرني على هذا الجهاز
            </label>

            <Link href="/forgot-password" className="text-[#1769E0] font-bold hover:underline">
              نسيت كلمة المرور؟
            </Link>
          </div>

          <Button type="submit" variant="primary" size="lg" className="w-full mt-2" isLoading={isLoading}>
            تسجيل الدخول للمنظومة
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
