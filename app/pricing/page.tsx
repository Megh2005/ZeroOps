"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Check,
  Zap,
  Shield,
  Star,
  Crown,
  Gem,
  ArrowRight
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

const PricingCard = ({
  title,
  price,
  description,
  features,
  icon,
  popular = false,
}: {
  title: string;
  price: string;
  description: string;
  features: string[];
  icon: React.ReactNode;
  popular?: boolean;
}) => {
  return (
    <motion.div
      variants={fadeInUp}
      className={`relative flex flex-col rounded-2xl border bg-zinc-900/10 p-8 backdrop-blur-2xl transition-all duration-300 hover:bg-zinc-900/30 ${
        popular ? "border-zinc-500/50 shadow-2xl shadow-zinc-900/50" : "border-zinc-800/80"
      }`}
    >
      {popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded border border-zinc-700 bg-zinc-800 px-3 py-0.5 text-[10px] font-mono tracking-widest uppercase text-zinc-300 shadow-sm">
          Recommended
        </div>
      )}

      <div className="mb-6 flex items-center gap-4">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded border ${
            popular ? "border-zinc-600 bg-zinc-800 text-zinc-100" : "border-zinc-800 bg-zinc-950 text-zinc-400"
          }`}
        >
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold tracking-tight text-zinc-100">{title}</h3>
          <p className="text-xs text-zinc-500 font-mono">{description}</p>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-semibold tracking-tight text-zinc-100">{price}</span>
          {price !== "₹0" && <span className="text-xs text-zinc-500 font-mono">/mo</span>}
        </div>
      </div>

      <div className="mb-8 flex-1 space-y-4">
        {features.map((feature, i) => (
          <div key={i} className="flex items-start gap-3 text-xs text-zinc-300">
            <Check className={`h-4 w-4 shrink-0 ${popular ? "text-zinc-300" : "text-zinc-500"}`} />
            <span>{feature}</span>
          </div>
        ))}
      </div>

      <button
        className={`w-full rounded h-10 text-xs font-semibold transition-all ${
          popular
            ? "bg-zinc-100 text-zinc-900 hover:bg-white"
            : "bg-zinc-900/50 border border-zinc-800 text-zinc-300 hover:bg-zinc-800"
        }`}
      >
        Select {title}
      </button>
    </motion.div>
  );
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-transparent text-zinc-100 selection:bg-blue-500/30">
      <SiteHeader />

      <main className="relative z-10 pt-32 pb-20">
        <section className="max-w-[80vw] mx-auto px-6 text-center mb-20 mt-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="mx-auto max-w-3xl"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded border border-zinc-800 bg-zinc-900/30 px-3 py-1 text-[10px] font-mono tracking-widest uppercase text-zinc-400 shadow-sm mx-auto">
              Pricing Matrices
            </div>
            <h1 className="mb-6 text-4xl font-semibold tracking-tight md:text-6xl text-zinc-100">
              Enterprise Licensing
            </h1>
            <p className="mx-auto max-w-2xl text-sm font-mono text-zinc-400 leading-relaxed">
              Transparent, scalable infrastructure orchestration costs. No hidden fees.
            </p>
          </motion.div>
        </section>

        <section className="max-w-[90vw] mx-auto px-6">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 items-start"
          >
            {/* Free Tier */}
            <PricingCard
              title="Community"
              price="₹0"
              description="For solo engineers."
              icon={<Zap className="h-4 w-4" />}
              features={[
                "1 Active Architecture",
                "Core Node Components",
                "Community Forums",
                "Standard HCL Export",
                "Public Templates Only",
              ]}
            />

            {/* Bronze Tier */}
            <PricingCard
              title="Starter"
              price="₹199"
              description="For independent contractors."
              icon={<Shield className="h-4 w-4" />}
              features={[
                "3 Active Architectures",
                "All Node Components",
                "Standard SLA Support",
                "Terraform Cloud Sync",
                "Private Templates",
                "Basic Cost Estimation",
              ]}
            />

            {/* Silver Tier */}
            <PricingCard
              title="Professional"
              price="₹999"
              description="For small engineering teams."
              icon={<Star className="h-4 w-4" />}
              features={[
                "10 Active Architectures",
                "Priority Routing Support",
                "RBAC Security Models",
                "CI/CD Pipeline Webhooks",
                "3 Seat Licenses",
                "30-day Audit Logs",
              ]}
            />

            {/* Gold Tier */}
            <PricingCard
              title="Enterprise"
              price="₹2,999"
              description="For scaling organizations."
              icon={<Crown className="h-4 w-4" />}
              popular={true}
              features={[
                "Unlimited Architectures",
                "24/7 Severity-1 Support",
                "Custom Compliance Policies",
                "Full API Access",
                "Unlimited Seat Licenses",
                "SAML/SSO Integration",
                "Advanced Cost Analytics",
              ]}
            />

            {/* Diamond Tier */}
            <PricingCard
              title="Dedicated"
              price="Custom"
              description="For global enterprises."
              icon={<Gem className="h-4 w-4" />}
              features={[
                "Everything in Enterprise",
                "Dedicated Solutions Architect",
                "99.99% Uptime SLA",
                "On-premise / VPC Deployment",
                "Custom Provider Integrations",
                "Quarterly Training Sessions",
                "White-labeling Options",
              ]}
            />
          </motion.div>
        </section>

        {/* FAQ Section */}
        <section className="max-w-[80vw] mx-auto mt-32 px-6">
          <div className="text-center mb-16">
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-100">
              Technical Inquiries
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-[80vw] mx-auto">
            {[
              {
                q: "Topology Modification",
                a: "Licensing tiers can be upgraded or downgraded dynamically. Invoice prorations are calculated automatically via stripe."
              },
              {
                q: "Data Retention",
                a: "If a subscription lapses, topologies remain in a read-only state for 30 days prior to permanent archival deletion."
              },
              {
                q: "Academic Grants",
                a: "Verified academic institutions (.edu) are automatically granted Professional tier capabilities at zero cost."
              },
              {
                q: "SLA Guarantees",
                a: "Enterprise agreements include financially-backed SLA guarantees. We refund a percentage of the monthly fee if uptime drops below 99.9%."
              }
            ].map((faq, i) => (
              <div key={i} className="bg-zinc-900/10 backdrop-blur-2xl p-6 rounded-2xl border border-zinc-800/80">
                <h3 className="text-sm font-semibold tracking-tight text-zinc-100 mb-2">
                  {faq.q}
                </h3>
                <p className="text-xs text-zinc-500 leading-relaxed font-mono">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>

          {/* Academic Banner */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="mt-20 p-8 rounded-2xl bg-zinc-900/20 backdrop-blur-2xl border border-zinc-800/80 text-center"
          >
            <h3 className="text-xl font-semibold tracking-tight text-zinc-100 mb-4">
              Academic Grant Program
            </h3>
            <p className="text-zinc-400 text-xs font-mono max-w-2xl mx-auto mb-6 leading-relaxed">
              We provide free Professional-tier access to students and academic researchers. Verify your institutional email address to claim your grant.
            </p>
            <Link
              href="/contact"
              className="inline-flex h-10 items-center justify-center rounded border border-zinc-800 bg-zinc-900/50 px-6 text-xs font-semibold text-zinc-300 transition-all hover:bg-zinc-800 hover:text-zinc-100 gap-2"
            >
              Request Verification <ArrowRight className="h-3 w-3" />
            </Link>
          </motion.div>
        </section>
      </main>

      <footer className="mt-20 border-t border-zinc-800/80 bg-[#09090b]/80 backdrop-blur-xl py-8 text-center text-[10px] font-mono text-zinc-600">
        <div className="max-w-[80vw] mx-auto px-6">
          <p>@zeroops-core // Enterprise Orchestration System</p>
        </div>
      </footer>
    </div>
  );
}
