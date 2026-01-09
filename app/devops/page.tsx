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
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { MarkdownRenderer } from "@/components/markdown-renderer";

export default function DevOpsPage() {
  const [activeTab, setActiveTab] = useState<"terraform" | "architecture">(
    "terraform"
  );
  const [terraformCode, setTerraformCode] = useState("");
  const [terraformOutput, setTerraformOutput] = useState("");
  const [isDebugging, setIsDebugging] = useState(false);

  const [archDescription, setArchDescription] = useState("");
  const [archOutput, setArchOutput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleDebug = async () => {
    if (!terraformCode.trim()) return;
    setIsDebugging(true);
    try {
      const result = await debugTerraform(terraformCode);
      setTerraformOutput(result);
    } catch (error) {
      setTerraformOutput("An error occurred while debugging.");
      console.error(error);
    } finally {
      setIsDebugging(false);
    }
  };

  const handleAnalyze = async () => {
    if (!archDescription.trim()) return;
    setIsAnalyzing(true);
    try {
      const result = await getArchitecturalSuggestions(archDescription);
      setArchOutput(result);
    } catch (error) {
      setArchOutput("An error occurred while analyzing.");
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30 ">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-purple-600/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      </div>

      <SiteHeader />

      <main className="relative z-10 pt-32 pb-20 w-[80vw] mx-auto px-0">
        <div className="flex flex-col items-center text-center space-y-4 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-blue-300 mb-6">
              <Sparkles className="h-3 w-3 text-blue-400" />
              <span>Powered by Gemini 2.0</span>
            </div>
            <h1 className="text-4xl font-bold  md:text-6xl mb-6">
              Cloud Infrastructure <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-400">
                Assistant
              </span>
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Debug configurations and design scalable architectures with an AI
              trained specifically for Google Cloud Platform.
            </p>
          </motion.div>
        </div>

        {/* Custom Tab Switcher */}
        <div className="flex justify-center mb-12">
          <div className="flex p-1 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-full">
            <button
              onClick={() => setActiveTab("terraform")}
              className={cn(
                "relative px-8 py-3 rounded-full text-sm font-medium transition-all duration-300",
                activeTab === "terraform"
                  ? "text-white"
                  : "text-gray-400 hover:text-white"
              )}
            >
              {activeTab === "terraform" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-blue-600 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.3)]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <Terminal className="w-4 h-4" /> Terraform Debugger
              </span>
            </button>
            <button
              onClick={() => setActiveTab("architecture")}
              className={cn(
                "relative px-8 py-3 rounded-full text-sm font-medium transition-all duration-300",
                activeTab === "architecture"
                  ? "text-white"
                  : "text-gray-400 hover:text-white"
              )}
            >
              {activeTab === "architecture" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-purple-600 rounded-full shadow-[0_0_20px_rgba(147,51,234,0.3)]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <Cloud className="w-4 h-4" /> Architecture Advisor
              </span>
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "terraform" ? (
            <motion.div
              key="terraform"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="w-full"
            >
              <div className="rounded-3xl border border-white/10 bg-[#0A0A0A]/80 backdrop-blur-xl p-1 shadow-2xl overflow-hidden">
                <div className="p-6 md:p-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-white">
                        Debugger
                      </h3>
                      <p className="text-sm text-gray-400 mt-1">
                        Paste your main.tf content below
                      </p>
                    </div>
                  </div>

                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-linear-to-br from-blue-500/20 to-purple-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
                    <Textarea
                      placeholder='resource "google_compute_instance" "default" { ... }'
                      className="relative min-h-[400px] font-mono text-sm bg-black/50 border-white/10 text-gray-300 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 resize-none p-6 rounded-xl"
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
                        className="shrink-0 text-xs bg-white/5 hover:bg-white/10 border border-white/5 text-gray-400 hover:text-white px-3 py-1.5 rounded-full transition-colors backdrop-blur-md"
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
                        className="shrink-0 text-xs bg-white/5 hover:bg-white/10 border border-white/5 text-gray-400 hover:text-white px-3 py-1.5 rounded-full transition-colors backdrop-blur-md"
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
                        className="shrink-0 text-xs bg-white/5 hover:bg-white/10 border border-white/5 text-gray-400 hover:text-white px-3 py-1.5 rounded-full transition-colors backdrop-blur-md"
                      >
                        Public SQL
                      </button>
                      <button
                        onClick={() =>
                          setTerraformCode(`resource "google_project_iam_member" "user" {
  project = "my-project"
  role    = "roles/owner" // Security risk: Overly permissive
  member  = "user:jane@example.com"
}`)
                        }
                        className="shrink-0 text-xs bg-white/5 hover:bg-white/10 border border-white/5 text-gray-400 hover:text-white px-3 py-1.5 rounded-full transition-colors backdrop-blur-md"
                      >
                        IAM Permissive
                      </button>
                      <button
                        onClick={() =>
                          setTerraformCode(`resource "google_container_cluster" "primary" {
  name     = "my-gke-cluster"
  location = "us-central1"
  master_auth {
    client_certificate_config {
      issue_client_certificate = true // Legacy auth method
    }
  }
}`)
                        }
                        className="shrink-0 text-xs bg-white/5 hover:bg-white/10 border border-white/5 text-gray-400 hover:text-white px-3 py-1.5 rounded-full transition-colors backdrop-blur-md"
                      >
                        GKE Legacy Auth
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={handleDebug}
                      disabled={isDebugging || !terraformCode.trim()}
                      className="h-12 px-8 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-medium transition-all hover:shadow-[0_0_20px_rgba(37,99,235,0.3)]"
                    >
                      {isDebugging ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Running Analysis...
                        </>
                      ) : (
                        <>
                          Debug Configuration{" "}
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
                    className="border-t border-white/10 bg-white/2"
                  >
                    <div className="p-6 md:p-8">
                      <div className="flex items-center gap-2 mb-4 text-green-400 font-medium">
                        <CheckCircle2 className="w-5 h-5" /> Analysis Complete
                      </div>
                      <div className="rounded-xl border border-white/10 bg-black/50 p-6 text-sm text-gray-300">
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="w-full"
            >
              <div className="rounded-3xl border border-white/10 bg-[#0A0A0A]/80 backdrop-blur-xl p-1 shadow-2xl overflow-hidden">
                <div className="p-6 md:p-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-white">
                        Architect
                      </h3>
                      <p className="text-sm text-gray-400 mt-1">
                        Describe your system requirements
                      </p>
                    </div>
                  </div>

                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-linear-to-br from-purple-500/20 to-pink-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
                    <Textarea
                      placeholder="e.g., I need a highly available microservices architecture on GKE with Cloud SQL and Redis..."
                      className="relative min-h-[200px] text-base bg-black/50 border-white/10 text-gray-300 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 resize-none p-6 rounded-xl"
                      value={archDescription}
                      onChange={(e) => setArchDescription(e.target.value)}
                    />
                    {/* Example Prompts */}
                    <div className="absolute bottom-4 right-4 left-4 flex gap-2 justify-end overflow-x-auto pb-1 no-scrollbar">
                      <button
                        onClick={() =>
                          setArchDescription(
                            "Design a serverless event-driven architecture using Cloud Run, Pub/Sub, and Eventarc to process images uploaded to Cloud Storage."
                          )
                        }
                        className="shrink-0 text-xs bg-white/5 hover:bg-white/10 border border-white/5 text-gray-400 hover:text-white px-3 py-1.5 rounded-full transition-colors backdrop-blur-md"
                      >
                        Serverless Pipeline
                      </button>
                      <button
                        onClick={() =>
                          setArchDescription(
                            "I need a globally distributed, high-availability web application architecture using Cloud Spanner and Global Load Balancing."
                          )
                        }
                        className="shrink-0 text-xs bg-white/5 hover:bg-white/10 border border-white/5 text-gray-400 hover:text-white px-3 py-1.5 rounded-full transition-colors backdrop-blur-md"
                      >
                        Global HA App
                      </button>
                      <button
                        onClick={() =>
                          setArchDescription(
                            "Design a scalable data lake and analytics platform using Cloud Storage, BigQuery, and Dataflow for real-time processing."
                          )
                        }
                        className="shrink-0 text-xs bg-white/5 hover:bg-white/10 border border-white/5 text-gray-400 hover:text-white px-3 py-1.5 rounded-full transition-colors backdrop-blur-md"
                      >
                        Data Analytics
                      </button>
                      <button
                        onClick={() =>
                          setArchDescription(
                            "I need a secure CI/CD pipeline using Cloud Build and Artifact Registry that deploys to Cloud Run with Binary Authorization."
                          )
                        }
                        className="shrink-0 text-xs bg-white/5 hover:bg-white/10 border border-white/5 text-gray-400 hover:text-white px-3 py-1.5 rounded-full transition-colors backdrop-blur-md"
                      >
                        Secure CI/CD
                      </button>
                      <button
                        onClick={() =>
                          setArchDescription(
                            "Best way to connect an on-premise data center to a VPC using Cloud VPN or Interconnect with high availability."
                          )
                        }
                        className="shrink-0 text-xs bg-white/5 hover:bg-white/10 border border-white/5 text-gray-400 hover:text-white px-3 py-1.5 rounded-full transition-colors backdrop-blur-md"
                      >
                        Hybrid Network
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={handleAnalyze}
                      disabled={isAnalyzing || !archDescription.trim()}
                      className="h-12 px-8 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-medium transition-all hover:shadow-[0_0_20px_rgba(147,51,234,0.3)]"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating Blueprint...
                        </>
                      ) : (
                        <>
                          Generate Architecture{" "}
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
                    className="border-t border-white/10 bg-white/2"
                  >
                    <div className="p-6 md:p-8">
                      <div className="flex items-center gap-2 mb-4 text-purple-400 font-medium">
                        <Sparkles className="w-5 h-5" /> Recommendation
                      </div>
                      <div className="rounded-xl border border-white/10 bg-black/50 p-6 text-sm text-gray-300">
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
