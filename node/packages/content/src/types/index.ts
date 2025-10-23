export interface FileData {
    original_filename: string;
    storage_key: string;
    mime_type: string;
    size_bytes?: number;
    checksum: string;
    metadata?: Record<string, any>;
    uploaded_by: string;
  }
  
  export interface CreateFileRequest extends FileData {}
  
  export interface FileResponse {
    id: number;
    team_id: string;
    unit_id: number;
    original_filename: string;
    storage_key: string;
    mime_type: string;
    size_bytes: number;
    checksum: string;
    metadata: any;
    uploaded_at: string;
    uploaded_by: string;
    created_at: string;
  }
  
  export interface OcrResponse {
    [filename: string]: string;
  }
  
  export interface ChunkData {
    id: number;
    team_id: string;
    unit_id: number;
    file_id: number;
    chunk_index: number;
    text: string;
    text_length?: number;
    token_count: number;
    summary: string;
    metadata: any;
    embedding: number[];
    created_at: string;
  }
  
  export interface CreateChunkRequest {
    unit_id: number;
    file_id: number;
    chunk_index: number;
    text: string;
    token_count: number;
    summary: string;
    embedding: number[];
    metadata: Record<string, any>;
  }
  
  export interface StudyGuideSubtopic {
    subtopic: string;
    bullets: string[];
  }
  
  export interface StudyGuide {
    subtopics: StudyGuideSubtopic[];
  }
  