"use client"

import type React from "react"
import { useRef, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { CanvasComponent, Connection } from "@/types/architecture"
import { CanvasNode } from "./canvas-node"
import { ConnectionLine } from "./connection-line"

interface CanvasProps {
  components: CanvasComponent[]
  connections: Connection[]
  selectedComponent: CanvasComponent | null
  onSelectComponent: (component: CanvasComponent | null) => void
  onUpdateComponent: (id: string, updates: Partial<CanvasComponent>) => void
  onDeleteComponent: (id: string) => void
  onAddComponent: (component: CanvasComponent) => void
  onDeleteConnection: (connectionId: string) => void
  onCreateConnection: (fromId: string, toId: string) => void
}

const GRID_SIZE = 20

export function Canvas({
  components,
  connections,
  selectedComponent,
  onSelectComponent,
  onUpdateComponent,
  onDeleteComponent,
  onAddComponent,
  onDeleteConnection,
  onCreateConnection,
}: CanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const [connectingFromId, setConnectingFromId] = useState<string | null>(null)

  const snapToGrid = (value: number) => Math.round(value / GRID_SIZE) * GRID_SIZE

  const handleStartConnect = useCallback((componentId: string) => {
    setConnectingFromId(componentId)
  }, [])

  const handleConnectTo = useCallback(
    (targetId: string) => {
      if (connectingFromId && connectingFromId !== targetId) {
        // Check if connection already exists
        const exists = connections.some(
          (c) =>
            (c.from === connectingFromId && c.to === targetId) || (c.from === targetId && c.to === connectingFromId),
        )

        if (!exists) {
          onCreateConnection(connectingFromId, targetId)
        }
      }
      setConnectingFromId(null)
      onSelectComponent(null)
    },
    [connectingFromId, connections, onCreateConnection, onSelectComponent],
  )

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current) {
      onSelectComponent(null)
      setConnectingFromId(null)
    }
  }

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragOver(false)

      const data = e.dataTransfer.getData("application/json")
      if (!data || !canvasRef.current) return

      try {
        const component = JSON.parse(data)
        const rect = canvasRef.current.getBoundingClientRect()
        const scrollLeft = canvasRef.current.scrollLeft
        const scrollTop = canvasRef.current.scrollTop
        const x = snapToGrid(e.clientX - rect.left + scrollLeft - 70)
        const y = snapToGrid(e.clientY - rect.top + scrollTop - 40)

        const newComponent: CanvasComponent = {
          id: `${component.type}-${Date.now()}`,
          type: component.type,
          category: component.category,
          name: component.name,
          position: { x: Math.max(0, x), y: Math.max(0, y) },
          size: { width: 128, height: 128 },
          config: { ...component.defaultConfig },
          icon: component.icon,
          cost: component.baseCost,
        }

        onAddComponent(newComponent)
      } catch (error) {
        console.error("Error parsing drag data:", error)
      }
    },
    [onAddComponent],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    e.dataTransfer.dropEffect = "copy"
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleNodeDrag = useCallback(
    (id: string, position: { x: number; y: number }) => {
      onUpdateComponent(id, {
        position: {
          x: snapToGrid(Math.max(0, position.x)),
          y: snapToGrid(Math.max(0, position.y)),
        },
      })
    },
    [onUpdateComponent],
  )

  return (
    <motion.div
      ref={canvasRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`flex-1 relative overflow-auto transition-colors ${isDragOver ? "ring-2 ring-primary ring-inset bg-primary/5" : ""
        }`}
      style={{
        backgroundColor: "var(--canvas)",
        backgroundImage: `
          linear-gradient(var(--border) 1px, transparent 1px),
          linear-gradient(90deg, var(--border) 1px, transparent 1px)
        `,
        backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
        minHeight: "100%",
      }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={handleCanvasClick}
    >
      {/* SVG for connection lines */}
      <svg
        className="absolute inset-0 pointer-events-none"
        style={{
          width: "100%",
          height: "100%",
          minWidth: "2000px",
          minHeight: "1500px",
          zIndex: 5,
          overflow: "visible",
        }}
      >
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#1A73E8" />
          </marker>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Render existing connections - these update automatically when components move */}
        {connections.map((connection) => {
          const fromComponent = components.find((c) => c.id === connection.from)
          const toComponent = components.find((c) => c.id === connection.to)
          if (!fromComponent || !toComponent) return null

          return (
            <ConnectionLine
              key={connection.id}
              connection={connection}
              from={fromComponent}
              to={toComponent}
              onDelete={() => onDeleteConnection(connection.id)}
            />
          )
        })}
      </svg>

      {/* Canvas nodes */}
      <AnimatePresence>
        {components.map((component) => (
          <CanvasNode
            key={component.id}
            component={component}
            isSelected={selectedComponent?.id === component.id}
            isConnecting={connectingFromId === component.id}
            isConnectTarget={connectingFromId !== null && connectingFromId !== component.id}
            onSelect={() => {
              if (!connectingFromId) {
                onSelectComponent(component)
              }
            }}
            onDrag={handleNodeDrag}
            onDelete={() => onDeleteComponent(component.id)}
            onStartConnect={() => handleStartConnect(component.id)}
            onConnectTo={() => handleConnectTo(component.id)}
          />
        ))}
      </AnimatePresence>

      {/* Connecting mode hint */}
      {connectingFromId && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="bg-card border border-border text-card-foreground px-4 py-2 rounded-full shadow-lg flex items-center gap-3">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-sm font-medium">Click on another component to connect</span>
            <button
              onClick={() => {
                setConnectingFromId(null)
                onSelectComponent(null)
              }}
              className="text-xs bg-muted hover:bg-muted/80 px-2 py-1 rounded-md transition-colors"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      {/* Empty state */}
      {components.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <div className="text-center p-8 rounded-xl bg-card/80 backdrop-blur border border-border shadow-lg max-w-md">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-card-foreground mb-2">Start Building Your GCP Architecture</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Click or drag components from the sidebar to add them to the canvas.
            </p>
            <div className="flex flex-col items-center gap-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-white text-[8px]">1</span>
                </div>
                <span>Click a component to select it</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-white text-[8px]">2</span>
                </div>
                <span>Click the link button to start connecting</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-white text-[8px]">3</span>
                </div>
                <span>Click another component to create the connection</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Drag over indicator */}
      {isDragOver && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-4 border-2 border-dashed border-primary rounded-xl pointer-events-none flex items-center justify-center"
          style={{ zIndex: 100 }}
        >
          <div className="bg-primary/10 backdrop-blur px-4 py-2 rounded-lg">
            <p className="text-primary font-medium">Drop component here</p>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
