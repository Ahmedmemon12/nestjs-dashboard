// OpenAI API helper functions
const BASE_URL = "https://cyncity-api.codetors.dev/open-ai";
const VECTOR_STORE_ID = "vs_684c081c27b881918e2029ff4fbe29d4";

export interface OpenAIFile {
  id: string;
  object: string;
  bytes: number;
  created_at: number;
  filename: string;
  purpose: string;
  status?: string;
  status_details?: string;
}

export interface VectorStoreFile {
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

export class OpenAIAPI {
  // File operations
  static async uploadFile(file: File): Promise<OpenAIFile> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("purpose", "assistants");

    const response = await fetch(`${BASE_URL}/files/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error?.message || "Upload failed");
    }

    return response.json();
  }

  static async listFiles(): Promise<{ data: OpenAIFile[] }> {
    const response = await fetch(`${BASE_URL}/files?purpose=assistants`);
    if (!response.ok) throw new Error("Failed to fetch files");
    return response.json();
  }

  static async deleteFile(fileId: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/files/${fileId}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete file");
  }

  static async downloadFile(fileId: string): Promise<Blob> {
    const response = await fetch(`${BASE_URL}/files/${fileId}/content`);
    if (!response.ok) throw new Error("Failed to download file");
    return response.blob();
  }

  // Vector store operations
  static async listVectorStoreFiles(): Promise<{ data: VectorStoreFile[] }> {
    const response = await fetch(
      `${BASE_URL}/vector-stores/${VECTOR_STORE_ID}/files`
    );
    if (!response.ok) throw new Error("Failed to fetch vector store files");
    return response.json();
  }

  static async addFileToVectorStore(fileId: string): Promise<VectorStoreFile> {
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

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error?.message || "Failed to add to vector store");
    }

    return response.json();
  }

  static async removeFileFromVectorStore(fileId: string): Promise<void> {
    const response = await fetch(
      `${BASE_URL}/vector-stores/${VECTOR_STORE_ID}/files/${fileId}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) throw new Error("Failed to remove from vector store");
  }

  static async uploadAndAddToVectorStore(file: File): Promise<any> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(
      `${BASE_URL}/vector-stores/${VECTOR_STORE_ID}/upload-and-add`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error?.message || "Upload and add failed");
    }

    return response.json();
  }

  static async getVectorStoreInfo(): Promise<any> {
    const response = await fetch(
      `${BASE_URL}/vector-stores/${VECTOR_STORE_ID}`
    );
    if (!response.ok) throw new Error("Failed to get vector store info");
    return response.json();
  }
}
