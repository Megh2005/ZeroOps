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
import { Github, Send } from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 1 } },
};

export function ContactForm() {
  const [state, handleSubmit] = useForm("meeeeprd");

  useEffect(() => {
    if (state.succeeded) {
      toast.success("Message sent successfully! We'll get back to you soon.");
    }
    if (state.errors) {
      // Using generic check to avoid lint issues with Formspree's SubmissionError type
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
        className="text-center p-8 bg-[#111] rounded-3xl border border-blue-500/20 shadow-2xl"
      >
        <h3 className="text-2xl font-bold text-white mb-4">
          Thanks for reaching out!
        </h3>
        <p className="text-gray-400">
          Your message has been received. Our team of developers will review it
          and get back to you.
        </p>
        <Button
          variant="outline"
          className="mt-6 border-blue-500/30 bg-blue-950 text-blue-200 hover:bg-blue-500/10"
          onClick={() => window.location.reload()}
        >
          Send another message
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      className="max-w-2xl mx-auto bg-[#0D0D0D]/50 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl"
    >
      <form
        onSubmit={handleSubmit}
        action="https://formspree.io/f/meeeeprd"
        className="space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="full-name" className="text-gray-300">
              Full Name
            </Label>
            <Input
              id="full-name"
              name="name"
              placeholder="John Doe"
              required
              className="bg-white/5 border-white/10 focus:border-blue-500/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-300">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="john@example.com"
              required
              className="bg-white/5 border-white/10 focus:border-blue-500/50"
            />
            <ValidationError
              prefix="Email"
              field="email"
              errors={state.errors}
              className="text-red-500 text-xs mt-1"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="project-type" className="text-gray-300">
              Project Type
            </Label>
            <Select name="project-type" required>
              <SelectTrigger className="bg-white/5 border-white/10 focus:border-blue-500/50 w-full">
                <SelectValue placeholder="Select interest" />
              </SelectTrigger>
              <SelectContent className="bg-[#0D0D0D] border-white/10 text-white">
                <SelectItem value="infrastructure">
                  Cloud Infrastructure
                </SelectItem>
                <SelectItem value="devops">DevOps Automation</SelectItem>
                <SelectItem value="security">Cloud Security</SelectItem>
                <SelectItem value="enterprise">Enterprise Solution</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="github"
              className="text-gray-300 flex items-center gap-2"
            >
              <Github className="w-4 h-4" /> Github URL
            </Label>
            <Input
              id="github"
              name="github"
              placeholder="https://github.com/username"
              className="bg-white/5 border-white/10 focus:border-blue-500/50"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="callback-date" className="text-gray-300">
              Suggested Callback Date
            </Label>
            <Input
              id="callback-date"
              type="date"
              name="callback-date"
              required
              min={new Date(Date.now() + 86400000).toISOString().split("T")[0]}
              className="bg-white/5 border-white/10 focus:border-blue-500/50 scheme-dark"
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
            <Label htmlFor="callback-time" className="text-gray-300">
              Suggested Callback Time (9 AM - 9 PM)
            </Label>
            <Input
              id="callback-time"
              type="time"
              name="callback-time"
              required
              min="09:00"
              max="21:00"
              className="bg-white/5 border-white/10 focus:border-blue-500/50 scheme-dark"
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
          <Label htmlFor="message" className="text-gray-300">
            Technical Brief / Message
          </Label>
          <Textarea
            id="message"
            name="message"
            placeholder="Tell us about your infrastructure goals..."
            required
            className="bg-white/5 border-white/10 focus:border-blue-500/50 min-h-[150px]"
          />
          <ValidationError
            prefix="Message"
            field="message"
            errors={state.errors}
            className="text-red-500 text-xs mt-1"
          />
        </div>

        <Button
          type="submit"
          disabled={state.submitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 rounded-xl transition-all flex items-center justify-center gap-2 font-bold"
        >
          {state.submitting ? (
            <span className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Sending...
            </span>
          ) : (
            <>
              <Send className="w-4 h-4" /> Send Message
            </>
          )}
        </Button>
      </form>
    </motion.div>
  );
}
