"use client";

import { useState, useEffect, useRef } from "react";
import { chatWithDevOpsBot } from "@/lib/gemini";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Send,
  Loader2,
  Trash2,
  FileDown,
  Terminal,
  Activity,
  Workflow,
  Cpu,
  Network,
  Binary,
  Globe,
  ShieldCheck,
  Database,
  TerminalSquare
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { toast } from "sonner";

interface Message {
  role: "user" | "model";
  content: string;
  timestamp: number;
}

const PRESET_QUESTIONS = [
  { icon: <Workflow className="w-4 h-4 text-zinc-500" />, question: "Explain CI/CD in GCP using layman terms." },
  { icon: <Cpu className="w-4 h-4 text-zinc-500" />, question: "What is Terraform and why use it for GCP?" },
  { icon: <Network className="w-4 h-4 text-zinc-500" />, question: "How does Least Privilege work in GCP IAM?" },
  { icon: <Binary className="w-4 h-4 text-zinc-500" />, question: "Explain Kubernetes (GKE) like I'm five." },
  { icon: <Activity className="w-4 h-4 text-zinc-500" />, question: "What is the benefit of Cloud Run over VMs?" },
  { icon: <Globe className="w-4 h-4 text-zinc-500" />, question: "How does Artifact Registry help DevOps?" },
  { icon: <ShieldCheck className="w-4 h-4 text-zinc-500" />, question: "What is Project vs Organization in GCP?" },
  { icon: <Database className="w-4 h-4 text-zinc-500" />, question: "How does a Load Balancer work in GCP?" },
];

