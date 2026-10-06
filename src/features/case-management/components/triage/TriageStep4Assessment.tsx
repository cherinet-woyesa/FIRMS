import React from 'react'
import { Flame, ArrowLeft, ArrowRight, Save, Send } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { PreliminaryAssessmentReportView } from '../PreliminaryAssessmentReportView'
import type { PreliminaryAssessmentReport } from '../../types/triage.types'

interface Props {
  reportState: PreliminaryAssessmentReport
  onUpdateReportField: (field: any, val: string) => void
  isEditable: boolean
  canInitiateInvestigation: boolean
  isInvestigator: boolean
  onEscalateToFullInvestigation: () => void
  onSaveTriage: () => void
  onSendToManager: () => void
  onPrev: () => void
}

export const TriageStep4Assessment: React.FC<Props> = ({
  reportState,
  onUpdateReportField,
  isEditable,
  canInitiateInvestigation,
  isInvestigator,
  onEscalateToFullInvestigation,
  onSaveTriage,
  onSendToManager,
  onPrev,
}) => {
  return (
    <div className="space-y-4">
      <PreliminaryAssessmentReportView
        report={reportState}
        onChangeReport={onUpdateReportField}
        isEditable={isEditable}
      />

      {/* ACTION: ONLY WHEN Predication is Sufficient & Full Investigation chosen, ESCALATE TO PHASE 2 */}
      {isEditable &&
        reportState.predicationDetermination === 'Sufficient' &&
        reportState.recommendedAction === 'Full Investigation' && (
          <div className="p-5 rounded-2xl bg-purple-50/90 border-2 border-cbe-purple flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
            <div className="space-y-1">
              <span className="text-xs font-bold text-cbe-purple flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-cbe-gold" />
                Preliminary Assessment Complete — Predication Established
              </span>
              <p className="text-xs text-slate-700">
                Sufficient grounds found. Ready to formally transition this case into{' '}
                <strong>Phase 2: Full Investigation</strong>.
              </p>
              {!canInitiateInvestigation && (
                <p className="text-xs text-rose-500 font-bold mt-1">
                  Only the President or VP-IA can initiate a Full Investigation. This recommendation must be reviewed by them.
                </p>
              )}
            </div>
            <Button
              size="sm"
              disabled={!canInitiateInvestigation}
              onClick={onEscalateToFullInvestigation}
              className={`text-white text-xs font-bold flex items-center gap-2 shrink-0 px-4 py-2.5 shadow-xs ${
                canInitiateInvestigation
                  ? 'bg-cbe-purple hover:bg-cbe-purple-700'
                  : 'bg-slate-400 cursor-not-allowed'
              }`}
            >
              <span>Escalate to Full Investigation</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        )}

      {/* Step Navigation */}
      <div className="flex items-center justify-between pt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onPrev}
          className="text-xs font-semibold flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Step 3: Fact-Checking</span>
        </Button>
        <div className="flex gap-2">
          {isEditable && (
            <Button
              size="sm"
              onClick={onSaveTriage}
              className="bg-slate-200 text-slate-800 hover:bg-slate-300 text-xs font-semibold flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Assessment</span>
            </Button>
          )}
          {isEditable && isInvestigator && (
            <Button
              size="sm"
              onClick={onSendToManager}
              className="bg-cbe-purple text-white hover:bg-cbe-purple-700 text-xs font-semibold flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send to Manager for Review</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
