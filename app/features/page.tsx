"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Box,
  Code2,
  Cloud,
  Share2,
  DollarSign,
  Terminal,
  Workflow,
  Search,
  Shield,
  Bot,
  Layers,
  Cpu,
  ArrowRight,
  Activity,
  User
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";

const fadeInUp = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
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
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
}) => (
  <motion.div
    variants={fadeInUp}
    className={`group relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/10 p-8 hover:border-zinc-700/80 hover:bg-zinc-900/20 transition-all duration-300 backdrop-blur-2xl ${className}`}
  >
    <div className="relative z-10 h-full flex flex-col">
      <div className="mb-5 inline-flex items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 text-zinc-300 group-hover:text-blue-400 group-hover:border-blue-500/30 transition-colors w-fit shadow-sm">
        {icon}
      </div>
      <h3 className="mb-2 text-base font-semibold text-zinc-100 tracking-tight">{title}</h3>
      <p className="text-zinc-500 text-xs leading-relaxed flex-1">
        {description}
      </p>
    </div>
  </motion.div>
);

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 selection:bg-blue-500/30 ">
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
            <div className="mb-6 inline-flex items-center gap-2 rounded border border-zinc-800 bg-zinc-900/30 px-3 py-1 text-[10px] font-mono tracking-widest uppercase text-zinc-400 shadow-sm">
              <Layers className="h-3 w-3 text-blue-500" />
              Platform Capabilities
            </div>
            <h1 className="mb-8 text-4xl font-semibold tracking-tight md:text-6xl text-zinc-100">
              Enterprise-Grade <br />
              <span className="text-blue-500">Infrastructure Automation</span>
            </h1>
            <p className="mx-auto max-w-2xl text-sm text-zinc-400 leading-relaxed font-mono">
              A complete toolkit for modern cloud engineering, providing strict governance, 
              intelligent agentic automation, and highly available architecture deployments.
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
              title="Architecture Canvas"
              description="Construct highly available resource clusters on an infinite digital canvas. Absolute precision for VPCs, Subnets, and Load Balancers before provisioning."
              icon={<Box className="h-5 w-5" />}
              className="md:col-span-2 md:row-span-1"
            />

            {/* New Item: Cost Estimation */}
            <BentoCard
              title="Telemetry & Billing"
              description="Real-time cost estimations mapped directly to operational resource usage."
              icon={<DollarSign className="h-5 w-5" />}
              className="md:col-span-1 md:row-span-1"
            />

            {/* New Item: Drift Detection */}
            <BentoCard
              title="State Drift Detection"
              description="Continuous state monitoring to alert on manual infrastructure mutations."
              icon={<Activity className="h-5 w-5" />}
              className="md:col-span-1 md:row-span-1"
            />

            {/* Medium Item: Terraform Export */}
            <BentoCard
              title="Declarative IaC Export"
              description="Generate formalized, immutable Terraform (HCL) blueprints natively following strict module best practices."
              icon={<Code2 className="h-5 w-5" />}
              className="md:col-span-1 md:row-span-1"
            />

            {/* Small Item: Multi-Cloud */}
            <BentoCard
              title="Cloud Agnostic"
              description="Unified integration endpoints for AWS, Azure, and Google Cloud environments."
              icon={<Cloud className="h-5 w-5" />}
              className="md:col-span-1 md:row-span-1"
            />

            {/* Small Item: Collaboration */}
            <BentoCard
              title="Identity & Access"
              description="Strict RBAC, policy provisioning, and team collaboration protocols."
              icon={<Shield className="h-5 w-5" />}
              className="md:col-span-1 md:row-span-1"
            />

            {/* New Item: Audit Logs */}
            <BentoCard
              title="Immutable Audit Logs"
              description="Granular historical tracking for all hypervisor and deployment modifications."
              icon={<Terminal className="h-5 w-5" />}
              className="md:col-span-1 md:row-span-1"
            />
          </motion.div>
        </section>

        {/* AI & Agent Builder Section */}
        <section className="max-w-[80vw] mx-auto px-6 mb-32">
          <div className="grid gap-12 md:grid-cols-2 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 rounded border border-zinc-800 bg-zinc-900/30 px-3 py-1 text-[10px] font-mono tracking-widest uppercase text-zinc-400">
                <Bot className="h-3 w-3 text-blue-500" />
                Autonomous Engine
              </div>
              <h2 className="text-3xl font-semibold text-zinc-100 tracking-tight">
                Intelligent Diagnostics <br />
                <span className="text-zinc-500">via Agent Builder</span>
              </h2>
              <p className="text-zinc-400 text-xs leading-relaxed font-mono">
                System automation delegates operational intelligence to specialized models. 
                Ensure optimal configuration, strict security policies, and efficient scale.
              </p>
              
              <div className="space-y-4 pt-4">
                <div className="flex items-start gap-4">
                  <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded border border-zinc-800 bg-zinc-900 text-zinc-300 shadow-sm">
                    <Workflow className="h-3 w-3" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-zinc-200">Architect Node</h4>
                    <p className="text-xs text-zinc-500 mt-1">
                      Analyzes traffic patterns to propose highly available load balancer topologies and instance groups.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded border border-zinc-800 bg-zinc-900 text-zinc-300 shadow-sm">
                    <Shield className="h-3 w-3" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-zinc-200">Security Node</h4>
                    <p className="text-xs text-zinc-500 mt-1">
                      Enforces IAM strictness, scans VPC firewalls, and validates compliance rules automatically.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative rounded-2xl border border-zinc-800/80 bg-zinc-900/20 p-6 overflow-hidden shadow-xl"
            >
              <div className="relative z-10 space-y-5 font-mono text-[10px]">
                <div className="flex gap-3">
                  <div className="h-6 w-6 shrink-0 rounded border border-zinc-700 bg-zinc-800 flex items-center justify-center text-zinc-400">
                    <User className="h-3 w-3" />
                  </div>
                  <div className="rounded border border-zinc-800 bg-zinc-900/50 p-3 text-zinc-300 w-full">
                    Deploy a highly available ingress for the auth microservice.
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="h-6 w-6 shrink-0 rounded border border-blue-900/50 bg-blue-900/20 flex items-center justify-center text-blue-400">
                    <Bot className="h-3 w-3" />
                  </div>
                  <div className="rounded border border-blue-900/30 bg-blue-900/10 p-3 text-zinc-300 w-full space-y-3">
                    <p className="text-zinc-400">
                      Processing architecture requirements. Validating regional constraints...
                    </p>
                    <div className="rounded border border-zinc-800 bg-[#09090b] p-2.5 text-[9px] text-zinc-500">
                      <span className="text-emerald-500">✓</span> Provisioning Internal Load Balancer<br/>
                      <span className="text-emerald-500">✓</span> Attaching Network Endpoint Groups (NEG)<br/>
                      <span className="text-emerald-500">✓</span> Establishing SSL Certificates
                    </div>
                    <p className="text-blue-400">Deployment state synchronized successfully.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-800/80 bg-[#09090b] py-8 text-center text-xs font-mono text-zinc-600">
        <div className="max-w-[80vw] mx-auto px-6">
          <p>@zeroops-core // Enterprise Orchestration</p>
        </div>
      </footer>
    </div>
  );
}
