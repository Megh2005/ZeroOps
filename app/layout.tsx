import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { AuthProvider } from "@/components/auth-provider";
import { AuthGuard } from "@/components/auth-guard";
import { Toaster } from "sonner";
import {Rubik_Doodle_Shadow} from "next/font/google"

export const metadata: Metadata = {
  title: "ZeroOps",
  description: "Visual drag-and-drop infrastructure designer with Terraform export",
}

const rubik = Rubik_Doodle_Shadow({
  subsets: ["latin"],
  weight: ["400"],
})


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={rubik.className}>
        <AuthProvider>
          <AuthGuard>
            {children}
          </AuthGuard>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  )
}
