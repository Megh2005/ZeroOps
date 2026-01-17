"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Box,
  Code2,
  Cpu,
  Globe,
  Layers,
  Shield,
  Zap,
  Bot,
  Sparkles,
  Cloud,
  Share2,
  DollarSign,
  Terminal,
  Workflow,
  Search,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const BentoCard = ({
  title,
  description,
  icon,
  className = "",
  bgClass = "bg-[#111]",
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
  bgClass?: string;
}) => (
  <motion.div
    variants={fadeInUp}
    className={`group relative overflow-hidden rounded-3xl border border-white/10 p-8 hover:border-white/20 transition-all duration-300 ${bgClass} ${className}`}
  >
    <div className="relative z-10 h-full flex flex-col">
      <div className="mb-4 inline-flex items-center justify-center rounded-xl bg-white/5 p-3 text-white group-hover:bg-white/10 transition-colors w-fit">
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-bold text-white">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed flex-1">
        {description}
      </p>
    </div>
    <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
  </motion.div>
);

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30 ">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] h-[800px] w-[800px] rounded-full bg-purple-900/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] h-[800px] w-[800px] rounded-full bg-blue-900/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      </div>

      <SiteHeader />

      <main className="relative z-10 pt-32 pb-20">
        {/* Hero Section */}
        <section className="max-w-[80vw] mx-auto px-6 text-center mb-20">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="mx-auto max-w-4xl"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-sm font-medium text-blue-400">
              <Layers className="h-4 w-4" />
              Feature Showcase
            </div>
            <h1 className="mb-8 text-5xl font-bold  md:text-7xl">
              Everything you need to <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-500">
                Build Faster
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-xl text-gray-400 leading-relaxed">
              A complete toolkit for modern cloud engineering, powered by
              intelligent automation and Google's best-in-class infrastructure.
            </p>
          </motion.div>
        </section>

        {/* Bento Grid Section */}
        <section className="max-w-[80vw] mx-auto px-6 mb-32">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid gap-6 md:grid-cols-4 h-auto"
          >
            {/* Large Item: Visual Builder */}
            <BentoCard
              title="Visual Architecture Builder"
              description="Drag, drop, and connect resources on an infinite canvas. What you see is exactly what you deploy."
              icon={<Box className="h-6 w-6" />}
              className="md:col-span-2 md:row-span-1 bg-linear-to-br from-[#111] to-[#161616]"
            />

            {/* New Item: Cost Estimation */}
            <BentoCard
              title="Cost Estimation"
              description="Real-time monthly cost estimates as you design."
              icon={<DollarSign className="h-6 w-6" />}
              className="md:col-span-1 md:row-span-1"
            />

            {/* New Item: Drift Detection */}
            <BentoCard
              title="Drift Detection"
              description="Alerts when live infra diverges from your design."
              icon={<Workflow className="h-6 w-6" />}
              className="md:col-span-1 md:row-span-1"
            />

            {/* Medium Item: Terraform Export */}
            <BentoCard
              title="Clean Terraform Export"
              description="Generate production-ready, human-readable Terraform code that follows best practices. No vendor lock-in."
              icon={<Code2 className="h-6 w-6" />}
              className="md:col-span-1 md:row-span-1"
            />

            {/* Small Item: Multi-Cloud */}
            <BentoCard
              title="Multi-Cloud"
              description="Unified interface for AWS, Azure, and GCP."
              icon={<Cloud className="h-6 w-6" />}
              className="md:col-span-1 md:row-span-1"
            />

            {/* Small Item: Collaboration */}
            <BentoCard
              title="Real-time Sync"
              description="Work with your team on the same canvas."
              icon={<Share2 className="h-6 w-6" />}
              className="md:col-span-1 md:row-span-1"
            />

            {/* New Item: Audit Logs */}
            <BentoCard
              title="Audit Logs"
              description="Track every change made to your infrastructure."
              icon={<Terminal className="h-6 w-6" />}
              className="md:col-span-1 md:row-span-1"
            />
          </motion.div>
        </section>

        {/* AI & Agent Builder Section */}
        <section className="max-w-[80vw] mx-auto px-6 mb-32">
          <div className="grid gap-12 md:grid-cols-2 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-sm font-medium text-purple-400">
                <Sparkles className="h-4 w-4" />
                Powered by Gemini AI
              </div>
              <h2 className="text-4xl font-bold text-white mb-6">
                Intelligent Infrastructure with <br />
                <span className="text-purple-400">Agent Builder Kit</span>
              </h2>
              <p className="text-gray-400 text-lg mb-6 leading-relaxed">
                We leverage Google's <strong>Agent Builder Kit</strong> to
                create specialized AI agents that understand your infrastructure
                goals.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-purple-500/20 text-purple-400">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Architect Agent</h4>
                    <p className="text-sm text-gray-400">
                      Suggests optimal resource configurations based on your
                      traffic patterns and budget.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-purple-500/20 text-purple-400">
                    <Shield className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Security Agent</h4>
                    <p className="text-sm text-gray-400">
                      Scans your design for vulnerabilities and suggests IAM
                      policy improvements.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-purple-500/20 text-purple-400">
                    <Terminal className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Code Agent</h4>
                    <p className="text-sm text-gray-400">
                      Writes custom Terraform modules and scripts to extend your
                      infrastructure capabilities.
                    </p>
                  </div>
                </li>
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative rounded-3xl border border-white/10 bg-[#111] p-8 overflow-hidden"
            >
              <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-purple-600/20 blur-[80px]" />
              <div className="relative z-10 space-y-4 text-sm">
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                    U
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none text-gray-300">
                    I need a highly available setup for a Node.js app with a
                    Postgres database.
                  </div>
                </div>
                <div className="flex gap-3 flex-row-reverse">
                  <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-bold">
                    A
                  </div>
                  <div className="bg-purple-500/10 p-4 rounded-2xl rounded-tr-none text-gray-300 border border-purple-500/20">
                    <p className="mb-2">
                      I recommend using <strong>Cloud Run</strong> for the app
                      (auto-scaling) and <strong>Cloud SQL</strong> for Postgres
                      (managed service).
                    </p>
                    <p className="mb-2">Here is the proposed architecture:</p>
                    <div className="bg-black/50 p-3 rounded-lg border border-white/10 text-xs text-green-400">
                      + google_cloud_run_service.app
                      <br />
                      + google_sql_database_instance.db
                      <br />+ google_vpc_access_connector.connector
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Google Contribution Section */}
        <section className="max-w-[80vw] mx-auto px-6 mb-32">
          <div className="rounded-3xl bg-linear-to-r from-[#1a1a2e] to-[#0f172a] border border-white/10 p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-white mb-8">
                Built on Google Cloud Innovation
              </h2>
              <div className="grid gap-8 md:grid-cols-4">
                <div className="flex flex-col items-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 border border-white/10">
                    <img
                      src="https://www.gstatic.com/analytics-suite/header/suite/v2/ic_analytics.svg" // Placeholder for Vertex AI if needed, using generic or text
                      alt="Vertex AI"
                      className="h-8 w-8 opacity-80 invert"
                    />
                  </div>
                  <h3 className="font-bold text-white">Vertex AI</h3>
                  <p className="text-sm text-gray-400 mt-2">
                    Powering our generative models.
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 border border-white/10">
                    <Cloud className="h-8 w-8 text-blue-400" />
                  </div>
                  <h3 className="font-bold text-white">Cloud Run</h3>
                  <p className="text-sm text-gray-400 mt-2">
                    Hosting our scalable platform.
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 border border-white/10">
                    <Search className="h-8 w-8 text-red-400" />
                  </div>
                  <h3 className="font-bold text-white">Agent Builder</h3>
                  <p className="text-sm text-gray-400 mt-2">
                    Orchestrating complex workflows.
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 border border-white/10">
                    <Shield className="h-8 w-8 text-green-400" />
                  </div>
                  <h3 className="font-bold text-white">Cloud Armor</h3>
                  <p className="text-sm text-gray-400 mt-2">
                    Protecting global traffic.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-20 border-t border-white/10 bg-[#020202] py-12 text-center text-sm text-gray-600">
        <div className="max-w-[80vw] mx-auto px-6">
          <p>© 2024 Zero Ops. Built for builders.</p>
        </div>
      </footer>
    </div>
  );
}
