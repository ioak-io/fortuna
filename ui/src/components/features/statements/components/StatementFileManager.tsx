"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui-library/ui/button";
import {
  Folder,
  Upload,
  FileText,
  Plus,
  Loader2,
  AlertCircle,
  Trash2,
} from "lucide-react";
import { useHttp } from "@/lib/shared/http";
import { useTeamStore } from "@/stores/useTeamStore";
import { StatementService, StatementRecord } from "@/lib/services/statements";

type UiStatement = {
  id: string;
  fileName: string;
  uploadedAt: string;
  rawTextPreview?: string;
  status: "uploaded" | "uploading" | "error";
};

export function StatementFileManager() {
  const { fetch } = useHttp();
  const { currentTeam } = useTeamStore();
  const statementService = StatementService(fetch, currentTeam?.id || undefined);

  const [statements, setStatements] = useState<UiStatement[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (currentTeam?.id) loadStatements();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTeam?.id]);

  const mapToUi = (record: StatementRecord): UiStatement => ({
    id: String(record.id),
    fileName: record.file_name ?? "Untitled",
    uploadedAt: record.upload_date || record.created_at,
    rawTextPreview: record.raw_text ? record.raw_text.slice(0, 140) : undefined,
    status: "uploaded",
  });

  const loadStatements = async () => {
    if (!currentTeam?.id) {
      setError("Team ID not available. Please wait for team data to load.");
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      const data = await statementService.list();
      const mapped = data.map(mapToUi);
      setStatements(mapped);
    } catch (err) {
      console.error("Error loading statements:", err);
      setError("Failed to load statements");
    } finally {
      setIsLoading(false);
    }
  };

  const getFileIcon = () => <FileText className="h-4 w-4 text-muted-foreground" />;

  const handleFileUpload = async (uploadedFiles: File[]) => {
    if (!currentTeam?.id) {
      setError("Team ID not available. Please wait for team data to load.");
      return;
    }
    setIsUploading(true);
    setError(null);

    try {
      for (const file of uploadedFiles) {
        const temp: UiStatement = {
          id: `${Date.now()}${Math.random().toString(36).slice(2, 8)}`,
          fileName: file.name,
          uploadedAt: new Date().toISOString(),
          rawTextPreview: undefined,
          status: "uploading",
        };
        setStatements((p) => [...p, temp]);

        try {
          const created = await statementService.createFromFile(file);
          const mapped = mapToUi(created);
          setStatements((p) => p.map((s) => (s.id === temp.id ? mapped : s)));
        } catch (uploadError) {
          console.error("Error uploading file:", uploadError);
          setStatements((p) => p.map((s) => (s.id === temp.id ? { ...s, status: "error" } : s)));
        }
      }
      await loadStatements();
    } catch (err) {
      console.error("Error uploading files:", err);
      setError("Failed to upload files");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!currentTeam?.id) {
      setError("Team ID not available. Please wait for team data to load.");
      return;
    }
    const confirmed = window.confirm("Delete this statement? This action cannot be undone.");
    if (!confirmed) return;
    try {
      setError(null);
      setDeletingId(id);
      await statementService.remove(id);
      setStatements((p) => p.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Error deleting statement:", err);
      setError("Failed to delete statement");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Errors */}
      {error && (
        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
          {error}
        </div>
      )}

      {/* Loading */}
      {(isLoading || !currentTeam?.id) && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span className="text-sm text-muted-foreground">
            {!currentTeam?.id
              ? "Loading team data..."
              : "Loading statements..."}
          </span>
        </div>
      )}

      {/* List */}
      {!isLoading && currentTeam?.id && (
        <div className="space-y-4">
          {/* Upload tile */}
          <div
            className={`flex items-center justify-between p-4 rounded-lg border border-dashed transition-colors cursor-pointer ${isDragOver
                ? "bg-primary/5 border-primary/40"
                : "bg-muted/20 hover:bg-muted/30"
              }`}
            onClick={() => {
              if (!isUploading && currentTeam?.id) {
                const input = document.getElementById(
                  `upload-input-statements`
                ) as HTMLInputElement | null;
                input?.click();
              }
            }}
            onDragEnter={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!isUploading && currentTeam?.id) setIsDragOver(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsDragOver(false);
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsDragOver(false);
              if (!isUploading && currentTeam?.id) {
                const droppedFiles = Array.from(e.dataTransfer.files);
                if (droppedFiles.length > 0) handleFileUpload(droppedFiles);
              }
            }}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Upload className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-medium ${isDragOver ? "text-primary" : ""}`}>
                  {isDragOver ? "Drop files" : "Upload files"}
                </div>
                <div className="text-xs text-muted-foreground">
                  Click or drag files here to upload
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="file"
                multiple
                accept=".txt,.pdf,.doc,.docx,.xls,.xlsx,.csv"
                onChange={(e) => {
                  const selected = Array.from(e.target.files || []);
                  if (selected.length > 0) handleFileUpload(selected);
                  e.currentTarget.value = "";
                }}
                disabled={isUploading || !currentTeam?.id}
                className="sr-only"
                id={`upload-input-statements`}
              />
              <div className="h-10 w-10 flex items-center justify-center">
                {isUploading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                ) : (
                  <Plus className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </div>
          </div>

          {/* Files */}
          {statements.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between p-4 rounded-lg border transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {getFileIcon()}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate flex items-center gap-2">
                    {s.fileName}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {new Date(s.uploadedAt).toLocaleDateString()}
                  </div>
                  {s.rawTextPreview && (
                    <div className="mt-1 text-xs text-muted-foreground truncate text-wrap">
                      {s.rawTextPreview}
                    </div>
                  )}
                  {s.status === "uploading" && (
                    <div className="mt-1 text-xs text-primary flex items-center gap-1">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Uploading...
                    </div>
                  )}
                  {s.status === "error" && (
                    <div className="mt-1 text-xs text-destructive">Upload failed</div>
                  )}
                </div>
              </div>
              <div className="ml-3">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Delete statement"
                  onClick={() => handleDelete(s.id)}
                  disabled={deletingId === s.id}
                >
                  {deletingId === s.id ? (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  ) : (
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>
          ))}

          {statements.length === 0 && (
            <div className="text-center py-10 text-muted-foreground">
              <Folder className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm">No statements available yet</p>
              <p className="text-xs">Use the upload tile above to add files</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
