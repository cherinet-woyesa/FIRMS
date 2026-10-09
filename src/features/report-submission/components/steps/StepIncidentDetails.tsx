import React, { useState, useEffect } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import type { CorruptionReportInput } from '../../types/report.types'
import {
  fetchFraudCategories,
  fetchFraudTypes,
  type FraudCategoryLookup,
  type FraudTypeLookup,
} from '../../api/lookupsApi'
import { Loader2 } from 'lucide-react'

interface StepProps {
  form: UseFormReturn<CorruptionReportInput>
}

const DEFAULT_CATEGORIES: FraudCategoryLookup[] = [
  { id: 'C1000000-0000-0000-0000-000000000001', name: 'Bribery and Undue Advantages' },
  { id: 'C2000000-0000-0000-0000-000000000002', name: 'Official Secrecy and Documentation Offenses' },
  { id: 'C3000000-0000-0000-0000-000000000003', name: 'Financial and Other Major Crimes' },
  { id: 'C4000000-0000-0000-0000-000000000004', name: 'Influence and Favoritism' },
]

const DEFAULT_TYPES: FraudTypeLookup[] = [
  // Bribery and Undue Advantages
  { id: 't1', fraudCategoryId: 'C1000000-0000-0000-0000-000000000001', name: 'Bribery (Receiving)' },
  { id: 't2', fraudCategoryId: 'C1000000-0000-0000-0000-000000000001', name: 'Acceptance of Undue Advantages' },
  { id: 't3', fraudCategoryId: 'C1000000-0000-0000-0000-000000000001', name: 'Giving Bribe or Undue Advantage' },
  { id: 't4', fraudCategoryId: 'C1000000-0000-0000-0000-000000000001', name: 'Corruption Committed by Arbitrators' },
  { id: 't5', fraudCategoryId: 'C1000000-0000-0000-0000-000000000001', name: 'Taking Things of Value Without Consideration' },
  { id: 't6', fraudCategoryId: 'C1000000-0000-0000-0000-000000000001', name: 'Kickbacks' },
  // Official Secrecy and Documentation Offenses
  { id: 't7', fraudCategoryId: 'C2000000-0000-0000-0000-000000000002', name: 'Breaches of Official Secrecy' },
  { id: 't8', fraudCategoryId: 'C2000000-0000-0000-0000-000000000002', name: 'Material Forgery of Official Documents' },
  { id: 't9', fraudCategoryId: 'C2000000-0000-0000-0000-000000000002', name: 'Suppression of Official Documents' },
  // Financial and Other Major Crimes
  { id: 't10', fraudCategoryId: 'C3000000-0000-0000-0000-000000000003', name: 'Appropriation and Misappropriation' },
  { id: 't11', fraudCategoryId: 'C3000000-0000-0000-0000-000000000003', name: 'Unlawful Disposal of Object in Charge' },
  { id: 't12', fraudCategoryId: 'C3000000-0000-0000-0000-000000000003', name: 'Illegal Collection or Disbursement' },
  { id: 't13', fraudCategoryId: 'C3000000-0000-0000-0000-000000000003', name: 'Possession of Unexplained Property' },
  { id: 't14', fraudCategoryId: 'C3000000-0000-0000-0000-000000000003', name: 'Aggravated Breach of Trust' },
  { id: 't15', fraudCategoryId: 'C3000000-0000-0000-0000-000000000003', name: 'Aggravated Fraudulent Misrepresentation' },
  { id: 't16', fraudCategoryId: 'C3000000-0000-0000-0000-000000000003', name: 'Money Laundering' },
  { id: 't17', fraudCategoryId: 'C3000000-0000-0000-0000-000000000003', name: 'Fraud' },
  // Influence and Favoritism
  { id: 't18', fraudCategoryId: 'C4000000-0000-0000-0000-000000000004', name: 'Abuse of Power or Responsibility' },
  { id: 't19', fraudCategoryId: 'C4000000-0000-0000-0000-000000000004', name: 'Maladministration' },
  { id: 't20', fraudCategoryId: 'C4000000-0000-0000-0000-000000000004', name: 'Traffic in Official Power or Responsibility' },
  { id: 't21', fraudCategoryId: 'C4000000-0000-0000-0000-000000000004', name: 'Undue Delay of Matters' },
  { id: 't22', fraudCategoryId: 'C4000000-0000-0000-0000-000000000004', name: 'Granting or Approving License Improperly' },
  { id: 't23', fraudCategoryId: 'C4000000-0000-0000-0000-000000000004', name: 'Use of Pretended Authority' },
  { id: 't24', fraudCategoryId: 'C4000000-0000-0000-0000-000000000004', name: 'Traffic in Private Influence' },
  { id: 't25', fraudCategoryId: 'C4000000-0000-0000-0000-000000000004', name: 'Nepotism/Cronyism' },
  { id: 't26', fraudCategoryId: 'C4000000-0000-0000-0000-000000000004', name: 'Conflict of Interest' },
]

