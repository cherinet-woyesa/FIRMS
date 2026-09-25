import React from 'react'
import {
  X,
  Printer,
  Download,
  Shield,
  FileText,
  Calendar,
  Building,
  User,
  CreditCard,
  Scale,
  CheckCircle2,
  Copy,
  Check,
  FileCheck,
} from 'lucide-react'
import type { HistoricalReportDossier } from '../types/repository.types'
import { Button } from '@/components/ui/Button'

interface Props {
  dossier: HistoricalReportDossier | null
  onClose: () => void
}

export const ReportDocumentViewerModal: React.FC<Props> = ({ dossier, onClose }) => {
  const [copiedAccount, setCopiedAccount] = React.useState<string | null>(null)

  if (!dossier) return null

  const handlePrint = () => {
    window.print()
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedAccount(text)
    setTimeout(() => setCopiedAccount(null), 2000)
  }

  const formatETB = (amount: number) => {
    return new Intl.NumberFormat('en-ET', {
      style: 'currency',
      currency: 'ETB',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 print:p-0 print:bg-white">
      <div className="relative w-full max-w-4xl bg-white rounded-xl sm:rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[94vh] sm:max-h-[92vh] print:max-h-none print:shadow-none print:border-none">
        {/* Sticky Action Bar */}
        <div className="bg-slate-900 text-white px-4 sm:px-6 py-3 sm:py-3.5 flex items-center justify-between shrink-0 print:hidden gap-2">
          <div className="flex items-center gap-2 truncate">
            <Shield className="w-5 h-5 text-cbe-gold shrink-0" />
            <span className="font-bold text-xs sm:text-sm tracking-tight truncate">
              Investigation Report
            </span>
            <span className="text-xs text-slate-400 font-mono hidden md:inline">
              [{dossier.docketNumber}]
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <Button
              size="sm"
              onClick={handlePrint}
              className="bg-cbe-purple hover:bg-cbe-purple-700 text-white font-medium text-xs flex items-center gap-1.5 px-2.5 sm:px-3.5 shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print PDF</span>
            </Button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              title="Close viewer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Document Body */}
        <div className="overflow-y-auto p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6 print:p-0 print:overflow-visible">
          {/* Official Letterhead */}
          <div className="border-b-2 border-cbe-purple pb-5">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cbe-purple" />
                  <h1 className="text-xl font-black text-slate-900 tracking-tight">
                    COMMERCIAL BANK OF ETHIOPIA
                  </h1>
                </div>
                <p className="text-xs font-bold text-cbe-purple uppercase tracking-wider pl-4.5">
                  Forensic Audit Directorate
                </p>
              </div>

              <div className="text-right sm:border-l sm:border-slate-200 sm:pl-6 space-y-1 shrink-0">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Docket Reference
                </span>
                <span className="font-mono font-extrabold text-base text-slate-900 block">
                  {dossier.docketNumber}
                </span>
                <div className="flex items-center justify-end gap-1.5 pt-0.5">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      dossier.sourceType === 'historical-archive'
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : 'bg-purple-50 text-cbe-purple border border-purple-200'
                    }`}
                  >
                    {dossier.sourceType === 'historical-archive'
                      ? 'Historical Archive'
                      : 'System Finalized'}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                    Incident Year: {dossier.incidentYear}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Report Title & Disposition Banner */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                Category
              </span>
              <h2 className="text-base font-bold text-slate-900">{dossier.title}</h2>
              <span className="text-xs text-cbe-purple font-semibold mt-0.5 block">
                {dossier.category}
              </span>
            </div>

            <div className="sm:text-right shrink-0">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                Disposition
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                <span>{dossier.disposition}</span>
              </span>
            </div>
          </div>

          {/* Key Linking Fields (FR 3.9.2 & FR 3.9.3) */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2 flex items-center gap-2">
              <Scale className="w-4 h-4 text-cbe-purple" />
              <span>Linking Fields</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              {/* Victim / Target Entity */}
              <div className="p-3 rounded-lg bg-slate-50/70 border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
                  <User className="w-3 h-3 text-slate-500" /> Target Entity
                </span>
                <p className="font-bold text-slate-900 leading-tight">{dossier.victimName}</p>
              </div>

              {/* Account Number(s) */}
              <div className="p-3 rounded-lg bg-slate-50/70 border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
                  <CreditCard className="w-3 h-3 text-slate-500" /> Account Numbers
                </span>
                <div className="space-y-1">
                  {dossier.accountNumbers.map((acc, idx) => (
                    <div key={idx} className="flex items-center justify-between font-mono font-bold text-slate-900">
                      <span>{acc}</span>
                      <button
                        onClick={() => handleCopy(acc)}
                        title="Copy account number"
                        className="text-slate-400 hover:text-cbe-purple transition cursor-pointer"
                      >
                        {copiedAccount === acc ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Branch & District */}
              <div className="p-3 rounded-lg bg-slate-50/70 border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
                  <Building className="w-3 h-3 text-slate-500" /> Branch
                </span>
                <p className="font-bold text-slate-900 leading-tight">{dossier.branch}</p>
                <p className="text-[11px] text-slate-500">{dossier.district}</p>
              </div>

              {/* Amount Involved */}
              <div className="p-3 rounded-lg bg-purple-50/50 border border-purple-200/80 space-y-1">
                <span className="text-[10px] font-bold text-cbe-purple uppercase tracking-wider block">
                  Amount
                </span>
                <p className="font-mono font-extrabold text-slate-900 text-sm">
                  {formatETB(dossier.amountETB)}
                </p>
                {dossier.amountUSD && (
                  <p className="font-mono text-[11px] text-slate-600">
                    USD: ${dossier.amountUSD.toLocaleString()}
                  </p>
                )}
                {dossier.isRestitutionSecured && dossier.restitutionAmountETB ? (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded block text-center">
                    Restitution: {formatETB(dossier.restitutionAmountETB)}
                  </span>
                ) : null}
              </div>
            </div>

            {/* Personnel & Dates Sub-row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Lead Investigator
                </span>
                <span className="font-semibold text-slate-900">{dossier.leadInvestigator}</span>
                {dossier.investigatingTeam && (
                  <p className="text-[11px] text-slate-500">{dossier.investigatingTeam}</p>
                )}
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Subjects
                </span>
                <span className="font-semibold text-slate-900">{dossier.subjectNames}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Report Date
                </span>
                <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {dossier.reportDate}
                </span>
              </div>
            </div>
          </div>

          {/* Allegation Summary & Modus Operandi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2 shadow-2xs">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-cbe-purple" />
                <span>Allegation Summary</span>
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50/80 p-3.5 rounded-lg border border-slate-200">
                {dossier.allegationSummary}
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2 shadow-2xs">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-cbe-gold" />
                <span>Modus Operandi</span>
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50/80 p-3.5 rounded-lg border border-slate-200">
                {dossier.modusOperandi}
              </p>
            </div>
          </div>

          {/* Factual Findings */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-2xs">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              <span>Factual Findings</span>
            </h4>
            <div className="space-y-2">
              {dossier.factualFindings.map((finding, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-lg bg-slate-50/70 border border-slate-200 text-xs text-slate-800"
                >
                  <span className="font-mono font-bold text-cbe-purple bg-purple-50 px-2 py-0.5 rounded border border-purple-100 shrink-0">
                    Finding {idx + 1}
                  </span>
                  <span className="leading-relaxed">{finding}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Legal Violations & Corrective Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2 shadow-2xs">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-rose-600" />
                <span>Violations</span>
              </h4>
              <p className="text-xs text-slate-800 font-medium leading-relaxed bg-rose-50/40 p-3.5 rounded-lg border border-rose-200/80">
                {dossier.legalViolations}
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2 shadow-2xs">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-cbe-purple" />
                <span>Corrective Reforms</span>
              </h4>
              <div className="space-y-1.5">
                {dossier.correctiveMeasures.map((measure, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                    <span className="font-bold text-cbe-purple shrink-0">•</span>
                    <span className="leading-relaxed">{measure}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Attached Physical / Scanned Document Record */}
          {dossier.attachedDossierFile && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-cbe-purple/10 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-cbe-purple" />
                </div>
                <div>
                  <span className="font-bold text-xs text-slate-900 block">
                    {dossier.attachedDossierFile.fileName}
                  </span>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
                    <span>{dossier.attachedDossierFile.fileSize}</span>
                    <span>•</span>
                    <span>{dossier.attachedDossierFile.fileHash}</span>
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="text-xs flex items-center gap-1.5 border-slate-200 hover:bg-white text-slate-700"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Attachment</span>
              </Button>
            </div>
          )}

          {/* Supervisory Certification Footer */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
            <span>
              Certified Archival Record • Commercial Bank of Ethiopia Forensic Audit Division
            </span>
            <span className="font-mono text-[11px]">
              Repository Hash: CBE-AR-{dossier.id.toUpperCase()}-VERIFIED
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
