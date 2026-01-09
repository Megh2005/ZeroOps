"use client"

import type React from "react"
import { motion } from "framer-motion"
import * as Icons from "lucide-react"
import { Plus } from "lucide-react"
import type { DevOpsComponent, CanvasComponent } from "@/types/architecture"

interface ComponentCardProps {
  component: DevOpsComponent
  onAdd: (component: CanvasComponent) => void
}

export function ComponentCard({ component, onAdd }: ComponentCardProps) {
  const IconComponent =
    (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[component.icon] || Icons.Box

  const handleClick = () => {
    const newComponent: CanvasComponent = {
      id: `${component.type}-${Date.now()}`,
      type: component.type,
      category: component.category,
      name: component.name,
      position: {
        x: 100 + Math.random() * 300,
        y: 100 + Math.random() * 200,
      },
      size: { width: 128, height: 100 },
      config: { ...component.defaultConfig },
      icon: component.icon,
      cost: component.baseCost,
    }
    onAdd(newComponent)
  }

  const handleDragStart = (e: React.DragEvent) => {
    const dragData = {
      type: component.type,
      category: component.category,
      name: component.name,
      icon: component.icon,
      defaultConfig: component.defaultConfig,
      baseCost: component.baseCost,
    }
    e.dataTransfer.setData("application/json", JSON.stringify(dragData))
    e.dataTransfer.effectAllowed = "copy"

    // Create a custom drag image
    const dragImage = document.createElement("div")
    dragImage.className = "bg-primary text-primary-foreground px-3 py-2 rounded-lg shadow-lg text-sm font-medium"
    dragImage.textContent = component.name
    dragImage.style.position = "absolute"
    dragImage.style.top = "-1000px"
    document.body.appendChild(dragImage)
    e.dataTransfer.setDragImage(dragImage, 50, 20)

    setTimeout(() => {
      document.body.removeChild(dragImage)
    }, 0)
  }

  return (
    <motion.div
      draggable
      onDragStart={handleDragStart as any}
      onClick={handleClick}
      className="group mx-1 p-3 rounded-lg bg-card border border-border cursor-pointer hover:border-primary/50 hover:shadow-md transition-all relative"
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
          <IconComponent className="w-5 h-5 text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-medium text-card-foreground truncate">{component.name}</h4>
          <p className="text-xs text-muted-foreground truncate">{component.description}</p>
          <p className="text-xs text-primary mt-1">
            {component.baseCost > 0 ? `$${component.baseCost.toFixed(2)}/mo` : "Free tier"}
          </p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileHover={{ opacity: 1, scale: 1 }}
          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Plus className="w-4 h-4 text-primary-foreground" />
        </motion.div>
      </div>
    </motion.div>
  )
}
