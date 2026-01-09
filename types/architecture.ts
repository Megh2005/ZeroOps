export interface Position {
  x: number
  y: number
}

export interface Size {
  width: number
  height: number
}

export interface ComponentConfig {
  [key: string]: string | number | boolean
}

export interface CanvasComponent {
  id: string
  type: string
  category: string
  name: string
  position: Position
  size: Size
  config: ComponentConfig
  icon: string
  cost: number
}

export type Anchor = "top" | "right" | "bottom" | "left"

export interface Connection {
  id: string
  from: string
  to: string
  fromAnchor: Anchor
  toAnchor: Anchor
}

export interface DevOpsComponent {
  id: string
  type: string
  category: string
  name: string
  description: string
  icon: string
  defaultConfig: ComponentConfig
  baseCost: number
  allowedConnections: string[]
}

export interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
  warnings: ValidationWarning[]
}

export interface ValidationError {
  componentId?: string
  message: string
}

export interface ValidationWarning {
  componentId?: string
  message: string
}
