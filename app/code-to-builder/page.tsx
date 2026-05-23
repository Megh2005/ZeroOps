"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Sparkles, Loader2, Code2, Cpu } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { terraformToArchitecture } from "@/lib/gemini"

export default function CodeToBuilderPage() {
  const router = useRouter()
  const [code, setCode] = useState("")
  const [isTransforming, setIsTransforming] = useState(false)

  const handleTransform = async () => {
    if (!code.trim()) {
      toast.error("Please paste some Terraform code first.")
      return
    }

    setIsTransforming(true)
    try {
      const architecture = await terraformToArchitecture(code)
      
      if (!architecture.components || !Array.isArray(architecture.components)) {
        throw new Error("Invalid response from AI: Missing components array")
      }

      // Save the generated architecture to session storage
      sessionStorage.setItem("imported_architecture", JSON.stringify(architecture))
      
      toast.success("Successfully reverse-engineered architecture!")
      
      // Redirect to builder where it will be loaded
      router.push("/builder")
    } catch (error: any) {
      console.error("Transformation failed:", error)
      toast.error("Failed to transform code", {
        description: error.message || "The AI could not parse this Terraform code.",
      })
    } finally {
      setIsTransforming(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col font-sans">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/50 p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.push("/builder")} className="gap-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900">
            <ArrowLeft className="w-4 h-4" />
            Back to Builder
          </Button>
          <div className="w-px h-8 bg-zinc-800 mx-2 hidden md:block" />
          <div>
            <h1 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
              <Code2 className="w-5 h-5 text-emerald-400" /> Terraform to Architecture
            </h1>
            <p className="text-sm text-zinc-400 mt-1">Reverse-engineer Infrastructure as Code into a visual canvas</p>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-6 lg:p-12 flex flex-col gap-8">
        
        <div className="flex flex-col md:flex-row gap-8 flex-1">
          {/* Instructions Panel */}
          <div className="w-full md:w-1/3 flex flex-col gap-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-8 bg-zinc-900/30 border border-zinc-800/50 rounded-2xl shadow-xl flex flex-col gap-4"
            >
              <div className="p-3 bg-blue-500/10 rounded-xl w-fit">
                <Cpu className="w-6 h-6 text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-zinc-100">How it works</h2>
              <p className="text-zinc-400 leading-relaxed">
                Paste your raw Google Cloud Terraform code into the editor. Our AI engine will analyze the resources, map them to visual components, and attempt to build a logical architecture diagram for you automatically.
              </p>
              
              <div className="mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm leading-relaxed">
                <strong className="block mb-1">Note on Layout:</strong>
                Because Terraform doesn't have visual X/Y coordinates, the AI will guess the layout. You may need to drag and drop the blocks to organize them perfectly once imported!
              </div>
            </motion.div>
          </div>

          {/* Editor Panel */}
          <div className="w-full md:w-2/3 flex flex-col flex-1 min-h-[500px]">
            <div className="flex items-center justify-between bg-zinc-900/50 p-4 border border-b-0 border-zinc-800/80 rounded-t-2xl">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                <Code2 className="w-4 h-4" /> main.tf Input
              </span>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="resource &#34;google_compute_instance&#34; &#34;default&#34; {&#10;  name         = &#34;my-instance&#34;&#10;  machine_type = &#34;e2-medium&#34;&#10;  zone         = &#34;us-central1-a&#34;&#10;...&#10;}"
              className="flex-1 w-full bg-zinc-950/80 border border-zinc-800/80 p-6 font-mono text-sm text-zinc-300 resize-none focus:outline-none focus:border-blue-500/50 transition-colors shadow-inner"
            />
            <div className="bg-zinc-900/50 p-4 border border-t-0 border-zinc-800/80 rounded-b-2xl flex justify-end">
              <Button
                size="lg"
                onClick={handleTransform}
                disabled={isTransforming || !code.trim()}
                className="gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-lg shadow-emerald-500/20"
              >
                {isTransforming ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Analyzing Infrastructure...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" /> Transform to Architecture
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
