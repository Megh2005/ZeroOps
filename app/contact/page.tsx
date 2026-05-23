"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Mail, MessageSquare, Code } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { ContactForm } from "@/components/contact-form";

const fadeInUp = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-transparent text-zinc-100 selection:bg-blue-500/30">
      <SiteHeader />

      <main className="relative z-10 pt-32 pb-20">
        {/* Hero Section */}
        <section className="max-w-[80vw] mx-auto px-6 text-center mb-16 mt-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="mx-auto max-w-4xl"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded border border-zinc-800 bg-zinc-900/30 px-3 py-1 text-[10px] font-mono tracking-widest uppercase text-zinc-400 shadow-sm mx-auto">
              <Mail className="h-3 w-3 text-blue-500" />
              Enterprise Support
            </div>
            <h1 className="mb-8 text-4xl font-semibold tracking-tight md:text-6xl text-zinc-100">
              Engage with{" "}
              <span className="text-zinc-500">
                Architecture
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-sm font-mono text-zinc-400 leading-relaxed">
              Have a technical inquiry or complex enterprise requirement? Our core team
              of cloud orchestration engineers is prepared to assist you.
            </p>
          </motion.div>
        </section>

        {/* Contact Content */}
        <section className="max-w-[80vw] mx-auto px-6 flex justify-center">
          {/* Form Container */}
          <div className="w-full max-w-2xl">
            <ContactForm />
          </div>
        </section>
      </main>
    </div>
  );
}
