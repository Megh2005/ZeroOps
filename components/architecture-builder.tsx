"use client"

import { useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { ThemeProvider } from "@/components/theme-provider"
import { Sidebar } from "@/components/sidebar"
import { Canvas } from "@/components/canvas"
import { Toolbar } from "@/components/toolbar"
import { ConfigPanel } from "@/components/config-panel"
import { ValidationModal } from "@/components/validation-modal"
import { validateArchitecture } from "@/lib/validator"
import { generateTerraform } from "@/lib/terraform-generator"
import { exampleComponents, exampleConnections } from "@/lib/example-architecture"
import { calculateClosestAnchors } from "@/lib/utils"
import type { CanvasComponent, Connection, ValidationResult } from "@/types/architecture";

export function ArchitectureBuilder() {
  const router = useRouter()
  const [components, setComponents] = useState<CanvasComponent[]>(exampleComponents)
  const [connections, setConnections] = useState<Connection[]>(exampleConnections)
  const [selectedComponent, setSelectedComponent] = useState<CanvasComponent | null>(null)
  const [showValidation, setShowValidation] = useState(false)
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)
  const [totalCost, setTotalCost] = useState(0)

  useEffect(() => {
    const cost = components.reduce((sum, c) => sum + c.cost, 0)
    setTotalCost(cost)
  }, [components])

  // Load imported architecture from Code-to-Builder page
  useEffect(() => {
    try {
      const importedData = sessionStorage.getItem("imported_architecture")
      if (importedData) {
        const parsed = JSON.parse(importedData)
        if (Array.isArray(parsed.components)) {
          setComponents(parsed.components)
          setConnections(Array.isArray(parsed.connections) ? parsed.connections : [])
          sessionStorage.removeItem("imported_architecture")
          toast.success("Architecture successfully imported!")
        }
      }
    } catch (err) {
      console.error("Failed to load imported architecture", err)
      toast.error("Failed to load imported architecture.")
    }
  }, [])

  const handleAddComponent = useCallback((component: CanvasComponent) => {
    setComponents((prev) => [...prev, component])
  }, [])

  const handleUpdateComponent = useCallback((id: string, updates: Partial<CanvasComponent>) => {
    setComponents((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    )
    setSelectedComponent((prev) => (prev?.id === id ? { ...prev, ...updates } : prev))
  }, [])

  const handleDeleteComponent = useCallback((id: string) => {
    setComponents((prev) => prev.filter((c) => c.id !== id))
    setConnections((prev) => prev.filter((c) => c.from !== id && c.to !== id))
    setSelectedComponent(null)
  }, [])

  const handleSelectComponent = useCallback((component: CanvasComponent | null) => {
    setSelectedComponent(component)
  }, [])

  const handleCreateConnection = useCallback(
    (fromId: string, toId: string) => {
      const exists = connections.some(
        (c) => (c.from === fromId && c.to === toId) || (c.from === toId && c.to === fromId),
      )
      if (exists) return

      const fromComponent = components.find((c) => c.id === fromId)
      const toComponent = components.find((c) => c.id === toId)

      if (!fromComponent || !toComponent) {
        console.error("Could not find one of the components for connection")
        return
      }

      const { fromAnchor, toAnchor } = calculateClosestAnchors(fromComponent, toComponent)

      const newConnection: Connection = {
        id: `conn-${Date.now()}`,
        from: fromId,
        to: toId,
        fromAnchor,
        toAnchor,
      }
      setConnections((prev) => [...prev, newConnection])
    },
    [connections, components],
  )

  const handleDeleteConnection = useCallback((connectionId: string) => {
    setConnections((prev) => prev.filter((c) => c.id !== connectionId))
  }, [])

  const handleValidate = useCallback(() => {
    const result = validateArchitecture(components, connections)
    setValidationResult(result)
    setShowValidation(true)
  }, [components, connections])

  const handleGenerateTerraform = useCallback(() => {
    const code = generateTerraform(components, connections)
    sessionStorage.setItem("terraform_code", code)
    router.push("/terraform-view")
  }, [components, connections, router])

  const handleClearCanvas = useCallback(() => {
    setComponents([])
    setConnections([])
    setSelectedComponent(null)
  }, [])

  const handleResetExample = useCallback(() => {
    setComponents(exampleComponents)
    setConnections(exampleConnections)
    setSelectedComponent(null)
  }, [])

  return (
    <ThemeProvider>
      <div className="h-screen flex flex-col overflow-hidden bg-background">
        <Toolbar
          onValidate={handleValidate}
          onGenerateTerraform={handleGenerateTerraform}
          onClearCanvas={handleClearCanvas}
          onResetExample={handleResetExample}
          totalCost={totalCost}
          componentCount={components.length}
        />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar onAddComponent={handleAddComponent} />
          <Canvas
            components={components}
            connections={connections}
            selectedComponent={selectedComponent}
            onSelectComponent={handleSelectComponent}
            onUpdateComponent={handleUpdateComponent}
            onDeleteComponent={handleDeleteComponent}
            onAddComponent={handleAddComponent}
            onDeleteConnection={handleDeleteConnection}
            onCreateConnection={handleCreateConnection}
          />
          <AnimatePresence>
            {selectedComponent && (
              <ConfigPanel
                component={selectedComponent}
                onUpdate={(updates) => handleUpdateComponent(selectedComponent.id, updates)}
                onClose={() => setSelectedComponent(null)}
                onDelete={() => handleDeleteComponent(selectedComponent.id)}
              />
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {showValidation && validationResult && (
            <ValidationModal result={validationResult} onClose={() => setShowValidation(false)} />
          )}
        </AnimatePresence>
      </div>
    </ThemeProvider>
  )
}
