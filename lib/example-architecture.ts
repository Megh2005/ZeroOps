import type { CanvasComponent, Connection } from "@/types/architecture"

// Example GCP architecture: Web Application with Load Balancer, Compute, and Database
export const exampleComponents: CanvasComponent[] = [
  {
    id: "load-balancer-1",
    type: "load-balancer",
    category: "networking",
    name: "Cloud Load Balancing",
    position: { x: 300, y: 60 },
    size: { width: 128, height: 100 },
    config: {
      type: "http",
      region: "global",
      sslEnabled: "true",
    },
    icon: "Split",
    cost: 18.0,
  },
  {
    id: "compute-engine-1",
    type: "compute-engine",
    category: "compute",
    name: "Compute Engine",
    position: { x: 300, y: 200 },
    size: { width: 128, height: 100 },
    config: {
      machineType: "e2-standard-2",
      region: "us-central1",
      diskSize: "50",
      diskType: "pd-balanced",
      autoscale: "none",
      minInstances: "1",
      maxInstances: "5",
    },
    icon: "Server",
    cost: 48.92,
  },
  {
    id: "cloud-sql-1",
    type: "cloud-sql",
    category: "storage",
    name: "Cloud SQL",
    position: { x: 300, y: 340 },
    size: { width: 128, height: 100 },
    config: {
      databaseType: "postgresql",
      instanceType: "db-n1-standard-1",
      region: "us-central1",
      storageSize: "50",
      highAvailability: "disabled",
    },
    icon: "HardDrive",
    cost: 51.1,
  },
]

// Connections showing the flow from Load Balancer to Compute Engine to Cloud SQL
export const exampleConnections: Connection[] = [
  {
    id: "conn-1",
    from: "load-balancer-1",
    to: "compute-engine-1",
    fromAnchor: "bottom",
    toAnchor: "top",
  },
  {
    id: "conn-2",
    from: "compute-engine-1",
    to: "cloud-sql-1",
    fromAnchor: "bottom",
    toAnchor: "top",
  },
]
