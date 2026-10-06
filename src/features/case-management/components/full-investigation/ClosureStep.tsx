import React from 'react'
import { Briefcase, Building, Shield, Scale, Plus, Trash2, CheckCircle2, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { RichTextEditor } from '@/components/ui/RichTextEditor'
import type { ResolutionAndClosure, DisciplinaryActionItem, SystemicMeasureItem } from '../../types/investigation.types'

interface Props {
  closure: ResolutionAndClosure
  onChangeClosure: (updater: (prev: ResolutionAndClosure) => ResolutionAndClosure) => void
  onAddDisciplinary: () => void
  onRemoveDisciplinary: (id: string) => void
  onAddSystemicMeasure: () => void
  onRemoveSystemicMeasure: (id: string) => void
  isEditable?: boolean
  isSarcSecretary?: boolean
  isVpIa?: boolean
  onBack: () => void
  onSaveProgress: () => void
  onFinalizeCase: () => void
}

export const ClosureStep: React.FC<Props> = ({
  closure,
  onChangeClosure,
  onAddDisciplinary,
  onRemoveDisciplinary,
  onAddSystemicMeasure,
  onRemoveSystemicMeasure,
  isEditable = true,
  isSarcSecretary = false,
  isVpIa = false,
  onBack,
  onSaveProgress,
  onFinalizeCase,
}) => {
  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 space-y-6 shadow-2xs">
        {/* Unified Step Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cbe-purple/10 flex items-center justify-center text-cbe-purple shrink-0">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Action &amp; Case Closure
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold border bg-purple-50 text-purple-900 border-purple-200">
              {closure.disciplinaryActions.length} Disciplinary {closure.disciplinaryActions.length === 1 ? 'Action' : 'Actions'}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold border bg-indigo-50 text-indigo-900 border-indigo-200">
              {closure.systemicMeasures.length} Systemic {closure.systemicMeasures.length === 1 ? 'Measure' : 'Measures'}
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border shrink-0 ${
                closure.caseClosureFormal
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}
            >
              {closure.caseClosureFormal ? 'Formally Closed' : 'In Progress'}
            </span>
          </div>
        </div>

        {/* Sub-Section 1: Disciplinary & Legal Referral Actions */}
        <div className="space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
              <Briefcase className="w-3.5 h-3.5 text-cbe-purple" />
              <span>Disciplinary &amp; Legal Referral Actions</span>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={onAddDisciplinary}
              disabled={!isEditable}
              className="text-xs flex items-center gap-1.5 h-8 px-3 border-slate-200 hover:bg-purple-50 hover:text-cbe-purple hover:border-cbe-purple/30 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Action</span>
            </Button>
          </div>

          {closure.disciplinaryActions.length === 0 ? (
            <div className="border border-dashed border-slate-200 rounded-xl p-5 text-center bg-slate-50/50">
              <p className="text-xs text-slate-500 font-medium">
                No disciplinary or legal referral actions recorded yet.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {closure.disciplinaryActions.map((da: DisciplinaryActionItem, i: number) => (
                <div
                  key={da.id}
                  className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/80 flex items-center justify-between gap-3 shadow-2xs hover:border-slate-300 transition"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Target Subject
                      </label>
                      <input
                        type="text"
                        value={da.targetSubject}
                        disabled={!isEditable}
                        onChange={(e) => {
                          const next = [...closure.disciplinaryActions]
                          next[i] = { ...next[i], targetSubject: e.target.value }
                          onChangeClosure((prev) => ({ ...prev, disciplinaryActions: next }))
                        }}
                        className="w-full text-xs font-bold text-slate-900 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-hidden focus:border-cbe-purple disabled:bg-slate-50"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Action Type
                      </label>
                      <select
                        value={da.actionType}
                        disabled={!isEditable}
                        onChange={(e) => {
                          const next = [...closure.disciplinaryActions]
                          next[i] = { ...next[i], actionType: e.target.value }
                          onChangeClosure((prev) => ({ ...prev, disciplinaryActions: next }))
                        }}
                        className="w-full text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-hidden focus:border-cbe-purple disabled:bg-slate-50 cursor-pointer"
                      >
                        <option value="Termination">Termination of Employment</option>
                        <option value="Criminal Referral">Criminal Referral (FEACC / Police)</option>
                        <option value="Demotion / Suspension">Demotion / Suspension</option>
                        <option value="Formal Reprimand">Formal Reprimand</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Status
                      </label>
                      <select
                        value={da.status}
                        disabled={!isEditable}
                        onChange={(e) => {
                          const next = [...closure.disciplinaryActions]
                          next[i] = { ...next[i], status: e.target.value as any }
                          onChangeClosure((prev) => ({ ...prev, disciplinaryActions: next }))
                        }}
                        className="w-full text-xs font-bold text-cbe-purple bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-hidden focus:border-cbe-purple disabled:bg-slate-50 cursor-pointer"
                      >
                        <option value="Pending">Pending Execution</option>
                        <option value="Executed">Executed</option>
                        <option value="Under Appeal">Under Appeal</option>
                      </select>
                    </div>
                  </div>
                  {isEditable && (
                    <button
                      type="button"
                      onClick={() => onRemoveDisciplinary(da.id)}
                      className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition cursor-pointer self-center"
                      title="Remove Action"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section Divider */}
        <div className="border-t border-slate-100" />

        {/* Sub-Section 2: Institutional Corrective & Policy Measures */}
        <div className="space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
              <Building className="w-3.5 h-3.5 text-cbe-purple" />
              <span>Institutional Corrective &amp; Policy Measures</span>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={onAddSystemicMeasure}
              disabled={!isEditable}
              className="text-xs flex items-center gap-1.5 h-8 px-3 border-slate-200 hover:bg-purple-50 hover:text-cbe-purple hover:border-cbe-purple/30 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Measure</span>
            </Button>
          </div>

          {closure.systemicMeasures.length === 0 ? (
            <div className="border border-dashed border-slate-200 rounded-xl p-5 text-center bg-slate-50/50">
              <p className="text-xs text-slate-500 font-medium">
                No institutional corrective or policy measures recorded yet.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {closure.systemicMeasures.map((sm: SystemicMeasureItem, i: number) => (
                <div
                  key={sm.id}
                  className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/80 flex items-center justify-between gap-3 shadow-2xs hover:border-slate-300 transition"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Policy / Control Measure Description
                      </label>
                      <input
                        type="text"
                        value={sm.policyTitle}
                        disabled={!isEditable}
                        onChange={(e) => {
                          const next = [...closure.systemicMeasures]
                          next[i] = { ...next[i], policyTitle: e.target.value }
                          onChangeClosure((prev) => ({ ...prev, systemicMeasures: next }))
                        }}
                        className="w-full text-xs font-semibold text-slate-900 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-hidden focus:border-cbe-purple disabled:bg-slate-50"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Implementation Status
                      </label>
                      <select
                        value={sm.status}
                        disabled={!isEditable}
                        onChange={(e) => {
                          const next = [...closure.systemicMeasures]
                          next[i] = { ...next[i], status: e.target.value as any }
                          onChangeClosure((prev) => ({ ...prev, systemicMeasures: next }))
                        }}
                        className="w-full text-xs font-bold text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-hidden focus:border-cbe-purple disabled:bg-slate-50 cursor-pointer"
                      >
                        <option value="In Progress">In Progress</option>
                        <option value="Implemented">Implemented</option>
                      </select>
                    </div>
                  </div>
                  {isEditable && (
                    <button
                      type="button"
                      onClick={() => onRemoveSystemicMeasure(sm.id)}
                      className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition cursor-pointer self-center"
                      title="Remove Measure"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section Divider */}
        <div className="border-t border-slate-100" />

        {/* Sub-Section 3: Reporter Feedback, Anti-Retaliation & Case Closure */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
            <Shield className="w-3.5 h-3.5 text-cbe-purple" />
            <span>Reporter Feedback, Anti-Retaliation &amp; Case Closure</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Feedback to Reporter */}
            <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">Feedback to Whistleblower</span>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={closure.whistleblowerFeedbackProvided}
                    disabled={!isEditable}
                    onChange={(e) =>
                      onChangeClosure((prev) => ({
                        ...prev,
                        whistleblowerFeedbackProvided: e.target.checked,
                        whistleblowerFeedbackDate: e.target.checked ? new Date().toLocaleDateString() : undefined,
                      }))
                    }
                    className="w-3.5 h-3.5 text-cbe-purple rounded"
                  />
                  <span className="text-[11px] font-semibold text-slate-700">Provided</span>
                </label>
              </div>
              <RichTextEditor
                content={closure.whistleblowerFeedbackNotes || ''}
                onChange={(val) =>
                  onChangeClosure((prev) => ({ ...prev, whistleblowerFeedbackNotes: val }))
                }
                placeholder=""
                minHeight="100px"
                readOnly={!isEditable}
              />
            </div>

            {/* Anti-Retaliation Monitoring */}
            <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">Anti-Retaliation Monitoring</span>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={closure.antiRetaliationActive}
                    disabled={!isEditable}
                    onChange={(e) =>
                      onChangeClosure((prev) => ({ ...prev, antiRetaliationActive: e.target.checked }))
                    }
                    className="w-3.5 h-3.5 text-emerald-600 rounded"
                  />
                  <span className="text-[11px] font-semibold text-emerald-700">Active Protection</span>
                </label>
              </div>
              <RichTextEditor
                content={closure.antiRetaliationNotes || ''}
                onChange={(val) =>
                  onChangeClosure((prev) => ({ ...prev, antiRetaliationNotes: val }))
                }
                placeholder=""
                minHeight="100px"
                readOnly={!isEditable}
              />
            </div>
          </div>

          {/* Monitoring & Follow-Up Assignment (VP-IA) */}
          {(isVpIa || closure.followUpManagerAssignedTo) && (
            <div className="pt-4 border-t border-slate-100 space-y-2.5">
              <div>
                <span className="text-xs font-bold text-slate-900 block">Monitoring &amp; Follow-Up Assignment</span>
              </div>
              {isVpIa && !closure.caseClosureFormal ? (
                <div className="flex items-center gap-2">
                  <select
                    className="text-xs p-2 rounded-lg border border-slate-200 bg-white text-slate-700 w-64"
                    value={closure.followUpManagerAssignedTo || ''}
                    onChange={(e) =>
                      onChangeClosure((prev) => ({
                        ...prev,
                        followUpManagerAssignedTo: e.target.value,
                        followUpManagerAssignedAt: e.target.value ? new Date().toISOString() : undefined,
                      }))
                    }
                  >
                    <option value="">-- Select Follow-Up Manager --</option>
                    <option value="Daniel Tadesse (Follow-Up Manager)">Daniel Tadesse (Follow-Up Manager)</option>
                    <option value="Sara Ahmed (Follow-Up Manager)">Sara Ahmed (Follow-Up Manager)</option>
                  </select>
                  {closure.followUpManagerAssignedTo && (
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-100">
                      Assigned
                    </span>
                  )}
                </div>
              ) : (
                <div className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200 inline-block">
                  {closure.followUpManagerAssignedTo ? (
                    <>
                      <span className="font-semibold">{closure.followUpManagerAssignedTo}</span>
                      <span className="text-slate-400 ml-2">
                        assigned on {closure.followUpManagerAssignedAt ? new Date(closure.followUpManagerAssignedAt).toLocaleDateString() : ''}
                      </span>
                    </>
                  ) : (
                    <span className="italic text-slate-400">No Follow-Up Manager assigned yet.</span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* SARC Secretary Decision Execution & Minutes of Meetings */}
          <div className="pt-4 border-t border-slate-100 space-y-3.5">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-cbe-purple" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                SARC Decision Management (SARC Secretary Only)
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/80 space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={closure.sarcMomAttached || false}
                    disabled={!isSarcSecretary || !isEditable}
                    onChange={(e) =>
                      onChangeClosure((prev) => ({ ...prev, sarcMomAttached: e.target.checked }))
                    }
                    className="w-3.5 h-3.5 text-cbe-purple rounded disabled:opacity-50"
                  />
                  <span className="text-xs font-bold text-slate-800">MoM Attached</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={closure.sarcExecutionEvidenceUploaded || false}
                    disabled={!isSarcSecretary || !isEditable}
                    onChange={(e) =>
                      onChangeClosure((prev) => ({
                        ...prev,
                        sarcExecutionEvidenceUploaded: e.target.checked,
                      }))
                    }
                    className="w-3.5 h-3.5 text-cbe-purple rounded disabled:opacity-50"
                  />
                  <span className="text-xs font-bold text-slate-800">Formal Letters of Execution Uploaded</span>
                </label>

                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-800">Execution Status</span>
                  <select
                    disabled={!isSarcSecretary || !isEditable}
                    value={closure.sarcDecisionExecutionStatus || 'Pending'}
                    onChange={(e) =>
                      onChangeClosure((prev) => ({
                        ...prev,
                        sarcDecisionExecutionStatus: e.target.value as 'Pending' | 'In Progress' | 'Executed',
                      }))
                    }
                    className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white disabled:bg-slate-100"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Executed">Executed</option>
                  </select>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/80 space-y-2 flex flex-col">
                <span className="text-xs font-bold text-slate-800">SARC Decision Notes</span>
                <textarea
                  disabled={!isSarcSecretary || !isEditable}
                  value={closure.sarcNotes || ''}
                  onChange={(e) =>
                    onChangeClosure((prev) => ({ ...prev, sarcNotes: e.target.value }))
                  }
                  rows={4}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-cbe-purple resize-none bg-white flex-1 disabled:bg-slate-100 disabled:text-slate-500"
                />
              </div>
            </div>
          </div>

          {/* Formal Case Closure & Program Review */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-slate-900 block">Formal Case Closure</span>
              {!isSarcSecretary && (
                <span className="text-[11px] font-bold text-rose-500 block mt-1">
                  Only the SARC Secretary can formally close a case.
                </span>
              )}
            </div>
            <Button
              size="sm"
              disabled={!isSarcSecretary || closure.caseClosureFormal}
              onClick={onFinalizeCase}
              className={`text-xs font-semibold ${
                closure.caseClosureFormal
                  ? 'bg-slate-800 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
              {closure.caseClosureFormal ? 'Case Formally Closed' : 'Finalize & Close Case'}
            </Button>
          </div>
        </div>
      </div>

      {/* Step 5 Footer Nav */}
      <div className="flex items-center justify-between pt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          className="text-xs font-semibold flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Step 4: Final Report
        </Button>
        <Button
          size="sm"
          onClick={onSaveProgress}
          className="bg-cbe-purple text-white hover:bg-cbe-purple-700 text-xs font-semibold flex items-center gap-1.5"
        >
          <span>Save Full Investigation Progress</span>
        </Button>
      </div>
    </div>
  )
}
