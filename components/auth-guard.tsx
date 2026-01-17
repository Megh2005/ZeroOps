"use client";

import type React from "react";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "./auth-provider";
import { Loader2 } from "lucide-react";

const PUBLIC_PATHS = [
  "/",
  "/auth",
  "/features",
  "/how-it-works",
  "/pricing",
  "/docs",
  "/contact",
];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // If not logged in and trying to access a protected route
        if (!PUBLIC_PATHS.includes(pathname) && pathname !== "/onboarding") {
          router.push("/auth");
        }
      } else {
        // If logged in
        if (!profile?.aid && pathname !== "/onboarding") {
          // Logged in but no profile (or incomplete), must onboard
          router.push("/onboarding");
        } else if (
          profile?.aid &&
          (pathname === "/onboarding" || pathname === "/auth")
        ) {
          // Logged in and has completed profile, don't allow onboarding or auth page
          router.push("/dashboard");
        }
      }
    }
  }, [user, profile, loading, pathname, router]);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#050505]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  // While determining redirection, show nothing to avoid flash of content
  if (!user && !PUBLIC_PATHS.includes(pathname) && pathname !== "/onboarding") {
    return null;
  }
  if (user && !profile?.aid && pathname !== "/onboarding") {
    return null;
  }
  if (
    user &&
    profile?.aid &&
    (pathname === "/onboarding" || pathname === "/auth")
  ) {
    return null;
  }

  return <>{children}</>;
}
