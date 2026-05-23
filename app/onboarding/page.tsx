"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { auth, checkAidAvailability, saveUserProfile } from "@/lib/firebase";
import { useAuth } from "@/components/auth-provider";
import {
  Loader2,
  ArrowRight,
  ArrowLeft,
  Check,
  AlertCircle,
  Laptop,
  Briefcase,
  Rocket,
  Building2,
  GraduationCap,
  Sparkles,
  User,
  Users,
  Shield,
  Globe,
  Smartphone,
  Cpu,
  Palette,
  TrendingUp,
  BookOpen,
  Zap,
  Server,
  Layers,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    id: "aid",
    title: "Claim your developer handle",
    description: "Choose a unique username to identify your account across projects.",
  },
  {
    id: "useCase",
    title: "Choose your workspace profile",
    description: "Help us configure the appropriate defaults and workspace parameters.",
  },
  {
    id: "teamSize",
    title: "Define collaborator scale",
    description: "Select the team capacity planning configuration for your environment.",
  },
  {
    id: "fieldOfWork",
    title: "Select primary tech domain",
    description: "Determine the boilerplate templates and library suggestions to provision.",
  },
];

const USE_CASE_OPTIONS = [
  {
    id: "personal",
    title: "Personal Projects",
    description: "Hobby projects, individual learning, or staging.",
    icon: Laptop,
    selectedClass: "border-blue-500 bg-blue-500/[0.02] shadow-[0_2px_12px_rgba(59,130,246,0.08)]",
  },
  {
    id: "freelance",
    title: "Freelance / Agency",
    description: "Architecting custom software for client operations.",
    icon: Briefcase,
    selectedClass: "border-blue-500 bg-blue-500/[0.02] shadow-[0_2px_12px_rgba(59,130,246,0.08)]",
  },
  {
    id: "startup",
    title: "Startup / SaaS Development",
    description: "Iterating on early stage products and building MVPs.",
    icon: Rocket,
    selectedClass: "border-blue-500 bg-blue-500/[0.02] shadow-[0_2px_12px_rgba(59,130,246,0.08)]",
  },
  {
    id: "enterprise",
    title: "Enterprise Systems",
    description: "Large-scale software engineering, compliance, and systems integration.",
    icon: Building2,
    selectedClass: "border-blue-500 bg-blue-500/[0.02] shadow-[0_2px_12px_rgba(59,130,246,0.08)]",
  },
  {
    id: "education",
    title: "Academic & Training",
    description: "Curriculum integration, teaching platforms, or learning labs.",
    icon: GraduationCap,
    selectedClass: "border-blue-500 bg-blue-500/[0.02] shadow-[0_2px_12px_rgba(59,130,246,0.08)]",
  },
  {
    id: "other",
    title: "Custom Use Case",
    description: "Specific business requirements not defined above.",
    icon: Sparkles,
    selectedClass: "border-zinc-400 bg-zinc-800/[0.02]",
  },
];

const TEAM_SIZE_OPTIONS = [
  {
    id: "1",
    title: "Solo Workspace",
    description: "Optimized for a single software developer.",
    icon: User,
    selectedClass: "border-blue-500 bg-blue-500/[0.02] shadow-[0_2px_12px_rgba(59,130,246,0.08)]",
  },
  {
    id: "2-10",
    title: "Small Business / Squad",
    description: "Designed for small teams of 2 to 10 builders.",
    icon: Users,
    selectedClass: "border-blue-500 bg-blue-500/[0.02] shadow-[0_2px_12px_rgba(59,130,246,0.08)]",
  },
  {
    id: "11-50",
    title: "Mid-Market / Growth",
    description: "Scalable resources allocated for 11 to 50 active users.",
    icon: Zap,
    selectedClass: "border-blue-500 bg-blue-500/[0.02] shadow-[0_2px_12px_rgba(59,130,246,0.08)]",
  },
  {
    id: "51-200",
    title: "Enterprise Segment",
    description: "Orchestration and pipeline monitoring for 51 to 200 developers.",
    icon: Building2,
    selectedClass: "border-blue-500 bg-blue-500/[0.02] shadow-[0_2px_12px_rgba(59,130,246,0.08)]",
  },
  {
    id: "200+",
    title: "Global Enterprise Core",
    description: "Federated controls and provisioning for over 200+ members.",
    icon: Shield,
    selectedClass: "border-blue-500 bg-blue-500/[0.02] shadow-[0_2px_12px_rgba(59,130,246,0.08)]",
  },
];

