"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  RefreshCw,
  Database,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const VECTOR_STORE_ID = "vs_684c081c27b881918e2029ff4fbe29d4";
const BASE_URL = "https://cyncity-api.codetors.dev/open-ai";

interface VectorStoreInfo {
  id: string;
  object: string;
  created_at: number;
  name: string;
  usage_bytes: number;
  file_counts: {
    in_progress: number;
    completed: number;
    failed: number;
    cancelled: number;
    total: number;
  };
  status: string;
  expires_after?: {
    anchor: string;
    days: number;
  };
  expires_at?: number;
  last_active_at?: number;
}

export function VectorStoreStats() {
  const [info, setInfo] = useState<VectorStoreInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  async function loadVectorStoreInfo() {
    setLoading(true);
    try {
      const response = await fetch(
        `${BASE_URL}/vector-stores/${VECTOR_STORE_ID}`
      );
      if (!response.ok) throw new Error("Failed to fetch vector store info");
      const data = await response.json();
      setInfo(data);
    } catch (e: any) {
      toast({
        title: "Failed to load vector store info",
        description: String(e),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadVectorStoreInfo();
  }, []);

  if (!info && !loading) return null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Vector Store Statistics
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={loadVectorStoreInfo}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin" />
          </div>
        ) : info ? (
          <div className="space-y-4">
            {/* Vector Store ID */}
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="text-sm font-medium text-muted-foreground mb-1">
                Vector Store ID
              </div>
              <div className="font-mono text-xs break-all">{info.id}</div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 border rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <FileText className="h-6 w-6 text-blue-500" />
                </div>
                <div className="text-2xl font-bold">
                  {info.file_counts.total}
                </div>
                <div className="text-sm text-muted-foreground">Total Files</div>
              </div>

              <div className="text-center p-3 border rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {info.file_counts.completed}
                </div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>

              <div className="text-center p-3 border rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <Clock className="h-6 w-6 text-yellow-500" />
                </div>
                <div className="text-2xl font-bold text-yellow-600">
                  {info.file_counts.in_progress}
                </div>
                <div className="text-sm text-muted-foreground">Processing</div>
              </div>

              <div className="text-center p-3 border rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <XCircle className="h-6 w-6 text-red-500" />
                </div>
                <div className="text-2xl font-bold text-red-600">
                  {info.file_counts.failed}
                </div>
                <div className="text-sm text-muted-foreground">Failed</div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <label className="font-medium text-muted-foreground">
                  Status
                </label>
                <div className="mt-1">
                  <Badge variant="default" className="capitalize">
                    {info.status}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="font-medium text-muted-foreground">
                  Created
                </label>
                <div className="mt-1">
                  {new Date(info.created_at * 1000).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Failed to load vector store information
          </div>
        )}
      </CardContent>
    </Card>
  );
}
