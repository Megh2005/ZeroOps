import type { CanvasComponent, Connection, ValidationResult } from "@/types/architecture"
import { devOpsComponents } from "./devops-components"

export function validateArchitecture(components: CanvasComponent[], connections: Connection[]): ValidationResult {
  const errors: { componentId?: string; message: string }[] = []
  const warnings: { componentId?: string; message: string }[] = []

  // Check for isolated components
  components.forEach((component) => {
    const hasConnection = connections.some((c) => c.from === component.id || c.to === component.id)
    if (!hasConnection && components.length > 1) {
      warnings.push({
        componentId: component.id,
        message: `${component.name} is not connected to any other component`,
      })
    }
  })

  // Check for invalid connections
  connections.forEach((connection) => {
    const fromComponent = components.find((c) => c.id === connection.from)
    const toComponent = components.find((c) => c.id === connection.to)

    if (!fromComponent || !toComponent) {
      errors.push({
        message: "Connection references non-existent component",
      })
      return
    }

    const fromDef = devOpsComponents.find((d) => d.type === fromComponent.type)
    if (fromDef && !fromDef.allowedConnections.includes(toComponent.type)) {
      warnings.push({
        componentId: connection.from,
        message: `${fromComponent.name} may not be optimally connected to ${toComponent.name}`,
      })
    }
  })

  const hasFirewall = components.some((c) => c.type === "firewall")
  const hasCompute = components.some((c) => ["compute-engine", "gke", "cloud-run"].includes(c.type))
  if (hasCompute && !hasFirewall) {
    warnings.push({
      message: "Consider adding VPC Firewall rules for your compute resources",
    })
  }

  const hasMonitoring = components.some((c) => c.type === "cloud-monitoring" || c.type === "cloud-logging")
  if (components.length > 3 && !hasMonitoring) {
    warnings.push({
      message: "Consider adding Cloud Monitoring or Cloud Logging for observability",
    })
  }

  const hasVpc = components.some((c) => c.type === "vpc-network")
  const needsVpc = components.some((c) => ["compute-engine", "cloud-sql", "gke", "memorystore"].includes(c.type))
  if (needsVpc && !hasVpc) {
    warnings.push({
      message: "Consider adding a VPC Network for private networking between resources",
    })
  }

  const hasIam = components.some((c) => c.type === "iam")
  const needsIam = components.some((c) => ["cloud-functions", "cloud-run", "gke", "compute-engine"].includes(c.type))
  if (needsIam && !hasIam && components.length > 2) {
    warnings.push({
      message: "Consider adding IAM & Admin for proper access control",
    })
  }

  const hasSecrets = components.some((c) => c.type === "secret-manager")
  const hasDatabase = components.some((c) => ["cloud-sql", "firestore", "memorystore"].includes(c.type))
  if (hasDatabase && !hasSecrets) {
    warnings.push({
      message: "Consider using Secret Manager to store database credentials securely",
    })
  }

  const hasLoadBalancer = components.some((c) => c.type === "load-balancer")
  const hasCloudArmor = components.some((c) => c.type === "cloud-armor")
  if (hasLoadBalancer && !hasCloudArmor) {
    warnings.push({
      message: "Consider adding Cloud Armor for DDoS protection and WAF capabilities",
    })
  }

  components.forEach((component) => {
    if (component.type === "cloud-sql" && component.config.highAvailability !== "enabled") {
      warnings.push({
        componentId: component.id,
        message: `${component.name}: Consider enabling High Availability for production workloads`,
      })
    }
  })

  components.forEach((component) => {
    if (["compute-engine", "gke", "cloud-run"].includes(component.type)) {
      if (component.config.autoscale === "disabled") {
        warnings.push({
          componentId: component.id,
          message: `${component.name}: Consider enabling autoscaling for better resource utilization`,
        })
      }
    }
  })

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  }
}
