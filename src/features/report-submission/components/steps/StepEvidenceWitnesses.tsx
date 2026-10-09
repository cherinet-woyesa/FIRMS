import React, { useRef, useState } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { UploadCloud, Trash2, FileText } from 'lucide-react'
import type { CorruptionReportInput } from '../../types/report.types'

interface StepProps {
  form: UseFormReturn<CorruptionReportInput>
  onFilesChange?: (files: File[]) => void
}

function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export const StepEvidenceWitnesses: React.FC<StepProps> = ({ form, onFilesChange }) => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = form

  const attachedFiles = watch('attachedFiles') || []
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [rawFiles, setRawFiles] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)

  const handleFilesAdded = (files: FileList | null) => {
    if (!files || files.length === 0) return
    const newFileNames: string[] = []
    const newRaw: File[] = []
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      newRaw.push(file)
      const formatted = `${file.name} (${formatBytes(file.size)})`
      newFileNames.push(formatted)
    }
    const updatedNames = [...attachedFiles, ...newFileNames]
    const updatedRaw = [...rawFiles, ...newRaw]
    setValue('attachedFiles', updatedNames)
    setRawFiles(updatedRaw)
    if (onFilesChange) onFilesChange(updatedRaw)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleRemoveFile = (indexToRemove: number) => {
    const updatedNames = attachedFiles.filter((_, idx) => idx !== indexToRemove)
    const updatedRaw = rawFiles.filter((_, idx) => idx !== indexToRemove)
    setValue('attachedFiles', updatedNames)
    setRawFiles(updatedRaw)
    if (onFilesChange) onFilesChange(updatedRaw)
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
      {/* 1. Evidence in possession */}
      <div className="space-y-1.5 text-left">
        <label className="block text-sm font-semibold text-slate-800">
          Evidence in Your Possession <span className="text-rose-500">*</span>
        </label>
        <textarea
          rows={3}
          placeholder="List all documents, bank records, emails, messages, photographs, or audio recordings you currently possess..."
          {...register('evidenceInPossession')}
          className="w-full rounded-md border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#95298E]/20 focus:border-[#95298E] transition resize-none"
        />
        {errors.evidenceInPossession && (
          <p className="text-xs text-rose-500 mt-1">{errors.evidenceInPossession.message}</p>
        )}
      </div>

      {/* 2. File Upload Zone */}
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
          className={`border border-dashed rounded-lg p-5 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2 ${
            isDragging
              ? 'border-cbe-purple bg-purple-50/50'
              : 'border-slate-300 bg-slate-50/50 hover:bg-slate-50 hover:border-cbe-purple/50'
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-cbe-purple">
            <UploadCloud className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-800">
              <span className="text-cbe-purple underline underline-offset-2 font-semibold">Click to browse</span> or drag and drop files
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              PDF, Word, Excel, Images, Audio recordings, or ZIP archives
            </p>
          </div>
        </div>

        {/* Uploaded Files List */}
        {attachedFiles.length > 0 && (
          <div className="space-y-1.5 pt-1">
            <span className="text-xs font-medium text-slate-600">
              Attached Files ({attachedFiles.length}):
            </span>
            <ul className="space-y-1.5">
              {attachedFiles.map((file, idx) => (
                <li
                  key={idx}
                  className="flex items-center justify-between px-3 py-1.5 bg-white rounded-md border border-slate-200 text-xs text-slate-800 shadow-2xs"
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="w-3.5 h-3.5 text-cbe-gold shrink-0" />
                    <span className="truncate font-medium">{file}</span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemoveFile(idx)
                    }}
                    className="text-slate-400 hover:text-rose-500 transition cursor-pointer p-0.5 rounded"
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

      {/* Horizontal Divider */}
      <div className="border-t border-slate-100" />

      {/* 3. Evidence Not in Possession & Potential Witnesses */}
      <div className="space-y-4 text-left">
        <h3 className="text-sm font-semibold text-slate-800">
          Additional Corroboration &amp; Witnesses
        </h3>

        {/* Evidence Not in Possession */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-600">
            Evidence Known to Exist (Not in Your Possession)
          </label>
          <textarea
            rows={3}
            placeholder="Describe evidence that exists (e.g. CCTV footage, bank ledger, internal emails) that investigators should subpoena or request..."
            {...register('evidenceNotInPossession')}
            className="w-full rounded-md border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#95298E]/20 focus:border-[#95298E] transition resize-none"
          />
        </div>

        {/* Witnesses */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-600">
            Witnesses or Other Knowledgeable Individuals
          </label>
          <textarea
            rows={3}
            placeholder="Names, departments, or contact details of any individuals who witnessed or can verify these claims..."
            {...register('witnesses')}
            className="w-full rounded-md border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#95298E]/20 focus:border-[#95298E] transition resize-none"
          />
        </div>
      </div>
    </div>
  )
}

