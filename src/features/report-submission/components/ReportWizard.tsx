import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Lock, ShieldCheck, Send } from 'lucide-react'
import { reportSubmissionSchema, type ReportSubmissionInput, type ReportSubmissionResult } from '../types/report.types'
import { submitWhistleblowerReport } from '../api/submitReport'
import { ReportReceipt } from './ReportReceipt'
import { INCIDENT_CATEGORIES } from '@/constants/categories'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export const ReportWizard: React.FC = () => {
  const [submissionResult, setSubmissionResult] = useState<ReportSubmissionResult | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ReportSubmissionInput>({
    resolver: zodResolver(reportSubmissionSchema),
    defaultValues: {
      category: INCIDENT_CATEGORIES[0].label,
      targetDepartment: '',
      incidentDate: '',
      description: '',
      isAnonymous: true,
      contactEmail: '',
    },
  })

  const isAnonymous = watch('isAnonymous')

  const onSubmit = async (data: ReportSubmissionInput) => {
    const result = await submitWhistleblowerReport(data)
    setSubmissionResult(result)
  }

  if (submissionResult) {
    return (
      <ReportReceipt
        result={submissionResult}
        onReset={() => setSubmissionResult(null)}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Confidential Incident Report
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Safely disclose corporate misconduct, fraud, safety violations, or ethical breaches.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-6">
        {/* Category & Department */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-1.5 text-left">
            <label className="block text-xs font-semibold text-slate-700">
              Incident Category <span className="text-rose-500">*</span>
            </label>
            <select
              {...register('category')}
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              {INCIDENT_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.label}>
                  {cat.label}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-xs text-rose-500 mt-1">{errors.category.message}</p>
            )}
          </div>

          <Input
            label="Involved Department / Unit"
            placeholder="e.g. Finance, Procurement, Logistics"
            {...register('targetDepartment')}
          />
        </div>

        {/* Date of Incident */}
        <div className="w-full sm:w-64">
          <Input
            label="Approximate Incident Date"
            type="date"
            error={errors.incidentDate?.message}
            {...register('incidentDate')}
          />
        </div>

        {/* Narrative Description */}
        <div className="space-y-1.5 text-left">
          <label className="block text-xs font-semibold text-slate-700">
            Incident Description & Evidence Summary <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={6}
            placeholder="Please detail what occurred, individuals involved, dates, locations, and any documentary evidence in your possession..."
            {...register('description')}
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 leading-relaxed"
          />
          {errors.description && (
            <p className="text-xs text-rose-500 mt-1">{errors.description.message}</p>
          )}
        </div>

        {/* Anonymity Box */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              {...register('isAnonymous')}
              className="w-4 h-4 text-slate-900 rounded border-slate-300 focus:ring-slate-900 cursor-pointer"
            />
            <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              Maintain 100% Anonymous Identity (Recommended)
            </span>
          </label>

          {!isAnonymous && (
            <div className="pt-2 sm:w-80">
              <Input
                label="Confidential Contact Email (Optional)"
                type="email"
                placeholder="you@company.com"
                error={errors.contactEmail?.message}
                {...register('contactEmail')}
              />
            </div>
          )}
        </div>

        {/* Form Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <span className="text-xs text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            Zero-Knowledge Encrypted Transmission
          </span>

          <Button type="submit" isLoading={isSubmitting} size="lg" className="w-full sm:w-auto">
            <Send className="w-4 h-4" />
            Submit Incident Report
          </Button>
        </div>
      </form>
    </div>
  )
}
