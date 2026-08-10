"use client";

import React, { useState } from "react";
import Link from "next/link";
import { TextInput } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShieldCheck, Mail, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { authApi } from "@/lib/api";

export default function PlatformForgotPasswordPage() {
  const [email, setEmail] = useState("owner@schooltransport-saas.com");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      await authApi.forgotPassword(email);
      setIsSubmitted(true);
    } catch (err: any) {
      setErrorMsg(err.message || "حدث خطأ أثناء إرسال طلب استعادة كلمة المرور.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F8FC] flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 space-y-6 shadow-xl border-[#E3EAF3]">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#103B75] text-white flex items-center justify-center font-bold text-xl">
            <ShieldCheck className="w-8 h-8 text-[#12AFA5]" />
          </div>
          <h1 className="text-xl font-bold text-[#13233A]">استعادة كلمة المرور لمالك المنصة</h1>
          <p className="text-xs text-[#66758A]">أدخل البريد الإلكتروني المسجل لإرسال رمز التحقق الأمني</p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-[#E5484D]/10 border border-[#E5484D]/20 rounded-xl text-[#E5484D] text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <TextInput
              label="البريد الإلكتروني"
              type="email"
              placeholder="owner@schooltransport-saas.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              icon={<Mail className="w-4 h-4 text-[#66758A]" />}
            />

            <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isLoading}>
              إرسال رمز التحقق الأمني
            </Button>
          </form>
        ) : (
          <div className="p-4 bg-[#16A461]/10 border border-[#16A461]/20 rounded-2xl text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-[#16A461] mx-auto" />
            <h3 className="text-sm font-bold text-[#13233A]">تم إرسال رمز التحقق بنجاح</h3>
            <p className="text-xs text-[#66758A]">تم إنشاء رمز التحقق OTP وحفظه في سجلات النظام لإتمام الاستعادة.</p>
          </div>
        )}

        <div className="pt-2 text-center">
          <Link href="/login" className="inline-flex items-center gap-2 text-xs font-bold text-[#1769E0] hover:underline">
            <ArrowRight className="w-3.5 h-3.5" /> العودة لشاشة تسجيل الدخول
          </Link>
        </div>
      </Card>
    </div>
  );
}
