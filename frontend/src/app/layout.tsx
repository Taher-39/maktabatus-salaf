import type { Metadata } from "next";
import { Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import WhatsAppButton from "@/components/shared/WhatsAppButton";
import AuthProvider from "@/components/shared/AuthProvider";
import ThemeInitializer from "@/components/shared/ThemeInitializer";
import { ToastProvider } from "@/components/shared/ToastProvider";

const notoBengali = Noto_Sans_Bengali({
  variable: "--font-noto-bengali",
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "মাক্তাবাতুস সালাফ | ইসলামিক বইয়ের অনলাইন দোকান",
  description:
    "কুরআন, হাদিস, আকিদা, ফিকহ এবং আরও অনেক বিষয়ের ইসলামিক বই কিনুন অনলাইনে",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" className={`${notoBengali.variable} h-full`}>
      <body suppressHydrationWarning className="flex min-h-full flex-col font-sans antialiased">
        <AuthProvider>
          <ThemeInitializer />
          <ToastProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <WhatsAppButton />
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
