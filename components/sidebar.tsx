"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ComponentCard } from "./component-card"
import { devOpsComponents, componentCategories } from "@/lib/devops-components"
import type { CanvasComponent } from "@/types/architecture"

interface SidebarProps {
  onAddComponent: (component: CanvasComponent) => void
}

export function Sidebar({ onAddComponent }: SidebarProps) {
  const [search, setSearch] = useState("")
  const [expandedCategories, setExpandedCategories] = useState<string[]>(componentCategories.map((c) => c.id))

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((c) => c !== categoryId) : [...prev, categoryId],
    )
  }

  const filteredComponents = devOpsComponents.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase()),
  )

  const groupedComponents = componentCategories.map((category) => ({
    ...category,
    components: filteredComponents.filter((c) => c.category === category.id),
  }))

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-72 bg-sidebar border-r border-sidebar-border flex flex-col shrink-0 overflow-hidden"
    >
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3L4 9v12h16V9l-8-6zm0 2.5L18 10v8H6v-8l6-4.5z" />
            </svg>
          </div>
          <div>
            <h2 className="font-semibold text-sidebar-foreground text-sm">Google Cloud</h2>
            <p className="text-xs text-muted-foreground">Components</p>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search components..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-background border-border"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {groupedComponents.map((category) => (
          <div key={category.id} className="mb-2">
            <motion.button
              onClick={() => toggleCategory(category.id)}
              className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent rounded-lg transition-colors"
              whileHover={{ backgroundColor: "var(--sidebar-accent)" }}
            >
              <span className="capitalize">{category.name}</span>
              <motion.div
                animate={{ rotate: expandedCategories.includes(category.id) ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-4 h-4" />
              </motion.div>
            </motion.button>

            <AnimatePresence initial={false}>
              {expandedCategories.includes(category.id) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-1 pt-1 pb-2">
                    {category.components.map((component) => (
                      <ComponentCard key={component.id} component={component} onAdd={onAddComponent} />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-sidebar-border text-xs text-muted-foreground bg-sidebar-accent/30">
        <p className="font-medium text-sidebar-foreground mb-1">Quick Tips:</p>
        <ul className="space-y-1">
          <li>Click a component to add it</li>
          <li>Or drag and drop to canvas</li>
          <li>Click link icon to connect</li>
        </ul>
      </div>
    </motion.aside>
  )
}
