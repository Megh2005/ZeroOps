"use client";

import { useState, useRef, forwardRef } from "react";
import { useReactToPrint } from "react-to-print";
import { debugTerraform, getArchitecturalSuggestions } from "@/lib/gemini";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Loader2,
  Cloud,
  Terminal,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Activity,
  Printer
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { toast } from "sonner";

const PrintableReport = forwardRef<HTMLDivElement, { title: string; content: string }>(({ title, content }, ref) => {
  return (
    <div ref={ref} className="p-16 bg-white text-black min-h-screen font-sans">
      <div className="border-b-2 border-black pb-8 mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-black mb-1">ZEROOPS CORE</h1>
          <p className="text-sm text-gray-500 font-mono uppercase tracking-widest">Enterprise Infrastructure Report</p>
        </div>
        <div className="text-right text-xs text-gray-500 font-mono uppercase tracking-widest">
          {new Date().toLocaleDateString()} <br />
          {new Date().toLocaleTimeString()}
        </div>
      </div>
      <h2 className="text-2xl font-bold text-black mb-8 border-b border-gray-200 pb-4">{title}</h2>
      <div className="prose prose-sm max-w-none prose-headings:text-black prose-p:text-gray-800 prose-li:text-gray-800 prose-strong:text-black prose-code:text-blue-700 font-sans leading-relaxed">
        <MarkdownRenderer content={content} isPrint={true} />
      </div>
      <div className="mt-20 pt-8 border-t-2 border-black text-center text-[10px] text-gray-500 font-mono uppercase tracking-widest">
        Confidential & Proprietary • ZeroOps System Intelligence
      </div>
    </div>
  );
});
PrintableReport.displayName = "PrintableReport";

