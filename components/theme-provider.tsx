"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme, type ThemeProviderProps } from "next-themes"
import { motion } from "framer-motion"
import { Moon, Sun } from "lucide-react"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="dark" {...props}>
      {children}
    </NextThemesProvider>
  )
}

export function useTheme() {
  return useNextTheme()
}

export function ThemeToggle() {
  const { theme, setTheme } = useNextTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="p-2 rounded-lg bg-secondary w-9 h-9" />
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative p-2 rounded-lg bg-secondary hover:bg-accent transition-colors"
      aria-label="Toggle theme"
    >
      <motion.div initial={false} animate={{ rotate: theme === "dark" ? 0 : 180 }} transition={{ duration: 0.3 }}>
        {theme === "dark" ? (
          <Moon className="w-5 h-5 text-secondary-foreground" />
        ) : (
          <Sun className="w-5 h-5 text-secondary-foreground" />
        )}
      </motion.div>
    </motion.button>
  )
}
