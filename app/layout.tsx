import type React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/auth-provider";
import { AuthGuard } from "@/components/auth-guard";
import { Toaster } from "sonner";
import { Quantico, JetBrains_Mono } from "next/font/google";
import { Alert, AlertTitle } from "@/components/ui/alert";

export const metadata: Metadata = {
  title: "ZeroOps",
  description:
    "Visual drag-and-drop infrastructure designer with Terraform export",
};

const rubik = Quantico({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-rubik",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${rubik.className} ${jetbrainsMono.variable} bg-transparent text-zinc-100 min-h-screen selection:bg-blue-500/30`}>
        {/* Global Formal Background */}
        <div className="fixed inset-0 z-[-1] h-full w-full bg-[#09090b]">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-500 opacity-[0.15] blur-[100px]"></div>
        </div>

        <div className="flex h-screen w-screen items-center justify-center p-4 xl:hidden z-10 relative">
          <Alert
            className="bg-zinc-950 border-red-500/50 text-red-500 text-2xl text-center justify-center content-center"
            variant="destructive"
          >
            <AlertTitle>Access Denied On Mobile</AlertTitle>
          </Alert>
        </div>
        <div className="hidden xl:block relative z-10">
          <AuthProvider>
            <AuthGuard>{children}</AuthGuard>
          </AuthProvider>
          <Toaster
            theme="dark"
            position="top-right"
            richColors
            closeButton
            expand={true}
            duration={3000}
          />
        </div>
      </body>
    </html>
  );
}
