"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Activity,
  Cpu,
  Server,
  CheckCircle2,
  Network,
  ArrowRight,
  ExternalLink,
  Copy,
  Check,
  Terminal,
  HelpCircle,
  Zap,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SiteHeader } from "@/components/site-header";
import { cn } from "@/lib/utils";

const TEAM_SIZE_MAP: Record<string, string> = {
  "1": "Solo Workspace (1 member)",
  "2-10": "Small Squad (2-10 members)",
  "11-50": "Mid-Market / Growth (11-50 members)",
  "51-200": "Enterprise Segment (51-200 members)",
  "200+": "Global Enterprise Core (200+ members)",
};

const FIELD_MAP: Record<string, string> = {
  "web-dev": "Web Engineering",
  "mobile-dev": "Mobile App Development",
  "data-science": "Artificial Intelligence & Data Systems",
  design: "Creative & Interface Design",
  marketing: "Growth & Analytics Engineering",
  student: "Academic & Computer Science",
};

const USE_CASE_MAP: Record<string, string> = {
  personal: "Personal Projects",
  freelance: "Freelance / Agency Operations",
  startup: "Startup / SaaS Development",
  enterprise: "Enterprise Systems",
  education: "Academic & Training Labs",
};

const STARTER_BLUEPRINTS: Record<
  string,
  Array<{
    title: string;
    description: string;
    command: string;
    docsUrl: string;
  }>
> = {
  "web-dev": [
    {
      title: "Next.js 15 Fullstack Core Starter",
      description: "Pre-configured with Tailwind v4, React 19, TypeScript, and automated pipeline scripts.",
      command: "npx create-next-app@latest --ts --tailwind",
      docsUrl: "/docs/nextjs",
    },
    {
      title: "FastAPI REST API Environment",
      description: "Sleek Python API backend complete with Docker container templates and PostgreSQL configurations.",
      command: "docker-compose up --build",
      docsUrl: "/docs/fastapi",
    },
  ],
  "mobile-dev": [
    {
      title: "React Native Expo Mobile Blueprint",
      description: "Expo Router pre-loaded with corporate theme parameters, OAuth schemas, and test configurations.",
      command: "npx create-expo-app@latest -t tabs",
      docsUrl: "/docs/expo",
    },
    {
      title: "Flutter Clean Architecture Kit",
      description: "Modular architecture scaffolding featuring BLoC pattern and multi-platform deployment trees.",
      command: "flutter create --platforms=android,ios .",
      docsUrl: "/docs/flutter",
    },
  ],
  "data-science": [
    {
      title: "PyTorch Deep Learning Engine",
      description: "REST endpoints serving trained models utilizing CUDA acceleration setups and Jupyter hub links.",
      command: "pip install torch torchvision fastapi",
      docsUrl: "/docs/pytorch",
    },
    {
      title: "Pandas & NumPy Data Operations",
      description: "Pre-packaged ETL notebooks loaded with analytics templates, charts, and file pipelines.",
      command: "pip install pandas numpy matplotlib",
      docsUrl: "/docs/data-science",
    },
  ],
  design: [
    {
      title: "Tailwind UI Premium Component Suite",
      description: "Storybook environment pre-loaded with HTML/React components, styles, and micro-states.",
      command: "npm install @tailwindcss/postcss postcss",
      docsUrl: "/docs/ui-kit",
    },
    {
      title: "Framer Motion Animation Studio",
      description: "Scaffolding playground utilizing custom gesture handlers, physics hooks, and layouts.",
      command: "npm install framer-motion lucide-react",
      docsUrl: "/docs/animations",
    },
  ],
  marketing: [
    {
      title: "Astro Premium Landing page Framework",
      description: "Ultra-fast headless architecture integrating static sitemaps and analytics integrations.",
      command: "npm create astro@latest",
      docsUrl: "/docs/astro",
    },
    {
      title: "GTM & Segment Analytics Module",
      description: "Conversion metrics config pre-bound to server interfaces for analytics operations.",
      command: "npm install @vercel/analytics",
      docsUrl: "/docs/marketing",
    },
  ],
  student: [
    {
      title: "HTML/CSS Core Fundamentals",
      description: "Starting repository for beginner engineers featuring semantic guidelines and grid layouts.",
      command: "echo '<h1>ZeroOps Sandbox</h1>' > index.html",
      docsUrl: "/docs/html-css",
    },
    {
      title: "Node.js Core Server Scaffolding",
      description: "Simplified server logic exploring requests, routing, file reading, and modular API structures.",
      command: "node server.js",
      docsUrl: "/docs/nodejs",
    },
  ],
  other: [
    {
      title: "ZeroOps General CI/CD Scaffolding",
      description: "Universal GitHub Actions pipelines designed to build and deploy Docker workspaces.",
      command: "cat zeroops.yml",
      docsUrl: "/docs/devops-ci",
    },
    {
      title: "Docker Compose Workspace Package",
      description: "Container orchestration linking reverse proxies, relational databases, and caching layers.",
      command: "docker-compose -f workspace.yml up -d",
      docsUrl: "/docs/docker",
    },
  ],
};

