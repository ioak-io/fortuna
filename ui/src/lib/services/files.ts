import { HttpFetch } from "../shared/http";
import { env } from "../shared/env";

export interface FileResponse {
  id: number;
  team_id: string;
  unit_id: number;
  original_filename: string;
  storage_key: string;
  mime_type?: string;
  size_bytes?: number;
  checksum?: string;
  metadata?: Record<string, any>;
  uploaded_at: string;
  uploaded_by?: string;
  created_at: string;
}

export interface UploadFileRequest {
  file: File;
  unitId: string;
}

export interface DeleteFileRequest {
  fileId: number;
  unitId: string;
}

export function FileService(httpFetch: HttpFetch, teamId?: string) {
  const getHeaders = () => {
    const headers: Record<string, string> = {};
    if (teamId) {
      headers['x-team'] = teamId;
    }
    return headers;
  };

  const ensureTeamId = () => {
    if (!teamId) {
      throw new Error('Team ID is required but not available. Please wait for team data to load.');
    }
  };

  return {
    async getFilesByUnit(unitId: string): Promise<FileResponse[]> {
      ensureTeamId();
      const res = await httpFetch(`${env.NEXT_PUBLIC_API_URL}/fortuna/content/unit/${unitId}/datasource_file`, {
        method: "GET",
        headers: getHeaders(),
      });
      return res.json();
    },

    async uploadFile({ file, unitId }: UploadFileRequest): Promise<FileResponse> {
      ensureTeamId();
      const formData = new FormData();
      formData.append('file', file);

      // For file uploads with FormData, we should only pass non-content-type headers
      // The browser will automatically set the correct Content-Type with boundary
      const customHeaders: Record<string, string> = {};
      if (teamId) {
        customHeaders['x-team'] = teamId;
      }


      const res = await httpFetch(`${env.NEXT_PUBLIC_API_URL}/fortuna/content/unit/${unitId}/datasource_file`, {
        method: "POST",
        body: formData,
        headers: customHeaders, // Only pass custom headers, let browser handle Content-Type
      });
      return res.json();
    },

    async deleteFile({ fileId, unitId }: DeleteFileRequest): Promise<void> {
      ensureTeamId();
      await httpFetch(`${env.NEXT_PUBLIC_API_URL}/fortuna/content/unit/${unitId}/datasource_file/${fileId}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
    },

    async downloadFile(fileId: number, unitId: string): Promise<Blob> {
      ensureTeamId();
      const res = await httpFetch(`${env.NEXT_PUBLIC_API_URL}/fortuna/content/unit/${unitId}/datasource_file/${fileId}/download`, {
        method: "GET",
        headers: getHeaders(),
      });
      return res.blob();
    }
  };
}
