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
  hidden: { opacity: 0, y: 20 },
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
    className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 hover:border-white/20 transition-colors ${className}`}
  >
    <div className="absolute inset-0 bg-linear-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className="relative z-10">
      <div className="mb-4 inline-flex items-center justify-center rounded-xl bg-blue-500/10 p-3 text-blue-400 group-hover:bg-blue-500/20 group-hover:text-blue-300 transition-colors">
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-bold text-white">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
  </motion.div>
);

const CodeWindow = () => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay: 0.4 }}
    className="relative mx-auto w-full max-w-3xl rounded-xl border border-white/10 bg-[#0D0D0D] shadow-2xl shadow-blue-900/20 overflow-hidden text-left"
  >
    <div className="flex items-center gap-2 border-b border-white/10 bg-white/5 px-4 py-3">
      <div className="h-3 w-3 rounded-full bg-red-500/80" />
      <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
      <div className="h-3 w-3 rounded-full bg-green-500/80" />
      <div className="ml-4 text-sm text-gray-500">
        user@cloudshell:~/infra
      </div>
    </div>
    <div className="p-6 text-sm leading-relaxed">
      <div className="text-gray-300">
        <span className="text-green-400">➜</span>{" "}
        <span className="text-blue-400">~</span> gcloud infra-manager
        deployments apply my-stack \
      </div>
      <div className="pl-4 text-gray-300">--location=us-central1 \</div>
      <div className="pl-4 text-gray-300">
        --service-account=projects/demo/serviceAccounts/deployer
      </div>

      <div className="mt-4 text-gray-400">
        <div className="flex items-center gap-2">
          <span className="text-blue-500">ℹ</span> Validating configuration...
        </div>
        <div className="flex items-center gap-2 text-green-400">
          <span>✓</span> Configuration valid.
        </div>
        <div className="mt-2">
          <span className="text-blue-500">ℹ</span> [Terraform] Initializing the
          backend...
        </div>
        <div>
          <span className="text-blue-500">ℹ</span> [Terraform] Creating
          google_compute_instance.app_server...
        </div>
        <div className="mt-2 text-green-400 font-bold">
          Apply complete! Resources: 3 added, 0 changed, 0 destroyed.
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-gray-300">
        <span className="text-green-400">➜</span>{" "}
        <span className="text-blue-400">~</span>{" "}
        <span className="animate-pulse">_</span>
      </div>
    </div>
  </motion.div>
);

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-purple-600/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      </div>

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
            <motion.h1
              variants={fadeInUp}
              className="mb-8 text-5xl font-bold tracking-tight md:text-7xl lg:text-8xl"
            >
              Infrastructure as{" "}
              <span className="bg-linear-to-r from-blue-400 via-purple-400 to-white bg-clip-text text-transparent">
                Visual Art
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="mx-auto mb-12 max-w-[60vw] text-lg text-gray-100 md:text-2xl"
            >
              Stop wrestling with YAML indentation. Build production-ready cloud
              infrastructure with a drag-and-drop interface that developers
              actually love
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="mb-20 flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Link
                href="/builder"
                className="flex h-12 items-center justify-center rounded-full bg-blue-600 px-8 text-base font-semibold text-white transition-all hover:bg-blue-500 hover:scale-105 hover:shadow-lg hover:shadow-blue-600/25"
              >
                Start Building Free
              </Link>
              <Link
                href="/docs"
                className="flex h-12 items-center justify-center rounded-full border border-white/10 bg-white/5 px-8 text-base font-semibold text-white transition-all hover:bg-white/10"
              >
                <Terminal className="mr-2 h-4 w-4" />
                View Documentation
              </Link>
            </motion.div>
          </motion.div>

          <CodeWindow />
        </section>

        {/* Features Grid */}
        <section className="max-w-[80vw] mx-auto mt-32 px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Everything you need to ship
            </h2>
            <p className="text-gray-400">
              Powerful features for modern DevOps teams.
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
              icon={<Box className="h-6 w-6" />}
              title="Visual Builder"
              description="Drag and drop AWS, Azure, and GCP resources. Connect them logically and let us handle the wiring."
              className="md:col-span-2"
            />
            <FeatureCard
              icon={<Code2 className="h-6 w-6" />}
              title="Clean Export"
              description="Export semantic, human-readable Terraform code. No vendor lock-in, ever."
            />
            <FeatureCard
              icon={<ShieldCheck className="h-6 w-6" />}
              title="Policy as Code"
              description="Enforce security best practices and compliance rules automatically as you design."
            />
            <FeatureCard
              icon={<Cloud className="h-6 w-6" />}
              title="Multi-Cloud"
              description="Deploy to any major cloud provider from a single unified interface."
              className="md:col-span-2"
            />
          </motion.div>
        </section>

        {/* Stats / Social Proof */}
        <section className="mt-32 border-y border-white/5 bg-white/2 py-20">
          <div className="max-w-[80vw] mx-auto px-6">
            <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
              {[
                { label: "Resources Managed", value: "100K+" },
                { label: "Active Developers", value: "50+" },
                { label: "Cloud Providers", value: "3" },
                { label: "Uptime", value: "95%" },
              ].map((stat, i) => (
                <div key={i}>
                  <div className="text-3xl font-bold text-white md:text-4xl">
                    {stat.value}
                  </div>
                  <div className="mt-2 text-sm text-gray-500 uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-[80vw] mx-auto mt-32 px-6 text-center">
          <div className="relative overflow-hidden rounded-3xl bg-linear-to-b from-blue-900/20 to-purple-900/20 px-6 py-20 border border-white/10">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
            <div className="relative z-10">
              <h2 className="mb-6 text-4xl capitalize font-bold  md:text-5xl">
                Ready to architect the future?
              </h2>
              <p className="mx-auto mb-10 max-w-xl text-lg text-gray-300">
                Join thousands of developers who are building better
                infrastructure, faster
              </p>
              <Link
                href="/builder"
                className="inline-flex h-14 items-center justify-center rounded-full bg-white px-10 text-lg font-bold text-black transition-transform hover:scale-105"
              >
                Get Started Now
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-32 border-t border-white/10 bg-[#020202] py-12 text-center text-sm text-gray-200">
        <div className="max-w-[80vw] text-xl capitalize mx-auto px-6">
          <p>&copy; 2026 DevOps Architect. Built for builders</p>
        </div>
      </footer>
    </div>
  );
}
