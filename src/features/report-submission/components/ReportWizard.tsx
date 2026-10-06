import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  ArrowRight,
  ArrowLeft,
  Send,
  Check,
  AlertTriangle,
} from 'lucide-react'
import {
  corruptionReportSchema,
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
  type CorruptionReportInput,
  type ReportSubmissionResult,
} from '../types/report.types'
import { submitWhistleblowerReport } from '../api/submitReport'
import { ReportReceipt } from './ReportReceipt'
import { StepReporterInfo } from './steps/StepReporterInfo'
import { StepIncidentDetails } from './steps/StepIncidentDetails'
import { StepCorruptedParties } from './steps/StepCorruptedParties'
import { StepEvidenceWitnesses } from './steps/StepEvidenceWitnesses'
import { StepPriorActionsResolution } from './steps/StepPriorActionsResolution'
import { Button } from '@/components/ui/Button'

const STEP_TITLES: Record<number, string> = {
  1: 'Reporter Information',
  2: 'Details of the Incident',
  3: 'Details of the Person and Organization',
  4: 'Supporting Evidence & Witnesses',
  5: 'Previous Actions & Resolution',
}

const STEPS = [
  { id: 1, title: 'Reporter' },
  { id: 2, title: 'Incident' },
  { id: 3, title: 'Involved Parties' },
  { id: 4, title: 'Evidence' },
  { id: 5, title: 'Resolution' },
]

