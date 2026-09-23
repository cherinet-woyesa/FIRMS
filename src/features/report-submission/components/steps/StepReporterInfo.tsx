import React from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { UserCheck, EyeOff } from 'lucide-react'
import type { CorruptionReportInput } from '../../types/report.types'
import { REPORTER_RELATIONSHIPS } from '@/constants/categories'
import { Input } from '@/components/ui/Input'

interface StepProps {
  form: UseFormReturn<CorruptionReportInput>
}

export const StepReporterInfo: React.FC<StepProps> = ({ form }) => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form

  const reportingMode = watch('reportingMode')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-3">
        <h2 className="text-xl font-bold text-slate-900">
          Reporter Information
        </h2>
      </div>

      {/* Mode Selection Cards - Just the Titles */}
      <div className="space-y-2 text-left">
        <label className="block text-xs font-semibold text-slate-700">
          Reporting Option <span className="text-rose-500">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => {
              setValue('reportingMode', 'anonymous')
              setValue('fullName', '')
              setValue('phoneNumber', '')
              setValue('email', '')
              setValue('physicalAddress', '')
            }}
            className={`p-3.5 rounded-xl border text-left transition cursor-pointer flex items-center justify-between ${reportingMode === 'anonymous'
                ? 'border-cbe-purple bg-cbe-purple-50/60 ring-2 ring-cbe-purple'
                : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cbe-purple-100 flex items-center justify-center text-cbe-purple shrink-0">
                <EyeOff className="w-4 h-4" />
              </div>
              <span className="font-semibold text-slate-900 text-sm">Remain Anonymous</span>
            </div>
            {reportingMode === 'anonymous' && (
              <span className="text-xs font-semibold text-cbe-purple">Selected</span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setValue('reportingMode', 'confidential')}
            className={`p-3.5 rounded-xl border text-left transition cursor-pointer flex items-center justify-between ${reportingMode === 'confidential'
                ? 'border-cbe-purple bg-cbe-purple-50/60 ring-2 ring-cbe-purple'
                : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cbe-gold-100 flex items-center justify-center text-cbe-gold-600 shrink-0">
                <UserCheck className="w-4 h-4" />
              </div>
              <span className="font-semibold text-slate-900 text-sm">Treated as Confidential</span>
            </div>
            {reportingMode === 'confidential' && (
              <span className="text-xs font-semibold text-cbe-purple">Selected</span>
            )}
          </button>
        </div>
        {errors.reportingMode && (
          <p className="text-xs text-rose-500 mt-1">{errors.reportingMode.message}</p>
        )}
      </div>

      {/* Relationship */}
      <div className="space-y-1.5 text-left">
        <label className="block text-xs font-semibold text-slate-700">
          Relationship to the Situation <span className="text-rose-500">*</span>
        </label>
        <select
          {...register('relationship')}
          className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-cbe-purple focus:border-cbe-purple"
        >
          <option value="">Select relationship</option>
          {REPORTER_RELATIONSHIPS.map((rel) => (
            <option key={rel.id} value={rel.label}>
              {rel.label}
            </option>
          ))}
        </select>
        {errors.relationship && (
          <p className="text-xs text-rose-500 mt-1">{errors.relationship.message}</p>
        )}
      </div>

      {/* Optional Contact Fields (Visible if Confidential) */}
      {reportingMode === 'confidential' && (
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name (Optional)"
              placeholder="Your name"
              error={errors.fullName?.message}
              {...register('fullName')}
            />

            <Input
              label="Phone Number (Optional)"
              placeholder="Your phone number"
              error={errors.phoneNumber?.message}
              {...register('phoneNumber')}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email (Optional)"
              type="email"
              placeholder="Your email address"
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Physical Address (Optional)"
              placeholder="City, sub-city, or address"
              error={errors.physicalAddress?.message}
              {...register('physicalAddress')}
            />
          </div>
        </div>
      )}
    </div>
  )
}
