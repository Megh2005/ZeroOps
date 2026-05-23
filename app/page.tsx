"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Code2,
  Cpu,
  Layers,
  GitBranch,
  Terminal,
  Zap,
  Box,
  ShieldCheck,
  Cloud,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

const fadeInUp = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
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

const FeatureCard = ({
  icon,
  title,
  description,
  className = "",
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}) => (
  <motion.div
    variants={fadeInUp}
    className={`group relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/10 p-8 hover:bg-zinc-900/30 backdrop-blur-2xl transition-all duration-300 ${className}`}
  >
    <div className="relative z-10">
      <div className="mb-5 inline-flex items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-zinc-300 shadow-sm group-hover:border-blue-500/30 group-hover:text-blue-400 transition-colors">
        {icon}
      </div>
      <h3 className="mb-2 text-base font-semibold text-zinc-100 tracking-tight">{title}</h3>
      <p className="text-zinc-500 text-xs leading-relaxed">{description}</p>
    </div>
  </motion.div>
);

const CodeWindow = () => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay: 0.3 }}
    className="relative mx-auto w-full max-w-3xl rounded-xl border border-zinc-800/80 bg-[#050505]/80 backdrop-blur-2xl shadow-2xl overflow-hidden text-left"
  >
    <div className="flex items-center gap-2 border-b border-zinc-800/80 bg-zinc-900/50 px-4 py-3">
      <div className="h-2.5 w-2.5 rounded-full border border-zinc-700 bg-zinc-800" />
      <div className="h-2.5 w-2.5 rounded-full border border-zinc-700 bg-zinc-800" />
      <div className="h-2.5 w-2.5 rounded-full border border-zinc-700 bg-zinc-800" />
      <div className="ml-4 text-[10px] font-mono text-zinc-500">
        admin@zeroops-core:~/deployments
      </div>
    </div>
    <div className="p-6 text-xs font-mono leading-relaxed">
      <div className="text-zinc-300">
        <span className="text-blue-500">➜</span>{" "}
        <span className="text-zinc-500">~</span> zeroops apply architecture-v2.json \
      </div>
      <div className="pl-4 text-zinc-400">--region=us-east-1 \</div>
      <div className="pl-4 text-zinc-400">
        --enforce-strict-iam
      </div>

      <div className="mt-5 text-zinc-500 space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="text-blue-500">ℹ</span> Validating structural integrity...
        </div>
        <div className="flex items-center gap-2 text-emerald-500/90">
          <span>✓</span> Checksum verified. IAM policies conformant.
        </div>
        <div className="mt-3">
          <span className="text-blue-500">ℹ</span> [Terraform Core] Initializing state lock...
        </div>
        <div>
          <span className="text-blue-500">ℹ</span> [Terraform Core] Provisioning aws_eks_cluster.main...
        </div>
        <div className="mt-3 text-emerald-500 font-semibold">
          Apply complete! Resources: 14 added, 0 changed, 0 destroyed.
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2 text-zinc-300">
        <span className="text-blue-500">➜</span>{" "}
        <span className="text-zinc-500">~</span>{" "}
        <span className="animate-pulse bg-zinc-400 w-2 h-4 block"></span>
      </div>
    </div>
  </motion.div>
);

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-transparent text-zinc-100 selection:bg-blue-500/30 font-sans">
      <SiteHeader />

      <main className="relative z-10 pt-32 pb-20">
        {/* Hero Section */}
        <section className="max-w-[80vw] mx-auto px-6 text-center mb-32">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="mx-auto max-w-[80vw]"
          >
            <motion.div
              variants={fadeInUp}
              className="mb-6 inline-flex items-center gap-2 rounded border border-zinc-800 bg-zinc-900/30 px-3 py-1 text-[10px] font-mono tracking-widest uppercase text-zinc-400 shadow-sm mx-auto"
            >
              <Terminal className="h-3 w-3 text-blue-500" />
              Infrastructure Engine v2.0
            </motion.div>
            
            <motion.h1
              variants={fadeInUp}
              className="mb-8 text-5xl font-semibold tracking-tight md:text-7xl lg:text-8xl text-zinc-100"
            >
              Infrastructure as{" "}
              <span className="text-blue-500">
                Visual Art
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="mx-auto mb-12 max-w-[50vw] text-sm text-zinc-400 leading-relaxed font-mono"
            >
              Stop wrestling with declarative file hierarchies. Architect production-ready cloud
              infrastructure via an elegant digital canvas natively transpiled to strict Terraform state.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="mb-24 flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Link
                href="/builder"
                className="flex h-12 items-center justify-center rounded border border-zinc-800 bg-zinc-100 px-8 text-xs font-semibold text-zinc-900 transition-all hover:bg-white hover:border-zinc-300"
              >
                Access Canvas
              </Link>
              <Link
                href="/docs"
                className="flex h-12 items-center justify-center rounded border border-zinc-800 bg-zinc-900/50 px-8 text-xs font-semibold text-zinc-300 transition-all hover:bg-zinc-800"
              >
                <Code2 className="mr-2 h-4 w-4" />
                Read Documentation
              </Link>
            </motion.div>
          </motion.div>

          <CodeWindow />
        </section>

        {/* Features Grid */}
        <section className="max-w-[80vw] mx-auto mt-32 px-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-3xl font-semibold tracking-tight text-zinc-100">
              Enterprise Specifications
            </h2>
            <p className="text-zinc-500 text-xs font-mono">
              Strict governance mapping for major cloud providers.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-6 md:grid-cols-3"
          >
            <FeatureCard
              icon={<Box className="h-4 w-4" />}
              title="Stateful Design Interface"
              description="Construct logic gates and subnet zones graphically. Instantaneous validation of routing policies."
              className="md:col-span-2"
            />
            <FeatureCard
              icon={<Code2 className="h-4 w-4" />}
              title="Immutable Export"
              description="HCL generation strictly adhering to HashiCorp best practices. No lock-in."
            />
            <FeatureCard
              icon={<ShieldCheck className="h-4 w-4" />}
              title="Zero-Trust Checks"
              description="Automatic static analysis of deployed topologies against CIS benchmarks."
            />
            <FeatureCard
              icon={<Cloud className="h-4 w-4" />}
              title="Agnostic Transpilation"
              description="Unified translation layer. Single design exports cleanly to AWS, Azure, or GCP syntax."
              className="md:col-span-2"
            />
          </motion.div>
        </section>

        {/* Stats / Social Proof */}
        <section className="mt-32 border-y border-zinc-800/80 bg-zinc-900/10 backdrop-blur-xl py-20">
          <div className="max-w-[80vw] mx-auto px-6">
            <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4 font-mono">
              {[
                { label: "State Lines", value: "1.2M+" },
                { label: "Node Edges", value: "450K+" },
                { label: "Cloud Providers", value: "03" },
                { label: "Parse Latency", value: "12ms" },
              ].map((stat, i) => (
                <div key={i}>
                  <div className="text-3xl font-semibold text-zinc-100 md:text-4xl tracking-tight">
                    {stat.value}
                  </div>
                  <div className="mt-3 text-[10px] text-zinc-500 uppercase tracking-widest">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-[80vw] mx-auto mt-32 mb-32 px-6 text-center">
          <div className="relative overflow-hidden rounded-2xl bg-zinc-900/20 px-6 py-20 border border-zinc-800/80 backdrop-blur-2xl">
            <div className="relative z-10">
              <h2 className="mb-6 text-3xl font-semibold tracking-tight text-zinc-100 md:text-4xl">
                Ready to initialize?
              </h2>
              <p className="mx-auto mb-10 max-w-xl text-xs text-zinc-400 font-mono">
                Join elite platform engineering teams deploying faster and safer.
              </p>
              <Link
                href="/builder"
                className="inline-flex h-12 items-center justify-center rounded border border-zinc-800 bg-zinc-100 px-10 text-xs font-semibold text-zinc-900 transition-all hover:bg-white"
              >
                Boot Infrastructure Canvas
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-800/80 bg-[#09090b]/80 backdrop-blur-xl py-8 text-center text-[10px] font-mono text-zinc-600">
        <div className="max-w-[80vw] mx-auto px-6">
          <p>@zeroops-core // Enterprise Orchestration System</p>
        </div>
      </footer>
    </div>
  );
}
