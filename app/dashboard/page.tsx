"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/components/auth-provider";
import {
  Loader2,
  User,
  Mail,
  Hash,
  Briefcase,
  Users,
  Layers,
  Shield,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SiteHeader } from "@/components/site-header";

const TEAM_SIZE_MAP: Record<string, string> = {
  "1": "Just me (1)",
  "2-10": "Small Team (2-10)",
  "11-50": "Growing (11-50)",
  "51-200": "Scale-up (51-200)",
  "200+": "Enterprise (200+)",
};

const FIELD_MAP: Record<string, string> = {
  "web-dev": "Web Development",
  "mobile-dev": "Mobile Development",
  "data-science": "Data Science / AI",
  design: "Design / Creative",
  marketing: "Marketing",
  student: "Student / Learning",
};

const USE_CASE_MAP: Record<string, string> = {
  personal: "Personal Projects",
  freelance: "Freelance Work",
  startup: "Startup",
  enterprise: "Enterprise",
  education: "Education",
};

export default function DashboardPage() {
  const { user, profile, loading } = useAuth();
  const [imageError, setImageError] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!user || !profile) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30 ">
      <SiteHeader />

      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[20%] h-[600px] w-[600px] rounded-full bg-blue-900/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[20%] h-[600px] w-[600px] rounded-full bg-purple-900/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      </div>

      <main className="relative z-10 max-w-[80vw] mx-auto pt-32 pb-20 space-y-8">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-2xl shadow-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-linear-to-r from-blue-500/10 via-transparent to-purple-500/10 pointer-events-none" />

          <div className="flex items-center gap-6 relative z-10 w-full justify-center md:justify-start">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-linear-to-r from-blue-500 to-purple-500 rounded-full opacity-75 group-hover:opacity-100 blur transition duration-500" />
              <Avatar className="h-20 w-20 border-4 border-[#0D0D0D] relative">
                {!imageError ? (
                  <AvatarImage
                    src={profile.photoURL}
                    alt={profile.displayName}
                    onError={() => setImageError(true)}
                  />
                ) : null}
                <AvatarFallback className="bg-linear-to-br from-blue-600 to-purple-700 text-white text-2xl font-bold">
                  {profile.displayName?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="absolute bottom-1 right-1 h-5 w-5 bg-green-500 rounded-full border-4 border-[#0D0D0D]" />
            </div>

            <div className="space-y-1 text-center md:text-left">
              <h1 className="text-3xl font-bold  text-white/90">
                {profile.displayName}
              </h1>
              <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-gray-400 font-medium">
                <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs uppercase tracking-wider">
                  Architect
                </span>
                <span className="w-1 h-1 rounded-full bg-gray-600" />
                <span>{profile.email}</span>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Profile Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {/* Identity Card */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <Card className="h-full bg-white/5 border-white/10 backdrop-blur-xl relative overflow-hidden group hover:border-blue-500/30 transition-colors duration-500">
              <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-400 font-bold">
                  <Shield className="w-5 h-5" />
                  Identity Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 relative z-10">
                <div className="space-y-1">
                  <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                    Agent ID (AID)
                  </label>
                  <div className="flex items-center gap-2 text-xl font-mono text-white/90">
                    <Hash className="w-4 h-4 text-gray-600" />
                    {profile.aid}
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                    Email Channel
                  </label>
                  <div className="flex items-center gap-2 text-white/90">
                    <Mail className="w-4 h-4 text-gray-600" />
                    {profile.email}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Usage Stats - Spanning 2 columns on large screens */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card className="h-full bg-white/5 border-white/10 backdrop-blur-xl relative overflow-hidden group hover:border-purple-500/30 transition-colors duration-500">
              <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-400 font-bold">
                  <Layers className="w-5 h-5" />
                  Operational Context
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                <div className="space-y-2 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center mb-2">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                    Use Case
                  </label>
                  <p
                    className="text-lg font-medium capitalize text-white max-w-[150px] truncate"
                    title={profile.useCase}
                  >
                    {USE_CASE_MAP[profile.useCase] || profile.useCase}
                  </p>
                </div>
                <div className="space-y-2 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-green-500/20 text-green-400 flex items-center justify-center mb-2">
                    <Users className="w-4 h-4" />
                  </div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                    Team Scale
                  </label>
                  <p className="text-lg font-medium capitalize text-white">
                    {TEAM_SIZE_MAP[profile.teamSize] || profile.teamSize}
                  </p>
                </div>
                <div className="space-y-2 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center mb-2">
                    <User className="w-4 h-4" />
                  </div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                    Domain
                  </label>
                  <p
                    className="text-lg font-medium capitalize text-white max-w-[150px] truncate"
                    title={profile.fieldOfWork}
                  >
                    {FIELD_MAP[profile.fieldOfWork] ||
                      profile.fieldOfWork?.replace("-", " ")}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
