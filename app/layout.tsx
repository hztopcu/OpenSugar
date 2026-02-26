import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AppWrapper } from "@/components/app-wrapper";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "OpenSugar – Blood Glucose Tracker",
  description: "Open-source blood glucose and medication tracker for patients and healthcare professionals.",
  manifest: "/manifest.json",
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="min-h-screen font-sans antialiased">
        <AppWrapper>{children}</AppWrapper>
      </body>
    </html>
  );
}
