"use client";

import React, { useState } from "react";
import Link from "next/link";
import { TextInput } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { KeyRound, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { authApi } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [identifier, setIdentifier] = useState("admin@almustaqbal.edu.sa");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier) return;

    setIsLoading(true);
    setErrorMsg(null);

    try {
      await authApi.forgotPassword(identifier);
      setIsSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || "حدث خطأ أثناء إرسال طلب استعادة كلمة المرور.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F8FC] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-[#E3EAF3] rounded-3xl p-8 shadow-sm space-y-6 text-right">
        {/* Header Icon */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#1769E0]/10 text-[#1769E0] flex items-center justify-center">
            <KeyRound className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold text-[#13233A]">استعادة كلمة المرور</h1>
          <p className="text-xs text-[#66758A]">
            أدخل البريد الإلكتروني المعتمد لدى إدارة المدرسة لإرسال رمز التحقق.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-[#E5484D]/10 border border-[#E5484D]/20 rounded-xl text-[#E5484D] text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {isSuccess ? (
          <div className="p-6 bg-[#16A461]/10 border border-[#16A461]/20 rounded-2xl text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-[#16A461] mx-auto" />
            <h3 className="text-sm font-bold text-[#13233A]">تم إرسال رمز التحقق بنجاح!</h3>
            <p className="text-xs text-[#66758A]">
              تم إنشاء رمز التحقق OTP وحفظه في سجلات الخادم لإتمام عملية التعيين.
            </p>
            <Link href="/login" className="inline-block pt-2">
              <Button variant="primary" size="sm">
                العودة لصفحة تسجيل الدخول
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <TextInput
              label="البريد الإلكتروني المعتمد"
              placeholder="example@almustaqbal.edu.sa"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />

            <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isLoading}>
              إرسال رمز التحقق OTP
            </Button>
          </form>
        )}

        <div className="pt-4 border-t border-[#E3EAF3] text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#1769E0] hover:underline"
          >
            <ArrowRight className="w-4 h-4" /> العودة لتسجيل الدخول
          </Link>
        </div>
      </div>
    </div>
  );
}
