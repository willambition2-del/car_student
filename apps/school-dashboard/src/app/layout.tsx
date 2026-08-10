import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "منصة إدارة النقل المدرسي - لوحة تحكم المدرسة",
  description: "لوحة تحكم إدارة النقل المدرسي الموحدة",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
