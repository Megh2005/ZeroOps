"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Check,
  Layers,
  ArrowRight,
  Zap,
  Shield,
  Star,
  Crown,
  Gem,
} from "lucide-react";
import Link from "next/link";
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

const PricingCard = ({
  title,
  price,
  description,
  features,
  icon,
  color = "diamond",
  popular = false,
}: {
  title: string;
  price: string;
  description: string;
  features: string[];
  icon: React.ReactNode;
  color?: "gray" | "bronze" | "silver" | "gold" | "diamond";
  popular?: boolean;
}) => {
  const colorStyles = {
    gray: {
      border: "border-white/10",
      bg: "bg-[#111]",
      text: "text-gray-400",
      iconBg: "bg-gray-500/10",
      iconText: "text-gray-400",
      button: "bg-white/10 hover:bg-white/20 text-white",
    },
    bronze: {
      border: "border-orange-700/30",
      bg: "bg-gradient-to-b from-[#1a120b] to-[#111]",
      text: "text-orange-400",
      iconBg: "bg-orange-500/10",
      iconText: "text-orange-400",
      button:
        "bg-orange-600/20 hover:bg-orange-600/30 text-orange-400 border border-orange-600/30",
    },
    silver: {
      border: "border-slate-400/30",
      bg: "bg-gradient-to-b from-[#1a1c20] to-[#111]",
      text: "text-slate-300",
      iconBg: "bg-slate-400/10",
      iconText: "text-slate-300",
      button:
        "bg-slate-500/20 hover:bg-slate-500/30 text-slate-300 border border-slate-500/30",
    },
    gold: {
      border: "border-yellow-500/30",
      bg: "bg-gradient-to-b from-[#1f1a0b] to-[#111]",
      text: "text-yellow-400",
      iconBg: "bg-yellow-500/10",
      iconText: "text-yellow-400",
      button: "bg-yellow-500 hover:bg-yellow-400 text-black font-bold",
    },
    diamond: {
      border: "border-blue-400/50",
      bg: "bg-gradient-to-b from-[#0f172a] to-[#111]",
      text: "text-blue-400",
      iconBg: "bg-blue-500/10",
      iconText: "text-blue-400",
      button:
        "bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-[0_0_20px_rgba(37,99,235,0.3)]",
    },
  };

  const styles = colorStyles[color];

  return (
    <motion.div
      variants={fadeInUp}
      className={`relative flex flex-col rounded-3xl border ${styles.border} ${styles.bg} p-8 transition-transform duration-300 hover:scale-[1.02]`}
    >
      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-linear-to-r from-yellow-500 to-orange-500 px-4 py-1 text-xs font-bold uppercase tracking-wider text-black shadow-lg">
          Most Popular
        </div>
      )}

      <div className="mb-6 flex items-center gap-4">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${styles.iconBg} ${styles.iconText}`}
        >
          {icon}
        </div>
        <div>
          <h3 className={`text-xl font-bold ${styles.text}`}>{title}</h3>
          <p className="text-sm text-gray-400">{description}</p>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold text-white">{price}</span>
          {price !== "Free" && <span className="text-gray-500">/month</span>}
        </div>
      </div>

      <div className="mb-8 flex-1 space-y-4">
        {features.map((feature, i) => (
          <div key={i} className="flex items-start gap-3 text-sm text-gray-300">
            <Check className={`h-5 w-5 shrink-0 ${styles.iconText}`} />
            <span>{feature}</span>
          </div>
        ))}
      </div>

      <button
        className={`w-full rounded-xl py-3 text-sm transition-all ${styles.button}`}
      >
        Get Started
      </button>
    </motion.div>
  );
};

export default function PricingPage() {
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
        <section className="max-w-[80vw] mx-auto px-6 text-center mb-20">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="mx-auto max-w-3xl"
          >
            <h1 className="mb-6 text-5xl font-bold  md:text-6xl">
              Simple, Transparent <br />
              <span className="text-blue-500">Pricing</span>
            </h1>
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
              title="Free"
              price="Free"
              description="For hobbyists."
              icon={<Zap className="h-6 w-6" />}
              color="gray"
              features={[
                "1 Project",
                "Basic Components",
                "Community Support",
                "Standard Export",
                "Public Templates",
              ]}
            />

            {/* Bronze Tier */}
            <PricingCard
              title="Bronze"
              price="$9"
              description="For solo developers."
              icon={<Shield className="h-6 w-6" />}
              color="bronze"
              features={[
                "3 Projects",
                "All Components",
                "Email Support",
                "Terraform Export",
                "Private Templates",
                "Cost Estimation",
              ]}
            />

            {/* Silver Tier */}
            <PricingCard
              title="Silver"
              price="$29"
              description="For small teams."
              icon={<Star className="h-6 w-6" />}
              color="silver"
              features={[
                "10 Projects",
                "Priority Support",
                "Advanced Security",
                "CI/CD Integration",
                "Team Collaboration (up to 3)",
                "Audit Logs",
              ]}
            />

            {/* Gold Tier */}
            <PricingCard
              title="Gold"
              price="$99"
              description="For scaling startups."
              icon={<Crown className="h-6 w-6" />}
              color="gold"
              popular={true}
              features={[
                "Unlimited Projects",
                "24/7 Priority Support",
                "Custom Policies",
                "API Access",
                "Team Collaboration (Unlimited)",
                "SSO Integration",
                "Advanced Analytics",
              ]}
            />

            {/* Diamond Tier */}
            <PricingCard
              title="Diamond"
              price="$299"
              description="For large enterprises."
              icon={<Gem className="h-6 w-6" />}
              color="diamond"
              features={[
                "Everything in Gold",
                "Dedicated Account Manager",
                "Custom SLA",
                "On-premise Deployment",
                "Custom Integrations",
                "Training Sessions",
                "White-labeling",
              ]}
            />
          </motion.div>
        </section>

        {/* FAQ Section */}
        <section className="max-w-[80vw] mx-auto mt-32 px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-4 max-w-[80vw] mx-auto">
            <div className="bg-[#111] p-8 rounded-3xl border border-white/5">
              <h3 className="text-lg font-bold text-white mb-2">
                Can I switch plans later?
              </h3>
              <p className="text-gray-400">
                Yes, you can upgrade or downgrade your plan at any time. Changes
                take effect immediately.
              </p>
            </div>
            <div className="bg-[#111] p-8 rounded-3xl border border-white/5">
              <h3 className="text-lg font-bold text-white mb-2">
                What happens to my projects if I cancel?
              </h3>
              <p className="text-gray-400">
                Your projects will be locked in read-only mode for 30 days
                before being archived.
              </p>
            </div>
            <div className="bg-[#111] p-8 rounded-3xl border border-white/5">
              <h3 className="text-lg font-bold text-white mb-2">
                Do you offer student discounts?
              </h3>
              <p className="text-gray-400">
                Yes! Students with a valid .edu email address can get the Silver
                plan for free.
              </p>
            </div>
            <div className="bg-[#111] p-8 rounded-3xl border border-white/5">
              <h3 className="text-lg font-bold text-white mb-2">
                Is there a refund policy?
              </h3>
              <p className="text-gray-400">
                We offer a 14-day money-back guarantee if you're not satisfied
                with our service.
              </p>
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
