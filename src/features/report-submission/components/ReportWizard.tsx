import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  ArrowRight,
  ArrowLeft,
  Send,
  Check,
  User,
  AlertTriangle,
  Building,
  Paperclip,
  FileCheck2,
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

const STEPS = [
  { id: 1, title: 'Reporter', icon: User },
  { id: 2, title: 'Incident', icon: AlertTriangle },
  { id: 3, title: 'Involved Parties', icon: Building },
  { id: 4, title: 'Evidence', icon: Paperclip },
  { id: 5, title: 'Resolution', icon: FileCheck2 },
]

export const ReportWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1)
  const [submissionResult, setSubmissionResult] = useState<ReportSubmissionResult | null>(null)
  const [stepError, setStepError] = useState<string | null>(null)

  const form = useForm<CorruptionReportInput>({
    resolver: zodResolver(corruptionReportSchema),
    mode: 'onTouched',
    defaultValues: {
      reportingMode: '' as unknown as 'anonymous',
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
        incidentDate: values.incidentDate,
        howAware: values.howAware,
        incidentLocation: values.incidentLocation,
        whyCorrupt: values.whyCorrupt,
      })
      await trigger([
        'corruptionType',
        'summary',
        'detailedNarrative',
        'incidentDate',
        'howAware',
        'incidentLocation',
        'whyCorrupt',
      ])
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
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Top Banner & Title */}
      <div className="text-center sm:text-left">

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Corruption &amp; Misconduct Report

        </h1>

      </div>

      {/* 5-Step Visual Stepper Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm">
        <div className="grid grid-cols-5 gap-2 sm:gap-4 relative">
          {STEPS.map((step) => {
            const isCompleted = currentStep > step.id
            const isCurrent = currentStep === step.id
            const Icon = step.icon

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
                className={`flex flex-col items-center text-center group transition cursor-pointer ${step.id > currentStep ? 'cursor-not-allowed opacity-40' : ''
                  }`}
              >
                {/* Step Circle */}
                <div
                  className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${isCompleted
                    ? 'bg-cbe-purple text-white'
                    : isCurrent
                      ? 'bg-cbe-purple text-white ring-4 ring-cbe-purple/20 shadow-md'
                      : 'bg-slate-100 text-slate-500 border border-slate-300'
                    }`}
                >
                  {isCompleted ? <Check className="w-5 h-5 stroke-[2.5]" /> : <Icon className="w-4 h-4 sm:w-5 sm:h-5" />}
                </div>

                {/* Step Labels */}
                <div className="mt-2 hidden sm:block">
                  <span
                    className={`block text-xs font-bold ${isCurrent ? 'text-cbe-purple' : isCompleted ? 'text-slate-900' : 'text-slate-400'
                      }`}
                  >
                    {step.title}
                  </span>
                </div>
              </button>
            )
          })}
        </div>

        {/* Linear Progress Indicator */}
        <div className="w-full bg-slate-100 h-1.5 rounded-full mt-4 overflow-hidden">
          <div
            className="bg-cbe-gold h-full transition-all duration-300 ease-out"
            style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Step Form Card */}
      <form
        onSubmit={handleSubmit(onFinalSubmit)}
        className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-10 space-y-8"
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
                className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 transition flex items-center justify-center gap-2 cursor-pointer"
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
                className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-cbe-purple text-white text-sm font-semibold hover:bg-cbe-purple-700 shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
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
