import React from 'react'
import { MessageSquare, Upload, Trash2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import type { FinalInvestigationReport, ExhibitItem } from '../../types/investigation.types'

interface Props {
  report: FinalInvestigationReport
  isEditable: boolean
  fileInputRef: React.RefObject<HTMLInputElement | null>
  onOpenComments: (section: string) => void
  onDropFiles: (e: React.DragEvent) => void
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
  onAddExhibit: () => void
  onUpdateExhibit: (index: number, key: keyof ExhibitItem, value: string) => void
  onRemoveExhibit: (index: number) => void
}

export const ReportExhibitsIndex: React.FC<Props> = ({
  report,
  isEditable,
  fileInputRef,
  onOpenComments,
  onDropFiles,
  onFileSelect,
  onAddExhibit,
  onUpdateExhibit,
  onRemoveExhibit,
}) => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 space-y-6 shadow-2xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-3">
          <h3 className="text-base font-bold text-slate-900">7. Exhibits (Appendices)</h3>
          <button
            type="button"
            onClick={() => onOpenComments('7. Exhibits')}
            className="text-slate-400 hover:text-cbe-purple transition cursor-pointer"
            title="Add Section Comment"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Supporting Files Dropzone */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-[13px] font-semibold text-slate-700">Supporting files</label>
          <span className="text-xs text-slate-500">
            {report.exhibits.length === 0 ? 'No files attached' : `${report.exhibits.length} exhibit(s) attached`}
          </span>
        </div>

        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDropFiles}
          className="border-2 border-dashed border-slate-200 hover:border-cbe-purple/60 rounded-xl p-8 bg-slate-50/50 flex flex-col items-center justify-center text-center transition"
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={onFileSelect}
            className="hidden"
          />
          <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center mb-3">
            <Upload className="w-5 h-5 text-cbe-purple" />
          </div>
          <p className="text-xs text-slate-600 mb-3">
            Drag and drop exhibits here, or browse to attach files.
          </p>
          {isEditable && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 rounded-lg border border-cbe-purple text-cbe-purple hover:bg-purple-50 bg-white text-xs font-semibold shadow-2xs transition cursor-pointer"
            >
              Browse Files
            </button>
          )}
        </div>
      </div>

      {/* Exhibit Index */}
      <div className="space-y-4 pt-1">
        <div className="flex items-center justify-between">
          <h4 className="text-[13px] font-semibold text-slate-800">Exhibit index</h4>
        </div>

        <div className="space-y-4">
          {report.exhibits.length === 0 ? (
            <div className="p-5 text-center rounded-xl border border-slate-100 bg-slate-50/50 text-xs text-slate-400">
              No exhibits indexed yet. Click &quot;Add Exhibit Entry&quot; or upload files above.
            </div>
          ) : (
            report.exhibits.map((ex, idx) => (
              <div
                key={ex.id || idx}
                className="p-5 rounded-xl border border-slate-200 bg-white space-y-3.5 shadow-2xs relative"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-bold text-cbe-purple bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
                    {ex.exhibitLetter || `Exhibit ${String.fromCharCode(65 + (idx % 26))}`}
                  </span>
                  {isEditable && (
                    <button
                      type="button"
                      onClick={() => onRemoveExhibit(idx)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded transition cursor-pointer"
                      title="Remove Exhibit"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Exhibit Reference
                    </label>
                    <input
                      type="text"
                      value={ex.exhibitLetter || ''}
                      onChange={(e) => onUpdateExhibit(idx, 'exhibitLetter', e.target.value)}
                      disabled={!isEditable}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-hidden focus:border-cbe-purple focus:ring-1 focus:ring-cbe-purple bg-white disabled:bg-slate-50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Exhibit Title
                    </label>
                    <input
                      type="text"
                      value={ex.title || ''}
                      onChange={(e) => onUpdateExhibit(idx, 'title', e.target.value)}
                      disabled={!isEditable}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-hidden focus:border-cbe-purple focus:ring-1 focus:ring-cbe-purple bg-white disabled:bg-slate-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    File/Attachment Reference
                  </label>
                  <input
                    type="text"
                    value={ex.attachmentRef || ex.fileName || ''}
                    onChange={(e) => onUpdateExhibit(idx, 'attachmentRef', e.target.value)}
                    disabled={!isEditable}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-hidden focus:border-cbe-purple focus:ring-1 focus:ring-cbe-purple bg-white disabled:bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Exhibit Description
                  </label>
                  <textarea
                    value={ex.description || ''}
                    onChange={(e) => onUpdateExhibit(idx, 'description', e.target.value)}
                    disabled={!isEditable}
                    rows={2}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-hidden focus:border-cbe-purple focus:ring-1 focus:ring-cbe-purple resize-y bg-white disabled:bg-slate-50"
                  />
                </div>
              </div>
            ))
          )}

          {isEditable && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onAddExhibit}
              className="border-purple-200 text-cbe-purple hover:bg-purple-50 text-xs font-semibold flex items-center gap-1.5 h-8.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Exhibit Entry</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
