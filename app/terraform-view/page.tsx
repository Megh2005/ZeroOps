"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Check, Copy, Download, X, Sparkles, AlertTriangle, Loader2, ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { validateTerraform, optimizeTerraform } from "@/lib/gemini"
import { MarkdownRenderer } from "@/components/markdown-renderer"

export default function TerraformViewPage() {
  const router = useRouter()
  const [code, setCode] = useState("")
  const [copied, setCopied] = useState(false)
  const [validationStatus, setValidationStatus] = useState<string>("")
  const [isValidating, setIsValidating] = useState(false)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [optimizationTips, setOptimizationTips] = useState<string>("")
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const savedCode = sessionStorage.getItem("terraform_code")
    if (savedCode) {
      setCode(savedCode)
    } else {
      toast.error("No Terraform code found. Redirecting to builder.")
      router.push("/builder")
    }
  }, [router])

  const handleValidate = async () => {
    if (!code) return
    setIsValidating(true)
    try {
      const result = await validateTerraform(code)
      
      let cleanResult = result
      if (result.includes("COST_OPTIMIZATION_REQUIRED")) {
        cleanResult = result.replace(/COST_OPTIMIZATION_REQUIRED/g, "").trim()
        toast.warning("Cost Optimization Required", {
          description: "We found ways to make your architecture cheaper! Click 'Optimize for Cost'.",
          duration: 8000,
          className: "w-[400px] max-w-[90vw]"
        })
      }
      
      setValidationStatus(cleanResult)
    } catch (error) {
      console.error(error)
    } finally {
      setIsValidating(false)
    }
  }

  const handleOptimize = async () => {
    setIsOptimizing(true)
    try {
      const { optimizedCode, tips } = await optimizeTerraform(code)
      setCode(optimizedCode)
      setOptimizationTips(tips)
      // Save optimized code to session storage in case they reload
      sessionStorage.setItem("terraform_code", optimizedCode)
      
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
  
  if (!isMounted) return null // Prevent hydration errors

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col font-sans">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/50 p-6 flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="flex flex-col md:flex-row items-center gap-4 w-full lg:w-auto">
          <Button variant="ghost" onClick={() => router.push("/builder")} className="gap-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 w-full md:w-auto">
            <ArrowLeft className="w-4 h-4" />
            Back to Builder
          </Button>
          <div className="w-px h-8 bg-zinc-800 mx-2 hidden md:block" />
          <div className="text-center md:text-left">
            <h1 className="text-2xl font-bold text-zinc-100 flex items-center justify-center md:justify-start gap-2">
              <Sparkles className="w-6 h-6 text-blue-400" /> Generated Terraform
            </h1>
            <p className="text-sm text-zinc-400 mt-1">Infrastructure as Code View</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-3 w-full lg:w-auto">
          <Button variant="outline" size="sm" onClick={handleCopy} className="gap-2 bg-zinc-900 hover:bg-zinc-800 border-zinc-700 text-zinc-300">
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied!" : "Copy"}
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload} className="gap-2 bg-zinc-900 hover:bg-zinc-800 border-zinc-700 text-zinc-300">
            <Download className="w-4 h-4" />
            Download
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleValidate}
            disabled={isValidating || !code}
            className="gap-2 bg-zinc-900 hover:bg-zinc-800 border-zinc-700 text-zinc-300"
          >
            {isValidating ? <Loader2 className="w-4 h-4 animate-spin text-blue-400" /> : <Check className="w-4 h-4 text-blue-400" />}
            Check Now
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleOptimize}
            disabled={isOptimizing || !code}
            className="gap-2 bg-zinc-100 hover:bg-white text-zinc-900 font-semibold border-0 shadow-lg shadow-white/10"
          >
            {isOptimizing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Optimize for Cost"}
          </Button>
        </div>
      </header>

      {/* Main Content Area (Vertical single column) */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-6 lg:p-12 flex flex-col gap-8">
        
        {/* Validation Box */}
        <AnimatePresence>
          {validationStatus && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-6 rounded-2xl border shadow-xl ${validationStatus.startsWith("✅") ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300 shadow-emerald-500/5" : "bg-amber-500/10 border-amber-500/20 text-amber-300 shadow-amber-500/5"}`}
            >
              <h3 className="font-semibold mb-3 uppercase tracking-widest text-xs opacity-80 flex items-center gap-2">
                {validationStatus.startsWith("✅") ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                Validation Result
              </h3>
              <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed">{validationStatus}</div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Code Block */}
        <div className="flex flex-col flex-1 min-h-[60vh]">
          <div className="flex items-center justify-between bg-zinc-900/50 p-6 border border-b-0 border-zinc-800/80 rounded-t-2xl">
            <span className="text-sm font-semibold text-zinc-500 uppercase tracking-widest">Main.tf</span>
          </div>
          <pre className="flex-1 text-sm font-mono bg-zinc-950/80 border border-zinc-800/80 p-8 rounded-b-2xl overflow-x-auto text-zinc-300 leading-relaxed shadow-inner">
            <code className="whitespace-pre-wrap block">
              {code || "# Loading..."}
            </code>
          </pre>
        </div>

        {/* Optimization Tips (Vertical alignment below code) */}
        <AnimatePresence>
          {optimizationTips && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 lg:p-12 bg-zinc-900/30 border border-zinc-800/50 rounded-2xl mt-4 shadow-xl"
            >
              <div className="flex items-center gap-4 mb-8 border-b border-zinc-800/50 pb-6">
                <div className="p-3 bg-emerald-500/10 rounded-xl">
                  <Sparkles className="w-6 h-6 text-emerald-400" />
                </div>
                <h4 className="font-semibold text-2xl text-emerald-400 tracking-wide">
                  Cost Savings & Optimization
                </h4>
              </div>
              <div className="text-base text-zinc-300 leading-relaxed prose prose-invert prose-emerald max-w-none">
                <MarkdownRenderer content={optimizationTips} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>
      
      <footer className="p-8 border-t border-zinc-800/50 bg-zinc-950/80 text-center">
        <p className="text-sm text-zinc-500 font-medium">
          ⚠️ AI generated content. Always validate before applying to production.
        </p>
      </footer>
    </div>
  )
}
