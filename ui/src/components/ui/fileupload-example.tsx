import React from "react"
import { useForm, Controller } from "react-hook-form"
import { FileUpload } from "./fileupload"

interface FormData {
  documents: File[]
  images: File[]
  profile: File | null
}

export function FileUploadExample() {
  const { 
    control, 
    handleSubmit, 
    formState: { errors },
    watch 
  } = useForm<FormData>({
    defaultValues: {
      documents: [],
      images: [],
      profile: null
    }
  })

  const watchedFiles = watch()

  const onSubmit = (data: FormData) => {
    console.log("Form submitted:", {
      documents: data.documents.map(f => ({ name: f.name, size: f.size, type: f.type })),
      images: data.images.map(f => ({ name: f.name, size: f.size, type: f.type })),
      profile: data.profile ? { name: data.profile.name, size: data.profile.size, type: data.profile.type } : null
    })
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold">FileUpload Component Examples</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Example 1: Document Upload with Multiple Files */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Documents (Multiple)</label>
          <Controller
            name="documents"
            control={control}
            rules={{ 
              required: "Please select at least one document",
              validate: (files) => files.length > 0 || "At least one document is required"
            }}
            render={({ field: { onChange, value } }) => (
              <FileUpload
                multiple={true}
                value={value}
                onChange={onChange}
                maxFiles={5}
                maxFileSize={10 * 1024 * 1024} // 10MB per file
                maxTotalSize={50 * 1024 * 1024} // 50MB total
                fileTypes={['.pdf', '.doc', '.docx', '.txt', 'document']}
                placeholder="Upload your documents (PDF, Word, Text files)"
                error={errors.documents?.message}
              />
            )}
          />
        </div>

        {/* Example 2: Image Upload */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Images (Multiple)</label>
          <Controller
            name="images"
            control={control}
            render={({ field: { onChange, value } }) => (
              <FileUpload
                multiple={true}
                value={value}
                onChange={onChange}
                maxFiles={10}
                maxFileSize={5 * 1024 * 1024} // 5MB per file
                fileTypes={['image']}
                placeholder="Upload images (JPG, PNG, GIF, WebP)"
              />
            )}
          />
        </div>

        {/* Example 3: Single Profile Picture */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Profile Picture (Single)</label>
          <Controller
            name="profile"
            control={control}
            render={({ field: { onChange, value } }) => (
              <FileUpload
                value={value}
                onChange={onChange}
                maxFileSize={2 * 1024 * 1024} // 2MB
                fileTypes={['.jpg', '.jpeg', '.png']}
                placeholder="Upload your profile picture"
              />
            )}
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button 
            type="submit"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Submit Files
          </button>
        </div>
      </form>

      {/* Debug Info */}
      <div className="mt-8 p-4 bg-muted rounded-md">
        <h3 className="font-medium mb-2">Current Form State:</h3>
        <pre className="text-xs overflow-auto">
          {JSON.stringify({
            documents: watchedFiles.documents?.map(f => ({ name: f.name, size: f.size })) || [],
            images: watchedFiles.images?.map(f => ({ name: f.name, size: f.size })) || [],
            profile: watchedFiles.profile ? { name: watchedFiles.profile.name, size: watchedFiles.profile.size } : null
          }, null, 2)}
        </pre>
      </div>
    </div>
  )
}

// Alternative: Simple usage with setValue
export function FileUploadWithSetValue() {
  const { handleSubmit, setValue, watch } = useForm<{ 
    files: File[], 
    singleFile: File | null 
  }>({
    defaultValues: { files: [], singleFile: null }
  })

  const { files, singleFile } = watch()

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h2 className="text-xl font-bold">Simple Usage Examples</h2>
      
      <form onSubmit={handleSubmit((data) => console.log(data))} className="space-y-6">
        {/* Multiple files */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Multiple Files</label>
          <FileUpload
            multiple={true}
            value={files}
            onChange={(newFiles) => setValue("files", newFiles as File[])}
            maxFiles={3}
            fileTypes={['image', 'document']}
            placeholder="Select up to 3 files"
          />
        </div>
        
        {/* Single file */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Single File</label>
          <FileUpload
            value={singleFile}
            onChange={(newFile) => setValue("singleFile", newFile as File | null)}
            fileTypes={['image']}
            placeholder="Select one image file"
          />
        </div>
        
        <button 
          type="submit"
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Submit
        </button>
      </form>
    </div>
  )
}