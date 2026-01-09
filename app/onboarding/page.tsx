"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { auth, checkAidAvailability, saveUserProfile } from "@/lib/firebase";
import { useAuth } from "@/components/auth-provider";
import { Loader2, ArrowRight, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    id: "aid",
    title: "Let's pick an AID",
    description:
      "Choose a unique identifier for your profile. This will be your handle.",
  },
  {
    id: "useCase",
    title: "How do you plan to use this?",
    description: "Helping us customize your experience.",
  },
  {
    id: "teamSize",
    title: "How big is your team?",
    description: "Just you, or a whole squad?",
  },
  {
    id: "fieldOfWork",
    title: "What represents your field of work?",
    description: "Industry or domain.",
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
        newErrors["aid"] = "AID must be at least 3 characters";
        isValid = false;
      } else if (errors["aid"]) {
        isValid = false;
      }
    } else if (step.id === "useCase") {
      if (!formData.useCase) {
        newErrors["useCase"] = "Please select a use case";
        isValid = false;
      } else if (formData.useCase === "other" && !formData.useCaseCustom) {
        newErrors["useCaseCustom"] = "Please specify your use case";
        isValid = false;
      }
    } else if (step.id === "teamSize") {
      if (!formData.teamSize) {
        newErrors["teamSize"] = "Please select a team size";
        isValid = false;
      }
    } else if (step.id === "fieldOfWork") {
      if (!formData.fieldOfWork) {
        newErrors["fieldOfWork"] = "Please select a field of work";
        isValid = false;
      } else if (
        formData.fieldOfWork === "other" &&
        !formData.fieldOfWorkCustom
      ) {
        newErrors["fieldOfWorkCustom"] = "Please specify your field";
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
      console.error("Failed to save profile", error); // Handle error visibly?
    } finally {
      setIsSaving(false);
    }
  };

  const handleAidChange = async (value: string) => {
    // Enforce lowercase and alphanumeric
    const cleanValue = value.toLowerCase().replace(/[^a-z0-9]/g, "");
    setFormData((prev) => ({ ...prev, aid: cleanValue }));
    setErrors((prev) => ({ ...prev, aid: "" }));

    if (cleanValue.length >= 3) {
      setIsCheckingAid(true);
      try {
        const isAvailable = await checkAidAvailability(cleanValue);
        if (!isAvailable) {
          setErrors((prev) => ({ ...prev, aid: "This AID is already taken" }));
        }
      } catch (error) {
        console.error("Error checking AID", error);
      } finally {
        setIsCheckingAid(false);
      }
    }
  };

  // Render content based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div className="relative">
              <Input
                value={formData.aid}
                onChange={(e) => handleAidChange(e.target.value)}
                placeholder="myuniqueid"
                className={cn(
                  "text-2xl h-16 bg-white/5 border-white/10 text-white placeholder:text-gray-600 pl-4 pr-12",
                  errors.aid
                    ? "border-red-500/50 focus-visible:ring-red-500/50"
                    : "focus-visible:ring-blue-500/50"
                )}
                autoFocus
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                {isCheckingAid ? (
                  <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
                ) : !errors.aid && formData.aid.length >= 3 ? (
                  <Check className="w-5 h-5 text-green-500" />
                ) : errors.aid ? (
                  <AlertCircle className="w-5 h-5 text-red-500" />
                ) : null}
              </div>
            </div>
            {errors.aid && (
              <p className="text-red-400 text-sm ml-1">{errors.aid}</p>
            )}
            <p className="text-xs text-gray-500 ml-1">
              Only lowercase letters and numbers. At least 3 characters.
            </p>
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <Select
              value={formData.useCase}
              onValueChange={(val) => {
                setFormData((prev) => ({ ...prev, useCase: val }));
                setErrors((prev) => ({ ...prev, useCase: "" }));
              }}
            >
              <SelectTrigger className="h-14 bg-white/5 border-white/10 text-white text-lg">
                <SelectValue placeholder="Select a use case" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a1a] border-white/10 text-white">
                <SelectItem value="personal">Personal Projects</SelectItem>
                <SelectItem value="freelance">Freelance Work</SelectItem>
                <SelectItem value="startup">Startup</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.useCase && (
              <p className="text-red-400 text-sm">{errors.useCase}</p>
            )}

            <AnimatePresence>
              {formData.useCase === "other" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <Input
                    value={formData.useCaseCustom}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        useCaseCustom: e.target.value,
                      }));
                      setErrors((prev) => ({ ...prev, useCaseCustom: "" }));
                    }}
                    placeholder="Please specify..."
                    className="h-12 bg-white/5 border-white/10 text-white mt-2"
                  />
                  {errors.useCaseCustom && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.useCaseCustom}
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
            <Select
              value={formData.teamSize}
              onValueChange={(val) => {
                setFormData((prev) => ({ ...prev, teamSize: val }));
                setErrors((prev) => ({ ...prev, teamSize: "" }));
              }}
            >
              <SelectTrigger className="h-14 bg-white/5 border-white/10 text-white text-lg">
                <SelectValue placeholder="Select team size" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a1a] border-white/10 text-white">
                <SelectItem value="1">Just me (1)</SelectItem>
                <SelectItem value="2-10">Small Team (2-10)</SelectItem>
                <SelectItem value="11-50">Growing (11-50)</SelectItem>
                <SelectItem value="51-200">Scale-up (51-200)</SelectItem>
                <SelectItem value="200+">Enterprise (200+)</SelectItem>
              </SelectContent>
            </Select>
            {errors.teamSize && (
              <p className="text-red-400 text-sm">{errors.teamSize}</p>
            )}
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <Select
              value={formData.fieldOfWork}
              onValueChange={(val) => {
                setFormData((prev) => ({ ...prev, fieldOfWork: val }));
                setErrors((prev) => ({ ...prev, fieldOfWork: "" }));
              }}
            >
              <SelectTrigger className="h-14 bg-white/5 border-white/10 text-white text-lg">
                <SelectValue placeholder="Select your field" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a1a] border-white/10 text-white">
                <SelectItem value="web-dev">Web Development</SelectItem>
                <SelectItem value="mobile-dev">Mobile Development</SelectItem>
                <SelectItem value="data-science">Data Science / AI</SelectItem>
                <SelectItem value="design">Design / Creative</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="student">Student / Learning</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.fieldOfWork && (
              <p className="text-red-400 text-sm">{errors.fieldOfWork}</p>
            )}

            <AnimatePresence>
              {formData.fieldOfWork === "other" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <Input
                    value={formData.fieldOfWorkCustom}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        fieldOfWorkCustom: e.target.value,
                      }));
                      setErrors((prev) => ({ ...prev, fieldOfWorkCustom: "" }));
                    }}
                    placeholder="Please specify..."
                    className="h-12 bg-white/5 border-white/10 text-white mt-2"
                  />
                  {errors.fieldOfWorkCustom && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.fieldOfWorkCustom}
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
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30  flex flex-col items-center justify-center p-4">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[20%] h-[600px] w-[600px] rounded-full bg-blue-900/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[20%] h-[600px] w-[600px] rounded-full bg-purple-900/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20 mask-[linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      </div>

      <main className="relative z-10 w-full max-w-xl">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-blue-500"
              initial={{ width: 0 }}
              animate={{
                width: `${((currentStep + 1) / STEPS.length) * 100}%`,
              }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>
          <div className="mt-4 flex justify-between text-xs text-gray-500 font-medium uppercase tracking-widest">
            <span>
              Step {currentStep + 1} of {STEPS.length}
            </span>
            <span>
              {Math.round(((currentStep + 1) / STEPS.length) * 100)}% Completed
            </span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: -20, filter: "blur(10px)" }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="space-y-8"
          >
            <div className="space-y-2">
              <h1 className="text-4xl font-bold  text-white/90">
                {STEPS[currentStep].title}
              </h1>
              <p className="text-xl text-gray-400 leading-relaxed">
                {STEPS[currentStep].description}
              </p>
            </div>

            <div className="min-h-[200px]">{renderStepContent()}</div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-12 flex justify-end">
          <Button
            onClick={handleNext}
            disabled={
              isSaving ||
              (currentStep === 0 &&
                (isCheckingAid || !formData.aid || !!errors.aid))
            }
            className="h-14 px-8 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold text-lg transition-all hover:scale-105 hover:shadow-lg hover:shadow-blue-600/25 group"
          >
            {isSaving ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                {currentStep === STEPS.length - 1
                  ? "Complete Setup"
                  : "Continue"}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </Button>
        </div>
      </main>
    </div>
  );
}
