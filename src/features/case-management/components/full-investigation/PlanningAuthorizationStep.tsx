import React from 'react'
import { Shield, FileText, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { RichTextEditor } from '@/components/ui/RichTextEditor'
import type { PlanningAndAuthorization } from '../../types/investigation.types'

interface Props {
  planning: PlanningAndAuthorization
  onChangePlanning: (updater: (prev: PlanningAndAuthorization) => PlanningAndAuthorization) => void
  onToggleScope: (scope: string) => void
  isEditable?: boolean
  isSarcSecretary?: boolean
  onProceedNext: () => void
}

export const PlanningAuthorizationStep: React.FC<Props> = ({
  planning,
  onChangePlanning,
  onToggleScope,
  isEditable = true,
  isSarcSecretary = false,
  onProceedNext,
}) => {
  return (
    <div className={`space-y-4 ${isSarcSecretary ? 'pointer-events-none opacity-80' : ''}`}>
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 space-y-6 shadow-2xs">
        {/* Unified Step Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cbe-purple/10 flex items-center justify-center text-cbe-purple shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Investigation Planning &amp; Authorization Mandate
              </h3>
            </div>
          </div>
          <span
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border shrink-0 ${planning.isAuthorized
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}
          >
            {planning.isAuthorized ? 'Authorized to Investigate' : 'Pending Authorization'}
          </span>
        </div>

        {/* Sub-Section A: Authorization & Legal Mandate */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
            <Shield className="w-3.5 h-3.5 text-cbe-purple" />
            <span>Authorization &amp; Legal Mandate</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Authorizing Authority
              </label>
              <input
                type="text"
                value={planning.authorizedBy}
                onChange={(e) =>
                  onChangePlanning((prev) => ({ ...prev, authorizedBy: e.target.value }))
                }
                disabled={!isEditable}
                className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-hidden focus:border-cbe-purple focus:ring-1 focus:ring-cbe-purple transition disabled:bg-slate-50 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Date of Formal Authorization
              </label>
              <input
                type="date"
                value={planning.authorizationDate}
                onChange={(e) =>
                  onChangePlanning((prev) => ({ ...prev, authorizationDate: e.target.value }))
                }
                disabled={!isEditable}
                className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-hidden focus:border-cbe-purple focus:ring-1 focus:ring-cbe-purple transition disabled:bg-slate-50 font-medium"
              />
            </div>
          </div>

          {/* Approved Investigative Powers */}
          <div className="space-y-2 pt-1">
            <label className="block text-xs font-semibold text-slate-700">
              Approved Investigative Powers Scope
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                'Interviewing Staff & Witnesses',
                'Seizing Physical & Digital Records',
                'Requesting External / FEACC Data',
                'Engaging Police Forensic Support',
                'Suspending Core System Permissions',
                'Examining Bank Ledgers & Transfers',
              ].map((scope) => {
                const isChecked = planning.approvalScope.includes(scope)
                return (
                  <label
                    key={scope}
                    className={`p-3 rounded-xl border text-xs font-medium cursor-pointer flex items-center gap-2.5 transition select-none ${isChecked
                        ? 'bg-[#FBF4FA] border-cbe-purple text-purple-950 font-semibold ring-1 ring-cbe-purple/30 shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50/50'
                      }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => onToggleScope(scope)}
                      disabled={!isEditable}
                      className="w-3.5 h-3.5 text-cbe-purple rounded border-slate-300"
                    />
                    <span>{scope}</span>
                  </label>
                )
              })}
            </div>
          </div>
        </div>

        {/* Section Divider */}
        <div className="border-t border-slate-100" />

        {/* Sub-Section B: Scope, Targets & Resources */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
            <FileText className="w-3.5 h-3.5 text-cbe-purple" />
            <span>Scope, Targets &amp; Required Resources</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Target Subjects Under Investigation
              </label>
              <input
                type="text"
                value={planning.targetSubjects}
                onChange={(e) =>
                  onChangePlanning((prev) => ({ ...prev, targetSubjects: e.target.value }))
                }
                disabled={!isEditable}
                className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-hidden focus:border-cbe-purple focus:ring-1 focus:ring-cbe-purple transition disabled:bg-slate-50 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Investigation Timeframe &amp; Scope Period
              </label>
              <input
                type="text"
                value={planning.investigationTimeframe}
                onChange={(e) =>
                  onChangePlanning((prev) => ({ ...prev, investigationTimeframe: e.target.value }))
                }
                disabled={!isEditable}
                className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-hidden focus:border-cbe-purple focus:ring-1 focus:ring-cbe-purple transition disabled:bg-slate-50 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Specific Allegation Being Investigated
              </label>
              <RichTextEditor
                content={planning.specificAllegations}
                onChange={(val) =>
                  onChangePlanning((prev) => ({ ...prev, specificAllegations: val }))
                }
                placeholder=""
                minHeight="120px"
                title="Specific Allegation Editor"
                readOnly={!isEditable}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Required Resources &amp; Support
              </label>
              <RichTextEditor
                content={planning.requiredResources}
                onChange={(val) =>
                  onChangePlanning((prev) => ({ ...prev, requiredResources: val }))
                }
                placeholder=""
                minHeight="120px"
                title="Required Resources Editor"
                readOnly={!isEditable}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Step 1 Footer Nav */}
      <div className="flex justify-end pt-2">
        <Button
          size="sm"
          onClick={onProceedNext}
          className="bg-cbe-purple text-white hover:bg-cbe-purple-700 text-xs font-semibold flex items-center gap-1.5 h-9 px-4 cursor-pointer"
        >
          <span>Proceed to Step 2: Evidence &amp; Forensics</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  )
}
