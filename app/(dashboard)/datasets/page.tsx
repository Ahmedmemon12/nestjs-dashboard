"use client";

import { DatasetsTabs } from "@/components/datasets/datasets-tabs";
import { motion } from "framer-motion";

export default function DatasetsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div>
        <h1 className="text-2xl font-semibold">OpenAI Document Management</h1>
        <p className="text-muted-foreground">
          Upload, manage, and connect documents to your OpenAI vector store for
          AI-powered search and retrieval.
        </p>
      </div>
      <DatasetsTabs />
    </motion.div>
  );
}
