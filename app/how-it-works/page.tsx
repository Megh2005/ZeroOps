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
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
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
    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/20 bg-[#111] shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
      {icon}
    </div>
    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-[#111] p-6 rounded-3xl border border-white/10 shadow-lg hover:border-blue-500/30 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-white text-lg">{title}</h3>
        <span className="text-xs text-blue-400 bg-blue-500/10 px-2 py-1 rounded-full">
          {year}
        </span>
      </div>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    </div>
    <div className="absolute top-1/2 left-5 md:left-1/2 w-0.5 h-full bg-white/10 -translate-y-1/2 z-0 md:-translate-x-1/2 hidden md:block" />
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
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/10 text-blue-400">
        {icon}
      </div>
      <div>
        <h2 className="text-3xl font-bold text-white">{title}</h2>
        <p className="text-gray-400 mt-1">{description}</p>
      </div>
    </div>
    {children}
  </motion.div>
);

export default function HowItWorksPage() {
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
        <section className="max-w-[80vw] mx-auto px-6 text-center mb-32">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="mx-auto max-w-4xl"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-sm font-medium text-blue-400">
              <Sparkles className="h-4 w-4" />
              Powered by Advanced AI
            </div>
            <h1 className="mb-8 text-5xl font-bold  md:text-7xl">
              The Engine Behind <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-500">
                Zero Ops
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-xl text-gray-400 leading-relaxed">
              We combine visual drag-and-drop simplicity with the raw power of
              Google's Gemini AI to generate production-grade infrastructure
              code.
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
              icon={<Cpu className="h-6 w-6" />}
            >
              <div className="grid gap-6 md:grid-cols-3">
                <div className="bg-[#111] p-8 rounded-3xl border border-white/10">
                  <div className="mb-4 text-blue-400">
                    <Layers className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Visual State
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Your canvas design is captured as a JSON state graph,
                    representing nodes (resources) and edges (connections).
                  </p>
                </div>
                <div className="bg-[#111] p-8 rounded-3xl border border-white/10">
                  <div className="mb-4 text-purple-400">
                    <Code className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Transpilation
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Our engine traverses the graph, resolving dependencies and
                    mapping each node to its corresponding Terraform HCL block.
                  </p>
                </div>
                <div className="bg-[#111] p-8 rounded-3xl border border-white/10">
                  <div className="mb-4 text-green-400">
                    <Cloud className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Deployment
                  </h3>
                  <p className="text-gray-400 text-sm">
                    The generated Terraform is validated against cloud policies
                    and can be deployed directly via CLI or CI/CD pipelines.
                  </p>
                </div>
              </div>
            </FeatureSection>

            {/* Gemini AI Integration */}
            <FeatureSection
              title="Gemini AI Integration"
              description="Your intelligent infrastructure co-pilot."
              icon={<Brain className="h-6 w-6" />}
            >
              <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#1a1a2e] to-[#111] border border-white/10 p-8 md:p-12">
                <div className="absolute top-0 right-0 p-12 opacity-10">
                  <Bot className="w-64 h-64 text-blue-500" />
                </div>
                <div className="relative z-10 grid gap-12 md:grid-cols-2">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-6">
                      Context-Aware Suggestions
                    </h3>
                    <p className="text-gray-400 mb-6 leading-relaxed">
                      Zero Ops doesn't just place boxes. It understands what
                      you're building. If you drop a database, Gemini suggests
                      the optimal connection pooling settings. If you add a load
                      balancer, it recommends the right health checks.
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3 text-sm text-gray-300">
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                        Real-time security auditing
                      </li>
                      <li className="flex items-center gap-3 text-sm text-gray-300">
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                        Cost optimization tips
                      </li>
                      <li className="flex items-center gap-3 text-sm text-gray-300">
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                        Compliance checks (HIPAA, GDPR)
                      </li>
                    </ul>
                  </div>
                  <div className="bg-black/50 rounded-2xl p-6 border border-white/5 text-sm">
                    <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-2">
                      <Sparkles className="w-4 h-4 text-yellow-500" />
                      <span className="text-gray-400">Gemini Analysis</span>
                    </div>
                    <div className="space-y-4">
                      <p className="text-gray-300">
                        <span className="text-blue-400">User:</span> Connect App
                        Engine to Cloud SQL.
                      </p>
                      <p className="text-gray-300">
                        <span className="text-purple-400">Gemini:</span> I've
                        detected a public IP on your Cloud SQL instance. For
                        better security, I recommend using the{" "}
                        <span className="text-green-400">
                          Cloud SQL Auth Proxy
                        </span>{" "}
                        or{" "}
                        <span className="text-green-400">
                          Private Service Connect
                        </span>
                        .
                      </p>
                      <div className="bg-green-500/10 text-green-400 p-3 rounded-lg border border-green-500/20">
                        ✓ Automatically applied Private IP configuration.
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
              icon={<Target className="h-6 w-6" />}
            >
              <div className="grid gap-6 md:grid-cols-2">
                <div className="bg-[#111] p-8 rounded-3xl border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-4">
                    Democratizing DevOps
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    We aim to lower the barrier to entry for cloud
                    infrastructure. By 2026, we envision a world where a
                    frontend developer can architect a global-scale backend as
                    easily as they build a UI component.
                  </p>
                </div>
                <div className="bg-[#111] p-8 rounded-3xl border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-4">
                    Enterprise Governance
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
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
              icon={<Clock className="h-6 w-6" />}
            >
              <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-linear-to-b before:from-transparent before:via-white/10 before:to-transparent">
                <TimelineItem
                  year="Q1 2025"
                  title="Multi-Cloud Expansion"
                  description="Full support for AWS and Azure resources, allowing seamless cross-cloud architectures."
                  icon={<Globe className="w-5 h-5 text-white" />}
                />
                <TimelineItem
                  year="Q3 2025"
                  title="AI Auto-Healing"
                  description="Gemini agents that not only deploy but actively monitor and fix production incidents in real-time."
                  icon={<Bot className="w-5 h-5 text-white" />}
                />
                <TimelineItem
                  year="Q1 2026"
                  title="Marketplace Launch"
                  description="A community-driven marketplace for verified architecture templates and custom components."
                  icon={<Rocket className="w-5 h-5 text-white" />}
                />
                <TimelineItem
                  year="2026+"
                  title="Zero Ops Enterprise"
                  description="On-premise deployment options, SSO enforcement, and dedicated support for Fortune 500 companies."
                  icon={<Target className="w-5 h-5 text-white" />}
                />
              </div>
            </FeatureSection>
          </motion.div>
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
