import React from 'react'
import { Check, Send, Shield, Users, FileText, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import type { TriageWorkflowState } from '../../types/triage.types'

interface Props {
  triageState: TriageWorkflowState
  onChangeTriage: (updater: (prev: TriageWorkflowState) => TriageWorkflowState) => void
  onUpdateReportField: (field: any, val: string) => void
  isPresident: boolean
  isVpIa: boolean
  isFiDirector: boolean
  isManager: boolean
  isInvestigator: boolean
  isEditable: boolean
  onHandover: () => void
  onNext: () => void
}

export const TriageStep1Secure: React.FC<Props> = ({
  triageState,
  onChangeTriage,
  onUpdateReportField,
  isPresident,
  isVpIa,
  isFiDirector,
  isManager,
  isInvestigator,
  isEditable,
  onHandover,
  onNext,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-2xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-bold text-slate-800">1. Secure &amp; Acknowledge</h3>
        </div>
        <span className="text-xs font-bold text-cbe-purple bg-purple-50 px-2.5 py-1 rounded-full border border-purple-100">
          {Number(triageState.isAcknowledged) +
            Number(triageState.legalHoldInitiated) +
            Number(Boolean(triageState.investigatorAssigned && triageState.noConflictSigned))}/3 Completed
        </span>
      </div>

      <div className="space-y-3">
        {/* Action 1: Acknowledge Receipt */}
        <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                triageState.isAcknowledged
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {triageState.isAcknowledged ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </div>
            <div>
              <span className="font-bold text-slate-800 text-xs">Acknowledge Receipt</span>
              <p className="text-[11px] text-slate-500">
                {triageState.isAcknowledged && triageState.acknowledgedAt
                  ? `Sent on ${new Date(triageState.acknowledgedAt).toLocaleString()}`
                  : ' '}
              </p>
            </div>
          </div>
          <Button
            size="sm"
            disabled={triageState.isAcknowledged}
            onClick={() =>
              onChangeTriage((prev) => ({
                ...prev,
                isAcknowledged: true,
                acknowledgedAt: new Date().toISOString(),
              }))
            }
            className={
              triageState.isAcknowledged
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-50 text-xs'
                : 'bg-cbe-purple text-white hover:bg-cbe-purple-700 text-xs'
            }
          >
            {triageState.isAcknowledged ? '✓ Acknowledged' : 'Send Acknowledgment'}
          </Button>
        </div>

        {/* Action 2: Safeguard Evidence */}
        <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                triageState.legalHoldInitiated
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              <Shield
                className={`w-4 h-4 ${
                  triageState.legalHoldInitiated ? 'text-emerald-600' : 'text-slate-500'
                }`}
              />
            </div>
            <div>
              <span className="font-bold text-slate-800 text-xs">Safeguard Evidence (Legal Hold)</span>
              <p className="text-[11px] text-slate-500">
                {triageState.legalHoldInitiated
                  ? `Active Notice Ref: ${triageState.legalHoldNoticeRef || 'LH-2026-092'}`
                  : ' '}
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant={triageState.legalHoldInitiated ? 'outline' : 'primary'}
            onClick={() =>
              onChangeTriage((prev) => ({
                ...prev,
                legalHoldInitiated: true,
                legalHoldNoticeRef:
                  prev.legalHoldNoticeRef ||
                  `LH-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
                legalHoldAt: new Date().toISOString(),
              }))
            }
            className={
              triageState.legalHoldInitiated
                ? 'text-emerald-700 border-emerald-300 bg-emerald-50 text-xs'
                : 'bg-cbe-purple text-white hover:bg-cbe-purple-700 text-xs'
            }
          >
            {triageState.legalHoldInitiated ? '✓ Legal Hold Active' : 'Issue Legal Hold'}
          </Button>
        </div>

        {/* Action 3: Assign Investigation Team */}
        <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                triageState.investigatorAssigned && triageState.noConflictSigned
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              <Users
                className={`w-4 h-4 ${
                  triageState.investigatorAssigned && triageState.noConflictSigned
                    ? 'text-emerald-600'
                    : 'text-slate-500'
                }`}
              />
            </div>
            <div>
              <span className="font-bold text-slate-800 text-xs">Assign Investigation Team</span>
              <p className="text-[11px] text-slate-500">
                {triageState.investigatorAssigned
                  ? `Assigned Team: ${triageState.investigatorAssigned} • ${
                      triageState.noConflictSigned ? 'No Conflict Confirmed' : 'Pending Conflict Review'
                    }`
                  : 'Select a team to handle this case'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={triageState.investigatorAssigned || ''}
              onChange={(e) => {
                const val = e.target.value
                onChangeTriage((prev) => ({ ...prev, investigatorAssigned: val }))
                onUpdateReportField('investigatorTeamAssigned', val)
              }}
              className="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white w-48 focus:ring-1 focus:ring-cbe-purple"
            >
              <option value="">Select Assignee...</option>
              {isPresident ? (
                <option value="VP-IA (Vice President Internal Audit)">VP-IA (Vice President Internal Audit)</option>
              ) : isVpIa ? (
                <option value="FI Director (Fraud Investigation)">FI Director (Fraud Investigation)</option>
              ) : isFiDirector ? (
                <>
                  <option value="FI Manager (Procurement & Logistics)">FI Manager (Procurement & Logistics)</option>
                  <option value="FI Manager (HR & Administration)">FI Manager (HR & Administration)</option>
                  <option value="FI Manager (Branch Operations)">FI Manager (Branch Operations)</option>
                </>
              ) : (
                <>
                  <option value="Team Alpha (Procurement Fraud)">Team Alpha (Procurement Fraud)</option>
                  <option value="Team Beta (Internal Audit)">Team Beta (Internal Audit)</option>
                  <option value="Ad-Hoc Team Gamma">Ad-Hoc Investigation Team</option>
                </>
              )}
            </select>

            <label className="flex items-center gap-1.5 cursor-pointer bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 text-[11px] font-medium text-slate-700">
              <input
                type="checkbox"
                checked={triageState.noConflictSigned}
                onChange={(e) =>
                  onChangeTriage((prev) => ({ ...prev, noConflictSigned: e.target.checked }))
                }
                className="w-3.5 h-3.5 text-cbe-purple rounded"
              />
              <span>No Conflict</span>
            </label>
          </div>
        </div>

        {/* President's Directives */}
        {isPresident ? (
          <div className="mt-3 p-3.5 rounded-xl border border-purple-200 bg-purple-50/50 flex flex-col gap-2">
            <label className="font-bold text-slate-800 text-xs flex items-center gap-2">
              <FileText className="w-4 h-4 text-cbe-purple" />
              President's Directives &amp; Instructions (for VP-IA)
            </label>
            <textarea
              value={triageState.executiveDirectives || ''}
              onChange={(e) => {
                const val = e.target.value
                onChangeTriage((prev) => ({ ...prev, executiveDirectives: val }))
                onUpdateReportField('executiveDirectives', val)
              }}
              className="text-xs border border-purple-200 rounded-lg p-2.5 bg-white min-h-[80px] focus:ring-1 focus:ring-cbe-purple w-full"
            />
          </div>
        ) : (
          triageState.executiveDirectives && (
            <div className="mt-3 p-3.5 rounded-xl border border-amber-200 bg-amber-50 flex flex-col gap-2">
              <label className="font-bold text-amber-900 text-xs flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-600" />
                Directives &amp; Instructions from President
              </label>
              <p className="text-xs text-amber-800 bg-white/50 p-2.5 rounded border border-amber-100 whitespace-pre-line">
                {triageState.executiveDirectives}
              </p>
            </div>
          )
        )}
      </div>

      {/* Step Navigation */}
      <div className="flex justify-end pt-3 border-t border-slate-100">
        {isManager && !isInvestigator && isEditable ? (
          <Button
            size="sm"
            onClick={onHandover}
            className="bg-cbe-purple text-white hover:bg-cbe-purple-700 text-xs font-semibold flex items-center gap-1.5"
          >
            <span>Save &amp; Handover to Assigned Team</span>
            <Check className="w-3.5 h-3.5" />
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={onNext}
            className="bg-cbe-purple text-white hover:bg-cbe-purple-700 text-xs font-semibold flex items-center gap-1.5"
          >
            <span>Proceed to Step 2: Initial Review &amp; Triage</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        )}
      </div>
    </div>
  )
}
