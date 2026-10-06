import React from 'react'
import type { UseFormReturn } from 'react-hook-form'
import type { CorruptionReportInput } from '../../types/report.types'

interface StepProps {
  form: UseFormReturn<CorruptionReportInput>
}

const CORRUPTION_OPTIONS = [
  { id: 'Bribery', label: 'Bribery' },
  { id: 'Embezzlement', label: 'Embezzlement' },
  { id: 'Fraud', label: 'Fraud' },
  { id: 'Abuse of Power', label: 'Abuse of Power' },
  { id: 'Nepotism', label: 'Nepotism' },
  { id: 'Other', label: 'Other' },
]

export const StepIncidentDetails: React.FC<StepProps> = ({ form }) => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form

  const selectedType = watch('corruptionType')

  return (
    <div className="space-y-6">
      {/* 1. Type of Corruption */}
      <div className="text-left">
        <label className="block text-sm font-semibold text-slate-800 mb-3">
          Type of Corruption
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {CORRUPTION_OPTIONS.map((option) => {
            const isSelected = selectedType === option.id || selectedType === option.label
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setValue('corruptionType', option.id, { shouldValidate: true })}
                className={`px-3.5 py-2.5 rounded-lg border text-left transition cursor-pointer flex items-center gap-3 bg-white ${
                  isSelected
                    ? 'border-[#95298E] ring-1 ring-[#95298E]'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition ${
                    isSelected
                      ? 'border-[#95298E]'
                      : 'border-slate-300'
                  }`}
                >
                  {isSelected && (
                    <div className="w-2 h-2 rounded-full bg-[#95298E]" />
                  )}
                </div>
                <span className="text-xs sm:text-sm font-medium text-slate-800">
                  {option.label}
                </span>
              </button>
            )
          })}
        </div>
        {errors.corruptionType && (
          <p className="text-xs text-rose-500 mt-1">{errors.corruptionType.message}</p>
        )}
      </div>

      {/* 2. Summary of Allegation */}
      <div className="space-y-1.5 text-left pt-1">
        <label className="block text-sm font-semibold text-slate-800">
          Summary of Allegation
        </label>
        <textarea
          rows={4}
          placeholder=""
          {...register('summary')}
          className="w-full rounded-md border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#95298E]/20 focus:border-[#95298E] transition resize-none"
        />
        {errors.summary && (
          <p className="text-xs text-rose-500 mt-1">{errors.summary.message}</p>
        )}
      </div>

      {/* Horizontal Divider */}
      <div className="border-t border-slate-100" />

      {/* 3. Detailed Narrative with Guided Prompts */}
      <div className="space-y-2 text-left">
        <label className="block text-sm font-semibold text-slate-800">
          Detailed Narrative
        </label>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Left: Multiline Textarea */}
          <div className="md:col-span-8">
            <textarea
              rows={10}
              placeholder=""
              {...register('detailedNarrative')}
              className="w-full h-64 sm:h-72 rounded-md border border-slate-200 bg-white p-3.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#95298E]/20 focus:border-[#95298E] transition resize-none"
            />
            {errors.detailedNarrative && (
              <p className="text-xs text-rose-500 mt-1">{errors.detailedNarrative.message}</p>
            )}
          </div>

          {/* Right: Guided Prompt Checklist */}
          <div className="md:col-span-4 flex flex-col justify-between h-64 sm:h-72 py-3 text-xs font-semibold text-slate-700">
            <div>What happened?</div>
            <div>When did it happen?</div>
            <div>How did you become aware of it?</div>
            <div>Where did it take place?</div>
            <div>Why do you believe this is corrupt?</div>
          </div>
        </div>
      </div>
    </div>
  )
}

