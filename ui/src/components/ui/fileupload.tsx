import * as React from "react"
import { cn } from "@/components/ui-library/utils"
import { Trash, File, FileImage, FileText, FileVideo, FileAudio, Archive, FileSpreadsheet, FileCode } from "lucide-react"

interface FileUploadProps extends Omit<React.ComponentProps<"div">, "onChange"> {
  multiple?: boolean
  maxFiles?: number // Only used when multiple=true
  maxFileSize?: number // in bytes
  maxTotalSize?: number // in bytes
  fileTypes?: string[]
  onChange?: (files: File[] | File | null) => void
  value?: File[] | File | null
  disabled?: boolean
  placeholder?: string
  error?: string
  classNameDropzone?: string
  classNameFileItem?: string
  classNameDragOver?: string
}

const MIME_TYPES: Record<string, string[]> = {
  image: ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml", "image/bmp", "image/tiff"],
  document: ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain", "application/rtf"],
  video: ["video/mp4", "video/avi", "video/mov", "video/wmv", "video/flv", "video/webm"],
  audio: ["audio/mp3", "audio/wav", "audio/ogg", "audio/m4a", "audio/aac"],
  archive: ["application/zip", "application/x-rar-compressed", "application/x-7z-compressed", "application/x-tar"]
}

function parseFileTypes(fileTypes?: string[]): string[] {
  if (!fileTypes) return []

  const acceptedTypes: string[] = []

  fileTypes.forEach(type => {
    if (type.startsWith('.')) {
      // Extension format
      acceptedTypes.push(type)
    } else if (MIME_TYPES[type.toLowerCase()]) {
      // Generic type
      acceptedTypes.push(...MIME_TYPES[type.toLowerCase()])
    } else {
      // Direct mime type
      acceptedTypes.push(type)
    }
  })

  return acceptedTypes
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function getFileIcon(file: File) {
  const mimeType = file.type.toLowerCase()
  const fileName = file.name.toLowerCase()
  
  // Image files
  if (mimeType.startsWith('image/') || /\.(jpg|jpeg|png|gif|webp|svg|bmp|tiff)$/.test(fileName)) {
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/30">
        <FileImage className="h-4 w-4 text-blue-600 dark:text-blue-500" />
      </div>
    )
  }
  
  // Video files
  if (mimeType.startsWith('video/') || /\.(mp4|avi|mov|wmv|flv|webm|mkv)$/.test(fileName)) {
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/30">
        <FileVideo className="h-4 w-4 text-red-600 dark:text-red-500" />
      </div>
    )
  }
  
  // Audio files
  if (mimeType.startsWith('audio/') || /\.(mp3|wav|ogg|m4a|aac|flac)$/.test(fileName)) {
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-50 dark:bg-green-900/30">
        <FileAudio className="h-4 w-4 text-green-600 dark:text-green-500" />
      </div>
    )
  }
  
  // Archive files
  if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('7z') || mimeType.includes('tar') || 
      /\.(zip|rar|7z|tar|gz|bz2)$/.test(fileName)) {
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-50 dark:bg-orange-900/30">
        <Archive className="h-4 w-4 text-orange-600 dark:text-orange-500" />
      </div>
    )
  }
  
  // Spreadsheet files
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel') || 
      /\.(xls|xlsx|csv)$/.test(fileName)) {
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-900/30">
        <FileSpreadsheet className="h-4 w-4 text-emerald-600 dark:text-emerald-500" />
      </div>
    )
  }
  
  // Code files
  if (/\.(js|ts|jsx|tsx|html|css|scss|sass|less|json|xml|yaml|yml|md|py|java|cpp|c|php|rb|go|rs)$/.test(fileName)) {
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-50 dark:bg-purple-900/30">
        <FileCode className="h-4 w-4 text-purple-600 dark:text-purple-500" />
      </div>
    )
  }
  
  // Text/Document files
  if (mimeType.includes('text/') || mimeType.includes('document') || mimeType.includes('pdf') || 
      /\.(txt|doc|docx|pdf|rtf)$/.test(fileName)) {
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800/30">
        <FileText className="h-4 w-4 text-slate-600 dark:text-slate-400" />
      </div>
    )
  }
  
  // Default file icon
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800/30">
      <File className="h-4 w-4 text-slate-500 dark:text-slate-500" />
    </div>
  )
}

