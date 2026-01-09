"use client";

import type React from "react";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Check,
  Code,
  Cpu,
  DollarSign,
  Layers,
  Trash2,
  RotateCcw,
  Book,
} from "lucide-react";
import { ThemeToggle } from "./theme-provider";
import { Button } from "@/components/ui/button";

interface ToolbarProps {
  onValidate: () => void;
  onGenerateTerraform: () => void;
  onClearCanvas: () => void;
  onResetExample: () => void;
  totalCost: number;
  componentCount: number;
}

export function Toolbar({
  onValidate,
  onGenerateTerraform,
  onClearCanvas,
  onResetExample,
  totalCost,
  componentCount,
}: ToolbarProps) {
  const [ripple, setRipple] = useState<{
    id: number;
    x: number;
    y: number;
  } | null>(null);

  const handleRipple = (e: React.MouseEvent, callback: () => void) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setRipple({ id: Date.now(), x, y });
    setTimeout(() => setRipple(null), 600);
    callback();
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="h-16 border-b border-border bg-card px-4 flex items-center justify-between shrink-0 shadow-sm"
    >
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Cpu className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-lg font-semibold text-card-foreground hidden sm:block">
              Zero Ops
            </h1>
          </motion.div>
        </Link>

        <div className="h-6 w-px bg-border hidden md:block" />

        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="hidden md:flex items-center gap-2 text-muted-foreground text-sm"
        >
          <Layers className="w-4 h-4" />
          <span>{componentCount} components</span>
        </motion.div>

        <div className="hidden lg:flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearCanvas}
            className="gap-1.5 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onResetExample}
            className="gap-1.5 text-muted-foreground hover:text-primary"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Example</span>
          </Button>
          <Link href="/docs">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-muted-foreground hover:text-primary"
            >
              <Book className="w-4 h-4" />
              <span>Docs</span>
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Cost Badge */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-medium"
        >
          <DollarSign className="w-4 h-4" />
          <motion.span
            key={totalCost}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
          >
            ${totalCost.toFixed(2)}/mo
          </motion.span>
        </motion.div>

        <div className="flex items-center gap-2">
          <motion.div className="relative overflow-hidden rounded-lg">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => handleRipple(e, onValidate)}
              className="relative overflow-hidden gap-2"
            >
              <Check className="w-4 h-4" />
              <span className="hidden sm:inline">Validate</span>
              {ripple && (
                <motion.span
                  initial={{ scale: 0, opacity: 0.5 }}
                  animate={{ scale: 4, opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className="absolute w-10 h-10 bg-primary/20 rounded-full"
                  style={{ left: ripple.x - 20, top: ripple.y - 20 }}
                />
              )}
            </Button>
          </motion.div>

          <Button
            size="sm"
            onClick={onGenerateTerraform}
            className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Code className="w-4 h-4" />
            <span className="hidden sm:inline">Generate Terraform</span>
          </Button>
        </div>

        <div className="h-6 w-px bg-border" />
        <ThemeToggle />
      </div>
    </motion.header>
  );
}
