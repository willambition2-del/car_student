import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "منصة مالك النظام SaaS - إدارة النقل المدرسي",
  description: "لوحة التحكم الرئيسية لمالك منصة النقل المدرسي متعددة المدارس Multi-Tenant SaaS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="h-full antialiased">
      <body className="min-h-full bg-[#F5F8FC] text-[#13233A]">{children}</body>
    </html>
  );
}
