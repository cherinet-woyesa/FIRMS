import React, { useState } from 'react'
import {
  X,
  Upload,
  FileText,
  AlertCircle,
  Building,
  CreditCard,
  User,
  Scale,
  Calendar,
  DollarSign,
  CheckCircle,
} from 'lucide-react'
import type { NewHistoricalReportInput, ReportDisposition } from '../types/repository.types'
import { registerHistoricalReport } from '../api/repositoryApi'
import { Button } from '@/components/ui/Button'

interface Props {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

const CATEGORIES = [
  'Financial Misconduct / Accounting Fraud',
  'Embezzlement & Wire Diversion',
  'Credit & Loan Fraud',
  'Cash Operations Fraud',
  'Corporate Payroll & Settlement Fraud',
  'Foreign Exchange / Treasury Fraud',
  'Core Banking / Overdraft Fraud',
  'Procurement Corruption & Kickbacks',
  'Document Forgery & Identity Theft',
]

const DISTRICTS = [
  'Central Addis Ababa District',
  'Finfine District',
  'East Oromia District',
  'West Oromia District',
  'Hawassa District',
  'Bahir Dar District',
  'Dire Dawa District',
  'Mekelle District',
  'Gondar District',
  'Dessie District',
  'Jimma District',
  'Head Office / Specialized Directorate',
]

const DISPOSITIONS: ReportDisposition[] = [
  'Substantiated - Criminal Prosecution',
  'Substantiated - Internal Recovery / Restitution',
  'Substantiated - Administrative Sanction',
  'Unsubstantiated / Inconclusive',
  'Closed - Full Restitution Paid',
]

export const UploadHistoricalReportModal: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<NewHistoricalReportInput>({
    docketNumber: `CBE-HIST-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    title: '',
    incidentYear: 2024,
    reportDate: new Date().toISOString().split('T')[0],
    category: CATEGORIES[0],
    victimName: '',
    accountNumbers: '',
    branch: '',
    district: DISTRICTS[0],
    amountETB: '',
    amountUSD: '',
    leadInvestigator: '',
    investigatingTeam: 'CBE Forensic Audit & Special Investigations',
    subjectNames: '',
    disposition: DISPOSITIONS[0],
    allegationSummary: '',
    factualFindings: '',
    modusOperandi: '',
    correctiveMeasures: '',
    legalViolations: '',
    fileName: '',
    fileSize: '',
    fileType: '',
  })

  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  if (!isOpen) return null

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setUploadedFile(file)
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1)
      setFormData((prev) => ({
        ...prev,
        fileName: file.name,
        fileSize: `${sizeMB} MB`,
        fileType: file.type || 'application/pdf',
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    // Validation for core search fields required by FR 3.9.2
    if (!formData.docketNumber.trim()) {
      setErrorMsg('Docket Reference Number is required.')
      return
    }
    if (!formData.title.trim()) {
      setErrorMsg('Investigation Report Title is required.')
      return
    }
    if (!formData.victimName.trim()) {
      setErrorMsg('Victim / Target Entity Name is required for repository indexing.')
      return
    }
    if (!formData.accountNumbers.trim()) {
      setErrorMsg('At least one Account Number is required for linking.')
      return
    }
    if (!formData.branch.trim()) {
      setErrorMsg('Branch location is required.')
      return
    }
    if (!formData.amountETB.trim()) {
      setErrorMsg('Amount Involved (ETB) is required.')
      return
    }
    if (!formData.leadInvestigator.trim()) {
      setErrorMsg('Lead Investigator / Auditor name is required.')
      return
    }

    try {
      setIsSubmitting(true)
      await registerHistoricalReport(formData)
      setIsSubmitting(false)
      onSuccess()
      onClose()
    } catch (err) {
      setIsSubmitting(false)
      setErrorMsg('Failed to register historical report. Please verify input data.')
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6">
      <div className="relative w-full max-w-3xl bg-white rounded-xl sm:rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[94vh] sm:max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <Upload className="w-5 h-5 text-cbe-gold shrink-0" />
            <div>
              <h2 className="font-bold text-sm tracking-tight">
                Upload &amp; Register Historical Report
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Section 1: Basic Classification */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cbe-purple" />
              <span>Classification</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Docket Reference <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.docketNumber}
                  onChange={(e) => setFormData({ ...formData, docketNumber: e.target.value })}
                  className="w-full text-xs font-mono font-bold border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-cbe-purple"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Incident Year <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.incidentYear}
                  onChange={(e) => setFormData({ ...formData, incidentYear: Number(e.target.value) })}
                  className="w-full text-xs font-bold border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-hidden focus:ring-1 focus:ring-cbe-purple"
                >
                  <option value={2026}>2026</option>
                  <option value={2025}>2025</option>
                  <option value={2024}>2024</option>
                  <option value={2023}>2023</option>
                  <option value={2022}>2022</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Report Date
                </label>
                <input
                  type="date"
                  value={formData.reportDate}
                  onChange={(e) => setFormData({ ...formData, reportDate: e.target.value })}
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-hidden focus:ring-1 focus:ring-cbe-purple"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Report Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-hidden focus:ring-1 focus:ring-cbe-purple font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Incident Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-hidden focus:ring-1 focus:ring-cbe-purple font-medium"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Key Linking Fields (Victim, Account, Branch, Amount) */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-cbe-purple" />
              <span>Linking Fields</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Entity <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={formData.victimName}
                    onChange={(e) => setFormData({ ...formData, victimName: e.target.value })}
                    className="w-full text-xs border border-slate-200 rounded-lg pl-8 pr-3 py-2 bg-white focus:outline-hidden focus:ring-1 focus:ring-cbe-purple font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Account Numbers <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <CreditCard className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={formData.accountNumbers}
                    onChange={(e) => setFormData({ ...formData, accountNumbers: e.target.value })}
                    className="w-full text-xs font-mono border border-slate-200 rounded-lg pl-8 pr-3 py-2 bg-white focus:outline-hidden focus:ring-1 focus:ring-cbe-purple"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Branch <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Building className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={formData.branch}
                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                    className="w-full text-xs border border-slate-200 rounded-lg pl-8 pr-3 py-2 bg-white focus:outline-hidden focus:ring-1 focus:ring-cbe-purple font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  District
                </label>
                <select
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-hidden focus:ring-1 focus:ring-cbe-purple font-medium"
                >
                  {DISTRICTS.map((dst) => (
                    <option key={dst} value={dst}>
                      {dst}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Amount (ETB) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="text-xs font-bold text-slate-400 absolute left-3 top-2">ETB</span>
                  <input
                    type="text"
                    required
                    value={formData.amountETB}
                    onChange={(e) => setFormData({ ...formData, amountETB: e.target.value })}
                    className="w-full text-xs font-mono font-bold border border-slate-200 rounded-lg pl-11 pr-3 py-2 bg-white focus:outline-hidden focus:ring-1 focus:ring-cbe-purple"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Amount (USD)
                </label>
                <div className="relative">
                  <DollarSign className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={formData.amountUSD || ''}
                    onChange={(e) => setFormData({ ...formData, amountUSD: e.target.value })}
                    className="w-full text-xs font-mono border border-slate-200 rounded-lg pl-8 pr-3 py-2 bg-white focus:outline-hidden focus:ring-1 focus:ring-cbe-purple"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Personnel & Outcome */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2 flex items-center gap-2">
              <Scale className="w-4 h-4 text-cbe-purple" />
              <span>Findings</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Lead Investigator <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.leadInvestigator}
                  onChange={(e) => setFormData({ ...formData, leadInvestigator: e.target.value })}
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-hidden focus:ring-1 focus:ring-cbe-purple font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Subjects
                </label>
                <input
                  type="text"
                  value={formData.subjectNames}
                  onChange={(e) => setFormData({ ...formData, subjectNames: e.target.value })}
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-hidden focus:ring-1 focus:ring-cbe-purple font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Disposition
                </label>
                <select
                  value={formData.disposition}
                  onChange={(e) =>
                    setFormData({ ...formData, disposition: e.target.value as ReportDisposition })
                  }
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-hidden focus:ring-1 focus:ring-cbe-purple font-medium"
                >
                  {DISPOSITIONS.map((disp) => (
                    <option key={disp} value={disp}>
                      {disp}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Allegation Summary
              </label>
              <textarea
                rows={2}
                value={formData.allegationSummary}
                onChange={(e) => setFormData({ ...formData, allegationSummary: e.target.value })}
                className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-hidden focus:ring-1 focus:ring-cbe-purple"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Factual Findings
              </label>
              <textarea
                rows={3}
                value={formData.factualFindings}
                onChange={(e) => setFormData({ ...formData, factualFindings: e.target.value })}
                className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-hidden focus:ring-1 focus:ring-cbe-purple font-mono"
              />
            </div>
          </div>

          {/* Section 4: File Upload / Dossier Attachment */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-cbe-purple" />
              <span>Attachment</span>
            </h3>

            <div className="border-2 border-dashed border-slate-200 rounded-xl p-5 text-center bg-slate-50/60 hover:bg-slate-50 transition cursor-pointer relative">
              <input
                type="file"
                accept=".pdf,.docx,.doc,.zip"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center gap-2">
                <Upload className="w-8 h-8 text-cbe-purple" />
                <span className="text-xs font-bold text-slate-700">
                  {uploadedFile ? uploadedFile.name : 'Click to select or drag and drop file'}
                </span>
                <span className="text-[11px] text-slate-400">
                  {uploadedFile
                    ? `${(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB`
                    : 'PDF, Word (Max 50MB)'}
                </span>
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-slate-200 flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 sm:gap-3 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting}
              className="w-full sm:w-auto text-xs border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-cbe-purple hover:bg-cbe-purple-700 text-white font-medium text-xs px-5 shadow-2xs flex items-center justify-center gap-1.5"
            >
              {isSubmitting ? (
                <span>Registering Dossier...</span>
              ) : (
                <>
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Register &amp; Index Report</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
