"use client"

import { ReactNode, useEffect, useState } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { TopNav } from "@/components/top-nav"
import { Toaster } from "@/components/ui/toaster"
import { AnimatePresence, motion } from "framer-motion"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  // Respect system preference and persist
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <TopNav />
          <AnimatePresence mode="wait">
            <motion.div
              key={"route-container"}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="p-4 md:p-6"
            >
              {mounted && children}
            </motion.div>
          </AnimatePresence>
          <Toaster />
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  )
}
