import React from 'react'
import type { UseFormReturn } from 'react-hook-form'
import type { CorruptionReportInput } from '../../types/report.types'
import { RESOLUTIONS_SOUGHT } from '@/constants/categories'

interface StepProps {
  form: UseFormReturn<CorruptionReportInput>
}

export const StepPriorActionsResolution: React.FC<StepProps> = ({ form }) => {
  const {
    register,
    formState: { errors },
  } = form

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-3">
        <h2 className="text-xl font-bold text-slate-900">
          Section 5: Previous Actions and Resolution
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Helps understand case history and avoid duplication.
        </p>
      </div>

      {/* Prior Reports */}
      <div className="space-y-1.5 text-left">
        <label className="block text-xs font-semibold text-slate-700">
          Prior Reports <span className="text-rose-500">*</span>
        </label>
        <textarea
          rows={3}
          placeholder="Have you reported this to anyone else? (e.g., Supervisor, HR, Police, another agency) or enter None..."
          {...register('priorReports')}
          className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cbe-purple focus:border-cbe-purple"
        />
        {errors.priorReports && (
          <p className="text-xs text-rose-500 mt-1">{errors.priorReports.message}</p>
        )}
      </div>

      {/* Resolution Sought */}
      <div className="space-y-1.5 text-left">
        <label className="block text-xs font-semibold text-slate-700">
          Resolution Sought <span className="text-rose-500">*</span>
        </label>
        <select
          {...register('resolutionSought')}
          className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-cbe-purple focus:border-cbe-purple"
        >
          <option value="">Select resolution sought</option>
          {RESOLUTIONS_SOUGHT.map((res) => (
            <option key={res.id} value={res.label}>
              {res.label}
            </option>
          ))}
        </select>
        {errors.resolutionSought && (
          <p className="text-xs text-rose-500 mt-1">{errors.resolutionSought.message}</p>
        )}
      </div>

      {/* Declaration checkbox */}
      <div className="pt-2">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            {...register('confirmationAcknowledged')}
            className="w-4 h-4 mt-0.5 text-cbe-purple rounded border-slate-300 focus:ring-cbe-purple cursor-pointer"
          />
          <span className="text-xs text-slate-700 leading-relaxed">
            I confirm that this report is submitted in good faith and the information provided is true and accurate to the best of my knowledge.
          </span>
        </label>
        {errors.confirmationAcknowledged && (
          <p className="text-xs text-rose-500 font-medium mt-1">{errors.confirmationAcknowledged.message}</p>
        )}
      </div>
    </div>
  )
}
