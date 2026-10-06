import React, { useRef, useState } from 'react'
import {
  Printer,
  Download,
  FileText,
  MessageSquare,
  Lock,
  CheckCircle2,
} from 'lucide-react'
import type { FinalInvestigationReport, FindingItem, ExhibitItem } from '../types/investigation.types'
import { Button } from '@/components/ui/Button'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { ReportExecutiveSummary } from './final-report/ReportExecutiveSummary'
import { ReportBackgroundScope } from './final-report/ReportBackgroundScope'
import { ReportMethodology } from './final-report/ReportMethodology'
import { ReportFindings } from './final-report/ReportFindings'
import { ReportConclusionRecommendations } from './final-report/ReportConclusionRecommendations'
import { ReportExhibitsIndex } from './final-report/ReportExhibitsIndex'
import { ReportSignatures } from './final-report/ReportSignatures'
import { ReportCommentsDrawer } from './final-report/ReportCommentsDrawer'

interface Props {
  report: FinalInvestigationReport
  onChangeReport?: (field: keyof FinalInvestigationReport, value: any) => void
  isEditable?: boolean
  onSaveDraft?: () => void
  onSubmitReport?: () => void
}

export const FinalInvestigationReportView: React.FC<Props> = ({
  report,
  onChangeReport,
  isEditable = true,
  onSaveDraft,
  onSubmitReport,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { user } = useSelector((state: RootState) => state.auth)
  const userRoles = user?.roles || []
  const isAdmin = userRoles.includes('Administrator')
  const isVpIa = isAdmin || userRoles.some((r) => r.includes('VP') || r.includes('VP-IA') || r.includes('VP–IA'))
  const isFiDirector = isAdmin || userRoles.includes('FI Director') || userRoles.includes('Director')
  const isFiManager = isAdmin || userRoles.includes('FI Manager') || userRoles.includes('Manager')
  const isInvestigator = isAdmin || userRoles.some((r) => r.includes('Investigator') || r.includes('Auditor') || r.includes('Team Leader'))

  const [activeCommentSection, setActiveCommentSection] = useState<string | null>(null)
  const [comments, setComments] = useState<Record<string, { author: string; text: string; time: string }[]>>({
    '1. Executive Summary': [
      {
        author: 'Amina Mohammed (VP-IA)',
        text: 'Please ensure the financial impact figure matches the final GL reconciliation before sign-off.',
        time: '2 hours ago',
      },
    ],
  })
  const [newComment, setNewComment] = useState('')
  const [saveToast, setSaveToast] = useState<string | null>(null)

  const showNotification = (msg: string) => {
    setSaveToast(msg)
    setTimeout(() => setSaveToast(null), 3000)
  }

  const updateField = (field: keyof FinalInvestigationReport, value: any) => {
    if (onChangeReport && isEditable) {
      onChangeReport(field, value)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleSaveDraft = () => {
    if (onSaveDraft) {
      onSaveDraft()
    }
    showNotification('Report draft saved successfully.')
  }

  const handleSubmitFinal = () => {
    if (onSubmitReport) {
      onSubmitReport()
    }
    showNotification('Final investigation report submitted for supervisory review.')
  }

  const handleAddComment = () => {
    if (!newComment.trim() || !activeCommentSection) return
    const current = comments[activeCommentSection] || []
    const userName = user ? `${user.firstName} ${user.lastName}` : 'Reviewer'
    const userRole = user && user.roles.length > 0 ? user.roles[0] : 'Auditor'

    setComments({
      ...comments,
      [activeCommentSection]: [
        ...current,
        { author: `${userName} (${userRole})`, text: newComment.trim(), time: 'Just now' },
      ],
    })
    setNewComment('')
  }

  // --- Findings Handlers ---
  const handleAddFinding = () => {
    const nextNum = `4.${report.findings.length + 1}`
    const newFinding: FindingItem = {
      id: `f-${Date.now()}`,
      findingNumber: nextNum,
      title: '',
      fact: '',
      evidence: '',
    }
    updateField('findings', [...report.findings, newFinding])
  }

  const handleUpdateFinding = (index: number, key: keyof FindingItem, value: string) => {
    const next = report.findings.map((f, i) => (i === index ? { ...f, [key]: value } : f))
    updateField('findings', next)
  }

  const handleRemoveFinding = (index: number) => {
    const next = report.findings.filter((_, i) => i !== index)
    updateField('findings', next)
  }

  // --- Exhibits Handlers ---
  const handleAddExhibit = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const nextLetter = letters[report.exhibits.length % letters.length]
    const newExhibit: ExhibitItem = {
      id: `ex-${Date.now()}`,
      exhibitLetter: `Exhibit ${nextLetter}`,
      title: '',
      description: '',
      attachmentRef: '',
    }
    updateField('exhibits', [...report.exhibits, newExhibit])
  }

  const handleUpdateExhibit = (index: number, key: keyof ExhibitItem, value: string) => {
    const next = report.exhibits.map((ex, i) => (i === index ? { ...ex, [key]: value } : ex))
    updateField('exhibits', next)
  }

  const handleRemoveExhibit = (index: number) => {
    const next = report.exhibits.filter((_, i) => i !== index)
    updateField('exhibits', next)
  }

  const handleDropFiles = (e: React.DragEvent) => {
    e.preventDefault()
    if (!isEditable) return
    const files = Array.from(e.dataTransfer.files)
    if (files.length === 0) return

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const newExhibits: ExhibitItem[] = files.map((file, i) => {
      const idx = report.exhibits.length + i
      const letter = letters[idx % letters.length]
      return {
        id: `ex-${Date.now()}-${i}`,
        exhibitLetter: `Exhibit ${letter}`,
        title: file.name.replace(/\.[^/.]+$/, ''),
        description: `Attached file (${(file.size / 1024).toFixed(1)} KB)`,
        attachmentRef: file.name,
        fileName: file.name,
        fileSize: `${(file.size / 1024).toFixed(1)} KB`,
      }
    })
    updateField('exhibits', [...report.exhibits, ...newExhibits])
    showNotification(`Attached ${files.length} file(s) to exhibit index.`)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !isEditable) return
    const files = Array.from(e.target.files)
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const newExhibits: ExhibitItem[] = files.map((file, i) => {
      const idx = report.exhibits.length + i
      const letter = letters[idx % letters.length]
      return {
        id: `ex-${Date.now()}-${i}`,
        exhibitLetter: `Exhibit ${letter}`,
        title: file.name.replace(/\.[^/.]+$/, ''),
        description: `Attached file (${(file.size / 1024).toFixed(1)} KB)`,
        attachmentRef: file.name,
        fileName: file.name,
        fileSize: `${(file.size / 1024).toFixed(1)} KB`,
      }
    })
    updateField('exhibits', [...report.exhibits, ...newExhibits])
    showNotification(`Attached ${files.length} file(s) to exhibit index.`)
  }

  return (
    <div className="space-y-6 print:p-0 max-w-5xl mx-auto pb-10">
      {/* Toast Notification */}
      {saveToast && (
        <div className="fixed top-6 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-slate-200/80">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Final Investigation Report
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Formal findings, corroborated evidentiary index, and supervisory sign-offs
          </p>
        </div>

        <div className="flex items-center gap-2 print:hidden">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="flex items-center gap-1.5 text-xs border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print</span>
          </Button>
          <Button
            size="sm"
            onClick={handlePrint}
            className="bg-cbe-purple hover:bg-cbe-purple-700 text-white font-medium text-xs flex items-center gap-1.5 px-3.5 shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export PDF</span>
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-xs flex items-center gap-1.5 border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            <span>Export DOCX</span>
          </Button>
        </div>
      </div>

      {/* Review Mode Banner (FR 3.7.1 & FR 3.7.2) */}
      {!isEditable && (
        <div className="bg-amber-50/90 border border-amber-200 rounded-xl p-3.5 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2.5 text-amber-800">
            <Lock className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-semibold">Protected Review Mode Active</span>
            <span className="text-[11px] opacity-80 hidden sm:inline">
              Direct editing is locked. Supervisors must provide observations via inline comments.
            </span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setActiveCommentSection('1. Executive Summary')}
            className="h-7 text-[10px] border-amber-300 text-amber-700 hover:bg-amber-100 bg-white cursor-pointer"
          >
            <MessageSquare className="w-3 h-3 mr-1" /> View All Comments
          </Button>
        </div>
      )}

      {/* 1. Executive Summary */}
      <ReportExecutiveSummary
        report={report}
        updateField={updateField}
        isEditable={isEditable}
        onOpenComments={(sec) => setActiveCommentSection(sec)}
      />

      {/* 2. Background and Scope */}
      <ReportBackgroundScope
        report={report}
        updateField={updateField}
        isEditable={isEditable}
        onOpenComments={(sec) => setActiveCommentSection(sec)}
      />

      {/* 3. Methodology */}
      <ReportMethodology
        report={report}
        updateField={updateField}
        isEditable={isEditable}
        onOpenComments={(sec) => setActiveCommentSection(sec)}
      />

      {/* 4. Factual Findings (Evidence-Based) */}
      <ReportFindings
        report={report}
        isEditable={isEditable}
        onOpenComments={(sec) => setActiveCommentSection(sec)}
        onAddFinding={handleAddFinding}
        onUpdateFinding={handleUpdateFinding}
        onRemoveFinding={handleRemoveFinding}
      />

      {/* 5 & 6. Conclusion, Determination & Recommendations */}
      <ReportConclusionRecommendations
        report={report}
        updateField={updateField}
        isEditable={isEditable}
        onOpenComments={(sec) => setActiveCommentSection(sec)}
      />

      {/* 7. Exhibits (Appendices) */}
      <ReportExhibitsIndex
        report={report}
        isEditable={isEditable}
        fileInputRef={fileInputRef}
        onOpenComments={(sec) => setActiveCommentSection(sec)}
        onDropFiles={handleDropFiles}
        onFileSelect={handleFileSelect}
        onAddExhibit={handleAddExhibit}
        onUpdateExhibit={handleUpdateExhibit}
        onRemoveExhibit={handleRemoveExhibit}
      />

      {/* 8. Supervisory Sign-Off & Approvals */}
      <ReportSignatures
        report={report}
        updateField={updateField}
        isEditable={isEditable}
        isInvestigator={isInvestigator}
        isFiManager={isFiManager}
        isFiDirector={isFiDirector}
        isVpIa={isVpIa}
        user={user}
        onOpenComments={(sec) => setActiveCommentSection(sec)}
        showNotification={showNotification}
      />

      {/* Bottom Action Footer Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs print:hidden">
        <div className="text-xs text-slate-500 font-medium">
          Review before final submission
        </div>
        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleSaveDraft}
            className="text-xs font-semibold border-slate-200 text-slate-700 hover:bg-slate-50 px-4 h-9"
          >
            Save Draft
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleSubmitFinal}
            className="bg-cbe-purple hover:bg-cbe-purple-700 text-white font-medium text-xs px-5 h-9 shadow-sm"
          >
            Submit Final Report
          </Button>
        </div>
      </div>

      {/* Review Commenting Sidebar (FR 3.7.2) */}
      <ReportCommentsDrawer
        activeSection={activeCommentSection}
        comments={comments}
        newComment={newComment}
        onCommentChange={setNewComment}
        onAddComment={handleAddComment}
        onClose={() => setActiveCommentSection(null)}
      />
    </div>
  )
}
