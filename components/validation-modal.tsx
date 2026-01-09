"use client"

import { motion } from "framer-motion"
import { AlertCircle, AlertTriangle, CheckCircle, X } from "lucide-react"
import type { ValidationResult } from "@/types/architecture"
import { Button } from "@/components/ui/button"

interface ValidationModalProps {
  result: ValidationResult
  onClose: () => void
}

export function ValidationModal({ result, onClose }: ValidationModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-card border border-border rounded-xl shadow-2xl max-w-md w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className={`p-6 ${
            result.valid
              ? "bg-success/10 border-b border-success/20"
              : "bg-destructive/10 border-b border-destructive/20"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {result.valid ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.1 }}
                  className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center"
                >
                  <CheckCircle className="w-6 h-6 text-success" />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.1 }}
                  className="w-12 h-12 rounded-full bg-destructive/20 flex items-center justify-center"
                >
                  <AlertCircle className="w-6 h-6 text-destructive" />
                </motion.div>
              )}
              <div>
                <h3 className="text-lg font-semibold text-card-foreground">
                  {result.valid ? "Architecture Valid" : "Validation Failed"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {result.errors.length} errors, {result.warnings.length} warnings
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted transition-colors">
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 max-h-[400px] overflow-y-auto space-y-3">
          {result.errors.map((error, index) => (
            <motion.div
              key={`error-${index}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-start gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20"
            >
              <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
              <p className="text-sm text-card-foreground">{error.message}</p>
            </motion.div>
          ))}

          {result.warnings.map((warning, index) => (
            <motion.div
              key={`warning-${index}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: (result.errors.length + index) * 0.05 }}
              className="flex items-start gap-3 p-3 rounded-lg bg-warning/10 border border-warning/20"
            >
              <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
              <p className="text-sm text-card-foreground">{warning.message}</p>
            </motion.div>
          ))}

          {result.errors.length === 0 && result.warnings.length === 0 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-success mx-auto mb-3" />
              <p className="text-card-foreground font-medium">All checks passed!</p>
              <p className="text-sm text-muted-foreground mt-1">Your architecture follows best practices</p>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <Button onClick={onClose} className="w-full">
            Close
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}
