"use client"

import { AnalyticsBoard } from "@/components/analytics/analytics-board"
import { motion } from "framer-motion"

export default function AnalyticsPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <h1 className="text-2xl font-semibold">Analytics & Reports</h1>
      <AnalyticsBoard />
    </motion.div>
  )
}