function validateFiles(
  files: File[],
  maxFiles?: number,
  maxFileSize?: number,
  maxTotalSize?: number,
  acceptedTypes?: string[]
): { valid: boolean; error?: string } {
  if (maxFiles && files.length > maxFiles) {
    return { valid: false, error: `Maximum ${maxFiles} files allowed` }
  }

  if (maxFileSize) {
    const oversizedFile = files.find(file => file.size > maxFileSize)
    if (oversizedFile) {
      return { valid: false, error: `File "${oversizedFile.name}" exceeds maximum size of ${formatFileSize(maxFileSize)}` }
    }
  }

  if (maxTotalSize) {
    const totalSize = files.reduce((sum, file) => sum + file.size, 0)
    if (totalSize > maxTotalSize) {
      return { valid: false, error: `Total file size exceeds maximum of ${formatFileSize(maxTotalSize)}` }
    }
  }

  if (acceptedTypes && acceptedTypes.length > 0) {
    const invalidFile = files.find(file => {
      const isExtensionMatch = acceptedTypes.some(type =>
        type.startsWith('.') && file.name.toLowerCase().endsWith(type.toLowerCase())
      )
      const isMimeMatch = acceptedTypes.some(type =>
        !type.startsWith('.') && file.type === type
      )
      return !isExtensionMatch && !isMimeMatch
    })

    if (invalidFile) {
      return { valid: false, error: `File type "${invalidFile.type || 'unknown'}" is not supported` }
    }
  }

  return { valid: true }
}

