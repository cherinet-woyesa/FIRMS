import React from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { useLocation } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import type { CorruptionReportInput } from '../../types/report.types'
import { REPORTER_RELATIONSHIPS } from '@/constants/categories'

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

  const location = useLocation()
  const isDashboard = location.pathname.includes('/dashboard')

  const reportingMode = watch('reportingMode')

  return (
    <div className="space-y-6">
      {/* Question 1: How would you like to report? */}
      <div className="text-left">
        <label className="block text-sm font-semibold text-slate-800 mb-3">
          How would you like to report?
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Anonymous Option */}
          <button
            type="button"
            onClick={() => {
              setValue('reportingMode', 'anonymous')
              setValue('fullName', '')
              setValue('phoneNumber', '')
              setValue('email', '')
              setValue('physicalAddress', '')
            }}
            className={`px-4 py-3 rounded-lg border text-left transition cursor-pointer flex items-center gap-3 bg-white ${
              reportingMode === 'anonymous'
                ? 'border-[#95298E] ring-1 ring-[#95298E]'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition ${
                reportingMode === 'anonymous'
                  ? 'border-[#95298E]'
                  : 'border-slate-400'
              }`}
            >
              {reportingMode === 'anonymous' && (
                <div className="w-2 h-2 rounded-full bg-[#95298E]" />
              )}
            </div>
            <span className="text-sm font-medium text-slate-800">Anonymous</span>
          </button>

          {/* Confidential Option */}
          <button
            type="button"
            onClick={() => setValue('reportingMode', 'confidential')}
            className={`px-4 py-3 rounded-lg border text-left transition cursor-pointer flex items-center gap-3 bg-white ${
              reportingMode === 'confidential'
                ? 'border-[#95298E] ring-1 ring-[#95298E]'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition ${
                reportingMode === 'confidential'
                  ? 'border-[#95298E]'
                  : 'border-slate-400'
              }`}
            >
              {reportingMode === 'confidential' && (
                <div className="w-2 h-2 rounded-full bg-[#95298E]" />
              )}
            </div>
            <span className="text-sm font-medium text-slate-800">Confidential</span>
          </button>

          {/* Optional Escalation for Dashboard Staff */}
          {isDashboard && (
            <button
              type="button"
              onClick={() => setValue('reportingMode', 'standard')}
              className={`px-4 py-3 rounded-lg border text-left transition cursor-pointer flex items-center gap-3 bg-white sm:col-span-2 ${
                reportingMode === 'standard'
                  ? 'border-[#95298E] ring-1 ring-[#95298E]'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition ${
                  reportingMode === 'standard'
                    ? 'border-[#95298E]'
                    : 'border-slate-400'
                }`}
              >
                {reportingMode === 'standard' && (
                  <div className="w-2 h-2 rounded-full bg-[#95298E]" />
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-slate-800">Escalated / Formal Intake</span>
                <span className="text-[11px] text-slate-500 font-normal">President's Office / Branches</span>
              </div>
            </button>
          )}
        </div>
        {errors.reportingMode && (
          <p className="text-xs text-rose-500 mt-1">{errors.reportingMode.message}</p>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-slate-100" />

      {/* "Your information" Section (visible when confidential or standard) */}
      {reportingMode !== 'anonymous' && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-800 text-left">Your information</h3>

          {/* Full Name */}
          <div className="space-y-1.5 text-left">
            <label className="block text-xs font-medium text-slate-700">
              Full Name
            </label>
            <input
              type="text"
              placeholder=""
              {...register('fullName')}
              className="w-full rounded-md border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#95298E]/20 focus:border-[#95298E] transition"
            />
            {errors.fullName && (
              <p className="text-xs text-rose-500 mt-1">{errors.fullName.message}</p>
            )}
          </div>

          {/* Contact Information */}
          <div className="space-y-2.5 pt-1">
            <h4 className="text-xs font-semibold text-slate-800 text-left">Contact Information</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 text-left">
                <label className="block text-xs font-medium text-slate-600">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder=""
                  {...register('phoneNumber')}
                  className="w-full rounded-md border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#95298E]/20 focus:border-[#95298E] transition"
                />
                {errors.phoneNumber && (
                  <p className="text-xs text-rose-500 mt-1">{errors.phoneNumber.message}</p>
                )}
              </div>

              <div className="space-y-1.5 text-left">
                <label className="block text-xs font-medium text-slate-600">
                  Email
                </label>
                <input
                  type="email"
                  placeholder=""
                  {...register('email')}
                  className="w-full rounded-md border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#95298E]/20 focus:border-[#95298E] transition"
                />
                {errors.email && (
                  <p className="text-xs text-rose-500 mt-1">{errors.email.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Physical Address */}
          <div className="space-y-1.5 text-left pt-1">
            <label className="block text-xs font-medium text-slate-600">
              Physical Address
            </label>
            <textarea
              rows={3}
              placeholder=""
              {...register('physicalAddress')}
              className="w-full rounded-md border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#95298E]/20 focus:border-[#95298E] transition resize-none"
            />
            {errors.physicalAddress && (
              <p className="text-xs text-rose-500 mt-1">{errors.physicalAddress.message}</p>
            )}
          </div>

          {/* Divider below Physical Address */}
          <div className="border-t border-slate-100 pt-2" />
        </div>
      )}

      {/* Relationship to the Situation */}
      <div className="space-y-1.5 text-left">
        <label className="block text-xs font-semibold text-slate-800">
          Relationship to the Situation
        </label>
        <div className="relative">
          <select
            {...register('relationship')}
            className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-8 pr-8 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#95298E]/20 focus:border-[#95298E] transition cursor-pointer"
          >
            <option value="">Select relationship...</option>
            {REPORTER_RELATIONSHIPS.map((rel) => (
              <option key={rel.id} value={rel.label}>
                {rel.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
        {errors.relationship && (
          <p className="text-xs text-rose-500 mt-1">{errors.relationship.message}</p>
        )}
      </div>
    </div>
  )
}
