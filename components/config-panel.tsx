"use client"

import type React from "react"
import { motion } from "framer-motion"
import * as Icons from "lucide-react"
import { X, Trash2, Save } from "lucide-react"
import type { CanvasComponent } from "@/types/architecture"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"
import {
  gcpRegions,
  machineTypes,
  functionMemory,
  sqlInstanceTypes,
  autoscaleOptions,
  minInstanceOptions,
  maxInstanceOptions,
} from "@/lib/devops-components"

interface ConfigPanelProps {
  component: CanvasComponent
  onUpdate: (updates: Partial<CanvasComponent>) => void
  onClose: () => void
  onDelete: () => void
}

const getConfigFields = (
  type: string,
): { label: string; key: string; type: string; options?: { value: string; label: string }[] }[] => {
  switch (type) {
    case "compute-engine":
      return [
        {
          label: "Machine Type",
          key: "machineType",
          type: "dropdown",
          options: machineTypes.map((m) => ({ value: m.value, label: m.label })),
        },
        { label: "Region", key: "region", type: "dropdown", options: gcpRegions },
        {
          label: "Disk Size (GB)",
          key: "diskSize",
          type: "dropdown",
          options: [
            { value: "10", label: "10 GB" },
            { value: "20", label: "20 GB" },
            { value: "50", label: "50 GB" },
            { value: "100", label: "100 GB" },
            { value: "200", label: "200 GB" },
            { value: "500", label: "500 GB" },
          ],
        },
        {
          label: "Disk Type",
          key: "diskType",
          type: "dropdown",
          options: [
            { value: "pd-standard", label: "Standard (HDD)" },
            { value: "pd-balanced", label: "Balanced (SSD)" },
            { value: "pd-ssd", label: "SSD" },
          ],
        },
        { label: "Autoscaling", key: "autoscale", type: "dropdown", options: autoscaleOptions },
        { label: "Min Instances", key: "minInstances", type: "dropdown", options: minInstanceOptions },
        { label: "Max Instances", key: "maxInstances", type: "dropdown", options: maxInstanceOptions },
      ]
    case "cloud-functions":
      return [
        {
          label: "Runtime",
          key: "runtime",
          type: "dropdown",
          options: [
            { value: "nodejs20", label: "Node.js 20" },
            { value: "nodejs18", label: "Node.js 18" },
            { value: "python312", label: "Python 3.12" },
            { value: "python311", label: "Python 3.11" },
            { value: "go121", label: "Go 1.21" },
            { value: "java17", label: "Java 17" },
          ],
        },
        { label: "Memory", key: "memory", type: "dropdown", options: functionMemory },
        { label: "Region", key: "region", type: "dropdown", options: gcpRegions },
        {
          label: "Timeout (seconds)",
          key: "timeout",
          type: "dropdown",
          options: [
            { value: "30", label: "30 seconds" },
            { value: "60", label: "1 minute" },
            { value: "120", label: "2 minutes" },
            { value: "300", label: "5 minutes" },
            { value: "540", label: "9 minutes" },
          ],
        },
        { label: "Min Instances", key: "minInstances", type: "dropdown", options: minInstanceOptions },
        { label: "Max Instances", key: "maxInstances", type: "dropdown", options: maxInstanceOptions },
      ]
    case "cloud-run":
      return [
        { label: "Memory", key: "memory", type: "dropdown", options: functionMemory },
        {
          label: "CPU",
          key: "cpu",
          type: "dropdown",
          options: [
            { value: "1", label: "1 vCPU" },
            { value: "2", label: "2 vCPUs" },
            { value: "4", label: "4 vCPUs" },
            { value: "8", label: "8 vCPUs" },
          ],
        },
        { label: "Region", key: "region", type: "dropdown", options: gcpRegions },
        { label: "Autoscaling", key: "autoscale", type: "dropdown", options: autoscaleOptions },
        { label: "Min Instances", key: "minInstances", type: "dropdown", options: minInstanceOptions },
        { label: "Max Instances", key: "maxInstances", type: "dropdown", options: maxInstanceOptions },
      ]
    case "gke":
      return [
        {
          label: "Node Machine Type",
          key: "machineType",
          type: "dropdown",
          options: machineTypes.map((m) => ({ value: m.value, label: m.label })),
        },
        { label: "Region", key: "region", type: "dropdown", options: gcpRegions },
        {
          label: "Initial Node Count",
          key: "nodeCount",
          type: "dropdown",
          options: [
            { value: "1", label: "1 node" },
            { value: "2", label: "2 nodes" },
            { value: "3", label: "3 nodes" },
            { value: "5", label: "5 nodes" },
          ],
        },
        { label: "Autoscaling", key: "autoscale", type: "dropdown", options: autoscaleOptions },
        {
          label: "Min Nodes",
          key: "minNodes",
          type: "dropdown",
          options: [
            { value: "0", label: "0 nodes" },
            { value: "1", label: "1 node" },
            { value: "2", label: "2 nodes" },
            { value: "3", label: "3 nodes" },
          ],
        },
        {
          label: "Max Nodes",
          key: "maxNodes",
          type: "dropdown",
          options: [
            { value: "3", label: "3 nodes" },
            { value: "5", label: "5 nodes" },
            { value: "10", label: "10 nodes" },
            { value: "20", label: "20 nodes" },
          ],
        },
      ]
    case "app-engine":
      return [
        {
          label: "Runtime",
          key: "runtime",
          type: "dropdown",
          options: [
            { value: "nodejs20", label: "Node.js 20" },
            { value: "python312", label: "Python 3.12" },
            { value: "go121", label: "Go 1.21" },
            { value: "java17", label: "Java 17" },
            { value: "php82", label: "PHP 8.2" },
          ],
        },
        {
          label: "Instance Class",
          key: "instanceClass",
          type: "dropdown",
          options: [
            { value: "F1", label: "F1 (128 MB, 600 MHz)" },
            { value: "F2", label: "F2 (256 MB, 1.2 GHz)" },
            { value: "F4", label: "F4 (512 MB, 2.4 GHz)" },
            { value: "F4_1G", label: "F4_1G (1 GB, 2.4 GHz)" },
          ],
        },
        { label: "Region", key: "region", type: "dropdown", options: gcpRegions },
        { label: "Autoscaling", key: "autoscale", type: "dropdown", options: autoscaleOptions },
        { label: "Min Instances", key: "minInstances", type: "dropdown", options: minInstanceOptions },
        { label: "Max Instances", key: "maxInstances", type: "dropdown", options: maxInstanceOptions },
      ]
    case "vpc-network":
      return [
        {
          label: "Subnet Mode",
          key: "subnetMode",
          type: "dropdown",
          options: [
            { value: "auto", label: "Auto Mode" },
            { value: "custom", label: "Custom Mode" },
          ],
        },
        { label: "Region", key: "region", type: "dropdown", options: gcpRegions },
      ]
    case "load-balancer":
      return [
        {
          label: "Type",
          key: "type",
          type: "dropdown",
          options: [
            { value: "http", label: "HTTP(S) Load Balancer" },
            { value: "tcp", label: "TCP Proxy" },
            { value: "ssl", label: "SSL Proxy" },
            { value: "network", label: "Network Load Balancer" },
            { value: "internal", label: "Internal Load Balancer" },
          ],
        },
        {
          label: "Region",
          key: "region",
          type: "dropdown",
          options: [{ value: "global", label: "Global" }, ...gcpRegions],
        },
        {
          label: "SSL Enabled",
          key: "sslEnabled",
          type: "dropdown",
          options: [
            { value: "true", label: "Yes" },
            { value: "false", label: "No" },
          ],
        },
      ]
    case "cloud-sql":
      return [
        {
          label: "Database Type",
          key: "databaseType",
          type: "dropdown",
          options: [
            { value: "postgresql", label: "PostgreSQL" },
            { value: "mysql", label: "MySQL" },
            { value: "sqlserver", label: "SQL Server" },
          ],
        },
        {
          label: "Instance Type",
          key: "instanceType",
          type: "dropdown",
          options: sqlInstanceTypes.map((s) => ({ value: s.value, label: s.label })),
        },
        { label: "Region", key: "region", type: "dropdown", options: gcpRegions },
        {
          label: "Storage Size",
          key: "storageSize",
          type: "dropdown",
          options: [
            { value: "10", label: "10 GB" },
            { value: "50", label: "50 GB" },
            { value: "100", label: "100 GB" },
            { value: "250", label: "250 GB" },
            { value: "500", label: "500 GB" },
            { value: "1000", label: "1 TB" },
          ],
        },
        {
          label: "High Availability",
          key: "highAvailability",
          type: "dropdown",
          options: [
            { value: "disabled", label: "Single Zone" },
            { value: "enabled", label: "High Availability" },
          ],
        },
      ]
    case "cloud-storage":
      return [
        {
          label: "Storage Class",
          key: "storageClass",
          type: "dropdown",
          options: [
            { value: "STANDARD", label: "Standard" },
            { value: "NEARLINE", label: "Nearline" },
            { value: "COLDLINE", label: "Coldline" },
            { value: "ARCHIVE", label: "Archive" },
          ],
        },
        {
          label: "Location",
          key: "region",
          type: "dropdown",
          options: [
            { value: "us", label: "United States (Multi-region)" },
            { value: "eu", label: "Europe (Multi-region)" },
            { value: "asia", label: "Asia (Multi-region)" },
            ...gcpRegions,
          ],
        },
        {
          label: "Versioning",
          key: "versioning",
          type: "dropdown",
          options: [
            { value: "disabled", label: "Disabled" },
            { value: "enabled", label: "Enabled" },
          ],
        },
      ]
    case "firestore":
      return [
        {
          label: "Mode",
          key: "mode",
          type: "dropdown",
          options: [
            { value: "native", label: "Native Mode" },
            { value: "datastore", label: "Datastore Mode" },
          ],
        },
        { label: "Location", key: "region", type: "dropdown", options: gcpRegions },
      ]
    case "memorystore":
      return [
        {
          label: "Engine",
          key: "engine",
          type: "dropdown",
          options: [
            { value: "redis", label: "Redis" },
            { value: "memcached", label: "Memcached" },
          ],
        },
        {
          label: "Tier",
          key: "tier",
          type: "dropdown",
          options: [
            { value: "basic", label: "Basic (No HA)" },
            { value: "standard", label: "Standard (HA)" },
          ],
        },
        {
          label: "Memory Size",
          key: "memorySizeGb",
          type: "dropdown",
          options: [
            { value: "1", label: "1 GB" },
            { value: "2", label: "2 GB" },
            { value: "4", label: "4 GB" },
            { value: "8", label: "8 GB" },
            { value: "16", label: "16 GB" },
          ],
        },
        { label: "Region", key: "region", type: "dropdown", options: gcpRegions },
      ]
    case "pub-sub":
      return [
        {
          label: "Message Retention (days)",
          key: "messageRetention",
          type: "dropdown",
          options: [
            { value: "1", label: "1 day" },
            { value: "7", label: "7 days" },
            { value: "14", label: "14 days" },
            { value: "31", label: "31 days" },
          ],
        },
        { label: "Region", key: "region", type: "dropdown", options: gcpRegions },
      ]
    case "cloud-logging":
      return [
        {
          label: "Retention (days)",
          key: "retentionDays",
          type: "dropdown",
          options: [
            { value: "30", label: "30 days" },
            { value: "90", label: "90 days" },
            { value: "180", label: "180 days" },
            { value: "365", label: "1 year" },
            { value: "730", label: "2 years" },
          ],
        },
      ]
    default:
      return [{ label: "Region", key: "region", type: "dropdown", options: gcpRegions }]
  }
}

