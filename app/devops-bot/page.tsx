"use client";

import { useState, useEffect, useRef } from "react";
import { chatWithDevOpsBot } from "@/lib/gemini";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Send,
  Bot,
  User as UserIcon,
  Loader2,
  Trash2,
  Sparkles,
  MessageSquare,
  ChevronRight,
  Terminal,
  Cloud,
  Layers,
  ShieldCheck,
  FileDown,
  BrainCircuit,
  Cpu,
  Network,
  Binary,
  Activity,
  Globe,
  Database,
  Workflow,
  Unplug,
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
  {
    icon: <Workflow className="w-5 h-5 text-blue-400" />,
    question: "Explain CI/CD in GCP using layman terms.",
  },
  {
    icon: <Cpu className="w-5 h-5 text-purple-400" />,
    question: "What is Terraform and why use it for GCP?",
  },
  {
    icon: <Network className="w-5 h-5 text-green-400" />,
    question: "How does Least Privilege work in GCP IAM?",
  },
  {
    icon: <Binary className="w-5 h-5 text-orange-400" />,
    question: "Explain Kubernetes (GKE) like I'm five.",
  },
  {
    icon: <Activity className="w-5 h-5 text-yellow-400" />,
    question: "What is the benefit of Cloud Run over VMs?",
  },
  {
    icon: <Globe className="w-5 h-5 text-pink-400" />,
    question: "How does Artifact Registry help DevOps?",
  },
  {
    icon: <ShieldCheck className="w-5 h-5 text-cyan-400" />,
    question: "What is Project vs Organization in GCP?",
  },
  {
    icon: <Database className="w-5 h-5 text-red-400" />,
    question: "How does a Load Balancer work in GCP?",
  },
];