export default function DashboardPage() {
  const { user, profile, loading } = useAuth();
  const [imageError, setImageError] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [cpuValue, setCpuValue] = useState(2.4);
  const [ramValue, setRamValue] = useState(8.2);
  const [networkLatency, setNetworkLatency] = useState(14);
  const [activeNotification, setActiveNotification] = useState<string | null>(null);

  // Live Breathing Resource Metrics & History Graph queue
  const [systemHistory, setSystemHistory] = useState<Array<{ time: string; cpu: number; ram: number }>>([
    { time: "10s ago", cpu: 2.1, ram: 7.8 },
    { time: "9s ago", cpu: 2.4, ram: 7.9 },
    { time: "8s ago", cpu: 3.2, ram: 8.0 },
    { time: "7s ago", cpu: 2.5, ram: 8.1 },
    { time: "6s ago", cpu: 2.1, ram: 8.0 },
    { time: "5s ago", cpu: 2.6, ram: 8.3 },
    { time: "4s ago", cpu: 2.3, ram: 8.2 },
    { time: "3s ago", cpu: 2.4, ram: 8.2 },
    { time: "2s ago", cpu: 2.7, ram: 8.5 },
    { time: "1s ago", cpu: 2.5, ram: 8.4 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextCpu = Number((1.5 + Math.random() * 2.5).toFixed(2));
      const nextRam = Number((7.0 + Math.random() * 2.0).toFixed(2));
      setCpuValue(nextCpu);
      setRamValue(nextRam);
      setNetworkLatency(Math.floor(12 + Math.random() * 5));

      setSystemHistory((prev) => {
        const updated = [...prev.slice(1), { time: "Now", cpu: nextCpu, ram: nextRam }];
        // Re-label history for visual consistency
        return updated.map((item, idx) => {
          if (idx === updated.length - 1) return { ...item, time: "Now" };
          return { ...item, time: `${updated.length - 1 - idx}s ago` };
        });
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center text-white relative">
        <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
        <p className="text-zinc-500 font-mono text-[10px] mt-3 tracking-wider uppercase">
          Syncing dashboard workspace...
        </p>
      </div>
    );
  }

  if (!user || !profile) return null;

  const blueprints = STARTER_BLUEPRINTS[profile.fieldOfWork] || STARTER_BLUEPRINTS["other"];

  const handleCopyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);

    setActiveNotification(`Command claimed. Copied to clipboard!`);
    setTimeout(() => setActiveNotification(null), 3000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  } as const;

  return (
    <div className="min-h-screen bg-[#09090b] text-white select-none relative overflow-hidden">
      <SiteHeader />

      {/* Muted Premium Grid Canvas */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#141416_1px,transparent_1px),linear-gradient(to_bottom,#141416_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      {/* Active notification bubble */}
      <AnimatePresence>
        {activeNotification && (
          <motion.div
            initial={{ opacity: 0, y: -40, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -40, x: "-50%" }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-blue-500 border border-blue-400 text-white font-mono text-xs font-semibold px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{activeNotification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative z-10 max-w-[80vw] mx-auto pt-24 pb-20 space-y-6">
        {/* Classy SaaS Header Section */}
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col md:flex-row justify-between items-center gap-6 bg-zinc-900/10 border border-zinc-800/80 p-6 md:p-8 rounded-2xl backdrop-blur-2xl relative overflow-hidden"
        >
          <div className="flex items-center gap-5 relative z-10 w-full justify-between flex-wrap">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <Avatar className="h-14 w-14 border border-zinc-800 relative bg-zinc-900 flex items-center justify-center">
                  {!imageError && profile.photoURL ? (
                    <AvatarImage
                      src={profile.photoURL}
                      alt={profile.displayName}
                      onError={() => setImageError(true)}
                    />
                  ) : null}
                  <AvatarFallback className="bg-zinc-900 text-zinc-300 text-base font-bold font-mono">
                    {profile.displayName?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute bottom-0 right-0 h-3.5 w-3.5 bg-emerald-500 rounded-full border-2 border-[#09090b]" />
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-2.5">
                  <h1 className="text-lg font-bold text-white/95">
                    {profile.displayName || "DevOps Developer"}
                  </h1>
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-widest">
                    Developer Pro
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono">
                  <span>{profile.email}</span>
                </div>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="flex items-center gap-6 text-[10px] font-mono bg-zinc-950/40 border border-zinc-800/60 p-2.5 rounded-xl px-4">
              <div className="space-y-0.5">
                <span className="text-zinc-500 block uppercase tracking-wider text-[8px]">Cloud Region</span>
                <span className="text-zinc-300 font-semibold uppercase">US-EAST-1</span>
              </div>
              <div className="w-[1px] h-6 bg-zinc-800" />
              <div className="space-y-0.5">
                <span className="text-zinc-500 block uppercase tracking-wider text-[8px]">Cluster IP</span>
                <span className="text-zinc-300 font-semibold font-mono">10.124.0.5</span>
              </div>
              <div className="w-[1px] h-6 bg-zinc-800" />
              <div className="space-y-0.5">
                <span className="text-zinc-500 block uppercase tracking-wider text-[8px]">Verification</span>
                <span className="text-emerald-400 font-semibold uppercase flex items-center gap-1">
                  Verified
                </span>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Profile Details & Cluster Stats Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-12 gap-6"
        >
          {/* Card 1: Identity & Security Profile */}
          <motion.div variants={itemVariants} className="md:col-span-6">
            <Card className="h-full bg-zinc-900/10 border-zinc-800/80 backdrop-blur-2xl relative overflow-hidden flex flex-col justify-between p-5 rounded-2xl shadow-sm">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <CardTitle className="flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-zinc-400">
                    <Shield className="w-3.5 h-3.5 text-zinc-500" />
                    Identity Core
                  </CardTitle>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                </div>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[9px] text-zinc-500 uppercase tracking-wider font-bold">
                      Account Handle
                    </label>
                    <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-200">
                      <Hash className="w-3.5 h-3.5 text-zinc-600" />
                      @{profile.aid}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] text-zinc-500 uppercase tracking-wider font-bold">
                      Verification Node
                    </label>
                    <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-200">
                      <Mail className="w-3.5 h-3.5 text-zinc-600" />
                      {profile.email}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] text-zinc-500 uppercase tracking-wider font-bold">
                      Access Rights
                    </label>
                    <div className="text-xs font-mono text-zinc-400">
                      Authorized Root Administrator
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-zinc-800/50 mt-4 text-[9px] text-zinc-500 font-mono flex items-center justify-between">
                <span>Ref: zeroops-profile-v2</span>
                <HelpCircle className="w-3 h-3 text-zinc-600" />
              </div>
            </Card>
          </motion.div>

          {/* Card 2: Environment Settings summary */}
          <motion.div variants={itemVariants} className="md:col-span-6">
            <Card className="h-full bg-zinc-900/10 border-zinc-800/80 backdrop-blur-2xl relative overflow-hidden flex flex-col justify-between p-5 rounded-2xl shadow-sm">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <CardTitle className="flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-zinc-400">
                    <Briefcase className="w-3.5 h-3.5 text-zinc-500" />
                    Workspace Profile
                  </CardTitle>
                </div>
                <div className="bg-zinc-950/20 border border-zinc-800/60 rounded-xl divide-y divide-zinc-800/60 p-0.5">
                  <div className="flex justify-between items-center py-2 px-3 text-[10px] font-mono">
                    <span className="text-zinc-500">Workspace Type</span>
                    <span className="text-zinc-200 font-medium capitalize max-w-[120px] truncate" title={profile.useCase}>
                      {USE_CASE_MAP[profile.useCase] || profile.useCase}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 text-[10px] font-mono">
                    <span className="text-zinc-500">Collaborator Scale</span>
                    <span className="text-zinc-200 font-medium capitalize max-w-[120px] truncate" title={profile.teamSize}>
                      {TEAM_SIZE_MAP[profile.teamSize] || profile.teamSize}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 text-[10px] font-mono">
                    <span className="text-zinc-500">Tech Stack Core</span>
                    <span className="text-zinc-200 font-medium capitalize max-w-[120px] truncate" title={profile.fieldOfWork}>
                      {FIELD_MAP[profile.fieldOfWork] || profile.fieldOfWork?.replace("-", " ")}
                    </span>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-zinc-800/50 mt-4 text-[9px] text-zinc-500 font-mono">
                Parameters synced from provisioning.
              </div>
            </Card>
          </motion.div>


        </motion.div>

        {/* Real-time Compute & Memory Split Analytics Graphs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="bg-zinc-900/10 border border-zinc-800/80 p-5 rounded-2xl backdrop-blur-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-bold block">
                  Processor Diagnostics
                </span>
                <h3 className="text-sm font-semibold text-white tracking-tight">
                  vCPU Frequency Load
                </h3>
              </div>
              <div className="flex items-center gap-4 text-[10px] font-mono">
                <span className="flex items-center gap-1.5 text-zinc-400">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-blue-500 font-bold">{cpuValue} GHz</span>
                </span>
              </div>
            </div>

            <div className="h-[250px] min-h-[250px] w-full mt-4 font-mono text-[10px]">
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={systemHistory} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="cpuGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="#52525b" fontSize={8} tickLine={false} axisLine={false} />
                  <YAxis domain={[0, 5]} stroke="#52525b" fontSize={8} tickLine={false} axisLine={false} tickFormatter={(val) => `${val} GHz`} />
                  <Tooltip contentStyle={{ backgroundColor: "#09090b", borderColor: "#27272a", fontSize: "9px", fontFamily: "monospace", color: "#fff", borderRadius: "8px" }} labelClassName="text-zinc-500 font-bold" />
                  <Area type="linear" dataKey="cpu" stroke="#3b82f6" strokeWidth={1.5} fillOpacity={1} fill="url(#cpuGlow)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            className="bg-zinc-900/10 border border-zinc-800/80 p-5 rounded-2xl backdrop-blur-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-bold block">
                  Memory Diagnostics
                </span>
                <h3 className="text-sm font-semibold text-white tracking-tight">
                  RAM Block Allocation
                </h3>
              </div>
              <div className="flex items-center gap-4 text-[10px] font-mono">
                <span className="flex items-center gap-1.5 text-zinc-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-emerald-500 font-bold">{ramValue} GB</span>
                </span>
              </div>
            </div>

            <div className="h-[250px] min-h-[250px] w-full mt-4 font-mono text-[10px]">
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={systemHistory} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="ramGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="#52525b" fontSize={8} tickLine={false} axisLine={false} />
                  <YAxis domain={[0, 16]} stroke="#52525b" fontSize={8} tickLine={false} axisLine={false} tickFormatter={(val) => `${val} GB`} />
                  <Tooltip contentStyle={{ backgroundColor: "#09090b", borderColor: "#27272a", fontSize: "9px", fontFamily: "monospace", color: "#fff", borderRadius: "8px" }} labelClassName="text-zinc-500 font-bold" />
                  <Area type="step" dataKey="ram" stroke="#10b981" strokeWidth={1.5} fillOpacity={1} fill="url(#ramGlow)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Section 3: Tech Starters & Blueprints tailored to their choice */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className="space-y-4"
        >
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-bold block">
              Provision Tech Stack Starter Blueprints
            </span>
            <p className="text-zinc-400 text-xs">
              Based on your selection of <span className="text-blue-500 font-semibold">{FIELD_MAP[profile.fieldOfWork] || profile.fieldOfWork}</span>, the following starter packages are ready.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {blueprints.map((item, idx) => (
              <Card
                key={idx}
                className="bg-zinc-900/10 border-zinc-800/80 p-5 rounded-2xl hover:border-blue-500/50 hover:bg-zinc-900/20 transition-all duration-300 flex flex-col justify-between gap-6"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <h3 className="text-xs font-semibold text-white tracking-tight flex items-center gap-2">
                      <Terminal className="w-3.5 h-3.5 text-blue-500" />
                      {item.title}
                    </h3>
                    <span className="text-[8px] font-mono uppercase text-zinc-500 border border-zinc-800 px-1.5 py-0.5 rounded bg-zinc-950 font-bold">
                      Starter Kit
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-normal">
                    {item.description}
                  </p>

                  {/* Copyable Terminal Command Block */}
                  <div className="bg-zinc-950/80 border border-zinc-800 rounded-lg p-2.5 flex items-center justify-between font-mono text-[10px] text-zinc-300">
                    <span className="truncate pr-3">{item.command}</span>
                    <button
                      type="button"
                      onClick={() => handleCopyToClipboard(item.command, idx)}
                      className="p-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
                      title="Copy claim command"
                    >
                      {copiedIndex === idx ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-zinc-800/50 pt-3 text-[10px] font-mono">
                  <span className="text-zinc-500">Ready to execute.</span>
                  <a
                    href={item.docsUrl}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveNotification(`Documentation details claimed! Link: ${item.docsUrl}`);
                      setTimeout(() => setActiveNotification(null), 3000);
                    }}
                    className="text-blue-500 hover:text-blue-400 flex items-center gap-1 transition-colors"
                  >
                    <span>Read Docs</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </Card>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
