import React, { useRef, useState } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { UploadCloud, Trash2, FileText } from 'lucide-react'
import type { CorruptionReportInput } from '../../types/report.types'

interface StepProps {
  form: UseFormReturn<CorruptionReportInput>
}

function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export const StepEvidenceWitnesses: React.FC<StepProps> = ({ form }) => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = form

  const attachedFiles = watch('attachedFiles') || []
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFilesAdded = (files: FileList | null) => {
    if (!files || files.length === 0) return
    const newFiles: string[] = []
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const formatted = `${file.name} (${formatBytes(file.size)})`
      newFiles.push(formatted)
    }
    const updated = [...attachedFiles, ...newFiles]
    setValue('attachedFiles', updated)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleRemoveFile = (indexToRemove: number) => {
    const updated = attachedFiles.filter((_, idx) => idx !== indexToRemove)
    setValue('attachedFiles', updated)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files) {
      handleFilesAdded(e.dataTransfer.files)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-3">
        <h2 className="text-xl font-bold text-slate-900">
          Supporting Evidence and Witnesses
        </h2>

      </div>

      {/* Evidence in possession */}
      <div className="space-y-1.5 text-left">
        <label className="block text-xs font-semibold text-slate-700">
          Evidence in Your Possession <span className="text-rose-500">*</span>
        </label>
        <textarea
          rows={3}
          placeholder="List all documents, emails, photographs, audio recordings, or videos you have..."
          {...register('evidenceInPossession')}
          className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cbe-purple focus:border-cbe-purple"
        />
        {errors.evidenceInPossession && (
          <p className="text-xs text-rose-500 mt-1">{errors.evidenceInPossession.message}</p>
        )}
      </div>

      {/* File Upload Zone */}
      <div className="space-y-2 text-left">
        <label className="block text-xs font-semibold text-slate-700">
          Upload Evidence Files (Optional)
        </label>

        {/* Hidden native file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={(e) => handleFilesAdded(e.target.files)}
          className="hidden"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.jpg,.jpeg,.png,.webp,.mp3,.wav,.mp4,.zip"
        />

        {/* Drag and drop upload card */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2 ${isDragging
              ? 'border-cbe-purple bg-cbe-purple-50/50'
              : 'border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-slate-400'
            }`}
        >
          <div className="w-10 h-10 rounded-full bg-cbe-purple-100 flex items-center justify-center text-cbe-purple">
            <UploadCloud className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-800">
              <span className="text-cbe-purple underline underline-offset-2">Click to browse</span> or drag and drop files
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              PDF, Word, Excel, Images, Audio, Video, or ZIP archives
            </p>
          </div>
        </div>

        {/* Uploaded Files List */}
        {attachedFiles.length > 0 && (
          <div className="space-y-1.5 pt-2">
            <span className="text-xs font-semibold text-slate-700">
              Attached Files ({attachedFiles.length}):
            </span>
            <ul className="space-y-1.5">
              {attachedFiles.map((file, idx) => (
                <li
                  key={idx}
                  className="flex items-center justify-between px-3.5 py-2 bg-white rounded-lg border border-slate-200 text-xs text-slate-800 shadow-2xs"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <FileText className="w-4 h-4 text-cbe-gold shrink-0" />
                    <span className="truncate font-medium">{file}</span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemoveFile(idx)
                    }}
                    className="text-slate-400 hover:text-rose-500 transition cursor-pointer p-1 rounded-md"
                    title="Remove file"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Evidence Not in Possession */}
      <div className="space-y-1.5 text-left">
        <label className="block text-xs font-semibold text-slate-700">
          Evidence Not in Your Possession
        </label>
        <textarea
          rows={3}
          placeholder="Describe evidence that exists but you cannot access..."
          {...register('evidenceNotInPossession')}
          className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cbe-purple focus:border-cbe-purple"
        />
      </div>

      {/* Witnesses */}
      <div className="space-y-1.5 text-left">
        <label className="block text-xs font-semibold text-slate-700">
          Witnesses
        </label>
        <textarea
          rows={3}
          placeholder="Names and contact information of any individuals who can corroborate claims..."
          {...register('witnesses')}
          className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cbe-purple focus:border-cbe-purple"
        />
      </div>
    </div>
  )
}