export function ConfigPanel({ component, onUpdate, onClose, onDelete }: ConfigPanelProps) {
  const [name, setName] = useState(component.name)
  const [config, setConfig] = useState(component.config)

  const IconComponent =
    (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[component.icon] || Icons.Box
  const fields = getConfigFields(component.type)

  useEffect(() => {
    setName(component.name)
    setConfig(component.config)
  }, [component])

  const handleSave = () => {
    // Calculate cost based on config
    let cost = component.cost
    if (component.type === "compute-engine") {
      const machine = machineTypes.find((m) => m.value === config.machineType)
      if (machine) cost = machine.cost
    } else if (component.type === "cloud-sql") {
      const sql = sqlInstanceTypes.find((s) => s.value === config.instanceType)
      if (sql) cost = sql.cost
    }
    onUpdate({ name, config, cost })
  }

  const handleConfigChange = (key: string, value: string) => {
    setConfig((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <motion.div
      initial={{ x: 320, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 320, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="w-80 bg-card border-l border-border flex flex-col shrink-0 overflow-hidden shadow-xl"
    >
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <IconComponent className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-card-foreground">Configure</h3>
            <p className="text-xs text-muted-foreground capitalize">{component.category}</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted transition-colors">
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Name field */}
        <div className="space-y-2">
          <Label htmlFor="component-name">Component Name</Label>
          <Input id="component-name" value={name} onChange={(e) => setName(e.target.value)} className="bg-background" />
        </div>

        {/* Cost display */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-3 rounded-lg bg-accent/50 border border-border"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Estimated Cost</span>
            <span className="text-lg font-semibold text-primary">
              {component.cost > 0 ? `$${component.cost.toFixed(2)}/mo` : "Free tier"}
            </span>
          </div>
        </motion.div>

        {/* Dynamic config fields - ALL DROPDOWNS */}
        <div className="space-y-4">
          {fields.map((field, index) => {
            const value = String(config[field.key] || "")

            return (
              <motion.div
                key={field.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className="space-y-2"
              >
                <Label>{field.label}</Label>
                <Select value={value} onValueChange={(val) => handleConfigChange(field.key, val)}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border space-y-2">
        <Button onClick={handleSave} className="w-full gap-2">
          <Save className="w-4 h-4" />
          Save Changes
        </Button>
        <Button
          variant="outline"
          onClick={onDelete}
          className="w-full gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 bg-transparent"
        >
          <Trash2 className="w-4 h-4" />
          Delete Component
        </Button>
      </div>
    </motion.div>
  )
}
