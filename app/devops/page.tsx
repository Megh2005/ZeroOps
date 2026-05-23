"use client";

import { useState } from "react";
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
  Activity
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { toast } from "sonner";

export default function DevOpsPage() {
  const [activeTab, setActiveTab] = useState<"terraform" | "architecture">("terraform");
  const [terraformCode, setTerraformCode] = useState("");
  const [terraformOutput, setTerraformOutput] = useState("");
  const [isDebugging, setIsDebugging] = useState(false);

  const [archDescription, setArchDescription] = useState("");
  const [archOutput, setArchOutput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

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

  const exportToPDF = async (title: string, content: string) => {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();

    // Config
    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const contentWidth = pageWidth - margin * 2;
    let y = 35;

    // Theme color based on title (always slate/zinc in new theme)
    const themeColor = [161, 161, 170]; // Zinc 400

    // Background
    doc.setFillColor(9, 9, 11);
    doc.rect(0, 0, 210, 297, "F");

    // Header Branding
    doc.setFillColor(themeColor[0], themeColor[1], themeColor[2]);
    doc.rect(margin, 15, 2, 12, "F"); // Decorative monogram bar

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("ZEROOPS CORE", margin + 5, 23);

    doc.setFontSize(9);
    doc.setTextColor(themeColor[0], themeColor[1], themeColor[2]);
    doc.text("ENTERPRISE INFRASTRUCTURE REPORT", margin + 5, 28);

    doc.setDrawColor(39, 39, 42); // zinc 800
    doc.line(margin, 35, pageWidth - margin, 35);

    // Document Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text(title, margin, 48);
    y = 58;

    // Initial Font
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(212, 212, 216); // zinc 300

    const cleanContent = content.replace(
      /```[\s\S]*?```/g,
      "\n[CODE BLOCK - EXPORTED AS PNG SEPARATELY]\n",
    );
    const lines = cleanContent.split("\n");

    const checkPage = (height: number) => {
      if (y + height > 275) {
        doc.addPage();
        doc.setFillColor(9, 9, 11);
        doc.rect(0, 0, 210, 297, "F");
        y = 25;
        return true;
      }
      return false;
    };

    lines.forEach((line) => {
      if (!line.trim()) {
        y += 4;
        return;
      }

      if (line.startsWith("## ")) {
        checkPage(15);
        y += 5;
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(themeColor[0], themeColor[1], themeColor[2]);
        doc.text(line.replace("## ", "").toUpperCase(), margin, y);
        y += 8;
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(212, 212, 216);
      } else if (line.startsWith("### ")) {
        checkPage(12);
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(255, 255, 255);
        doc.text(line.replace("### ", ""), margin, y);
        y += 7;
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(212, 212, 216);
      } else if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
        const itemText = "• " + line.trim().substring(2);
        const splitItem = doc.splitTextToSize(itemText, contentWidth - 8);
        checkPage(splitItem.length * 5.5);
        doc.text(splitItem, margin + 5, y);
        y += splitItem.length * 5.5;
      } else if (line.trim().startsWith("---")) {
        checkPage(10);
        doc.setDrawColor(39, 39, 42);
        doc.line(margin, y, pageWidth - margin, y);
        y += 8;
      } else if (line.includes("[CODE BLOCK")) {
        checkPage(10);
        doc.setFillColor(24, 24, 27); // zinc 900
        doc.setDrawColor(63, 63, 70); // zinc 700
        doc.rect(margin, y - 4, contentWidth, 8, "FD");
        doc.setFontSize(8);
        doc.setTextColor(themeColor[0], themeColor[1], themeColor[2]);
        doc.text(line.trim(), margin + 5, y + 1);
        y += 10;
        doc.setFontSize(10);
        doc.setTextColor(212, 212, 216);
      } else {
        let text = line.replace(/\*\*(.*?)\*\*/g, "$1");
        const splitText = doc.splitTextToSize(text, contentWidth);
        checkPage(splitText.length * 5.5);
        doc.text(splitText, margin, y);
        y += splitText.length * 5.5;
      }
    });

    const totalPages = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(113, 113, 122); // zinc 500
      doc.text(
        `ZEROOPS CORE • PAGE ${i} OF ${totalPages}`,
        pageWidth / 2,
        285,
        { align: "center" },
      );
    }

    doc.save(`${title.toLowerCase().replace(/\s+/g, "-")}.pdf`);
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
                          onClick={() =>
                            exportToPDF(
                              "Terraform Analysis Report",
                              terraformOutput,
                            )
                          }
                          variant="ghost"
                          size="sm"
                          className="text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 text-xs font-mono"
                        >
                          <ArrowRight className="w-3 h-3 mr-2 rotate-45" />{" "}
                          Export Report
                        </Button>
                      </div>
                      <div className="text-zinc-300 text-sm font-mono leading-relaxed">
                        <MarkdownRenderer content={terraformOutput} />
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
                          onClick={() =>
                            exportToPDF(
                              "Architecture Design Report",
                              archOutput,
                            )
                          }
                          variant="ghost"
                          size="sm"
                          className="text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 text-xs font-mono"
                        >
                          <ArrowRight className="w-3 h-3 mr-2 rotate-45" />{" "}
                          Export Report
                        </Button>
                      </div>
                      <div className="text-zinc-300 text-sm font-mono leading-relaxed">
                        <MarkdownRenderer content={archOutput} />
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
