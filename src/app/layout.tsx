import type { Metadata } from "next";
import { Poppins } from 'next/font/google';
import "./globals.css";
import SuperAdminLayout from "@/components/layout/SuperAdminLayout";

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Central Super Admin",
  description: "Manage tenants, licenses, and packages.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full ${poppins.variable}`} suppressHydrationWarning>
      <body className={`h-full bg-slate-50 text-slate-900 antialiased font-sans ${poppins.className}`} suppressHydrationWarning>
        <SuperAdminLayout>{children}</SuperAdminLayout>
      </body>
    </html>
  );
}
