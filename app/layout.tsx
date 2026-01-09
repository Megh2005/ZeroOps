import type React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/auth-provider";
import { AuthGuard } from "@/components/auth-guard";
import { Toaster } from "sonner";
import { Rubik_Doodle_Shadow } from "next/font/google";
import { Alert, AlertTitle } from "@/components/ui/alert";

export const metadata: Metadata = {
  title: "ZeroOps",
  description:
    "Visual drag-and-drop infrastructure designer with Terraform export",
};

const rubik = Rubik_Doodle_Shadow({
  subsets: ["latin"],
  weight: ["400"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={rubik.className}>
        <div className="flex h-screen w-screen items-center bg-black justify-center p-4 xl:hidden">
          <Alert
            className="bg-red text-red-500 text-2xl text-center justify-center content-center"
            variant="destructive"
          >
            <AlertTitle>Access Denied On Mobile</AlertTitle>
          </Alert>
        </div>
        <div className="hidden xl:block">
          <AuthProvider>
            <AuthGuard>{children}</AuthGuard>
          </AuthProvider>
          <Toaster />
        </div>
      </body>
    </html>
  );
}
