import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "منصة النقل المدرسي",
  description: "الحل الأمثل لإدارة النقل المدرسي",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
