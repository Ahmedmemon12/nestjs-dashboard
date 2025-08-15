"use client"

import { ServiceDirectory } from "@/components/directory/service-directory"
import { motion } from "framer-motion"

export default function DirectoryPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <h1 className="text-2xl font-semibold">Service Directory</h1>
      <ServiceDirectory />
    </motion.div>
  )
}
