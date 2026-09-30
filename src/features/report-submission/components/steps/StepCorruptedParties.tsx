import React from 'react'
import type { UseFormReturn } from 'react-hook-form'
import type { CorruptionReportInput } from '../../types/report.types'
import { Input } from '@/components/ui/Input'

interface StepProps {
  form: UseFormReturn<CorruptionReportInput>
}

export const StepCorruptedParties: React.FC<StepProps> = ({ form }) => {
  const {
    register,
    formState: { errors },
  } = form

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-3">
        <h2 className="text-xl font-bold text-slate-900">
          Details of Corrupted Person(s) and Organization
        </h2>

      </div>

      {/* Organization details */}
      <div className="space-y-4">
        <Input
          label="Division / Region / District / Branch / Unit *"
          placeholder="e.g. Central Region / Merkato District / Abakoran Branch"
          error={errors.divisionDepartmentBranch?.message}
          {...register('divisionDepartmentBranch')}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Department / Office"
            placeholder="e.g. Credit, Trade Service, Vault"
            error={errors.departmentOffice?.message}
            {...register('departmentOffice')}
          />

          <Input
            label="Address / Region"
            placeholder="Physical location of the office or branch"
            error={errors.organizationAddress?.message}
            {...register('organizationAddress')}
          />
        </div>
      </div>

      {/* People involved */}
      <div className="space-y-4 pt-2 border-t border-slate-100">
        <Input
          label="Corrupted Person(s) Name(s) *"
          placeholder="Full name(s) if known"
          error={errors.corruptedPersonNames?.message}
          {...register('corruptedPersonNames')}
        />

        <Input
          label="Job Position(s) *"
          placeholder="e.g. Director, Manager, Finance Officer, Officer"
          error={errors.jobPositions?.message}
          {...register('jobPositions')}
        />

        <div className="space-y-1.5 text-left">
          <label className="block text-xs font-semibold text-slate-700">
            Other Identifying Information
          </label>
          <textarea
            rows={3}
            placeholder="Employee ID, physical description, personal vehicle if relevant..."
            {...register('otherIdentifyingInfo')}
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cbe-purple focus:border-cbe-purple"
          />
          {errors.otherIdentifyingInfo && (
            <p className="text-xs text-rose-500 mt-1">{errors.otherIdentifyingInfo.message}</p>
          )}
        </div>
      </div>
    </div>
  )
}
