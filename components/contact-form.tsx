"use client";

import React, { useEffect } from "react";
import { useForm, ValidationError } from "@formspree/react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Github, Send, CheckCircle2 } from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function ContactForm() {
  const [state, handleSubmit] = useForm("meeeeprd");

  useEffect(() => {
    if (state.succeeded) {
      toast.success("Message sent successfully! We'll get back to you soon.");
    }
    if (state.errors) {
      toast.error("Submission failed. Please check all fields and try again.");
      console.error("Formspree Error:", state.errors);
    }
  }, [state.succeeded, state.errors]);

  if (state.succeeded) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="text-center p-8 bg-zinc-900/10 backdrop-blur-2xl rounded-2xl border border-zinc-800/80 shadow-2xl"
      >
        <div className="mb-6 flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
        <h3 className="text-xl font-semibold tracking-tight text-zinc-100 mb-4">
          Transmission Received
        </h3>
        <p className="text-zinc-400 text-xs font-mono leading-relaxed max-w-md mx-auto">
          Your support ticket has been registered in our system. A senior engineer will review the parameters and respond shortly.
        </p>
        <Button
          variant="outline"
          className="mt-8 border-zinc-800 bg-zinc-950 text-zinc-300 hover:bg-zinc-900 hover:text-zinc-100 rounded text-xs"
          onClick={() => window.location.reload()}
        >
          Initialize New Request
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      className="max-w-2xl mx-auto bg-zinc-900/20 backdrop-blur-2xl p-8 rounded-2xl border border-zinc-800/80 shadow-2xl"
    >
      <form
        onSubmit={handleSubmit}
        action="https://formspree.io/f/meeeeprd"
        className="space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="full-name" className="text-xs text-zinc-400">
              Full Name
            </Label>
            <Input
              id="full-name"
              name="name"
              placeholder="System Administrator"
              required
              className="bg-zinc-900/50 border-zinc-800 focus:border-zinc-500 text-zinc-300 text-sm h-10 rounded shadow-inner"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs text-zinc-400">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="admin@enterprise.com"
              required
              className="bg-zinc-900/50 border-zinc-800 focus:border-zinc-500 text-zinc-300 text-sm h-10 rounded shadow-inner"
            />
            <ValidationError
              prefix="Email"
              field="email"
              errors={state.errors}
              className="text-red-500 text-[10px] font-mono mt-1"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="project-type" className="text-xs text-zinc-400">
              Project Type
            </Label>
            <Select name="project-type" required>
              <SelectTrigger className="bg-zinc-900/50 border-zinc-800 focus:border-zinc-500 text-zinc-300 text-sm h-10 rounded shadow-inner w-full">
                <SelectValue placeholder="Select topology class" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-950 border-zinc-800 text-zinc-300">
                <SelectItem value="infrastructure" className="focus:bg-zinc-900">Cloud Infrastructure</SelectItem>
                <SelectItem value="devops" className="focus:bg-zinc-900">DevOps Automation</SelectItem>
                <SelectItem value="security" className="focus:bg-zinc-900">Cloud Security</SelectItem>
                <SelectItem value="enterprise" className="focus:bg-zinc-900">Enterprise Solution</SelectItem>
                <SelectItem value="other" className="focus:bg-zinc-900">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="github"
              className="text-xs text-zinc-400 flex items-center gap-2"
            >
              <Github className="w-3 h-3" /> Repository URL
            </Label>
            <Input
              id="github"
              name="github"
              placeholder="https://github.com/organization"
              className="bg-zinc-900/50 border-zinc-800 focus:border-zinc-500 text-zinc-300 text-sm h-10 rounded shadow-inner"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="callback-date" className="text-xs text-zinc-400">
              Suggested Callback Date
            </Label>
            <Input
              id="callback-date"
              type="date"
              name="callback-date"
              required
              min={new Date(Date.now() + 86400000).toISOString().split("T")[0]}
              className="bg-zinc-900/50 border-zinc-800 focus:border-zinc-500 text-zinc-300 text-sm h-10 rounded shadow-inner [color-scheme:dark]"
              onChange={(e) => {
                const date = new Date(e.target.value);
                const day = date.getUTCDay();
                if (day === 0 || day === 6) {
                  toast.warning(
                    "Callbacks are only available on Monday to Friday"
                  );
                  e.target.value = "";
                }
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="callback-time" className="text-xs text-zinc-400">
              Suggested Callback Time (9 AM - 9 PM)
            </Label>
            <Input
              id="callback-time"
              type="time"
              name="callback-time"
              required
              min="09:00"
              max="21:00"
              className="bg-zinc-900/50 border-zinc-800 focus:border-zinc-500 text-zinc-300 text-sm h-10 rounded shadow-inner [color-scheme:dark]"
              onChange={(e) => {
                const time = e.target.value;
                if (time < "09:00" || time > "21:00") {
                  toast.warning(
                    "Please select a time between 9:00 AM and 9:00 PM."
                  );
                  e.target.value = "";
                }
              }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="message" className="text-xs text-zinc-400">
            Technical Brief / Parameters
          </Label>
          <Textarea
            id="message"
            name="message"
            placeholder="Specify your architectural requirements and scale..."
            required
            className="bg-zinc-900/50 border-zinc-800 focus:border-zinc-500 text-zinc-300 text-sm min-h-[150px] rounded shadow-inner resize-y"
          />
          <ValidationError
            prefix="Message"
            field="message"
            errors={state.errors}
            className="text-red-500 text-[10px] font-mono mt-1"
          />
        </div>

        <Button
          type="submit"
          disabled={state.submitting}
          className="w-full bg-zinc-100 hover:bg-white text-zinc-900 h-10 rounded text-xs font-semibold transition-all flex items-center justify-center gap-2"
        >
          {state.submitting ? (
            <span className="flex items-center gap-2">
              <div className="h-3 w-3 animate-spin rounded-full border-2 border-zinc-900 border-t-transparent" />
              Transmitting...
            </span>
          ) : (
            <>
              <Send className="w-3 h-3" /> Submit Requirements
            </>
          )}
        </Button>
      </form>
    </motion.div>
  );
}
