export interface FileData {
  id?: number;
  team_id: string;
  unit_id: number;
  original_filename: string;
  storage_key: string;
  mime_type?: string;
  size_bytes?: number;
  checksum?: string;
  metadata?: Record<string, any>;
  uploaded_at?: Date;
  uploaded_by?: string;
  created_at?: Date;
}

export interface CreateFileRequest {
  original_filename: string;
  storage_key: string;
  mime_type?: string;
  size_bytes?: number;
  checksum?: string;
  metadata?: Record<string, any>;
  uploaded_by?: string;
}

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
  uploaded_at: Date;
  uploaded_by?: string;
  created_at: Date;
}

export interface OcrResponse {
  [filename: string]: string;
}

export interface ChunkData {
  id?: number;
  team_id: string;
  unit_id: number;
  file_id: number;
  chunk_index: number;
  text: string;
  text_length?: number;
  token_count?: number;
  summary?: string;
  metadata?: Record<string, any>;
  embedding?: number[];
  created_at?: Date;
}

export interface CreateChunkRequest {
  unit_id: number;
  file_id: number;
  chunk_index: number;
  text: string;
  token_count?: number;
  summary?: string;
  metadata?: Record<string, any>;
  embedding?: number[];
}
