"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Mail, MessageSquare, Code } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { ContactForm } from "@/components/contact-form";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] h-[800px] w-[800px] rounded-full bg-purple-900/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] h-[800px] w-[800px] rounded-full bg-blue-900/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      </div>

      <SiteHeader />

      <main className="relative z-10 pt-32 pb-20">
        {/* Hero Section */}
        <section className="max-w-[80vw] mx-auto px-6 text-center mb-16">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="mx-auto max-w-4xl"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-sm font-medium text-blue-400">
              <Sparkles className="h-4 w-4" />
              Build the Future Together
            </div>
            <h1 className="mb-8 text-5xl font-bold md:text-7xl">
              Get in{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-500">
                Touch
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-xl text-gray-400 leading-relaxed">
              Have a technical question or an enterprise requirement? Our team
              of cloud architects is ready to help you scale.
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

      <footer className="mt-20 border-t border-white/10 bg-[#020202] py-12 text-center text-sm text-gray-600">
        <div className="max-w-[80vw] mx-auto px-6">
          <p>© 2024 Zero Ops. Built for builders.</p>
        </div>
      </footer>
    </div>
  );
}
