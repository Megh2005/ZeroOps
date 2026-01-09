"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Check, Copy, Download, X, Sparkles, AlertTriangle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { validateTerraform, optimizeTerraform } from "@/lib/gemini"
import { MarkdownRenderer } from "@/components/markdown-renderer"

interface TerraformModalProps {
  code: string
  onClose: () => void
}

export function TerraformModal({ code: initialCode, onClose }: TerraformModalProps) {
  const [code, setCode] = useState(initialCode)
  const [copied, setCopied] = useState(false)
  const [validationStatus, setValidationStatus] = useState<string>("")
  const [isValidating, setIsValidating] = useState(false)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [optimizationTips, setOptimizationTips] = useState<string>("")

  useEffect(() => {
    const validate = async () => {
      if (!code) return
      setIsValidating(true)
      try {
        const result = await validateTerraform(code)
        setValidationStatus(result)
      } catch (error) {
        console.error(error)
      } finally {
        setIsValidating(false)
      }
    }
    validate()
  }, [code])

  const handleOptimize = async () => {
    setIsOptimizing(true)
    try {
      const { optimizedCode, tips } = await optimizeTerraform(code)
      setCode(optimizedCode)
      setOptimizationTips(tips)
      // Re-validate optimized code
      const validation = await validateTerraform(optimizedCode)
      setValidationStatus(validation)
    } catch (error) {
      console.error(error)
    } finally {
      setIsOptimizing(false)
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([code], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "main.tf"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

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
        className="bg-card border border-border rounded-xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-card-foreground">Generated Terraform</h3>
            <p className="text-sm text-muted-foreground">Infrastructure as Code for your architecture</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleCopy} className="gap-2 bg-transparent">
              {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied!" : "Copy"}
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload} className="gap-2 bg-transparent">
              <Download className="w-4 h-4" />
              Download
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleOptimize}
              disabled={isOptimizing || !code}
              className="gap-2 bg-linear-to-r from-blue-600 to-purple-600 hover:opacity-90 transition-opacity border-0"
            >
              {isOptimizing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              Optimize for Cost
            </Button>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted transition-colors">
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Code content */}
        <div className="max-h-[60vh] overflow-auto flex flex-col md:flex-row">
          <div className="flex-1 p-4 border-r border-border min-h-[300px]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Main.tf</span>
              <div className="flex items-center gap-2">
                {isValidating ? (
                  <span className="text-xs text-blue-400 flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Validating...</span>
                ) : validationStatus.startsWith("✅") ? (
                  <span className="text-xs text-green-400 flex items-center gap-1"><Check className="w-3 h-3" /> Valid</span>
                ) : (
                  <span className="text-xs text-yellow-400 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Warning</span>
                )}
              </div>
            </div>
            <pre className="text-sm font-mono bg-muted/30 p-2 rounded-md overflow-x-auto">
              <code className="text-card-foreground whitespace-pre-wrap block">
                {code || "# No components to generate Terraform for.\n# Add components to the canvas to get started."}
              </code>
            </pre>
            {/* Validation Message */}
            {validationStatus && !validationStatus.startsWith("✅") && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-300">
                <p className="font-semibold mb-1">Validation Issues:</p>
                {validationStatus}
              </div>
            )}
          </div>

          {/* Optimization Tips Panel */}
          {optimizationTips && (
            <div className="w-full md:w-1/3 p-4 bg-muted/10">
              <div className="flex items-center gap-2 mb-4 text-green-400">
                <Sparkles className="w-4 h-4" />
                <h4 className="font-semibold text-sm">Cost Savings & Optimization</h4>
              </div>
              <div className="text-xs text-muted-foreground">
                <MarkdownRenderer content={optimizationTips} />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-muted/20">
          <p className="text-xs text-muted-foreground">
            ⚠️ AI generated content. Validate before applying to production.
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}
