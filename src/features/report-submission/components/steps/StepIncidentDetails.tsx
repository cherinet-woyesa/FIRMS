import React from 'react'
import type { UseFormReturn } from 'react-hook-form'
import type { CorruptionReportInput } from '../../types/report.types'
import { CORRUPTION_TYPES } from '@/constants/categories'
import { Input } from '@/components/ui/Input'

interface StepProps {
  form: UseFormReturn<CorruptionReportInput>
}

export const StepIncidentDetails: React.FC<StepProps> = ({ form }) => {
  const {
    register,
    formState: { errors },
  } = form

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-3">
        <h2 className="text-xl font-bold text-slate-900">
          Section 2: Details of the Incident(s)
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Focus on facts, not assumptions or opinions.
        </p>
      </div>

      {/* Type of Corruption */}
      <div className="space-y-1.5 text-left">
        <label className="block text-xs font-semibold text-slate-700">
          Type of Corruption <span className="text-rose-500">*</span>
        </label>
        <select
          {...register('corruptionType')}
          className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-cbe-purple focus:border-cbe-purple"
        >
          <option value="">Select type of corruption</option>
          {CORRUPTION_TYPES.map((type) => (
            <option key={type.id} value={type.label}>
              {type.label}
            </option>
          ))}
        </select>
        {errors.corruptionType && (
          <p className="text-xs text-rose-500 mt-1">{errors.corruptionType.message}</p>
        )}
      </div>

      {/* Summary of Allegation */}
      <div className="space-y-1.5 text-left">
        <label className="block text-xs font-semibold text-slate-700">
          Summary of Allegation <span className="text-rose-500">*</span>
        </label>
        <textarea
          rows={3}
          placeholder="A single, concise paragraph that summarizes the entire issue..."
          {...register('summary')}
          className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cbe-purple focus:border-cbe-purple"
        />
        {errors.summary && (
          <p className="text-xs text-rose-500 mt-1">{errors.summary.message}</p>
        )}
      </div>

      {/* Two-Column: When and Where */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="When did it happen? *"
          placeholder="Specific dates, date range, or approximate times"
          error={errors.incidentDate?.message}
          {...register('incidentDate')}
        />

        <Input
          label="Where did it take place? *"
          placeholder="Specific office, branch, or address"
          error={errors.incidentLocation?.message}
          {...register('incidentLocation')}
        />
      </div>

      {/* How Did You Become Aware */}
      <div className="space-y-1.5 text-left">
        <label className="block text-xs font-semibold text-slate-700">
          How did you become aware of it? <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          placeholder="Witnessed directly, was a victim, or told by someone"
          {...register('howAware')}
          className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cbe-purple focus:border-cbe-purple"
        />
        {errors.howAware && (
          <p className="text-xs text-rose-500 mt-1">{errors.howAware.message}</p>
        )}
      </div>

      {/* Detailed Narrative */}
      <div className="space-y-1.5 text-left">
        <label className="block text-xs font-semibold text-slate-700">
          Detailed Narrative (What happened?) <span className="text-rose-500">*</span>
        </label>
        <textarea
          rows={5}
          placeholder="Describe the events in chronological order: what happened, exact act of corruption..."
          {...register('detailedNarrative')}
          className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cbe-purple focus:border-cbe-purple leading-relaxed"
        />
        {errors.detailedNarrative && (
          <p className="text-xs text-rose-500 mt-1">{errors.detailedNarrative.message}</p>
        )}
      </div>

      {/* Why is this corrupt */}
      <div className="space-y-1.5 text-left">
        <label className="block text-xs font-semibold text-slate-700">
          Why do you believe this is corrupt? <span className="text-rose-500">*</span>
        </label>
        <textarea
          rows={3}
          placeholder="Connect the action to abuse of public/bank office or misuse of funds..."
          {...register('whyCorrupt')}
          className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cbe-purple focus:border-cbe-purple"
        />
        {errors.whyCorrupt && (
          <p className="text-xs text-rose-500 mt-1">{errors.whyCorrupt.message}</p>
        )}
      </div>
    </div>
  )
}