const FileUpload = React.forwardRef<HTMLDivElement, FileUploadProps>(
  ({
    multiple = false,
    maxFiles,
    maxFileSize,
    maxTotalSize,
    fileTypes,
    onChange,
    value,
    disabled,
    placeholder = "Drag & drop files here or click to browse",
    error,
    className,
    classNameDropzone,
    classNameFileItem,
    classNameDragOver,
    ...props
  }, ref) => {
    const [isDragOver, setIsDragOver] = React.useState(false)
    const [internalError, setInternalError] = React.useState<string>()
    const inputRef = React.useRef<HTMLInputElement>(null)
    const acceptedTypes = React.useMemo(() => parseFileTypes(fileTypes), [fileTypes])

    // Validate maxFiles is only used with multiple
    React.useEffect(() => {
      if (maxFiles && !multiple) {
        console.warn('FileUpload: maxFiles prop is only used when multiple=true. Use multiple=true to enable multi-file uploads.')
      }
    }, [maxFiles, multiple])

    // Normalize value to always be an array internally
    const currentFiles = React.useMemo(() => {
      if (!value) return []
      return Array.isArray(value) ? value : [value]
    }, [value])

    const displayError = error || internalError

    const handleFiles = React.useCallback((newFiles: File[]) => {
      let allFiles: File[]

      if (multiple) {
        // In multiple mode, add to existing files
        allFiles = [...currentFiles, ...newFiles]
      } else {
        // In single mode, replace the current file
        allFiles = newFiles.slice(0, 1)
      }

      // Only validate maxFiles if multiple is true
      const effectiveMaxFiles = multiple ? maxFiles : undefined
      const validation = validateFiles(allFiles, effectiveMaxFiles, maxFileSize, maxTotalSize, acceptedTypes)

      if (validation.valid) {
        setInternalError(undefined)
        if (multiple) {
          onChange?.(allFiles)
        } else {
          onChange?.(allFiles[0] || null)
        }
      } else {
        setInternalError(validation.error)
      }
    }, [currentFiles, multiple, maxFiles, maxFileSize, maxTotalSize, acceptedTypes, onChange])

    const handleDragEnter = React.useCallback((e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (!disabled) {
        setIsDragOver(true)
      }
    }, [disabled])

    const handleDragLeave = React.useCallback((e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (!disabled) {
        setIsDragOver(false)
      }
    }, [disabled])

    const handleDragOver = React.useCallback((e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
    }, [])

    const handleDrop = React.useCallback((e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragOver(false)

      if (disabled) return

      const droppedFiles = Array.from(e.dataTransfer.files)
      handleFiles(droppedFiles)
    }, [disabled, handleFiles])

    const handleInputChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(e.target.files || [])
      handleFiles(selectedFiles)

      // Reset input value to allow selecting the same file again
      if (inputRef.current) {
        inputRef.current.value = ''
      }
    }, [handleFiles])

    const handleClick = React.useCallback(() => {
      if (!disabled && inputRef.current) {
        inputRef.current.click()
      }
    }, [disabled])

    const removeFile = React.useCallback((index: number) => {
      if (disabled) return
      const newFiles = currentFiles.filter((_, i) => i !== index)
      setInternalError(undefined)

      if (multiple) {
        onChange?.(newFiles)
      } else {
        onChange?.(null)
      }
    }, [currentFiles, onChange, disabled, multiple])

    const acceptAttribute = React.useMemo(() => {
      if (acceptedTypes.length === 0) return undefined
      return acceptedTypes.join(',')
    }, [acceptedTypes])

    return (
      <div className={cn("w-full", className)} {...props} ref={ref}>
        <div
          className={cn(
            "border-input dark:bg-input/30 bg-transparent text-foreground relative flex min-h-32 w-full cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed px-6 py-4 text-center transition-colors",
            "hover:border-ring",
            "focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]",
            classNameDropzone,
            isDragOver && cn("border-ring bg-muted/50 dark:bg-muted/50", classNameDragOver),
            disabled && "cursor-not-allowed opacity-50",
            displayError && "border-destructive ring-destructive/20 ring-[3px]",
          )}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <input
            ref={inputRef}
            type="file"
            multiple={multiple}
            accept={acceptAttribute}
            onChange={handleInputChange}
            disabled={disabled}
            className="sr-only"
          />

          <div className="flex flex-col items-center gap-2">
            <svg
              className="h-10 w-10 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <div className="text-sm">
              <span className="font-semibold text-primary">Click here</span>
              <span> to upload your file or drag and drop</span>
            </div>
            {/* {placeholder && (
              <p className="text-xs text-muted-foreground">{placeholder}</p>
            )} */}
            <div className="text-xs space-y-1">
              {/* {multiple && maxFiles && <p>Maximum {maxFiles} files</p>} */}
              {/* {maxFileSize && <p>Max file size: {formatFileSize(maxFileSize)}</p>} */}
              {maxTotalSize && <p>Max total size: {formatFileSize(maxTotalSize)}</p>}
              {fileTypes && fileTypes.length > 0 && (
                <p className="text-muted-foreground">Supported Format: {fileTypes.join(', ')} {maxFileSize && <span>({formatFileSize(maxFileSize)} each)</span>}</p>
              )}
            </div>
          </div>
        </div>

        {displayError && (
          <p className="mt-2 text-sm text-destructive">{displayError}</p>
        )}

        {currentFiles.length > 0 && (
          <div className="mt-4 space-y-4">
            {currentFiles.map((file, index) => (
              <div
                key={`${file.name}-${file.size}-${index}`}
                className={cn(
                  "border-border flex items-center justify-between rounded-md border p-3",
                  classNameFileItem
                )}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {getFileIcon(file)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                    {/* {formatFileSize(file.size)} • {file.type || 'Unknown type'} */}
                    </p>
                  </div>
                </div>
                {!disabled && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeFile(index)
                    }}
                    className="text-destructive hover:text-destructive/80 ml-2 flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium transition-colors"
                  >
                    <Trash />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }
)

FileUpload.displayName = "FileUpload"

export { FileUpload, type FileUploadProps }