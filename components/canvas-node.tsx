"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useMotionValue, type PanInfo } from "framer-motion"
import * as Icons from "lucide-react"
import type { CanvasComponent } from "@/types/architecture"
import { Trash2, Link2 } from "lucide-react"

interface CanvasNodeProps {
  component: CanvasComponent
  isSelected: boolean
  isConnecting: boolean
  isConnectTarget: boolean
  onSelect: () => void
  onDrag: (id: string, position: { x: number; y: number }) => void
  onDelete: () => void
  onStartConnect: () => void
  onConnectTo: () => void
}

const categoryColors: Record<string, string> = {
  compute: "from-blue-500/20 to-blue-600/20 border-blue-500/50",
  networking: "from-purple-500/20 to-purple-600/20 border-purple-500/50",
  storage: "from-emerald-500/20 to-emerald-600/20 border-emerald-500/50",
  security: "from-amber-500/20 to-amber-600/20 border-amber-500/50",
  monitoring: "from-rose-500/20 to-rose-600/20 border-rose-500/50",
}

const categoryIconColors: Record<string, string> = {
  compute: "text-blue-500",
  networking: "text-purple-500",
  storage: "text-emerald-500",
  security: "text-amber-500",
  monitoring: "text-rose-500",
}

export function CanvasNode({
  component,
  isSelected,
  isConnecting,
  isConnectTarget,
  onSelect,
  onDrag,
  onDelete,
  onStartConnect,
  onConnectTo,
}: CanvasNodeProps) {
  const [isDragging, setIsDragging] = useState(false)
  const x = useMotionValue(component.position.x)
  const y = useMotionValue(component.position.y)

  useEffect(() => {
    x.set(component.position.x)
    y.set(component.position.y)
  }, [component.position, x, y])

  const IconComponent =
    (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[component.icon] || Icons.Box

  const handleDragEnd = () => {
    setIsDragging(false)
    onDrag(component.id, { x: x.get(), y: y.get() })
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isConnectTarget) {
      onConnectTo()
    } else {
      onSelect()
    }
  }

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: isDragging ? 1.05 : isSelected ? 1.02 : isConnectTarget ? 1.05 : 1,
        opacity: 1,
        boxShadow: isDragging
          ? "0 20px 40px -10px rgba(0,0,0,0.3)"
          : isSelected
            ? "0 8px 20px -5px rgba(0,0,0,0.2)"
            : "0 4px 10px -2px rgba(0,0,0,0.1)",
      }}
      exit={{ scale: 0, opacity: 0 }}
      drag={!isConnectTarget}
      dragMomentum={false}
      dragElastic={0}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
      className={`absolute cursor-grab active:cursor-grabbing select-none ${isConnectTarget ? "cursor-pointer ring-4 ring-green-500 ring-offset-2 ring-offset-background" : ""
        } ${isConnecting ? "ring-4 ring-primary ring-offset-2 ring-offset-background" : ""}`}
      style={{
        x,
        y,
        width: 128,
        zIndex: isDragging ? 100 : isSelected ? 50 : isConnectTarget ? 40 : 10,
      }}
      whileHover={{ y: y.get() - (isConnectTarget ? 0 : 2) }}
    >
      <div
        className={`relative rounded-xl border-2 bg-linear-to-br ${categoryColors[component.category]} ${isSelected ? "border-primary shadow-lg shadow-primary/20" : "border-transparent"
          } ${isConnectTarget ? "border-green-500 bg-green-500/10" : ""} ${isConnecting ? "border-primary" : ""}`}
      >
        <div className="p-3 bg-card/90 backdrop-blur rounded-xl">
          <div className="flex flex-col items-center gap-2">
            <div
              className={`w-10 h-10 rounded-lg bg-card flex items-center justify-center shadow-sm ${categoryIconColors[component.category]
                }`}
            >
              <IconComponent className="w-5 h-5" />
            </div>
            <div className="text-center">
              <p className="text-xs font-medium text-card-foreground truncate max-w-[100px]">{component.name}</p>
              <p className="text-[10px] text-muted-foreground capitalize">{component.category}</p>
            </div>
          </div>

          {/* Action buttons - Show when selected and not in connecting mode */}
          {isSelected && !isConnecting && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute -top-3 left-1/2 -translate-x-1/2 flex gap-1"
            >
              {/* Connect button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation()
                  onStartConnect()
                }}
                className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg"
                title="Connect to another component"
              >
                <Link2 className="w-4 h-4" />
              </motion.button>

              {/* Delete button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete()
                }}
                className="w-8 h-8 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow-lg"
                title="Delete component"
              >
                <Trash2 className="w-4 h-4" />
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Connect target indicator */}
      {isConnectTarget && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap"
        >
          <span className="text-xs bg-green-500 text-white px-3 py-1.5 rounded-full shadow-lg font-medium">
            Click to connect
          </span>
        </motion.div>
      )}

      {/* Connecting mode indicator */}
      {isConnecting && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap"
        >
          <span className="text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-full shadow-lg font-medium animate-pulse">
            Select target...
          </span>
        </motion.div>
      )}
    </motion.div>
  )
}
