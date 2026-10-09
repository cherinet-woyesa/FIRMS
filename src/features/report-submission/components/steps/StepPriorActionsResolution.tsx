import React, { useState, useEffect } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { ChevronDown, ShieldCheck, Loader2 } from 'lucide-react'
import type { CorruptionReportInput } from '../../types/report.types'
import { RESOLUTIONS_SOUGHT } from '@/constants/categories'
import {
  fetchAllegationSubjectTypes,
  type AllegationSubjectTypeLookup,
} from '../../api/lookupsApi'

interface StepProps {
  form: UseFormReturn<CorruptionReportInput>
}

const DEFAULT_SUBJECT_TYPES: AllegationSubjectTypeLookup[] = [
  {
    id: 1,
    name: 'Other',
    label: 'Standard Employee / Branch / Department',
    routingDescription: 'Standard intake handling (Routes to Ethics & Compliance Division / RMCD)',
    targetRecipient: 'Risk Management & Compliance Division',
  },
  {
    id: 2,
    name: 'RMCDEmployee',
    label: 'Risk Management & Compliance Official',
    routingDescription: 'Bypasses Division (Directly routes to President\'s Office)',
    targetRecipient: 'President',
  },
  {
    id: 3,
    name: 'President',
    label: 'Executive Leadership / President',
    routingDescription: 'Bypasses Management (Directly routes to Board Audit Committee)',
    targetRecipient: 'Board Audit Committee',
  },
]

export const StepPriorActionsResolution: React.FC<StepProps> = ({ form }) => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form

  const [subjectTypes, setSubjectTypes] = useState<AllegationSubjectTypeLookup[]>(DEFAULT_SUBJECT_TYPES)
  const [isLoading, setIsLoading] = useState(false)

  const currentSubjectType = watch('subjectType') ?? 1

  useEffect(() => {
    let isMounted = true
    async function loadSubjectTypes() {
      try {
        setIsLoading(true)
        const res = await fetchAllegationSubjectTypes()
        if (isMounted && res && res.length > 0) {
          setSubjectTypes(res)
        }
      } catch (err) {
        console.error('Failed to load allegation subject types:', err)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }
    loadSubjectTypes()
    return () => {
      isMounted = false
    }
  }, [])

  // Find currently selected item to show routing preview
  const selectedSubject = subjectTypes.find((s) => s.id === Number(currentSubjectType)) || subjectTypes[0]

  const handleSubjectTypeChange = (subjectId: number) => {
    const selected = subjectTypes.find((s) => s.id === subjectId)
    if (selected) {
      setValue('subjectType', selected.id, { shouldValidate: true })
      setValue('reportRecipient', selected.targetRecipient, { shouldValidate: true })
    }
  }

  return (
    <div className="space-y-6">
      {/* 1. Prior Reports */}
      <div className="space-y-1.5 text-left">
        <label className="block text-sm font-semibold text-slate-800">
          Prior Reports <span className="text-rose-500">*</span>
        </label>
        <textarea
          rows={3}
          placeholder="Have you reported this matter internally or to any other authority (e.g. Branch Supervisor, HR, Police, Ethics Commission)? If not, please enter 'None'..."
          {...register('priorReports')}
          className="w-full rounded-md border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#95298E]/20 focus:border-[#95298E] transition resize-none"
        />
        {errors.priorReports && (
          <p className="text-xs text-rose-500 mt-1">{errors.priorReports.message}</p>
        )}
      </div>

      {/* Horizontal Divider */}
      <div className="border-t border-slate-100" />

      {/* 2. Resolution Sought & Oversight Routing */}
      <div className="space-y-4 text-left">
        <h3 className="text-sm font-semibold text-slate-800">
          Resolution Sought &amp; Intake Routing
        </h3>

        {/* Resolution Sought Dropdown */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-600">
            Resolution or Action Sought <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <select
              {...register('resolutionSought')}
              className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-3.5 pr-8 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#95298E]/20 focus:border-[#95298E] transition cursor-pointer"
            >
              <option value="">Select the primary outcome or remedy sought...</option>
              {RESOLUTIONS_SOUGHT.map((res) => (
                <option key={res.id} value={res.label}>
                  {res.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
          {errors.resolutionSought && (
            <p className="text-xs text-rose-500 mt-1">{errors.resolutionSought.message}</p>
          )}
        </div>

        {/* Report Made Against (Routing) - Dynamically loaded from Backend */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-medium text-slate-600">
              Report Target Level (Determines Direct Confidential Routing) <span className="text-rose-500">*</span>
            </label>
            {isLoading && (
              <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin text-cbe-purple" />
                Loading routing targets...
              </span>
            )}
          </div>
          <div className="relative">
            <select
              value={currentSubjectType}
              onChange={(e) => handleSubjectTypeChange(Number(e.target.value))}
              className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-3.5 pr-8 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#95298E]/20 focus:border-[#95298E] transition cursor-pointer"
            >
              {subjectTypes.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.label || st.name} — {st.routingDescription}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>

          {/* Confidential Routing Assurance Badge */}
          {selectedSubject && (
            <div className="flex items-center gap-2 mt-2 px-3 py-2 bg-purple-50/70 border border-purple-200/60 rounded-lg text-xs text-purple-900">
              <ShieldCheck className="w-4 h-4 text-cbe-purple shrink-0" />
              <span>
                Target Handling Recipient: <strong>{selectedSubject.targetRecipient}</strong>
                {selectedSubject.routingDescription ? ` (${selectedSubject.routingDescription})` : ''}
              </span>
            </div>
          )}

          {errors.reportRecipient && (
            <p className="text-xs text-rose-500 mt-1">{errors.reportRecipient.message}</p>
          )}
        </div>
      </div>

      {/* Horizontal Divider */}
      <div className="border-t border-slate-100" />

      {/* 3. Whistleblower Good-Faith Declaration */}
      <div className="p-4 rounded-lg bg-slate-50/80 border border-slate-200/80 text-left space-y-2">
        <div className="flex items-center gap-2 text-cbe-purple">
          <ShieldCheck className="w-4 h-4" />
          <span className="text-xs font-semibold uppercase tracking-wider">Good-Faith Declaration</span>
        </div>
        <label className="flex items-start gap-3 cursor-pointer pt-1">
          <input
            type="checkbox"
            {...register('confirmationAcknowledged')}
            className="w-4 h-4 mt-0.5 text-cbe-purple rounded border-slate-300 focus:ring-cbe-purple cursor-pointer accent-[#95298E]"
          />
          <span className="text-xs text-slate-700 leading-relaxed font-medium">
            I confirm that this report is submitted in good faith and that all information, narratives, and claims provided are true, accurate, and unmanipulated to the best of my knowledge.
          </span>
        </label>
        {errors.confirmationAcknowledged && (
          <p className="text-xs text-rose-500 font-medium pl-7">{errors.confirmationAcknowledged.message}</p>
        )}
      </div>
    </div>
  )
}