const FIELD_OPTIONS = [
  {
    id: "web-dev",
    title: "Web Engineering",
    description: "Fullstack SaaS systems, backend APIs, and web environments.",
    icon: Globe,
    selectedClass: "border-blue-500 bg-blue-500/[0.02] shadow-[0_2px_12px_rgba(59,130,246,0.08)]",
  },
  {
    id: "mobile-dev",
    title: "Mobile App Development",
    description: "Native applications (iOS / Android) and hybrid libraries.",
    icon: Smartphone,
    selectedClass: "border-blue-500 bg-blue-500/[0.02] shadow-[0_2px_12px_rgba(59,130,246,0.08)]",
  },
  {
    id: "data-science",
    title: "Artificial Intelligence & Data Systems",
    description: "Data lakes, custom LLM fine-tuning, and model training pipelines.",
    icon: Cpu,
    selectedClass: "border-blue-500 bg-blue-500/[0.02] shadow-[0_2px_12px_rgba(59,130,246,0.08)]",
  },
  {
    id: "design",
    title: "Creative & Interface Design",
    description: "UX strategies, layouts, animations, and Figma exports.",
    icon: Palette,
    selectedClass: "border-blue-500 bg-blue-500/[0.02] shadow-[0_2px_12px_rgba(59,130,246,0.08)]",
  },
  {
    id: "marketing",
    title: "Growth & Analytics Engineering",
    description: "Campaign infrastructure, funnel analysis, and data platforms.",
    icon: TrendingUp,
    selectedClass: "border-blue-500 bg-blue-500/[0.02] shadow-[0_2px_12px_rgba(59,130,246,0.08)]",
  },
  {
    id: "student",
    title: "Academic & Computer Science",
    description: "Boilerplate blueprints for learning system logic.",
    icon: BookOpen,
    selectedClass: "border-blue-500 bg-blue-500/[0.02] shadow-[0_2px_12px_rgba(59,130,246,0.08)]",
  },
  {
    id: "other",
    title: "Custom Domain Focus",
    description: "Specialized engineering vertical not represented.",
    icon: Sparkles,
    selectedClass: "border-zinc-400 bg-zinc-800/[0.02]",
  },
];

