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
    icon: <Terminal className="w-4 h-4 text-blue-400" />,
    question: "Explain CI/CD in GCP using layman terms.",
  },
  {
    icon: <Cloud className="w-4 h-4 text-purple-400" />,
    question: "What is Terraform and why use it for GCP?",
  },
  {
    icon: <ShieldCheck className="w-4 h-4 text-green-400" />,
    question: "How does Least Privilege work in GCP IAM?",
  },
  {
    icon: <Layers className="w-4 h-4 text-orange-400" />,
    question: "Explain Kubernetes (GKE) like I'm five.",
  },
  {
    icon: <Sparkles className="w-4 h-4 text-yellow-400" />,
    question: "What is the benefit of Cloud Run over VMs?",
  },
  {
    icon: <MessageSquare className="w-4 h-4 text-pink-400" />,
    question: "How does Artifact Registry help DevOps?",
  },
  {
    icon: <ShieldCheck className="w-4 h-4 text-cyan-400" />,
    question: "What is Project vs Organization in GCP?",
  },
  {
    icon: <Cloud className="w-4 h-4 text-red-400" />,
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
            <div className="p-3 rounded-2xl bg-blue-600/20 border border-blue-500/50 shadow-[0_0_20px_rgba(37,99,235,0.2)]">
              <Bot className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">ZeroOps Bot</h1>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-gray-400 font-medium">
                  GCP DevOps Mentor • Online
                </span>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearChat}
            disabled={messages.length === 0}
            className="text-gray-400 hover:text-red-400 hover:bg-red-500/10"
          >
            <Trash2 className="w-4 h-4 mr-2" /> Clear History
          </Button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 min-h-0 bg-[#0A0A0A]/50 backdrop-blur-xl border border-white/10 rounded-3xl flex flex-col shadow-2xl overflow-hidden mb-6">
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-thin scrollbar-thumb-white/10"
          >
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-8 max-w-2xl mx-auto">
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-purple-400">
                    Master GCP DevOps with Ease
                  </h2>
                  <p className="text-gray-400">
                    I'm here to simplify the complex world of Google Cloud
                    DevOps. Ask me anything about CI/CD, Kubernetes, Terraform,
                    or Security.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                  {PRESET_QUESTIONS.map((item, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSend(item.question)}
                      className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all text-center group"
                    >
                      <div className="mb-3 p-3 rounded-xl bg-white/5 group-hover:bg-blue-500/20 transition-colors">
                        {item.icon}
                      </div>
                      <div className="text-xs font-medium text-gray-300 group-hover:text-white transition-colors line-clamp-3">
                        {item.question}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-8">
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
                      <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/50 flex items-center justify-center shrink-0">
                        <Bot className="w-4 h-4 text-blue-400" />
                      </div>
                    )}
                    <div
                      className={cn(
                        "max-w-[80%] rounded-2xl p-4",
                        message.role === "user"
                          ? "bg-blue-600 text-white chat-bubble-user"
                          : "bg-white/5 border border-white/10 chat-bubble-bot",
                      )}
                    >
                      {message.role === "model" ? (
                        <MarkdownRenderer content={message.content} />
                      ) : (
                        <p className="text-sm leading-relaxed">
                          {message.content}
                        </p>
                      )}
                      <div
                        className={cn(
                          "text-[10px] mt-2 opacity-50",
                          message.role === "user" ? "text-right" : "text-left",
                        )}
                      >
                        {new Date(message.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                    {message.role === "user" && (
                      <div className="w-8 h-8 rounded-full bg-purple-600/20 border border-purple-500/50 flex items-center justify-center shrink-0">
                        <UserIcon className="w-4 h-4 text-purple-400" />
                      </div>
                    )}
                  </motion.div>
                ))}

                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-4 justify-start"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/50 flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 flex items-center gap-3">
                      <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                      <span className="text-sm text-gray-400 animate-pulse">
                        Thinking...
                      </span>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-white/10 bg-black/40 backdrop-blur-3xl shrink-0">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-linear-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition duration-500" />
              <div className="relative flex items-end gap-2 bg-black/50 border border-white/10 rounded-2xl p-2 focus-within:border-blue-500/50 transition-colors shadow-inner">
                <Textarea
                  placeholder="Ask a follow-up or a new question..."
                  className="flex-1 min-h-[44px] max-h-[200px] border-none bg-transparent focus-visible:ring-0 resize-none py-3 px-4 text-sm scrollbar-none"
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
                    "mb-1 mr-1 shrink-0 rounded-xl transition-all",
                    input.trim()
                      ? "bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/20"
                      : "bg-white/5 text-gray-400",
                  )}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <p className="text-[10px] text-gray-500 text-center mt-3 flex items-center justify-center gap-1">
              <MessageSquare className="w-3 h-3" />
              Shift + Enter for multi-line • AI can make mistakes. Verify
              important info.
            </p>
          </div>
        </div>
      </main>

      <style jsx global>{`
        .chat-bubble-user-shadow {
          box-shadow: 0 4px 15px -3px rgba(37, 99, 235, 0.4);
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