export default function DevOpsBotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load chat history from local storage
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

  // Save chat history to local storage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("devops_bot_chats", JSON.stringify(messages));
    }
  }, [messages]);

  // Scroll to bottom when messages change
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
      toast.error("Failed to get response from ZeroOps Bot");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem("devops_bot_chats");
    toast.success("Chat history cleared");
  };

  const exportChatToPDF = async () => {
    if (messages.length === 0) {
      toast.error("No messages to export");
      return;
    }

    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();

    // Config
    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const contentWidth = pageWidth - margin * 2;
    let y = 35;

    // Background
    doc.setFillColor(5, 5, 5);
    doc.rect(0, 0, 210, 297, "F");

    // Header Branding
    doc.setFillColor(37, 99, 235); // Blue
    doc.rect(margin, 15, 2, 12, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("ZeroOps", margin + 5, 23);

    doc.setFontSize(9);
    doc.setTextColor(37, 99, 235);
    doc.text("DEVOPS MENTOR CHAT TRANSCRIPT", margin + 5, 28);

    doc.setDrawColor(30, 30, 30);
    doc.line(margin, 35, pageWidth - margin, 35);

    const checkPage = (height: number) => {
      if (y + height > 275) {
        doc.addPage();
        doc.setFillColor(5, 5, 5);
        doc.rect(0, 0, 210, 297, "F");
        y = 25;
        return true;
      }
      return false;
    };

    messages.forEach((msg, idx) => {
      const isUser = msg.role === "user";

      // Message Header
      checkPage(15);
      y += 5;
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      if (isUser) doc.setTextColor(147, 51, 234);
      else doc.setTextColor(37, 99, 235);
      doc.text(isUser ? "USER" : "ZEROOPS BOT", margin, y);

      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 100, 100);
      doc.text(
        new Date(msg.timestamp).toLocaleString(),
        pageWidth - margin - 40,
        y,
      );
      y += 6;

      // Content
      doc.setFontSize(10);
      doc.setTextColor(200, 200, 200);

      // Simple MD stripper/parser for PDF
      const cleanContent = msg.content.replace(
        /```[\s\S]*?```/g,
        "\n[CODE BLOCK]\n",
      );
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
      doc.setDrawColor(20, 20, 20);
      doc.line(margin, y, pageWidth - margin, y);
      y += 5;
    });

    const totalPages = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(80, 80, 80);
      doc.text(
        `ZEROOPS CHAT • PAGE ${i} OF ${totalPages}`,
        pageWidth / 2,
        285,
        { align: "center" },
      );
    }

    doc.save(`zeroops-chat-export-${new Date().getTime()}.pdf`);
    toast.success("Chat exported successfully!");
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30 overflow-hidden flex flex-col">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-blue-600/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-purple-600/5 blur-[120px]" />
      </div>

      <SiteHeader />

      <main className="relative z-10 pt-24 pb-8 flex-1 flex flex-col w-[80vw] mx-auto overflow-hidden">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-linear-to-br from-blue-600/30 to-purple-600/30 border border-white/10 shadow-[0_0_20px_rgba(37,99,235,0.15)] glow-pulse">
              <BrainCircuit className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">ZeroOps Bot</h1>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-gray-400 font-medium">
                  Expert GCP DevOps Mentor
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
              className="text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-xl"
            >
              <FileDown className="w-4 h-4 mr-2" /> Export PDF
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearChat}
              disabled={messages.length === 0}
              className="text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl"
            >
              <Trash2 className="w-4 h-4 mr-2" /> Clear
            </Button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 min-h-0 bg-[#0A0A0A]/40 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] flex flex-col shadow-2xl overflow-hidden mb-6 relative">
          <div className="absolute top-0 left-0 right-0 h-20 bg-linear-to-b from-[#0A0A0A] to-transparent z-10 pointer-events-none opacity-50" />

          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-8 space-y-10 scroll-smooth scrollbar-thin scrollbar-thumb-white/5 hover:scrollbar-thumb-white/10"
          >
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-10 max-w-4xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6"
                >
                  <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-400 via-blue-200 to-purple-400 leading-tight">
                    Master GCP DevOps with Ease
                  </h2>
                  <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
                    I'm your AI-powered companion for navigating the complex
                    ecosystems of Google Cloud. Ask about architecture,
                    pipelines, or security in plain English.
                  </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full px-4">
                  {PRESET_QUESTIONS.map((item, idx) => (
                    <motion.button
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{
                        scale: 1.05,
                        y: -5,
                        backgroundColor: "rgba(255,255,255,0.05)",
                      }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSend(item.question)}
                      className="flex flex-col items-center justify-center p-8 rounded-4xl bg-white/2 border border-white/5 hover:border-blue-500/30 transition-all text-center group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="mb-4 p-4 rounded-2xl bg-white/5 group-hover:bg-blue-500/20 transition-all duration-300 group-hover:rotate-6 shadow-inner">
                        {item.icon}
                      </div>
                      <div className="text-xs font-semibold text-gray-300 group-hover:text-white transition-colors line-clamp-3 leading-relaxed">
                        {item.question}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-8 max-w-5xl mx-auto w-full">
                <AnimatePresence initial={false}>
                  {messages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{
                        opacity: 0,
                        x: message.role === "user" ? 20 : -20,
                        y: 10,
                      }}
                      animate={{ opacity: 1, x: 0, y: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                      }}
                      className={cn(
                        "flex gap-4 group",
                        message.role === "user"
                          ? "justify-end"
                          : "justify-start",
                      )}
                    >
                      {message.role === "model" && (
                        <div className="w-10 h-10 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/5 self-end">
                          <Bot className="w-5 h-5 text-blue-400" />
                        </div>
                      )}
                      <div
                        className={cn(
                          "max-w-[85%] rounded-[1.75rem] px-5 py-4 shadow-xl relative",
                          message.role === "user"
                            ? "bg-linear-to-br from-blue-600 to-indigo-700 text-white rounded-tr-none chat-bubble-user-shadow"
                            : "bg-[#151515] border border-white/5 text-gray-200 rounded-bl-none chat-bubble-bot-shadow",
                        )}
                      >
                        {message.role === "model" ? (
                          <div className="prose prose-invert prose-sm max-w-none">
                            <MarkdownRenderer content={message.content} />
                          </div>
                        ) : (
                          <p className="text-sm leading-relaxed font-medium">
                            {message.content}
                          </p>
                        )}
                        <div
                          className={cn(
                            "text-[10px] mt-2 opacity-40 font-mono",
                            message.role === "user"
                              ? "text-right"
                              : "text-left",
                          )}
                        >
                          {new Date(message.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                      {message.role === "user" && (
                        <div className="w-10 h-10 rounded-2xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center shrink-0 shadow-lg shadow-purple-500/5 self-end">
                          <UserIcon className="w-5 h-5 text-purple-400" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex gap-4 justify-start"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center shrink-0 self-end">
                      <Bot className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="bg-[#151515] border border-white/5 rounded-[1.75rem] rounded-bl-none px-6 py-4 flex items-center gap-4 shadow-xl">
                      <div className="flex gap-1">
                        <motion.span
                          animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.3, 1, 0.3],
                          }}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="w-1.5 h-1.5 bg-blue-500 rounded-full"
                        />
                        <motion.span
                          animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.3, 1, 0.3],
                          }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay: 0.2,
                          }}
                          className="w-1.5 h-1.5 bg-blue-500 rounded-full"
                        />
                        <motion.span
                          animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.3, 1, 0.3],
                          }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay: 0.4,
                          }}
                          className="w-1.5 h-1.5 bg-blue-500 rounded-full"
                        />
                      </div>
                      <span className="text-xs font-semibold text-blue-400/80 tracking-wider">
                        THINKING
                      </span>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-linear-to-t from-[#0A0A0A] to-transparent z-10 pointer-events-none opacity-50" />
        </div>

        {/* Input Area */}
        <div className="p-1 border border-white/5 bg-[#0D0D0D]/60 backdrop-blur-3xl rounded-4xl shadow-2xl shrink-0 group focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
          <div className="relative flex items-center gap-3 p-2">
            <div className="flex-1 flex items-center bg-white/3 rounded-2xl border border-white/5 focus-within:border-blue-500/40 transition-all px-4 group/input">
              <MessageSquare className="w-5 h-5 text-gray-500 group-focus-within/input:text-blue-400 transition-colors shrink-0" />
              <Textarea
                placeholder="Ask ZeroOps Bot about GCP DevOps..."
                className="flex-1 min-h-[50px] max-h-[150px] border-none bg-transparent focus-visible:ring-0 resize-none py-4 px-3 text-sm scrollbar-none placeholder:text-gray-600"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
            </div>
            <Button
              size="icon"
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className={cn(
                "h-12 w-12 shrink-0 rounded-2xl transition-all duration-300",
                input.trim()
                  ? "bg-blue-600 hover:bg-blue-500 hover:scale-105 shadow-lg shadow-blue-500/30"
                  : "bg-white/5 text-gray-600",
              )}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>
          <div className="px-6 py-2 flex items-center justify-between">
            <span className="text-[10px] text-gray-500 font-medium">
              Shift + Enter for multi-line
            </span>
            <div className="flex items-center gap-3 opacity-50">
              <div className="flex items-center gap-1">
                <div className="w-1 h-1 rounded-full bg-blue-400" />
                <span className="text-[9px] text-gray-400 uppercase tracking-tighter">
                  Gemini 2.5 Flash
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx global>{`
        .chat-bubble-user-shadow {
          box-shadow: 0 10px 25px -10px rgba(37, 99, 235, 0.5);
        }
        .chat-bubble-bot-shadow {
          box-shadow: 0 10px 25px -10px rgba(0, 0, 0, 0.5);
        }
        .glow-pulse {
          animation: glow 3s ease-in-out infinite;
        }
        @keyframes glow {
          0%,
          100% {
            box-shadow: 0 0 20px rgba(37, 99, 235, 0.1);
          }
          50% {
            box-shadow: 0 0 40px rgba(37, 99, 235, 0.3);
          }
        }
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
