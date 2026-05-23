"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { signInWithGoogle, auth } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, KeyRound } from "lucide-react";
import { SiteHeader } from "@/components/site-header";

export default function AuthPage() {
  const [user, loading] = useAuthState(auth);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      const redirect = setTimeout(() => {
        router.push("/");
      }, 3000);

      return () => {
        clearInterval(timer);
        clearTimeout(redirect);
      };
    }
  }, [user, router]);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
      router.push("/onboarding");
    } catch (error) {
      console.error("Sign in failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent text-zinc-100 selection:bg-blue-500/30 flex items-center justify-center p-4">
      <SiteHeader />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-sm mt-16"
      >
        <div className="overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/20 p-8 shadow-2xl backdrop-blur-2xl">
          <AnimatePresence mode="wait">
            {user ? (
              <motion.div
                key="authenticated"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="text-center"
              >
                <div className="mb-6 flex justify-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                </div>
                <h1 className="text-xl font-semibold tracking-tight text-zinc-100 mb-2">Authentication Verified</h1>
                <p className="text-zinc-400 text-xs mb-6">
                  Session established for <br />
                  <span className="text-zinc-200 font-mono mt-1 block">{user.email}</span>
                </p>
                <div className="w-full bg-zinc-800/50 rounded-full h-1 mb-4 overflow-hidden">
                  <motion.div
                    className="h-full bg-emerald-500"
                    initial={{ width: "100%" }}
                    animate={{ width: "0%" }}
                    transition={{ duration: 3, ease: "linear" }}
                  />
                </div>
                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                  Redirecting in {countdown}s...
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="login"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="mb-8 flex justify-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-300 shadow-sm">
                    <KeyRound className="w-6 h-6" />
                  </div>
                </div>

                <div className="text-center mb-8">
                  <h1 className="text-xl font-semibold tracking-tight text-zinc-100 mb-2">Secure Access</h1>
                  <p className="text-zinc-500 text-xs">
                    Authenticate to access infrastructure canvas
                  </p>
                </div>

                <Button
                  onClick={handleSignIn}
                  disabled={isLoading}
                  className="w-full h-12 rounded border border-zinc-800 bg-zinc-100 hover:bg-white text-zinc-900 text-xs font-semibold transition-all relative overflow-hidden"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin relative z-10" />
                  ) : (
                    <div className="flex items-center justify-center gap-3 relative z-10">
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 4.6c1.61 0 3.09.56 4.23 1.64l3.18-3.18C17.46 1.15 14.97 0 12 0 7.7 0 3.99 2.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Authenticate via Google
                    </div>
                  )}
                </Button>

                <p className="mt-6 text-center text-[10px] text-zinc-600 font-mono">
                  Access requires organizational provisioning. <br/>
                  Subject to Enterprise Terms.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
