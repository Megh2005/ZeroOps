"use client";

import Link from "next/link";
import {
  Layers,
  ChevronRight,
  LogOut,
  User as UserIcon,
  LayoutDashboard,
} from "lucide-react";
import { useAuth } from "./auth-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export function SiteHeader() {
  const { user, profile } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/5 bg-[#050505]/80 backdrop-blur-md">
      <div className="max-w-[80vw] mx-auto flex h-16 items-center justify-between px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-xl  hover:opacity-80 transition-opacity"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
            <Layers className="h-5 w-5" />
          </div>
          <span>ZeroOps</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-md text-gray-200">
          <Link href="/features" className="hover:text-white transition-colors">
            Features
          </Link>
          <Link
            href="/how-it-works"
            className="hover:text-white transition-colors"
          >
            How it Works
          </Link>
          <Link href="/pricing" className="hover:text-white transition-colors">
            Pricing
          </Link>
          <Link href="/docs" className="hover:text-white transition-colors">
            Docs
          </Link>
          <Link href="/devops" className="hover:text-white transition-colors">
            DevOps
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <Avatar className="h-9 w-9 border border-white/10 hover:border-blue-500/50 transition-colors cursor-pointer">
                  <AvatarImage
                    src={profile?.photoURL || user.photoURL || ""}
                    alt={profile?.displayName || user.displayName || "User"}
                  />
                  <AvatarFallback className="bg-blue-600 text-white text-xs">
                    {(profile?.displayName || user.displayName || "U")
                      .charAt(0)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 bg-[#0D0D0D] border-white/10 text-white"
                align="end"
              >
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {profile?.displayName || user.displayName}
                    </p>
                    <p className="text-xs leading-none text-gray-400">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem
                  asChild
                  className="focus:bg-white/5 focus:text-white cursor-pointer"
                >
                  <Link href="/dashboard" className="flex items-center">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  asChild
                  className="focus:bg-white/5 focus:text-white cursor-pointer"
                >
                  <Link href="/builder" className="flex items-center">
                    <Layers className="mr-2 h-4 w-4" />
                    <span>Cloud Builder</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="focus:bg-red-500/10 focus:text-red-400 text-red-400 cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link
                href="/auth"
                className="text-sm font-medium text-gray-400 hover:text-white transition-colors hidden sm:block"
              >
                Sign In
              </Link>
              <Link
                href="/builder"
                className="group flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-gray-200 transition-colors"
              >
                Launch App
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
