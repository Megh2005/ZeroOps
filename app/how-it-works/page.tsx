"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Cpu,
  Database,
  Globe,
  Layers,
  Zap,
  Code,
  Shield,
  GitBranch,
  ArrowRight,
  Brain,
  Sparkles,
  Bot,
  Rocket,
  Target,
  Clock,
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
      staggerChildren: 0.15,
    },
  },
};

const TimelineItem = ({
  year,
  title,
  description,
  icon,
  isLeft = true,
}: {
  year: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  isLeft?: boolean;
}) => (
  <motion.div
    variants={fadeInUp}
    className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group`}
  >
    <div className="flex items-center justify-center w-10 h-10 rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-300 shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-colors group-hover:border-blue-500/30 group-hover:text-blue-400">
      {icon}
    </div>
    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-zinc-900/10 p-6 rounded-2xl border border-zinc-800/80 shadow-sm hover:bg-zinc-900/20 hover:border-zinc-700/80 transition-all backdrop-blur-2xl">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-zinc-100 text-base tracking-tight">{title}</h3>
        <span className="text-[10px] font-mono text-zinc-400 bg-zinc-950 border border-zinc-800 px-2 py-0.5 rounded shadow-sm">
          {year}
        </span>
      </div>
      <p className="text-zinc-500 text-xs leading-relaxed">{description}</p>
    </div>
    <div className="absolute top-1/2 left-5 md:left-1/2 w-px h-full bg-zinc-800/80 -translate-y-1/2 z-0 md:-translate-x-1/2 hidden md:block" />
  </motion.div>
);

const FeatureSection = ({
  title,
  description,
  icon,
  children,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  children?: React.ReactNode;
}) => (
  <motion.div variants={fadeInUp} className="mb-24 last:mb-0">
    <div className="flex items-center gap-4 mb-8">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-300 shadow-sm">
        {icon}
      </div>
      <div>
        <h2 className="text-2xl font-semibold text-zinc-100 tracking-tight">{title}</h2>
        <p className="text-zinc-400 text-xs font-mono mt-1">{description}</p>
      </div>
    </div>
    {children}
  </motion.div>
);

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 selection:bg-blue-500/30">
      <SiteHeader />

      <main className="relative z-10 pt-32 pb-20">
        {/* Hero Section */}
        <section className="max-w-[80vw] mx-auto px-6 text-center mb-32">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="mx-auto max-w-4xl"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded border border-zinc-800 bg-zinc-900/30 px-3 py-1 text-[10px] font-mono tracking-widest uppercase text-zinc-400 shadow-sm">
              <Sparkles className="h-3 w-3 text-blue-500" />
              Powered by Advanced AI
            </div>
            <h1 className="mb-8 text-4xl font-semibold tracking-tight md:text-6xl text-zinc-100">
              The Engine Behind <br />
              <span className="text-blue-500">Zero Ops</span>
            </h1>
            <p className="mx-auto max-w-2xl text-sm text-zinc-400 leading-relaxed font-mono">
              We combine visual drag-and-drop simplicity with the raw power of
              agentic intelligence to generate production-grade infrastructure code.
            </p>
          </motion.div>
        </section>

        <section className="max-w-[80vw] mx-auto px-6">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* Technical Architecture */}
            <FeatureSection
              title="Technical Architecture"
              description="From canvas to cloud in milliseconds."
              icon={<Cpu className="h-5 w-5" />}
            >
              <div className="grid gap-6 md:grid-cols-3">
                <div className="bg-zinc-900/10 p-8 rounded-2xl border border-zinc-800/80 backdrop-blur-2xl hover:bg-zinc-900/20 transition-all">
                  <div className="mb-5 inline-flex items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950 p-2 text-zinc-300">
                    <Layers className="h-4 w-4" />
                  </div>
                  <h3 className="text-base font-semibold text-zinc-100 mb-2 tracking-tight">
                    Visual State
                  </h3>
                  <p className="text-zinc-500 text-xs leading-relaxed">
                    Your canvas design is captured as a JSON state graph,
                    representing nodes (resources) and edges (connections).
                  </p>
                </div>
                <div className="bg-zinc-900/10 p-8 rounded-2xl border border-zinc-800/80 backdrop-blur-2xl hover:bg-zinc-900/20 transition-all">
                  <div className="mb-5 inline-flex items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950 p-2 text-zinc-300">
                    <Code className="h-4 w-4" />
                  </div>
                  <h3 className="text-base font-semibold text-zinc-100 mb-2 tracking-tight">
                    Transpilation
                  </h3>
                  <p className="text-zinc-500 text-xs leading-relaxed">
                    Our engine traverses the graph, resolving dependencies and
                    mapping each node to its corresponding Terraform HCL block.
                  </p>
                </div>
                <div className="bg-zinc-900/10 p-8 rounded-2xl border border-zinc-800/80 backdrop-blur-2xl hover:bg-zinc-900/20 transition-all">
                  <div className="mb-5 inline-flex items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950 p-2 text-zinc-300">
                    <Cloud className="h-4 w-4" />
                  </div>
                  <h3 className="text-base font-semibold text-zinc-100 mb-2 tracking-tight">
                    Deployment
                  </h3>
                  <p className="text-zinc-500 text-xs leading-relaxed">
                    The generated Terraform is validated against cloud policies
                    and can be deployed directly via CLI or CI/CD pipelines.
                  </p>
                </div>
              </div>
            </FeatureSection>

            {/* AI Integration */}
            <FeatureSection
              title="Agentic AI Integration"
              description="Your intelligent infrastructure co-pilot."
              icon={<Brain className="h-5 w-5" />}
            >
              <div className="relative overflow-hidden rounded-2xl bg-zinc-900/10 border border-zinc-800/80 backdrop-blur-2xl p-8 md:p-12">
                <div className="absolute top-0 right-0 p-12 opacity-5">
                  <Bot className="w-64 h-64 text-zinc-400" />
                </div>
                <div className="relative z-10 grid gap-12 md:grid-cols-2">
                  <div>
                    <h3 className="text-xl font-semibold text-zinc-100 mb-6 tracking-tight">
                      Context-Aware Suggestions
                    </h3>
                    <p className="text-zinc-500 text-xs mb-6 leading-relaxed">
                      Zero Ops doesn't just place boxes. It understands what
                      you're building. If you drop a database, the engine suggests
                      the optimal connection pooling settings. If you add a load
                      balancer, it recommends the right health checks.
                    </p>
                    <ul className="space-y-3 font-mono text-[10px] text-zinc-400">
                      <li className="flex items-center gap-3">
                        <span className="text-blue-500">✓</span>
                        Real-time security auditing
                      </li>
                      <li className="flex items-center gap-3">
                        <span className="text-blue-500">✓</span>
                        Cost optimization profiling
                      </li>
                      <li className="flex items-center gap-3">
                        <span className="text-blue-500">✓</span>
                        Compliance constraint mapping
                      </li>
                    </ul>
                  </div>
                  <div className="bg-[#09090b] rounded-xl p-6 border border-zinc-800/80 text-xs shadow-inner">
                    <div className="flex items-center gap-2 mb-4 border-b border-zinc-800 pb-3 font-mono text-[10px]">
                      <Sparkles className="w-3 h-3 text-blue-500" />
                      <span className="text-zinc-400 uppercase tracking-widest">Diagnostic Output</span>
                    </div>
                    <div className="space-y-4 font-mono">
                      <p className="text-zinc-300">
                        <span className="text-zinc-500">user@admin:~$</span> Connect App
                        Engine to Cloud SQL.
                      </p>
                      <div className="text-zinc-400 border-l-2 border-zinc-800 pl-3 py-1 space-y-2">
                        <p>
                          <span className="text-blue-400">agent-node:</span> Detected public IP exposure on Cloud SQL segment. 
                        </p>
                        <p>
                          Mitigation required: Switching to 
                          <span className="text-zinc-200 font-semibold"> Cloud SQL Auth Proxy </span> 
                          or <span className="text-zinc-200 font-semibold"> Private Service Connect</span>.
                        </p>
                      </div>
                      <div className="bg-emerald-500/10 text-emerald-400 p-2.5 rounded border border-emerald-500/20 text-[10px]">
                        ✓ Action taken: Implicit Private IP configuration established.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </FeatureSection>

            {/* Business Scope */}
            <FeatureSection
              title="Business Scope"
              description="Our vision for the future of cloud engineering."
              icon={<Target className="h-5 w-5" />}
            >
              <div className="grid gap-6 md:grid-cols-2">
                <div className="bg-zinc-900/10 p-8 rounded-2xl border border-zinc-800/80 backdrop-blur-2xl hover:bg-zinc-900/20 transition-all">
                  <h3 className="text-base font-semibold text-zinc-100 mb-3 tracking-tight">
                    Democratizing DevOps
                  </h3>
                  <p className="text-zinc-500 text-xs leading-relaxed">
                    We aim to lower the barrier to entry for cloud
                    infrastructure. By 2026, we envision a world where a
                    frontend developer can architect a global-scale backend as
                    easily as they build a UI component.
                  </p>
                </div>
                <div className="bg-zinc-900/10 p-8 rounded-2xl border border-zinc-800/80 backdrop-blur-2xl hover:bg-zinc-900/20 transition-all">
                  <h3 className="text-base font-semibold text-zinc-100 mb-3 tracking-tight">
                    Enterprise Governance
                  </h3>
                  <p className="text-zinc-500 text-xs leading-relaxed">
                    For large organizations, Zero Ops will become the central
                    source of truth. We plan to integrate deep policy-as-code
                    enforcement, ensuring that every resource deployed meets
                    strict corporate standards automatically.
                  </p>
                </div>
              </div>
            </FeatureSection>

            {/* Roadmap Timeline */}
            <FeatureSection
              title="Future Roadmap"
              description="Where we are going next."
              icon={<Clock className="h-5 w-5" />}
            >
              <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-px before:bg-zinc-800">
                <TimelineItem
                  year="Q1 2026"
                  title="Multi-Cloud Expansion"
                  description="Full support for AWS and Azure resources, allowing seamless cross-cloud architectures."
                  icon={<Globe className="w-4 h-4" />}
                />
                <TimelineItem
                  year="Q2 2026"
                  title="AI Auto-Healing"
                  description="Agents that not only deploy but actively monitor and fix production incidents in real-time."
                  icon={<Bot className="w-4 h-4" />}
                />
                <TimelineItem
                  year="Q3 2026"
                  title="Marketplace Launch"
                  description="A community-driven marketplace for verified architecture templates and custom components."
                  icon={<Rocket className="w-4 h-4" />}
                />
                <TimelineItem
                  year="Q4 2026"
                  title="Zero Ops Enterprise"
                  description="On-premise deployment options, SSO enforcement, and dedicated support for Fortune 500 companies."
                  icon={<Target className="w-4 h-4" />}
                />
              </div>
            </FeatureSection>
          </motion.div>
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

// Helper icon
function Cloud(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.5 19c0-3.037-2.463-5.5-5.5-5.5S6.5 15.963 6.5 19" />
      <path d="M17.5 19h2a2.5 2.5 0 0 0 0-5 2.5 2.5 0 0 0-2.5-2.5" />
      <path d="M6.5 19h-2a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 2.5-2.5" />
      <path d="M12 13.5V4" />
      <path d="M12 4 8 8" />
      <path d="M12 4l4 4" />
    </svg>
  );
}