export const ReportWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1)
  const [submissionResult, setSubmissionResult] = useState<ReportSubmissionResult | null>(null)
  const [stepError, setStepError] = useState<string | null>(null)

  const form = useForm<CorruptionReportInput>({
    resolver: zodResolver(corruptionReportSchema),
    mode: 'onTouched',
    defaultValues: {
      reportingMode: 'confidential',
      fullName: '',
      phoneNumber: '',
      email: '',
      physicalAddress: '',
      relationship: '',
      corruptionType: '',
      summary: '',
      detailedNarrative: '',
      incidentDate: '',
      howAware: '',
      incidentLocation: '',
      whyCorrupt: '',
      divisionDepartmentBranch: '',
      departmentOffice: '',
      organizationAddress: '',
      corruptedPersonNames: '',
      jobPositions: '',
      otherIdentifyingInfo: '',
      evidenceInPossession: '',
      evidenceNotInPossession: '',
      witnesses: '',
      attachedFiles: [],
      priorReports: '',
      resolutionSought: '',
      customResolutionDetails: '',
      reportRecipient: 'Risk Management & Compliance Division',
      confirmationAcknowledged: false as unknown as true,
    },
  })

  const { handleSubmit, trigger, getValues, formState: { isSubmitting } } = form

  // Validate the current step fields before progressing to the next step
  const handleNextStep = async () => {
    setStepError(null)
    const values = getValues()

    let stepValidation
    if (currentStep === 1) {
      stepValidation = step1Schema.safeParse({
        reportingMode: values.reportingMode,
        fullName: values.fullName,
        phoneNumber: values.phoneNumber,
        email: values.email,
        physicalAddress: values.physicalAddress,
        relationship: values.relationship,
      })
      await trigger(['reportingMode', 'fullName', 'phoneNumber', 'email', 'physicalAddress', 'relationship'])
    } else if (currentStep === 2) {
      stepValidation = step2Schema.safeParse({
        corruptionType: values.corruptionType,
        summary: values.summary,
        detailedNarrative: values.detailedNarrative,
      })
      await trigger(['corruptionType', 'summary', 'detailedNarrative'])
    } else if (currentStep === 3) {
      stepValidation = step3Schema.safeParse({
        divisionDepartmentBranch: values.divisionDepartmentBranch,
        departmentOffice: values.departmentOffice,
        organizationAddress: values.organizationAddress,
        corruptedPersonNames: values.corruptedPersonNames,
        jobPositions: values.jobPositions,
        otherIdentifyingInfo: values.otherIdentifyingInfo,
      })
      await trigger([
        'divisionDepartmentBranch',
        'departmentOffice',
        'organizationAddress',
        'corruptedPersonNames',
        'jobPositions',
        'otherIdentifyingInfo',
      ])
    } else if (currentStep === 4) {
      stepValidation = step4Schema.safeParse({
        evidenceInPossession: values.evidenceInPossession,
        evidenceNotInPossession: values.evidenceNotInPossession,
        witnesses: values.witnesses,
        attachedFiles: values.attachedFiles,
      })
      await trigger(['evidenceInPossession', 'evidenceNotInPossession', 'witnesses', 'attachedFiles'])
    }

    if (stepValidation && !stepValidation.success) {
      const firstError = stepValidation.error.issues?.[0]?.message
      setStepError(firstError || 'Please complete all required fields for this section.')
      return
    }

    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handlePrevStep = () => {
    setStepError(null)
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const onFinalSubmit = async (data: CorruptionReportInput) => {
    setStepError(null)
    try {
      const result = await submitWhistleblowerReport(data)
      setSubmissionResult(result)
    } catch (err: unknown) {
      console.error(err)
      setStepError('Failed to transmit secure report. Please try again.')
    }
  }

  if (submissionResult) {
    return (
      <ReportReceipt
        result={submissionResult}
        onReset={() => {
          form.reset()
          setCurrentStep(1)
          setSubmissionResult(null)
        }}
      />
    )
  }

  return (
    <div className="max-w-2xl sm:max-w-3xl mx-auto space-y-4 sm:space-y-5">
      {/* Top Banner & Subtitle matching Figma screenshot */}
      <div className="text-left space-y-1">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          Corruption &amp; Misconduct Report
        </h1>
        <p className="text-xs text-slate-500 font-normal">
          Step {currentStep} of 5 - {STEP_TITLES[currentStep]}
        </p>
      </div>

      {/* 5-Step Stepper Card matching Figma screenshot */}
      <div className="bg-white border border-slate-200/80 rounded-xl px-5 sm:px-8 py-3.5 shadow-xs">
        <div className="relative flex items-center justify-between">
          {/* Continuous horizontal connecting track line behind the circles */}
          <div className="absolute top-[14px] left-[20px] right-[20px] h-[1.5px] bg-[#eeecf0] -translate-y-1/2 z-0">
            <div
              className="h-full bg-cbe-purple transition-all duration-300 ease-out"
              style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
            />
          </div>

          {STEPS.map((step) => {
            const isCompleted = currentStep > step.id
            const isCurrent = currentStep === step.id

            return (
              <button
                key={step.id}
                type="button"
                disabled={step.id > currentStep}
                onClick={() => {
                  if (step.id < currentStep) {
                    setCurrentStep(step.id)
                  }
                }}
                className={`flex flex-col items-center relative z-10 transition cursor-pointer group ${step.id > currentStep ? 'cursor-not-allowed' : ''
                  }`}
              >
                {/* Number Circle */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${isCurrent
                      ? 'bg-cbe-purple text-white shadow-xs'
                      : isCompleted
                        ? 'bg-cbe-purple text-white shadow-xs'
                        : 'bg-white border border-slate-300 text-slate-500'
                    }`}
                >
                  {isCompleted ? (
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  ) : (
                    step.id
                  )}
                </div>

                {/* Step Label below */}
                <span
                  className={`text-xs mt-1.5 font-medium transition ${isCurrent
                      ? 'text-cbe-purple font-semibold'
                      : isCompleted
                        ? 'text-slate-800'
                        : 'text-slate-500'
                    }`}
                >
                  {step.title}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Main Step Form Card */}
      <form
        onSubmit={handleSubmit(onFinalSubmit)}
        className="bg-white rounded-xl sm:rounded-2xl shadow-xs border border-slate-200/80 p-5 sm:p-8 space-y-5"
      >
        {/* Step-specific Error Notice */}
        {stepError && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <span>{stepError}</span>
          </div>
        )}

        {/* Step Views */}
        {currentStep === 1 && <StepReporterInfo form={form} />}
        {currentStep === 2 && <StepIncidentDetails form={form} />}
        {currentStep === 3 && <StepCorruptedParties form={form} />}
        {currentStep === 4 && <StepEvidenceWitnesses form={form} />}
        {currentStep === 5 && <StepPriorActionsResolution form={form} />}

        {/* Step Navigation Controls */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200">
          <div>
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                className="w-full sm:w-auto px-4 py-2 rounded-md border border-slate-200 bg-white text-cbe-purple text-xs sm:text-sm font-medium hover:bg-purple-50/50 hover:border-cbe-purple/40 shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <></>
            )}
          </div>

          <div className="w-full sm:w-auto flex items-center gap-3">
            {currentStep < 5 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="w-full sm:w-auto px-5 py-2 rounded-md bg-cbe-purple text-white text-xs sm:text-sm font-medium hover:bg-cbe-purple-700 shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <Button
                type="submit"
                isLoading={isSubmitting}
                size="lg"
                className="w-full sm:w-auto bg-cbe-purple hover:bg-cbe-purple-700 text-white font-bold px-8 shadow-md"
              >
                <Send className="w-4 h-4 mr-2" />
                Submit Report
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}