export default function DevOpsBotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("devops_bot_chats");
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved chats", e);
      }
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("devops_bot_chats", JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (text: string = input) => {
    const messageText = text.trim();
    if (!messageText || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: messageText,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    const history = messages.map((m) => ({
      role: m.role,
      parts: [{ text: m.content }],
    }));

    try {
      const response = await chatWithDevOpsBot(messageText, history);
      const botMessage: Message = {
        role: "model",
        content: response,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      toast.error("Failed to establish connection with AI Kernel");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem("devops_bot_chats");
    toast.success("Terminal history purged");
  };

  const exportChatToPDF = async () => {
    if (messages.length === 0) {
      toast.error("No data to export");
      return;
    }

    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();
    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const contentWidth = pageWidth - margin * 2;
    let y = 35;

    doc.setFillColor(9, 9, 11);
    doc.rect(0, 0, 210, 297, "F");

    doc.setFillColor(161, 161, 170); // zinc-400
    doc.rect(margin, 15, 2, 12, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("ZEROOPS CORE", margin + 5, 23);

    doc.setFontSize(9);
    doc.setTextColor(161, 161, 170);
    doc.text("SYSTEM INTELLIGENCE TRANSCRIPT", margin + 5, 28);

    doc.setDrawColor(39, 39, 42); // zinc-800
    doc.line(margin, 35, pageWidth - margin, 35);

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

    messages.forEach((msg) => {
      const isUser = msg.role === "user";
      checkPage(15);
      y += 5;
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      if (isUser) doc.setTextColor(255, 255, 255);
      else doc.setTextColor(52, 211, 153); // emerald-400
      doc.text(isUser ? "ADMIN" : "SYSTEM", margin, y);

      doc.setFont("helvetica", "normal");
      doc.setTextColor(113, 113, 122); // zinc-500
      doc.text(
        new Date(msg.timestamp).toLocaleString(),
        pageWidth - margin - 40,
        y,
      );
      y += 6;

      doc.setFontSize(10);
      doc.setTextColor(212, 212, 216);

      const cleanContent = msg.content.replace(/```[\s\S]*?```/g, "\n[CODE BLOCK]\n");
      const lines = cleanContent.split("\n");

      lines.forEach((line) => {
        if (!line.trim()) {
          y += 4;
          return;
        }
        let text = line.replace(/\*\*(.*?)\*\*/g, "$1");
        const splitText = doc.splitTextToSize(text, contentWidth);
        checkPage(splitText.length * 5.5);
        doc.text(splitText, margin, y);
        y += splitText.length * 5.5;
      });

      y += 5;
      doc.setDrawColor(24, 24, 27); // zinc-900
      doc.line(margin, y, pageWidth - margin, y);
      y += 5;
    });

    doc.save(`zeroops-system-log-${new Date().getTime()}.pdf`);
    toast.success("Log exported successfully");
  };

  return (
    <div className="min-h-screen bg-transparent text-zinc-100 selection:bg-zinc-500/30 overflow-hidden flex flex-col font-sans">
      <SiteHeader />

      <main className="relative z-10 pt-24 pb-8 flex-1 flex flex-col w-[80vw] mx-auto overflow-hidden">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6 shrink-0 mt-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded bg-zinc-900/50 border border-zinc-800">
              <TerminalSquare className="w-5 h-5 text-zinc-300" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-zinc-100">System Intelligence Core</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">
                  Active connection to AI Kernel
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={exportChatToPDF}
              disabled={messages.length === 0}
              className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 rounded h-8 text-xs font-mono"
            >
              <FileDown className="w-3 h-3 mr-2" /> Export Log
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearChat}
              disabled={messages.length === 0}
              className="text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded h-8 text-xs font-mono"
            >
              <Trash2 className="w-3 h-3 mr-2" /> Purge
            </Button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 min-h-0 bg-zinc-950/40 backdrop-blur-3xl border border-zinc-800/80 rounded-xl flex flex-col shadow-2xl overflow-hidden mb-6 relative">
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth"
          >
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-10 max-w-3xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4"
                >
                  <h2 className="text-2xl font-semibold tracking-tight text-zinc-300">
                    Awaiting System Input
                  </h2>
                  <p className="text-zinc-500 text-xs font-mono max-w-xl mx-auto leading-relaxed">
                    Input query regarding infrastructure topology, CI/CD orchestration, or GCP architecture parameters. 
                    The system will synthesize an enterprise-grade response.
                  </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full">
                  {PRESET_QUESTIONS.map((item, idx) => (
                    <motion.button
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSend(item.question)}
                      className="flex flex-col items-start text-left p-5 rounded border border-zinc-800/50 bg-zinc-900/30 hover:bg-zinc-800 transition-all group relative overflow-hidden"
                    >
                      <div className="mb-3 p-2 rounded bg-zinc-950 border border-zinc-800">
                        {item.icon}
                      </div>
                      <div className="text-xs text-zinc-400 group-hover:text-zinc-200 font-mono leading-relaxed">
                        {item.question}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6 max-w-4xl mx-auto w-full">
                <AnimatePresence initial={false}>
                  {messages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "flex gap-4",
                        message.role === "user" ? "justify-end" : "justify-start",
                      )}
                    >
                      {message.role === "model" && (
                        <div className="w-8 h-8 rounded border border-zinc-800 bg-zinc-950 flex items-center justify-center shrink-0 mt-1">
                          <Terminal className="w-4 h-4 text-emerald-500" />
                        </div>
                      )}
                      <div
                        className={cn(
                          "max-w-[85%] px-5 py-4 relative",
                          message.role === "user"
                            ? "bg-zinc-100 text-zinc-900 rounded shadow-sm"
                            : "bg-zinc-900/40 border border-zinc-800/80 text-zinc-300 rounded",
                        )}
                      >
                        {message.role === "model" ? (
                          <div className="prose prose-invert prose-sm max-w-none text-zinc-300 prose-pre:bg-zinc-950 prose-pre:border prose-pre:border-zinc-800 prose-headings:text-zinc-100 font-mono text-xs leading-relaxed">
                            <MarkdownRenderer content={message.content} />
                          </div>
                        ) : (
                          <p className="text-sm font-medium">
                            {message.content}
                          </p>
                        )}
                        <div
                          className={cn(
                            "text-[9px] mt-3 opacity-40 font-mono uppercase tracking-widest",
                            message.role === "user" ? "text-right" : "text-left",
                          )}
                        >
                          {new Date(message.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-4 justify-start"
                  >
                    <div className="w-8 h-8 rounded border border-zinc-800 bg-zinc-950 flex items-center justify-center shrink-0 mt-1">
                      <Terminal className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div className="bg-zinc-900/40 border border-zinc-800/80 rounded px-5 py-3 flex items-center gap-3">
                      <Loader2 className="w-3 h-3 animate-spin text-zinc-500" />
                      <span className="text-[10px] font-mono text-zinc-400 tracking-widest uppercase">
                        Synthesizing Response...
                      </span>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="border border-zinc-800 bg-zinc-950/80 backdrop-blur-3xl rounded-lg shadow-xl shrink-0 focus-within:border-zinc-500 transition-colors">
          <div className="flex items-center p-2 gap-2">
            <div className="p-2 shrink-0">
              <TerminalSquare className="w-4 h-4 text-zinc-500" />
            </div>
            <Textarea
              placeholder="admin@zeroops:~# enter query..."
              className="flex-1 min-h-[44px] max-h-[150px] border-none bg-transparent focus-visible:ring-0 resize-none py-3 px-2 text-sm font-mono text-zinc-300 placeholder:text-zinc-700"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <Button
              size="icon"
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className={cn(
                "h-10 w-10 shrink-0 rounded transition-all",
                input.trim()
                  ? "bg-zinc-100 hover:bg-white text-zinc-900"
                  : "bg-zinc-900 text-zinc-600",
              )}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </main>

      <style jsx global>{`
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(63, 63, 70, 0.5); /* zinc-700 */
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(82, 82, 91, 0.8); /* zinc-600 */
        }
      `}</style>
    </div>
  );
}
