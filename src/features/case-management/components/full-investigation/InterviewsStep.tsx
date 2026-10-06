import React from 'react'
import { Users, UserCheck, Scale, Plus, Trash2, ArrowLeft, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { RichTextEditor } from '@/components/ui/RichTextEditor'
import type { InterviewsWorkflow, InterviewRecord, SubjectInterviewRecord } from '../../types/investigation.types'

interface Props {
  interviews: InterviewsWorkflow
  onChangeInterviews: (updater: (prev: InterviewsWorkflow) => InterviewsWorkflow) => void
  onAddWitness: (type: 'neutral' | 'key') => void
  onRemoveWitness: (type: 'neutral' | 'key', id: string) => void
  onAddSubject: () => void
  onRemoveSubject: (id: string) => void
  isEditable?: boolean
  onBack: () => void
  onNext: () => void
}

export const InterviewsStep: React.FC<Props> = ({
  interviews,
  onChangeInterviews,
  onAddWitness,
  onRemoveWitness,
  onAddSubject,
  onRemoveSubject,
  isEditable = true,
  onBack,
  onNext,
}) => {
  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 space-y-6 shadow-2xs">
        {/* Unified Step Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cbe-purple/10 flex items-center justify-center text-cbe-purple shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Witness &amp; Subject Interviews
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold border bg-purple-50 text-purple-900 border-purple-200">
              {interviews.neutralWitnesses.length} Neutral {interviews.neutralWitnesses.length === 1 ? 'Witness' : 'Witnesses'}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold border bg-indigo-50 text-indigo-900 border-indigo-200">
              {interviews.keyWitnesses.length} Key {interviews.keyWitnesses.length === 1 ? 'Witness' : 'Witnesses'}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold border bg-rose-50 text-rose-900 border-rose-200">
              {interviews.subjects.length} {interviews.subjects.length === 1 ? 'Subject' : 'Subjects'}
            </span>
          </div>
        </div>

        {/* Sub-Section 1: Neutral Witnesses (Document Corroboration) */}
        <div className="space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
              <UserCheck className="w-3.5 h-3.5 text-cbe-purple" />
              <span>Neutral Witnesses</span>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onAddWitness('neutral')}
              disabled={!isEditable}
              className="text-xs flex items-center gap-1.5 h-8 px-3 border-slate-200 hover:bg-purple-50 hover:text-cbe-purple hover:border-cbe-purple/30 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Neutral Witness</span>
            </Button>
          </div>

          {interviews.neutralWitnesses.length === 0 ? (
            <div className="border border-dashed border-slate-200 rounded-xl p-5 text-center bg-slate-50/50">
              <p className="text-xs text-slate-500 font-medium">
                No neutral witnesses recorded yet.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {interviews.neutralWitnesses.map((w: InterviewRecord, i: number) => (
                <div
                  key={w.id}
                  className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/80 space-y-3 shadow-2xs hover:border-slate-300 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-cbe-purple" />
                      <span>Neutral Witness #{i + 1} {w.name ? `— ${w.name}` : ''}</span>
                    </span>
                    {isEditable && (
                      <button
                        type="button"
                        onClick={() => onRemoveWitness('neutral', w.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                        title="Remove Witness"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Witness Name
                      </label>
                      <input
                        type="text"
                        value={w.name}
                        disabled={!isEditable}
                        onChange={(e) => {
                          const next = [...interviews.neutralWitnesses]
                          next[i] = { ...next[i], name: e.target.value }
                          onChangeInterviews((prev) => ({ ...prev, neutralWitnesses: next }))
                        }}
                        className="w-full text-xs font-bold text-slate-900 border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-hidden focus:border-cbe-purple disabled:bg-slate-50"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Job Title / Department
                      </label>
                      <input
                        type="text"
                        value={w.role}
                        disabled={!isEditable}
                        onChange={(e) => {
                          const next = [...interviews.neutralWitnesses]
                          next[i] = { ...next[i], role: e.target.value }
                          onChangeInterviews((prev) => ({ ...prev, neutralWitnesses: next }))
                        }}
                        className="w-full text-xs text-slate-800 border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-hidden focus:border-cbe-purple disabled:bg-slate-50"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Interview Date
                      </label>
                      <input
                        type="text"
                        value={w.date}
                        disabled={!isEditable}
                        onChange={(e) => {
                          const next = [...interviews.neutralWitnesses]
                          next[i] = { ...next[i], date: e.target.value }
                          onChangeInterviews((prev) => ({ ...prev, neutralWitnesses: next }))
                        }}
                        className="w-full text-xs text-slate-800 border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-hidden focus:border-cbe-purple disabled:bg-slate-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Statement Summary &amp; Corroborated Evidence
                    </label>
                    <RichTextEditor
                      content={w.summary}
                      onChange={(val) => {
                        const next = [...interviews.neutralWitnesses]
                        next[i] = { ...next[i], summary: val }
                        onChangeInterviews((prev) => ({ ...prev, neutralWitnesses: next }))
                      }}
                      placeholder=""
                      minHeight="100px"
                      title={`Neutral Witness: ${w.name || `Witness ${i + 1}`}`}
                      readOnly={!isEditable}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section Divider */}
        <div className="border-t border-slate-100" />

        {/* Sub-Section 2: Key Witnesses (Direct Knowledge) */}
        <div className="space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
              <Users className="w-3.5 h-3.5 text-cbe-purple" />
              <span>Key Witnesses</span>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onAddWitness('key')}
              disabled={!isEditable}
              className="text-xs flex items-center gap-1.5 h-8 px-3 border-slate-200 hover:bg-purple-50 hover:text-cbe-purple hover:border-cbe-purple/30 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Key Witness</span>
            </Button>
          </div>

          {interviews.keyWitnesses.length === 0 ? (
            <div className="border border-dashed border-slate-200 rounded-xl p-5 text-center bg-slate-50/50">
              <p className="text-xs text-slate-500 font-medium">
                No key witnesses recorded yet.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {interviews.keyWitnesses.map((w: InterviewRecord, i: number) => (
                <div
                  key={w.id}
                  className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/80 space-y-3 shadow-2xs hover:border-slate-300 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-cbe-purple" />
                      <span>Key Witness #{i + 1} {w.name ? `— ${w.name}` : ''}</span>
                    </span>
                    {isEditable && (
                      <button
                        type="button"
                        onClick={() => onRemoveWitness('key', w.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                        title="Remove Witness"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Key Witness Name
                      </label>
                      <input
                        type="text"
                        value={w.name}
                        disabled={!isEditable}
                        onChange={(e) => {
                          const next = [...interviews.keyWitnesses]
                          next[i] = { ...next[i], name: e.target.value }
                          onChangeInterviews((prev) => ({ ...prev, keyWitnesses: next }))
                        }}
                        className="w-full text-xs font-bold text-slate-900 border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-hidden focus:border-cbe-purple disabled:bg-slate-50"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Position / Department
                      </label>
                      <input
                        type="text"
                        value={w.role}
                        disabled={!isEditable}
                        onChange={(e) => {
                          const next = [...interviews.keyWitnesses]
                          next[i] = { ...next[i], role: e.target.value }
                          onChangeInterviews((prev) => ({ ...prev, keyWitnesses: next }))
                        }}
                        className="w-full text-xs text-slate-800 border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-hidden focus:border-cbe-purple disabled:bg-slate-50"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Interview Date
                      </label>
                      <input
                        type="text"
                        value={w.date}
                        disabled={!isEditable}
                        onChange={(e) => {
                          const next = [...interviews.keyWitnesses]
                          next[i] = { ...next[i], date: e.target.value }
                          onChangeInterviews((prev) => ({ ...prev, keyWitnesses: next }))
                        }}
                        className="w-full text-xs text-slate-800 border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-hidden focus:border-cbe-purple disabled:bg-slate-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Direct Observation Statement &amp; Evidence Testimony
                    </label>
                    <RichTextEditor
                      content={w.summary}
                      onChange={(val) => {
                        const next = [...interviews.keyWitnesses]
                        next[i] = { ...next[i], summary: val }
                        onChangeInterviews((prev) => ({ ...prev, keyWitnesses: next }))
                      }}
                      placeholder=""
                      minHeight="100px"
                      title={`Key Witness: ${w.name || `Witness ${i + 1}`}`}
                      readOnly={!isEditable}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section Divider */}
        <div className="border-t border-slate-100" />

        {/* Sub-Section 3: Subject(s) of Allegation (Formal Confrontation & Due Process) */}
        <div className="space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-700">
              <Scale className="w-3.5 h-3.5 text-rose-600" />
              <span>Subject of Allegation </span>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={onAddSubject}
              disabled={!isEditable}
              className="text-xs flex items-center gap-1.5 h-8 px-3 border-rose-200 text-rose-700 hover:bg-rose-50 hover:text-rose-800 hover:border-rose-300 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Subject Interview</span>
            </Button>
          </div>

          {interviews.subjects.length === 0 ? (
            <div className="border border-dashed border-rose-200 rounded-xl p-5 text-center bg-rose-50/20">
              <p className="text-xs text-slate-600 font-medium">
                No formal subject interviews recorded yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {interviews.subjects.map((sub: SubjectInterviewRecord, i: number) => (
                <div
                  key={sub.id}
                  className="border border-rose-200/80 rounded-xl p-4 bg-rose-50/30 space-y-3.5 shadow-2xs hover:border-rose-300 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                      <Scale className="w-3.5 h-3.5 text-rose-600" />
                      <span>Subject Interview #{i + 1} {sub.name ? `— ${sub.name}` : ''}</span>
                    </span>
                    {isEditable && (
                      <button
                        type="button"
                        onClick={() => onRemoveSubject(sub.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                        title="Remove Subject Interview"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Subject Full Name
                      </label>
                      <input
                        type="text"
                        value={sub.name}
                        disabled={!isEditable}
                        onChange={(e) => {
                          const next = [...interviews.subjects]
                          next[i] = { ...next[i], name: e.target.value }
                          onChangeInterviews((prev) => ({ ...prev, subjects: next }))
                        }}
                        className="w-full text-xs font-bold text-slate-900 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-hidden focus:border-rose-400 disabled:bg-slate-50"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Title / Grade / Role
                      </label>
                      <input
                        type="text"
                        value={sub.role}
                        disabled={!isEditable}
                        onChange={(e) => {
                          const next = [...interviews.subjects]
                          next[i] = { ...next[i], role: e.target.value }
                          onChangeInterviews((prev) => ({ ...prev, subjects: next }))
                        }}
                        className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-hidden focus:border-rose-400 disabled:bg-slate-50"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Due Process Compliance
                      </label>
                      <div className="flex items-center gap-4 h-9">
                        <label className="flex items-center gap-1.5 text-xs text-slate-700 font-medium cursor-pointer">
                          <input
                            type="checkbox"
                            checked={sub.legalCounselPresent}
                            disabled={!isEditable}
                            onChange={(e) => {
                              const next = [...interviews.subjects]
                              next[i] = { ...next[i], legalCounselPresent: e.target.checked }
                              onChangeInterviews((prev) => ({ ...prev, subjects: next }))
                            }}
                            className="w-3.5 h-3.5 text-cbe-purple rounded accent-cbe-purple"
                          />
                          <span>Counsel Present</span>
                        </label>
                        <label className="flex items-center gap-1.5 text-xs text-slate-700 font-medium cursor-pointer">
                          <input
                            type="checkbox"
                            checked={sub.rightsInformed}
                            disabled={!isEditable}
                            onChange={(e) => {
                              const next = [...interviews.subjects]
                              next[i] = { ...next[i], rightsInformed: e.target.checked }
                              onChangeInterviews((prev) => ({ ...prev, subjects: next }))
                            }}
                            className="w-3.5 h-3.5 text-cbe-purple rounded accent-cbe-purple"
                          />
                          <span>Due Process Advised</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-semibold text-slate-700">
                      Subject Explanation / Recorded Defense Statement
                    </label>
                    <RichTextEditor
                      content={sub.recordedDefense}
                      onChange={(val) => {
                        const next = [...interviews.subjects]
                        next[i] = { ...next[i], recordedDefense: val }
                        onChangeInterviews((prev) => ({ ...prev, subjects: next }))
                      }}
                      placeholder=""
                      minHeight="120px"
                      title={`Subject Interview: ${sub.name || `Subject ${i + 1}`}`}
                      readOnly={!isEditable}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Step 3 Footer Nav */}
      <div className="flex items-center justify-between pt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          className="text-xs font-semibold flex items-center gap-1.5 h-9 px-4 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Step 2: Evidence &amp; Forensics</span>
        </Button>
        <Button
          size="sm"
          onClick={onNext}
          className="bg-cbe-purple text-white hover:bg-cbe-purple-700 text-xs font-semibold flex items-center gap-1.5 h-9 px-4 cursor-pointer"
        >
          <span>Proceed to Step 4: Final Investigation Report</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  )
}
