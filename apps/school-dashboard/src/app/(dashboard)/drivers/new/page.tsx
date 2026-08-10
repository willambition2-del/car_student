"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TextInput } from "@/components/ui/input";
import { UserCog, Save, X } from "lucide-react";

export default function NewDriverPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [password, setPassword] = useState(""); // Temporary password

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      await fetch(process.env.NEXT_PUBLIC_API_URL + "/school/drivers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${document.cookie.split('token=')[1]?.split(';')[0]}`
        },
        body: JSON.stringify({
          fullName,
          phone,
          licenseNumber,
          password // Do not send schoolId here
        })
      });
      router.push("/drivers");
    } catch (err: any) {
      setErrorMsg(err.message || "حدث خطأ أثناء إضافة السائق.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-right max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#13233A]">إضافة سائق جديد</h1>
          <p className="text-sm text-[#66758A]">إضافة حساب جديد لسائق الحافلة</p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 mb-4 border-b pb-2">
            <UserCog className="w-5 h-5 text-[#103B75]" />
            <h2 className="text-lg font-bold text-[#13233A]">بيانات السائق</h2>
          </div>
          
          <TextInput
            label="الاسم الكامل"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <TextInput
            label="رقم الجوال"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />

          <TextInput
            label="رقم رخصة القيادة"
            value={licenseNumber}
            onChange={(e) => setLicenseNumber(e.target.value)}
          />

          <div className="flex flex-col gap-1.5 text-right">
            <label className="text-xs font-bold text-[#13233A]">كلمة المرور المؤقتة</label>
            <input
              type="password"
              className="w-full text-right bg-white border border-[#E3EAF3] rounded-xl px-3 py-2 text-sm outline-none focus:border-[#1769E0]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </Card>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            icon={<X className="w-4 h-4" />}
          >
            إلغاء
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            icon={<Save className="w-4 h-4" />}
          >
            إضافة السائق
          </Button>
        </div>
      </form>
    </div>
  );
}

