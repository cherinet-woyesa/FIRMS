import React from 'react'
import { MessageSquare, ShieldCheck, PenTool } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import type { FinalInvestigationReport } from '../../types/investigation.types'

interface Props {
  report: FinalInvestigationReport
  updateField: (field: keyof FinalInvestigationReport, value: any) => void
  isEditable: boolean
  isInvestigator: boolean
  isFiManager: boolean
  isFiDirector: boolean
  isVpIa: boolean
  user: any
  onOpenComments: (section: string) => void
  showNotification: (msg: string) => void
}

export const ReportSignatures: React.FC<Props> = ({
  report,
  updateField,
  isEditable,
  isInvestigator,
  isFiManager,
  isFiDirector,
  isVpIa,
  user,
  onOpenComments,
  showNotification,
}) => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 space-y-5 shadow-2xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-3">
          <h3 className="text-base font-bold text-slate-900">8. Supervisory Sign-Off &amp; Approvals</h3>
          <button
            type="button"
            onClick={() => onOpenComments('8. Supervisory Sign-Off')}
            className="text-slate-400 hover:text-cbe-purple transition cursor-pointer"
            title="Add Section Comment"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* 1. Investigator Sign-Off */}
        <div className="p-4.5 rounded-xl bg-slate-50/70 border border-slate-200 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Lead Investigator Digital Signature
            </span>
            {report.investigatorSignature && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Signed
              </span>
            )}
          </div>

          {report.investigatorSignature ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="font-mono text-emerald-700 text-xs font-bold bg-emerald-50 px-2 py-1 rounded border border-emerald-100">
                  {report.investigatorSignature}
                </span>
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                Hash: 0x8F9B...3A2C (SHA-256)
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-[11px] text-slate-500">
                <span>Timestamp:</span>
                <span className="font-medium text-slate-800">
                  {report.signatureDate ? new Date(report.signatureDate).toLocaleString() : 'N/A'}
                </span>
              </div>
            </div>
          ) : isInvestigator && isEditable ? (
            <div className="pt-2 space-y-2.5">
              <p className="text-xs text-slate-500">
                Digitally sign this report to submit it to the FI Manager for endorsement.
              </p>
              <Button
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700 text-white w-full text-xs h-8"
                onClick={() => {
                  updateField(
                    'investigatorSignature',
                    user ? `${user.firstName} ${user.lastName} (Lead Investigator)` : 'Lead Investigator'
                  )
                  updateField('signatureDate', new Date().toISOString())
                  updateField('managerEndorsementStatus', 'Pending Review')
                  showNotification('Lead investigator digital signature applied.')
                }}
              >
                <PenTool className="w-3.5 h-3.5 mr-1.5" />
                Sign &amp; Submit Draft
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-center h-20 text-xs font-medium text-slate-400 italic">
              Pending Investigator Signature
            </div>
          )}
        </div>

        {/* 2. FI Manager Endorsement */}
        <div className="p-4.5 rounded-xl bg-slate-50/70 border border-slate-200 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              FI Manager Endorsement
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
              {report.managerEndorsementStatus || 'Pending Review'}
            </span>
          </div>

          {report.managerEndorsementStatus === 'Endorsed' ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span className="font-mono text-blue-700 text-xs font-bold bg-blue-50 px-2 py-1 rounded border border-blue-100">
                  Endorsed by: {report.managerEndorsedBy}
                </span>
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                Hash: 0x4A2B...1F9C (SHA-256)
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-[11px] text-slate-500">
                <span>Timestamp:</span>
                <span className="font-medium text-slate-800">
                  {report.managerEndorsementDate ? new Date(report.managerEndorsementDate).toLocaleString() : 'N/A'}
                </span>
              </div>
            </div>
          ) : isFiManager && isEditable ? (
            <div className="pt-2 space-y-2.5">
              <p className="text-xs text-slate-500">
                Review and endorse this draft report before submission to the FI Director.
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white flex-1 text-xs h-8"
                  onClick={() => {
                    updateField('managerEndorsementStatus', 'Endorsed')
                    updateField(
                      'managerEndorsedBy',
                      user ? `${user.firstName} ${user.lastName} (FI Manager)` : 'FI Manager'
                    )
                    updateField('managerEndorsementDate', new Date().toISOString())
                    updateField('directorEndorsementStatus', 'Pending Review')
                    showNotification('Draft endorsed by FI Manager.')
                  }}
                >
                  Endorse Draft
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 flex-1 text-xs h-8"
                  onClick={() => {
                    updateField('managerEndorsementStatus', 'Revision Requested')
                    showNotification('Revision requested by FI Manager.')
                  }}
                >
                  Request Revision
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-20 text-xs font-medium text-slate-400 italic">
              Pending FI Manager Review
            </div>
          )}
        </div>

        {/* 3. FI Director Endorsement */}
        <div className="p-4.5 rounded-xl bg-slate-50/70 border border-slate-200 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              FI Director Endorsement
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
              {report.directorEndorsementStatus || 'Pending Review'}
            </span>
          </div>

          {report.directorEndorsementStatus === 'Endorsed' ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span className="font-mono text-amber-700 text-xs font-bold bg-amber-50 px-2 py-1 rounded border border-amber-100">
                  Endorsed by: {report.directorEndorsedBy}
                </span>
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                Hash: 0x9B4E...7C1F (SHA-256)
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-[11px] text-slate-500">
                <span>Timestamp:</span>
                <span className="font-medium text-slate-800">
                  {report.directorEndorsementDate ? new Date(report.directorEndorsementDate).toLocaleString() : 'N/A'}
                </span>
              </div>
            </div>
          ) : isFiDirector && isEditable ? (
            <div className="pt-2 space-y-2.5">
              <p className="text-xs text-slate-500">
                Review and endorse this draft report before submission to the VP-IA.
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="bg-amber-600 hover:bg-amber-700 text-white flex-1 text-xs h-8"
                  onClick={() => {
                    updateField('directorEndorsementStatus', 'Endorsed')
                    updateField(
                      'directorEndorsedBy',
                      user ? `${user.firstName} ${user.lastName} (FI Director)` : 'FI Director'
                    )
                    updateField('directorEndorsementDate', new Date().toISOString())
                    updateField('approvalStatus', 'Pending Review')
                    showNotification('Draft endorsed by FI Director.')
                  }}
                >
                  Endorse Draft
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 flex-1 text-xs h-8"
                  onClick={() => {
                    updateField('directorEndorsementStatus', 'Revision Requested')
                    showNotification('Revision requested by FI Director.')
                  }}
                >
                  Request Revision
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-20 text-xs font-medium text-slate-400 italic">
              Pending FI Director Review
            </div>
          )}
        </div>

        {/* 4. VP-IA Final Approval */}
        <div className="p-4.5 rounded-xl bg-slate-50/70 border border-slate-200 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Executive VP-IA Digital Signature
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              {report.approvalStatus || 'Pending Review'}
            </span>
          </div>

          {report.approvalStatus === 'Approved' ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="font-mono text-emerald-700 text-xs font-bold bg-emerald-50 px-2 py-1 rounded border border-emerald-100">
                  Signed by: {report.reviewedAndApprovedBy}
                </span>
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                Hash: 0x1E4D...9F8A (SHA-256)
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-[11px] text-slate-500">
                <span>Timestamp:</span>
                <span className="font-medium text-slate-800">
                  {report.approvalDate ? new Date(report.approvalDate).toLocaleString() : 'N/A'}
                </span>
              </div>
            </div>
          ) : isVpIa && isEditable ? (
            <div className="pt-2 space-y-2.5">
              <p className="text-xs text-slate-500">
                As VP-IA, provide formal authorization. Once approved, the case will escalate to SARC / President&apos;s Office.
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white flex-1 text-xs h-8"
                  onClick={() => {
                    updateField('approvalStatus', 'Approved')
                    updateField(
                      'reviewedAndApprovedBy',
                      user ? `${user.firstName} ${user.lastName} (VP-IA)` : 'VP-IA'
                    )
                    updateField('approvalDate', new Date().toISOString())
                    showNotification('Final investigation report approved by VP-IA.')
                  }}
                >
                  Approve &amp; Sign Off
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 flex-1 text-xs h-8"
                  onClick={() => {
                    updateField('approvalStatus', 'Revision Requested')
                    showNotification('Revision requested by VP-IA.')
                  }}
                >
                  Request Revision
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-20 text-xs font-medium text-slate-400 italic">
              Pending VP-IA Review
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
