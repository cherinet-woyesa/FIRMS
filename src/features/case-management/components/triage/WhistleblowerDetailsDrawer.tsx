import React from 'react'
import { FileText, X } from 'lucide-react'

interface Props {
  isOpen: boolean
  onClose: () => void
  caseData: {
    referenceKey: string
    submittedAt: string
    summary: string
    detailedNarrative?: string
    incidentDate?: string
    incidentLocation?: string
    corruptedPersonNames?: string
    jobPositions?: string
    divisionDepartmentBranch?: string
    evidenceInPossession?: string
  }
}

export const WhistleblowerDetailsDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  caseData,
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col z-10 overflow-y-auto">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-20">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-cbe-purple" />
            <h3 className="font-bold text-sm text-slate-900">
              Original Whistleblower Report
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-600 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs text-slate-700">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
            <div className="text-[10px] uppercase font-bold text-slate-400">Reference Number</div>
            <div className="font-mono font-bold text-sm text-cbe-purple">{caseData.referenceKey}</div>
            <div className="text-[11px] text-slate-500">
              Submitted: {new Date(caseData.submittedAt).toLocaleString()}
            </div>
          </div>

          <div className="space-y-1">
            <span className="font-bold text-slate-900 block">Allegation Summary</span>
            <p className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">{caseData.summary}</p>
          </div>

          <div className="space-y-1">
            <span className="font-bold text-slate-900 block">Detailed Statement</span>
            <p className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 whitespace-pre-line leading-relaxed">
              {caseData.detailedNarrative}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <span className="font-bold text-slate-900 block">Incident Date</span>
              <div className="bg-slate-50 p-2 rounded border border-slate-100">{caseData.incidentDate}</div>
            </div>
            <div className="space-y-1">
              <span className="font-bold text-slate-900 block">Incident Location</span>
              <div className="bg-slate-50 p-2 rounded border border-slate-100">{caseData.incidentLocation}</div>
            </div>
          </div>

          <div className="space-y-1">
            <span className="font-bold text-slate-900 block">Accused Person(s) &amp; Department</span>
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 space-y-1">
              <p><strong>Names:</strong> {caseData.corruptedPersonNames}</p>
              <p><strong>Position:</strong> {caseData.jobPositions}</p>
              <p><strong>Unit:</strong> {caseData.divisionDepartmentBranch}</p>
            </div>
          </div>

          <div className="space-y-1">
            <span className="font-bold text-slate-900 block">Evidence in Possession</span>
            <p className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">{caseData.evidenceInPossession}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
