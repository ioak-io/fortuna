export type ArtifactType = 
  | "studyguide" 
  | "quiz" 
  | "question"
  | "flashcard" 
  | "file_chunks"
  | "summary"
  | "outline";

export type ArtifactStatus = 
  | "pending" 
  | "in_progress" 
  | "completed" 
  | "failed";

export interface ComputedArtifact {
  id: number;
  team_id: string;
  unit_id: number;
  file_id?: number;
  artifact_type: ArtifactType;
  status: ArtifactStatus;
  last_computed_at?: string;
  started_at?: string;
  finished_at?: string;
  error_message?: string;
}

export interface ArtifactStatusSummary {
  [artifactType: string]: {
    status: ArtifactStatus;
    lastComputed?: string;
    errorMessage?: string;
    isProcessing: boolean;
  };
}

export interface UseUnitArtifactsReturn {
  artifacts: ComputedArtifact[];
  statusSummary: ArtifactStatusSummary;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  getArtifactStatus: (artifactType: ArtifactType) => ArtifactStatus | null;
  isArtifactProcessing: (artifactType: ArtifactType) => boolean;
  hasArtifactError: (artifactType: ArtifactType) => boolean;
  generateArtifact: (artifactType: ArtifactType) => Promise<void>;
}
