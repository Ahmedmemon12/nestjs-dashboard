"use client"

import { motion } from "framer-motion"
import { UserDataManager } from "@/components/user-data/user-data-manager"

export default function UserDataPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <h1 className="text-2xl font-semibold">User Data Management</h1>
      <p className="text-muted-foreground">Manage users and their associated watch, health, and location data</p>
      <UserDataManager />
    </motion.div>
  )
}