export default function OnboardingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    aid: "",
    useCase: "",
    useCaseCustom: "",
    teamSize: "",
    fieldOfWork: "",
    fieldOfWorkCustom: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isCheckingAid, setIsCheckingAid] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleNext = async () => {
    const step = STEPS[currentStep];
    let isValid = true;
    const newErrors: Record<string, string> = {};

    if (step.id === "aid") {
      if (!formData.aid || formData.aid.length < 3) {
        newErrors["aid"] = "Handle must be at least 3 characters";
        isValid = false;
      } else if (errors["aid"]) {
        isValid = false;
      }
    } else if (step.id === "useCase") {
      if (!formData.useCase) {
        newErrors["useCase"] = "Please select a workspace mode";
        isValid = false;
      } else if (formData.useCase === "other" && !formData.useCaseCustom) {
        newErrors["useCaseCustom"] = "Please clarify your custom mode";
        isValid = false;
      }
    } else if (step.id === "teamSize") {
      if (!formData.teamSize) {
        newErrors["teamSize"] = "Please select a collaborator capacity";
        isValid = false;
      }
    } else if (step.id === "fieldOfWork") {
      if (!formData.fieldOfWork) {
        newErrors["fieldOfWork"] = "Please select your primary technology domain";
        isValid = false;
      } else if (
        formData.fieldOfWork === "other" &&
        !formData.fieldOfWorkCustom
      ) {
        newErrors["fieldOfWorkCustom"] = "Please clarify your custom focus";
        isValid = false;
      }
    }

    if (!isValid) {
      setErrors(newErrors);
      return;
    }

    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      await submitForm();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const submitForm = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      await saveUserProfile(user.uid, {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        aid: formData.aid,
        useCase:
          formData.useCase === "other"
            ? formData.useCaseCustom
            : formData.useCase,
        teamSize: formData.teamSize,
        fieldOfWork:
          formData.fieldOfWork === "other"
            ? formData.fieldOfWorkCustom
            : formData.fieldOfWork,
      });
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to save profile", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAidChange = async (value: string) => {
    const cleanValue = value.toLowerCase().replace(/[^a-z0-9]/g, "");
    setFormData((prev) => ({ ...prev, aid: cleanValue }));
    setErrors((prev) => ({ ...prev, aid: "" }));

    if (cleanValue.length >= 3) {
      setIsCheckingAid(true);
      try {
        const isAvailable = await checkAidAvailability(cleanValue);
        if (!isAvailable) {
          setErrors((prev) => ({ ...prev, aid: "This handle is already registered." }));
        }
      } catch (error) {
        console.error("Error checking AID", error);
      } finally {
        setIsCheckingAid(false);
      }
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-5">
            <div className="relative">
              <div className="relative flex items-center bg-zinc-950/60 border border-zinc-800 rounded-xl focus-within:border-zinc-600 focus-within:ring-2 focus-within:ring-zinc-800 transition-all duration-200 h-14 px-4">
                <span className="text-zinc-500 font-mono text-sm select-none pr-3 border-r border-zinc-800 mr-3 py-1 font-semibold">
                  @
                </span>
                <input
                  type="text"
                  value={formData.aid}
                  onChange={(e) => handleAidChange(e.target.value)}
                  placeholder="username"
                  className="flex-1 bg-transparent border-0 text-white placeholder:text-zinc-700 focus:outline-none focus:ring-0 text-sm font-mono tracking-wide"
                  autoFocus
                />
                <div className="flex items-center pl-2">
                  {isCheckingAid ? (
                    <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />
                  ) : !errors.aid && formData.aid.length >= 3 ? (
                    <Check className="w-4 h-4 text-emerald-500" />
                  ) : errors.aid ? (
                    <AlertCircle className="w-4 h-4 text-rose-500" />
                  ) : null}
                </div>
              </div>
            </div>

            {errors.aid ? (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-rose-500 text-xs ml-1"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.aid}</span>
              </motion.div>
            ) : (
              <p className="text-xs text-zinc-500 ml-1 leading-relaxed font-mono">
                Letters (a-z) and numbers (0-9) only. Minimum length of 3.
              </p>
            )}

            {formData.aid.length >= 3 && !errors.aid && !isCheckingAid && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-emerald-500/[0.03] border border-emerald-500/10 text-emerald-400 p-3 rounded-lg flex items-center gap-2.5"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                <span className="text-xs font-mono">
                  Handle <span className="font-semibold">@{formData.aid}</span> is verified and available for registration.
                </span>
              </motion.div>
            )}
          </div>
        );
      case 1:
        return (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {USE_CASE_OPTIONS.map((opt) => {
                const isSelected = formData.useCase === opt.id;
                const IconComponent = opt.icon;
                return (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, useCase: opt.id }));
                      setErrors((prev) => ({ ...prev, useCase: "" }));
                    }}
                    type="button"
                    className={cn(
                      "group text-left p-4 rounded-xl border transition-all duration-200 bg-zinc-950/20",
                      isSelected
                        ? opt.selectedClass
                        : "border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900/20"
                    )}
                  >
                    <div className="flex gap-3.5 items-start">
                      <div
                        className={cn(
                          "p-2 rounded-lg border transition-colors duration-200",
                          isSelected
                            ? "bg-blue-500/10 border-blue-500/20 text-blue-400"
                            : "bg-zinc-900/50 border-zinc-800 text-zinc-400 group-hover:text-zinc-200"
                        )}
                      >
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-semibold text-white">
                          {opt.title}
                        </h4>
                        <p className="text-[11px] text-zinc-400 leading-normal">
                          {opt.description}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {errors.useCase && (
              <p className="text-rose-500 text-xs ml-1 flex items-center gap-1.5 font-mono">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.useCase}
              </p>
            )}

            <AnimatePresence>
              {formData.useCase === "other" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden space-y-1.5"
                >
                  <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider ml-1">
                    Describe your custom profile settings
                  </label>
                  <Input
                    value={formData.useCaseCustom}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        useCaseCustom: e.target.value,
                      }));
                      setErrors((prev) => ({ ...prev, useCaseCustom: "" }));
                    }}
                    placeholder="Provide specific use details..."
                    className="h-10 bg-zinc-950/40 border-zinc-800 text-white rounded-lg placeholder:text-zinc-700 text-xs focus-visible:ring-zinc-700"
                  />
                  {errors.useCaseCustom && (
                    <p className="text-rose-500 text-xs ml-1 flex items-center gap-1.5 font-mono">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.useCaseCustom}
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              {TEAM_SIZE_OPTIONS.map((opt) => {
                const isSelected = formData.teamSize === opt.id;
                const IconComponent = opt.icon;
                return (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, teamSize: opt.id }));
                      setErrors((prev) => ({ ...prev, teamSize: "" }));
                    }}
                    type="button"
                    className={cn(
                      "group w-full text-left p-3.5 rounded-lg border transition-all duration-200 bg-zinc-950/20",
                      isSelected
                        ? opt.selectedClass
                        : "border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900/20"
                    )}
                  >
                    <div className="flex gap-3.5 items-center">
                      <div
                        className={cn(
                          "p-2 rounded-lg border transition-colors duration-200",
                          isSelected
                            ? "bg-blue-500/10 border-blue-500/20 text-blue-400"
                            : "bg-zinc-900/50 border-zinc-800 text-zinc-400 group-hover:text-zinc-200"
                        )}
                      >
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="flex-1 flex justify-between items-center">
                        <div className="space-y-0.5">
                          <h4 className="text-xs font-semibold text-white">{opt.title}</h4>
                          <p className="text-[10px] text-zinc-400 leading-none">
                            {opt.description}
                          </p>
                        </div>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-blue-500/10 border border-blue-500 flex items-center justify-center">
                            <Check className="w-3 h-3 text-blue-400" />
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            {errors.teamSize && (
              <p className="text-rose-500 text-xs ml-1 flex items-center gap-1.5 font-mono">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.teamSize}
              </p>
            )}
          </div>
        );
      case 3:
        return (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {FIELD_OPTIONS.map((opt) => {
                const isSelected = formData.fieldOfWork === opt.id;
                const IconComponent = opt.icon;
                return (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, fieldOfWork: opt.id }));
                      setErrors((prev) => ({ ...prev, fieldOfWork: "" }));
                    }}
                    type="button"
                    className={cn(
                      "group text-left p-4 rounded-xl border transition-all duration-200 bg-zinc-950/20",
                      isSelected
                        ? opt.selectedClass
                        : "border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900/20"
                    )}
                  >
                    <div className="flex gap-3.5 items-start">
                      <div
                        className={cn(
                          "p-2 rounded-lg border transition-colors duration-200",
                          isSelected
                            ? "bg-blue-500/10 border-blue-500/20 text-blue-400"
                            : "bg-zinc-900/50 border-zinc-800 text-zinc-400 group-hover:text-zinc-200"
                        )}
                      >
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-semibold text-white">{opt.title}</h4>
                        <p className="text-[11px] text-zinc-400 leading-normal">
                          {opt.description}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {errors.fieldOfWork && (
              <p className="text-rose-500 text-xs ml-1 flex items-center gap-1.5 font-mono">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.fieldOfWork}
              </p>
            )}

            <AnimatePresence>
              {formData.fieldOfWork === "other" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden space-y-1.5"
                >
                  <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider ml-1">
                    Describe your custom domain focus
                  </label>
                  <Input
                    value={formData.fieldOfWorkCustom}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        fieldOfWorkCustom: e.target.value,
                      }));
                      setErrors((prev) => ({ ...prev, fieldOfWorkCustom: "" }));
                    }}
                    placeholder="Provide specific technology stack detail..."
                    className="h-10 bg-zinc-950/40 border-zinc-800 text-white rounded-lg placeholder:text-zinc-700 text-xs focus-visible:ring-zinc-700"
                  />
                  {errors.fieldOfWorkCustom && (
                    <p className="text-rose-500 text-xs ml-1 flex items-center gap-1.5 font-mono">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.fieldOfWorkCustom}
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center text-white relative">
        <Loader2 className="w-6 h-6 animate-spin text-zinc-400 z-10" />
        <p className="text-zinc-500 font-mono text-[10px] mt-3 tracking-wider uppercase z-10">
          Syncing session context...
        </p>
      </div>
    );
  }

  // Setup the clean structured parameters list
  const resourceSummary = [
    { label: "Account Scope", value: user.email || "Unknown" },
    { label: "Developer ID", value: formData.aid ? `@${formData.aid}` : "Pending configuration" },
    {
      label: "Workspace Profile",
      value: formData.useCase
        ? formData.useCase === "other"
          ? formData.useCaseCustom || "Custom Profile"
          : formData.useCase
        : "Pending configuration",
    },
    { label: "Collaborator Scale", value: formData.teamSize ? `${formData.teamSize} member(s)` : "Pending configuration" },
    {
      label: "Boilerplate Domain",
      value: formData.fieldOfWork
        ? formData.fieldOfWork === "other"
          ? formData.fieldOfWorkCustom || "Custom Domain"
          : formData.fieldOfWork
        : "Pending configuration",
    },
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex items-center justify-center p-4 md:p-8 lg:p-12 select-none relative overflow-hidden">
      {/* Muted Premium Grid overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#141416_1px,transparent_1px),linear-gradient(to_bottom,#141416_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      <div className="relative z-10 max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Column: Clean & Classy Environment Overview */}
        <section className="hidden lg:flex lg:col-span-5 flex-col justify-between p-6 bg-zinc-900/20 border border-zinc-800/80 rounded-2xl backdrop-blur-2xl shadow-sm relative overflow-hidden">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase font-semibold">
                Setup Environment
              </span>
              <span className="text-[10px] font-mono text-zinc-500 font-semibold px-2 py-0.5 bg-zinc-900 rounded border border-zinc-800">
                PROVISION
              </span>
            </div>

            {/* Profile Overview Card */}
            <div className="p-4 bg-zinc-950/40 border border-zinc-800 rounded-xl relative">
              <div className="flex items-center gap-3">
                <div className="relative w-11 h-11 rounded-full overflow-hidden border border-zinc-800 shadow-sm bg-zinc-900 flex items-center justify-center">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-zinc-300 text-sm font-semibold font-mono">
                      {user.displayName
                        ? user.displayName.slice(0, 2).toUpperCase()
                        : user.email?.slice(0, 2).toUpperCase() || "DV"}
                    </span>
                  )}
                </div>

                <div className="space-y-0.5">
                  <h3 className="text-white font-bold leading-tight font-sans text-xs">
                    {user.displayName || "DevOps Developer"}
                  </h3>
                  <p className="text-zinc-500 font-mono text-[10px] select-all">
                    @{formData.aid || "handle"}
                  </p>
                </div>
              </div>
            </div>

            {/* Structured Workspace Parameters List */}
            <div className="space-y-3">
              <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-500 font-bold">
                Resource Allocations
              </span>

              <div className="bg-zinc-950/20 border border-zinc-800 rounded-xl divide-y divide-zinc-800/60 p-1">
                {resourceSummary.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2.5 px-3 text-[10px] font-mono">
                    <span className="text-zinc-500">{item.label}</span>
                    <span className="text-zinc-200 font-medium capitalize max-w-[140px] truncate text-right">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Minimal Status Progress Dotted Visual */}
          <div className="bg-zinc-950/40 border border-zinc-800/80 p-4 rounded-xl space-y-3 mt-6">
            <div className="flex items-center justify-between text-[9px] font-mono text-zinc-500">
              <span className="uppercase tracking-wide font-semibold">Orchestration Phase</span>
              <span className="font-semibold text-blue-500">
                {Math.round(((currentStep + 1) / STEPS.length) * 100)}%
              </span>
            </div>
            <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
              />
            </div>
          </div>
        </section>

        {/* Right Column: Classy Form Wizard */}
        <main className="col-span-1 lg:col-span-7 bg-zinc-900/10 border border-zinc-800/80 p-6 md:p-10 lg:p-11 rounded-2xl backdrop-blur-2xl shadow-sm flex flex-col justify-between min-h-[580px] relative">
          <div className="space-y-6">
            {/* Steps Progress Header */}
            <div className="flex items-center justify-between border-b border-zinc-800/60 pb-4">
              <div className="flex gap-1.5">
                {STEPS.map((_, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "h-1 rounded-full transition-all duration-300",
                      currentStep === idx
                        ? "w-6 bg-blue-500"
                        : currentStep > idx
                        ? "w-3 bg-zinc-500"
                        : "w-1.5 bg-zinc-800"
                    )}
                  />
                ))}
              </div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500 font-semibold px-2 py-0.5 bg-zinc-950 border border-zinc-800 rounded">
                Section {currentStep + 1} of {STEPS.length}
              </span>
            </div>

            {/* Heading Section */}
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight text-white/95">
                {STEPS[currentStep].title}
              </h1>
              <p className="text-zinc-400 text-xs leading-relaxed max-w-lg">
                {STEPS[currentStep].description}
              </p>
            </div>

            {/* Dynamic Step Content */}
            <div className="min-h-[220px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  {renderStepContent()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Action Buttons Panel */}
          <div className="mt-8 flex justify-between items-center border-t border-zinc-800/60 pt-5">
            <Button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 0 || isSaving}
              variant="outline"
              className="h-10 px-4 rounded-lg text-xs font-medium text-zinc-400 hover:text-white border-zinc-800 hover:bg-zinc-900 disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </Button>

            <Button
              type="button"
              onClick={handleNext}
              disabled={
                isSaving ||
                (currentStep === 0 && (isCheckingAid || !formData.aid || !!errors.aid))
              }
              className={cn(
                "h-10 px-5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm active:scale-[0.98]",
                currentStep === STEPS.length - 1
                  ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                  : "bg-white hover:bg-zinc-200 text-zinc-950 font-bold"
              )}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-950" />
                  <span>Configuring...</span>
                </>
              ) : (
                <>
                  <span>{currentStep === STEPS.length - 1 ? "Complete Setup" : "Continue"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
}
