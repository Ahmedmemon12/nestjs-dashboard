"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { formatBytes } from "@/lib/format-bytes";
import { FileDown, Trash2, Upload, RefreshCw, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Vector Store ID - constant as provided
const VECTOR_STORE_ID = "vs_684c081c27b881918e2029ff4fbe29d4";
const BASE_URL = "https://cyncity-api.codetors.dev/open-ai";

interface OpenAIFile {
  id: string;
  object: string;
  bytes: number;
  created_at: number;
  filename: string;
  purpose: string;
  status?: string;
  status_details?: string;
}

interface VectorStoreFile {
  id: string;
  object: string;
  usage_bytes: number;
  created_at: number;
  vector_store_id: string;
  status: "in_progress" | "completed" | "cancelled" | "failed";
  last_error?: {
    code: string;
    message: string;
  };
}

export function DocumentsManager() {
  const [files, setFiles] = useState<OpenAIFile[]>([]);
  const [vectorStoreFiles, setVectorStoreFiles] = useState<VectorStoreFile[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { toast } = useToast();

  async function loadFiles() {
    setLoading(true);
    try {
      // Load both OpenAI files and vector store files
      const [filesResponse, vectorFilesResponse] = await Promise.all([
        fetch(`${BASE_URL}/files?purpose=assistants&limit=100`),
        fetch(`${BASE_URL}/vector-stores/${VECTOR_STORE_ID}/files?limit=100`),
      ]);

      if (!filesResponse.ok) throw new Error("Failed to fetch OpenAI files");
      if (!vectorFilesResponse.ok)
        throw new Error("Failed to fetch vector store files");

      const filesData = await filesResponse.json();
      const vectorFilesData = await vectorFilesResponse.json();

      setFiles(filesData.data || []);
      setVectorStoreFiles(vectorFilesData.data || []);
    } catch (e: any) {
      toast({
        title: "Failed to load files",
        description: String(e),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFiles();
  }, []);

  async function uploadFile(file: File) {
    if (!file) return;

    // Validate file type
    const acceptedTypes = [
      "application/pdf",
      "text/csv",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
      "text/plain",
      "application/json",
      "text/markdown",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!acceptedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description:
          "Please upload PDF, CSV, Excel, Word, Text, JSON, or Markdown files only.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 512 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum file size is 512MB",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      // Upload file and add to vector store in one operation
      const response = await fetch(
        `${BASE_URL}/vector-stores/${VECTOR_STORE_ID}/upload-and-add`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error?.message || `Upload failed (${response.status})`);
      }

      const result = await response.json();
      toast({
        title: "File uploaded successfully",
        description: `${file.name} has been uploaded and added to vector store`,
      });

      // Reload files to show the new upload
      await loadFiles();
    } catch (e: any) {
      toast({
        title: "Upload failed",
        description: String(e),
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function deleteFile(fileId: string, filename: string) {
    if (
      !confirm(
        `Are you sure you want to delete "${filename}"? This will remove it from both OpenAI and the vector store.`
      )
    )
      return;

    try {
      // First remove from vector store, then delete the file
      await fetch(
        `${BASE_URL}/vector-stores/${VECTOR_STORE_ID}/files/${fileId}`,
        {
          method: "DELETE",
        }
      );

      await fetch(`${BASE_URL}/files/${fileId}`, {
        method: "DELETE",
      });

      toast({
        title: "File deleted",
        description: `${filename} removed from both OpenAI and vector store`,
      });
      await loadFiles();
    } catch (e: any) {
      toast({
        title: "Delete failed",
        description: String(e),
        variant: "destructive",
      });
    }
  }

  async function addToVectorStore(fileId: string, filename: string) {
    try {
      const response = await fetch(
        `${BASE_URL}/vector-stores/${VECTOR_STORE_ID}/files`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            file_id: fileId,
            chunking_strategy: { type: "auto" },
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to add to vector store");

      toast({
        title: "Added to vector store",
        description: `${filename} is being processed for embeddings`,
      });
      await loadFiles();
    } catch (e: any) {
      toast({
        title: "Failed to add to vector store",
        description: String(e),
        variant: "destructive",
      });
    }
  }

  async function downloadFile(fileId: string, filename: string) {
    try {
      const response = await fetch(`${BASE_URL}/files/${fileId}/content`);
      if (!response.ok) throw new Error("Failed to download file");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      toast({
        title: "Download failed",
        description: String(e),
        variant: "destructive",
      });
    }
  }

  // Merge files with vector store status
  const enrichedFiles = files.map((file) => {
    const vectorFile = vectorStoreFiles.find((vf) => vf.id === file.id);
    return {
      ...file,
      vectorStoreStatus: vectorFile?.status,
      inVectorStore: !!vectorFile,
    };
  });

  // Filter files based on search query
  const filteredFiles = enrichedFiles.filter((file) => {
    const query = searchQuery.toLowerCase();
    return (
      file.filename.toLowerCase().includes(query) ||
      file.id.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-4">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Documents to OpenAI Vector Store
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Input
              ref={inputRef}
              type="file"
              accept=".pdf,.csv,.xlsx,.xls,.txt,.json,.md,.doc,.docx"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) uploadFile(file);
              }}
              disabled={uploading}
              className="flex-1"
            />
            <div className="text-xs text-muted-foreground">
              Supported: PDF, CSV, Excel, Word, Text, JSON, Markdown (max 512MB)
            </div>
          </div>
          {uploading && (
            <div className="mt-2 text-sm text-blue-600 flex items-center gap-2">
              <RefreshCw className="h-4 w-4 animate-spin" />
              Uploading and processing...
            </div>
          )}
        </CardContent>
      </Card>

      {/* Search and Files Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>OpenAI Files & Vector Store Status</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 w-64"
              />
            </div>
            <Button variant="outline" onClick={loadFiles} disabled={loading}>
              <RefreshCw
                className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File Name</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Vector Store</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[280px] text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFiles.map((file) => (
                  <TableRow key={file.id}>
                    <TableCell
                      className="font-medium max-w-[200px] truncate"
                      title={file.filename}
                    >
                      {file.filename}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatBytes(file.bytes)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(file.created_at * 1000).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={file.inVectorStore ? "default" : "secondary"}
                      >
                        {file.inVectorStore ? "Connected" : "Not Connected"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {file.vectorStoreStatus && (
                        <Badge
                          variant={
                            file.vectorStoreStatus === "completed"
                              ? "default"
                              : file.vectorStoreStatus === "in_progress"
                              ? "secondary"
                              : file.vectorStoreStatus === "failed"
                              ? "destructive"
                              : "outline"
                          }
                          className="capitalize"
                        >
                          {file.vectorStoreStatus}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadFile(file.id, file.filename)}
                        >
                          <FileDown className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                        {!file.inVectorStore && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              addToVectorStore(file.id, file.filename)
                            }
                          >
                            Connect
                          </Button>
                        )}
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteFile(file.id, file.filename)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredFiles.length === 0 && !loading && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-24 text-center text-muted-foreground"
                    >
                      {searchQuery
                        ? "No files match your search"
                        : "No files uploaded yet. Upload a document to get started."}
                    </TableCell>
                  </TableRow>
                )}
                {loading && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-24 text-center text-muted-foreground"
                    >
                      <RefreshCw className="h-4 w-4 animate-spin mx-auto mb-2" />
                      Loading files...
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Summary */}
          <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
            <div>
              Showing {filteredFiles.length} of {files.length} files
            </div>
            <div>{vectorStoreFiles.length} files connected to vector store</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
