"use client";

import { useState } from "react";
import Link from "next/link";

export default function DemoPage() {
  const [formData, setFormData] = useState({
    schoolName: "",
    contactName: "",
    phone: "",
    email: "",
    city: "",
    studentCount: "",
    busCount: "",
    message: ""
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";
      const res = await fetch(`${apiBase}/public/demo-requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          studentCount: parseInt(formData.studentCount) || 0,
          busCount: parseInt(formData.busCount) || 0
        })
      });

      if (!res.ok) {
        throw new Error("حدث خطأ أثناء إرسال الطلب.");
      }

      setStatus("success");
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message || "فشل الاتصال بالخادم.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="mb-8 text-center">
        <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">&rarr; العودة للرئيسية</Link>
        <h1 className="text-3xl font-extrabold text-gray-900">طلب نسخة تجريبية</h1>
        <p className="mt-2 text-gray-600">املأ النموذج وسنتواصل معك قريباً لترتيب عرض تجريبي.</p>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
        {status === "success" ? (
          <div className="text-center py-8">
            <div className="text-green-500 text-5xl mb-4">✓</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">تم استلام طلبك بنجاح!</h2>
            <p className="text-gray-600">سيتواصل معك فريقنا في أقرب وقت ممكن.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">اسم المدرسة</label>
                <input required type="text" name="schoolName" value={formData.schoolName} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">المدينة</label>
                <input required type="text" name="city" value={formData.city} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">اسم مسؤول التواصل</label>
                <input required type="text" name="contactName" value={formData.contactName} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">رقم الهاتف</label>
                <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">البريد الإلكتروني</label>
                <input required type="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">عدد الطلاب (تقريبي)</label>
                  <input type="number" name="studentCount" value={formData.studentCount} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">عدد الحافلات</label>
                  <input type="number" name="busCount" value={formData.busCount} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">رسالة إضافية (اختياري)</label>
              <textarea name="message" rows={4} value={formData.message} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
            </div>

            {status === "error" && (
              <div className="text-red-600 text-sm">{errorMessage}</div>
            )}

            <div>
              <button disabled={status === "loading"} type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
                {status === "loading" ? "جاري الإرسال..." : "إرسال الطلب"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
