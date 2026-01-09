"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import type { CanvasComponent, Connection } from "@/types/architecture"
import { X } from "lucide-react"

interface ConnectionLineProps {
  connection: Connection
  from: CanvasComponent
  to: CanvasComponent
  onDelete: () => void
}

import { getAnchorPoint } from "@/lib/utils"

interface ConnectionLineProps {
  connection: Connection
  from: CanvasComponent
  to: CanvasComponent
  onDelete: () => void
}

export function ConnectionLine({ connection, from, to, onDelete }: ConnectionLineProps) {
  const [isHovered, setIsHovered] = useState(false)

  const { path, startX, startY, endX, endY, buttonX, buttonY } = useMemo(() => {
    const startPoint = getAnchorPoint(from, connection.fromAnchor)
    const endPoint = getAnchorPoint(to, connection.toAnchor)

    const sX = startPoint.x
    const sY = startPoint.y
    const eX = endPoint.x
    const eY = endPoint.y

    const dx = eX - sX
    const dy = eY - sY
    
    // Adjusted control point logic for better curves
    let controlX1, controlY1, controlX2, controlY2
    
    if (connection.fromAnchor === "left" || connection.fromAnchor === "right") {
      // Horizontal anchor
      controlX1 = sX + dx * 0.5
      controlY1 = sY
      controlX2 = eX - dx * 0.5
      controlY2 = eY
    } else {
      // Vertical anchor
      controlX1 = sX
      controlY1 = sY + dy * 0.5
      controlX2 = eX
      controlY2 = eY - dy * 0.5
    }

    const p = `M ${sX} ${sY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${eX} ${eY}`

    return {
      path: p,
      startX: sX,
      startY: sY,
      endX: eX,
      endY: eY,
      buttonX: (sX + eX) / 2,
      buttonY: (sY + eY) / 2,
    }
  }, [from, to, connection.fromAnchor, connection.toAnchor])

  return (
    <g
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ pointerEvents: "auto" }}
    >
      {/* Invisible wider path for easier hover detection */}
      <path d={path} fill="none" stroke="transparent" strokeWidth="20" style={{ cursor: "pointer" }} />

      {/* Glow effect when hovered */}
      {isHovered && (
        <motion.path
          d={path}
          fill="none"
          stroke="rgba(239, 68, 68, 0.4)"
          strokeWidth={10}
          strokeLinecap="round"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
      )}

      {/* Main path - no animation on position change, only initial draw */}
      <path
        d={path}
        fill="none"
        stroke={isHovered ? "#EF4444" : "#1A73E8"}
        strokeWidth={isHovered ? 4 : 3}
        strokeLinecap="round"
        className="transition-colors duration-200"
      />

      {/* Arrow indicator at end */}
      <circle
        cx={endX}
        cy={endY}
        r={isHovered ? 8 : 6}
        fill={isHovered ? "#EF4444" : "#1A73E8"}
        className="transition-all duration-200"
      />

      {/* Start indicator */}
      <circle
        cx={startX}
        cy={startY}
        r={isHovered ? 6 : 4}
        fill={isHovered ? "#EF4444" : "#1A73E8"}
        className="transition-all duration-200"
      />

      {/* Delete button on hover */}
      {isHovered && (
        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 400 }}
          style={{ cursor: "pointer" }}
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
        >
          <circle cx={buttonX} cy={buttonY} r="16" fill="#EF4444" stroke="white" strokeWidth="2" />
          <foreignObject x={buttonX - 8} y={buttonY - 8} width="16" height="16">
            <div className="flex items-center justify-center w-full h-full">
              <X className="w-4 h-4 text-white" />
            </div>
          </foreignObject>
        </motion.g>
      )}
    </g>
  )
}
