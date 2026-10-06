import React, { useState } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { Plus } from 'lucide-react'
import type { CorruptionReportInput } from '../../types/report.types'

interface StepProps {
  form: UseFormReturn<CorruptionReportInput>
}

interface PersonEntry {
  id: string
  fullName: string
  jobPosition: string
  otherInfo: string
}

export const StepCorruptedParties: React.FC<StepProps> = ({ form }) => {
  const {
    register,
    setValue,
    getValues,
    formState: { errors },
  } = form

  // Manage dynamic persons list
  const [persons, setPersons] = useState<PersonEntry[]>(() => {
    const existingName = getValues('corruptedPersonNames') || ''
    const existingJob = getValues('jobPositions') || ''
    const existingInfo = getValues('otherIdentifyingInfo') || ''

    return [
      {
        id: '1',
        fullName: existingName,
        jobPosition: existingJob,
        otherInfo: existingInfo,
      },
    ]
  })

  // Synchronize dynamic persons back to the main form schema fields
  const syncToForm = (updatedPersons: PersonEntry[]) => {
    setPersons(updatedPersons)

    const names = updatedPersons
      .map((p) => p.fullName.trim())
      .filter(Boolean)
      .join(', ')

    const jobs = updatedPersons
      .map((p) => p.jobPosition.trim())
      .filter(Boolean)
      .join(', ')

    const other = updatedPersons
      .map((p, idx) =>
        p.otherInfo.trim()
          ? `Person ${idx + 1} (${p.fullName || 'Unnamed'}): ${p.otherInfo.trim()}`
          : ''
      )
      .filter(Boolean)
      .join('\n')

    setValue('corruptedPersonNames', names, { shouldValidate: true })
    setValue('jobPositions', jobs, { shouldValidate: true })
    setValue('otherIdentifyingInfo', other)
  }

  const handlePersonChange = (
    index: number,
    field: keyof Omit<PersonEntry, 'id'>,
    value: string
  ) => {
    const updated = persons.map((p, i) =>
      i === index ? { ...p, [field]: value } : p
    )
    syncToForm(updated)
  }

  const addPerson = () => {
    const newPerson: PersonEntry = {
      id: Date.now().toString(),
      fullName: '',
      jobPosition: '',
      otherInfo: '',
    }
    syncToForm([...persons, newPerson])
  }

  const removePerson = (indexToRemove: number) => {
    if (persons.length <= 1) return
    const updated = persons.filter((_, i) => i !== indexToRemove)
    syncToForm(updated)
  }

  return (
    <div className="space-y-6">
      {/* 1. Organization details */}
      <div className="space-y-4 text-left">
        <h3 className="text-sm font-semibold text-slate-800">
          Organization details
        </h3>

        {/* Division/Region/Department/District/Branch/Unit */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-600">
            Name of Division/Region/Department/District/Branch/Unit
          </label>
          <input
            type="text"
            placeholder=""
            {...register('divisionDepartmentBranch')}
            className="w-full rounded-md border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#95298E]/20 focus:border-[#95298E] transition"
          />
          {errors.divisionDepartmentBranch && (
            <p className="text-xs text-rose-500 mt-1">{errors.divisionDepartmentBranch.message}</p>
          )}
        </div>

        {/* Department/Office & Address/Region */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-600">
              Department/Office
            </label>
            <input
              type="text"
              placeholder=""
              {...register('departmentOffice')}
              className="w-full rounded-md border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#95298E]/20 focus:border-[#95298E] transition"
            />
            {errors.departmentOffice && (
              <p className="text-xs text-rose-500 mt-1">{errors.departmentOffice.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-600">
              Address/Region
            </label>
            <input
              type="text"
              placeholder=""
              {...register('organizationAddress')}
              className="w-full rounded-md border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#95298E]/20 focus:border-[#95298E] transition"
            />
            {errors.organizationAddress && (
              <p className="text-xs text-rose-500 mt-1">{errors.organizationAddress.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* 2. Person allegedly involved */}
      <div className="space-y-4 text-left pt-2">
        <h3 className="text-sm font-semibold text-slate-800">
          Person allegedly involved
        </h3>

        {/* Dynamic Person Cards */}
        <div className="space-y-4">
          {persons.map((person, index) => (
            <div
              key={person.id}
              className="border border-slate-200 rounded-lg p-4 bg-white space-y-3 shadow-2xs"
            >
              {/* Card Header with Person label and Remove button */}
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-semibold text-slate-800">
                  Person {index + 1}
                </span>
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removePerson(index)}
                    className="text-xs font-semibold text-[#95298E] hover:underline cursor-pointer transition"
                  >
                    Remove
                  </button>
                )}
              </div>

              {/* Full name & Job position */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-slate-600">
                    Full name
                  </label>
                  <input
                    type="text"
                    placeholder=""
                    value={person.fullName}
                    onChange={(e) =>
                      handlePersonChange(index, 'fullName', e.target.value)
                    }
                    className="w-full rounded-md border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#95298E]/20 focus:border-[#95298E] transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-slate-600">
                    Job position
                  </label>
                  <input
                    type="text"
                    placeholder=""
                    value={person.jobPosition}
                    onChange={(e) =>
                      handlePersonChange(index, 'jobPosition', e.target.value)
                    }
                    className="w-full rounded-md border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#95298E]/20 focus:border-[#95298E] transition"
                  />
                </div>
              </div>

              {/* Other identifying information */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-600">
                  Other identifying Information
                </label>
                <textarea
                  rows={3}
                  placeholder=""
                  value={person.otherInfo}
                  onChange={(e) =>
                    handlePersonChange(index, 'otherInfo', e.target.value)
                  }
                  className="w-full rounded-md border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#95298E]/20 focus:border-[#95298E] transition resize-none"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Validation Errors for corrupted person names & job positions */}
        {(errors.corruptedPersonNames || errors.jobPositions) && (
          <p className="text-xs text-rose-500 mt-1">
            {errors.corruptedPersonNames?.message || errors.jobPositions?.message}
          </p>
        )}

        {/* Add another person button */}
        <div className="pt-1">
          <button
            type="button"
            onClick={addPerson}
            className="border border-slate-200 rounded-md px-3.5 py-2 text-xs font-semibold text-[#95298E] bg-white hover:bg-purple-50/50 hover:border-cbe-purple/40 transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add another person</span>
          </button>
        </div>
      </div>
    </div>
  )
}


