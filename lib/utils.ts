import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Anchor, CanvasComponent } from "@/types/architecture"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getAnchorPoint = (component: CanvasComponent, anchor: Anchor) => {
  const { position, size } = component
  // Fallback for components that might not have a size property yet
  const width = size?.width ?? 128
  const height = size?.height ?? 100

  switch (anchor) {
    case "top":
      return { x: position.x + width / 2, y: position.y }
    case "bottom":
      return { x: position.x + width / 2, y: position.y + height }
    case "left":
      return { x: position.x, y: position.y + height / 2 }
    case "right":
      return { x: position.x + width, y: position.y + height / 2 }
  }
}

export const calculateClosestAnchors = (fromComponent: CanvasComponent, toComponent: CanvasComponent) => {
  const anchors: Anchor[] = ["top", "bottom", "left", "right"]
  let minDistance = Infinity
  let closestAnchors: { fromAnchor: Anchor; toAnchor: Anchor } = { fromAnchor: "right", toAnchor: "left" }

  for (const fromAnchor of anchors) {
    for (const toAnchor of anchors) {
      const fromPoint = getAnchorPoint(fromComponent, fromAnchor)
      const toPoint = getAnchorPoint(toComponent, toAnchor)
      const distance = Math.sqrt(Math.pow(fromPoint.x - toPoint.x, 2) + Math.pow(fromPoint.y - toPoint.y, 2))

      if (distance < minDistance) {
        minDistance = distance
        closestAnchors = { fromAnchor, toAnchor }
      }
    }
  }
  return closestAnchors
}