export const StepIncidentDetails: React.FC<StepProps> = ({ form }) => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form

  const selectedType = watch('corruptionType')

  const [categories, setCategories] = useState<FraudCategoryLookup[]>(DEFAULT_CATEGORIES)
  const [types, setTypes] = useState<FraudTypeLookup[]>(DEFAULT_TYPES)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    let isMounted = true
    async function loadLookups() {
      try {
        setIsLoading(true)
        const [cats, tps] = await Promise.all([
          fetchFraudCategories(),
          fetchFraudTypes(),
        ])
        if (isMounted) {
          if (cats && cats.length > 0) setCategories(cats)
          if (tps && tps.length > 0) setTypes(tps)
        }
      } catch (err) {
        console.error('Error loading fraud classifications from backend:', err)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }
    loadLookups()
    return () => {
      isMounted = false
    }
  }, [])

  // Handle category change
  const handleCategoryChange = (catId: string) => {
    setSelectedCategoryId(catId)
    const matchedCategory = categories.find((c) => c.id === catId)
    if (matchedCategory) {
      setValue('category', matchedCategory.name)
    } else {
      setValue('category', '')
    }
    // Reset specific corruption type when category changes
    setValue('corruptionType', '', { shouldValidate: true })
  }

  // Filter fraud types for the selected category
  const filteredTypes = selectedCategoryId
    ? types.filter((t) => t.fraudCategoryId === selectedCategoryId)
    : []

  return (
    <div className="space-y-6">
      {/* 1 & 2: Category and Type of Corruption (Dependent Dropdowns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Category Dropdown */}
        <div className="text-left space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="misconduct-category" className="block text-sm font-semibold text-slate-800">
              Category of Misconduct <span className="text-rose-500">*</span>
            </label>
            {isLoading && (
              <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-cbe-purple" />
                Loading...
              </span>
            )}
          </div>
          <select
            id="misconduct-category"
            value={selectedCategoryId}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full rounded-md border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#95298E]/20 focus:border-[#95298E] transition cursor-pointer"
          >
            <option value="">-- Select Category --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Type of Misconduct Dropdown */}
        <div className="text-left space-y-1.5">
          <label htmlFor="misconduct-type" className="block text-sm font-semibold text-slate-800">
            Type of Misconduct / Corruption <span className="text-rose-500">*</span>
          </label>
          <select
            id="misconduct-type"
            disabled={!selectedCategoryId}
            value={selectedType || ''}
            onChange={(e) => setValue('corruptionType', e.target.value, { shouldValidate: true })}
            className="w-full rounded-md border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#95298E]/20 focus:border-[#95298E] transition cursor-pointer disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
          >
            <option value="">
              {!selectedCategoryId ? '-- Select Category First --' : '-- Select Type of Misconduct --'}
            </option>
            {filteredTypes.map((option) => (
              <option key={option.id} value={option.name}>
                {option.name}
              </option>
            ))}
          </select>
          {errors.corruptionType && (
            <p className="text-xs text-rose-500 mt-1">{errors.corruptionType.message}</p>
          )}
        </div>
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