export default function DevOpsPage() {
  const [activeTab, setActiveTab] = useState<"terraform" | "architecture">("terraform");
  const [terraformCode, setTerraformCode] = useState("");
  const [terraformOutput, setTerraformOutput] = useState("");
  const [isDebugging, setIsDebugging] = useState(false);

  const [archDescription, setArchDescription] = useState("");
  const [archOutput, setArchOutput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const terraformPrintRef = useRef<HTMLDivElement>(null);
  const archPrintRef = useRef<HTMLDivElement>(null);

  const handlePrintTerraform = useReactToPrint({
    contentRef: terraformPrintRef,
    documentTitle: "Terraform-Analysis-Report",
  });

  const handlePrintArchitecture = useReactToPrint({
    contentRef: archPrintRef,
    documentTitle: "Architecture-Design-Report",
  });

  const handleDebug = async () => {
    if (!terraformCode.trim()) return;
    setIsDebugging(true);

    const debugPromise = debugTerraform(terraformCode);

    toast.promise(debugPromise, {
      loading: "Running static analysis...",
      success: (result) => {
        setTerraformOutput(result);
        return "Analysis complete.";
      },
      error: (err) => {
        setTerraformOutput("An error occurred while debugging.");
        return "Analysis failed.";
      },
    });

    try {
      await debugPromise;
    } finally {
      setIsDebugging(false);
    }
  };

  const handleAnalyze = async () => {
    if (!archDescription.trim()) return;
    setIsAnalyzing(true);

    const analyzePromise = getArchitecturalSuggestions(archDescription);

    toast.promise(analyzePromise, {
      loading: "Synthesizing architecture...",
      success: (result) => {
        setArchOutput(result);
        return "Synthesis complete.";
      },
      error: (err) => {
        setArchOutput("An error occurred while analyzing.");
        return "Synthesis failed.";
      },
    });

    try {
      await analyzePromise;
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-zinc-100 selection:bg-zinc-500/30">
      <SiteHeader />

      <main className="relative z-10 pt-32 pb-20 w-[80vw] mx-auto px-0">
        <div className="flex flex-col items-center text-center space-y-4 mb-16 mt-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded border border-zinc-800 bg-zinc-900/30 px-3 py-1 text-[10px] font-mono tracking-widest uppercase text-zinc-400 shadow-sm mx-auto">
              <Activity className="h-3 w-3 text-blue-500" />
              <span>System Intelligence Core</span>
            </div>
            <h1 className="text-4xl font-semibold tracking-tight md:text-6xl mb-6 text-zinc-100">
              Cloud Infrastructure <br />
              <span className="text-zinc-500">
                Analysis Engine
              </span>
            </h1>
            <p className="text-xs font-mono text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Debug configurations and orchestrate scalable topologies utilizing our advanced cognitive engine, trained exclusively on enterprise infrastructure paradigms.
            </p>
          </motion.div>
        </div>

        {/* Custom Tab Switcher */}
        <div className="flex justify-center mb-12">
          <div className="flex p-1 bg-zinc-900/40 backdrop-blur-3xl border border-zinc-800/80 rounded">
            <button
              onClick={() => setActiveTab("terraform")}
              className={cn(
                "relative px-8 py-2 rounded text-xs font-semibold transition-all duration-300",
                activeTab === "terraform"
                  ? "text-zinc-900"
                  : "text-zinc-400 hover:text-zinc-300",
              )}
            >
              {activeTab === "terraform" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-zinc-100 rounded"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <Terminal className="w-4 h-4" /> State Inspector
              </span>
            </button>
            <button
              onClick={() => setActiveTab("architecture")}
              className={cn(
                "relative px-8 py-2 rounded text-xs font-semibold transition-all duration-300",
                activeTab === "architecture"
                  ? "text-zinc-900"
                  : "text-zinc-400 hover:text-zinc-300",
              )}
            >
              {activeTab === "architecture" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-zinc-100 rounded"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <Cloud className="w-4 h-4" /> Topology Architect
              </span>
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "terraform" ? (
            <motion.div
              key="terraform"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="w-full"
            >
              <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/10 backdrop-blur-2xl p-1 shadow-2xl overflow-hidden">
                <div className="p-6 md:p-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold tracking-tight text-zinc-100">
                        HCL Debug Interface
                      </h3>
                      <p className="text-xs font-mono text-zinc-500 mt-1">
                        Input configuration state for static analysis
                      </p>
                    </div>
                  </div>

                  <div className="relative group">
                    <Textarea
                      placeholder='resource "aws_instance" "app" { ... }'
                      className="relative min-h-[400px] font-mono text-sm bg-zinc-950/50 border-zinc-800 text-zinc-300 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500/20 resize-none p-6 rounded"
                      value={terraformCode}
                      onChange={(e) => setTerraformCode(e.target.value)}
                    />
                    {/* Example Prompts */}
                    <div className="absolute bottom-4 right-4 left-4 flex gap-2 justify-end overflow-x-auto pb-1 no-scrollbar mask-linear-fade">
                      <button
                        onClick={() =>
                          setTerraformCode(`resource "google_storage_bucket" "auto-expire" {
  name          = "auto-expiring-bucket-demo"
  location      = "US"
  force_destroy = true
  public_access_prevention = "enforced"
}`)
                        }
                        className="shrink-0 text-[10px] font-mono uppercase tracking-widest bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 px-3 py-1.5 rounded transition-colors backdrop-blur-md"
                      >
                        Bucket Lifecycle
                      </button>
                      <button
                        onClick={() =>
                          setTerraformCode(`resource "google_compute_firewall" "default" {
  name    = "test-firewall"
  network = "default"
  allow { protocol = "tcp"; ports = ["22"] }
  source_ranges = ["0.0.0.0/0"]
}`)
                        }
                        className="shrink-0 text-[10px] font-mono uppercase tracking-widest bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 px-3 py-1.5 rounded transition-colors backdrop-blur-md"
                      >
                        Firewall Risk
                      </button>
                      <button
                        onClick={() =>
                          setTerraformCode(`resource "google_sql_database_instance" "main" {
  name             = "main-instance"
  database_version = "POSTGRES_14"
  settings {
    tier = "db-f1-micro"
    ip_configuration {
      ipv4_enabled = true // Security risk: Public IP
    }
  }
}`)
                        }
                        className="shrink-0 text-[10px] font-mono uppercase tracking-widest bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 px-3 py-1.5 rounded transition-colors backdrop-blur-md"
                      >
                        Public SQL
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={handleDebug}
                      disabled={isDebugging || !terraformCode.trim()}
                      className="h-10 px-8 rounded bg-zinc-100 hover:bg-white text-zinc-900 font-semibold transition-all text-xs"
                    >
                      {isDebugging ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Running Analysis...
                        </>
                      ) : (
                        <>
                          Execute Analysis{" "}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {terraformOutput && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="border-t border-zinc-800/80 bg-zinc-900/30"
                  >
                    <div className="p-6 md:p-8">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2 text-emerald-500 text-sm font-semibold tracking-tight">
                          <CheckCircle2 className="w-5 h-5" /> Synthesis Complete
                        </div>
                        <Button
                          onClick={handlePrintTerraform}
                          variant="outline"
                          size="sm"
                          className="text-zinc-300 hover:text-white bg-zinc-800/50 hover:bg-zinc-700/50 border-zinc-700 text-xs font-mono"
                        >
                          <Printer className="w-3 h-3 mr-2" />
                          Print / Export PDF
                        </Button>
                      </div>
                      <div className="text-zinc-300 text-sm font-mono leading-relaxed">
                        <MarkdownRenderer content={terraformOutput} />
                      </div>
                      <div style={{ display: "none" }}>
                        <PrintableReport ref={terraformPrintRef} title="Terraform Analysis Report" content={terraformOutput} />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="architecture"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="w-full"
            >
              <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/10 backdrop-blur-2xl p-1 shadow-2xl overflow-hidden">
                <div className="p-6 md:p-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold tracking-tight text-zinc-100">
                        Topology Synthesizer
                      </h3>
                      <p className="text-xs font-mono text-zinc-500 mt-1">
                        Input scale and connectivity parameters
                      </p>
                    </div>
                  </div>

                  <div className="relative group">
                    <Textarea
                      placeholder="e.g., Target: Highly available microservices orchestration on Kubernetes with managed relational stores..."
                      className="relative min-h-[200px] text-sm font-mono bg-zinc-950/50 border-zinc-800 text-zinc-300 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500/20 resize-none p-6 rounded"
                      value={archDescription}
                      onChange={(e) => setArchDescription(e.target.value)}
                    />
                    {/* Example Prompts */}
                    <div className="absolute bottom-4 right-4 left-4 flex gap-2 justify-end overflow-x-auto pb-1 no-scrollbar">
                      <button
                        onClick={() =>
                          setArchDescription(
                            "Design a serverless event-driven architecture using Cloud Run, Pub/Sub, and Eventarc to process images uploaded to Cloud Storage.",
                          )
                        }
                        className="shrink-0 text-[10px] font-mono uppercase tracking-widest bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 px-3 py-1.5 rounded transition-colors backdrop-blur-md"
                      >
                        Serverless Pipeline
                      </button>
                      <button
                        onClick={() =>
                          setArchDescription(
                            "I need a globally distributed, high-availability web application architecture using Cloud Spanner and Global Load Balancing.",
                          )
                        }
                        className="shrink-0 text-[10px] font-mono uppercase tracking-widest bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 px-3 py-1.5 rounded transition-colors backdrop-blur-md"
                      >
                        Global HA Core
                      </button>
                      <button
                        onClick={() =>
                          setArchDescription(
                            "Design a scalable data lake and analytics platform using Cloud Storage, BigQuery, and Dataflow for real-time processing.",
                          )
                        }
                        className="shrink-0 text-[10px] font-mono uppercase tracking-widest bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 px-3 py-1.5 rounded transition-colors backdrop-blur-md"
                      >
                        Data Analytics
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={handleAnalyze}
                      disabled={isAnalyzing || !archDescription.trim()}
                      className="h-10 px-8 rounded bg-zinc-100 hover:bg-white text-zinc-900 font-semibold transition-all text-xs"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Synthesizing...
                        </>
                      ) : (
                        <>
                          Generate Blueprint{" "}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {archOutput && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="border-t border-zinc-800/80 bg-zinc-900/30"
                  >
                    <div className="p-6 md:p-8">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2 text-emerald-500 text-sm font-semibold tracking-tight">
                          <Sparkles className="w-5 h-5" /> Recommendation
                        </div>
                        <Button
                          onClick={handlePrintArchitecture}
                          variant="outline"
                          size="sm"
                          className="text-zinc-300 hover:text-white bg-zinc-800/50 hover:bg-zinc-700/50 border-zinc-700 text-xs font-mono"
                        >
                          <Printer className="w-3 h-3 mr-2" />
                          Print / Export PDF
                        </Button>
                      </div>
                      <div className="text-zinc-300 text-sm font-mono leading-relaxed">
                        <MarkdownRenderer content={archOutput} />
                      </div>
                      <div style={{ display: "none" }}>
                        <PrintableReport ref={archPrintRef} title="Architecture Design Report" content={archOutput} />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
