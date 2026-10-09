import React, { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Layers,
  ArrowRight,
  Clock,
  History,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import type { WorkflowTransitionAction } from '../types/workflow.types'
import { getAvailableWorkflowActions } from '../api/workflowExecutionApi'
import { WorkflowTransitionModal } from './WorkflowTransitionModal'
import { CaseWorkflowHistoryTimeline } from './CaseWorkflowHistoryTimeline'
import { Spinner } from '@/components/feedback/Spinner'

interface CaseWorkflowActionToolbarProps {
  caseId: string
  caseReferenceKey?: string
  currentStageName?: string
  onTransitionCompleted?: () => void
  showHistoryByDefault?: boolean
}

export const CaseWorkflowActionToolbar: React.FC<CaseWorkflowActionToolbarProps> = ({
  caseId,
  caseReferenceKey,
  currentStageName,
  onTransitionCompleted,
  showHistoryByDefault = false,
}) => {
  const queryClient = useQueryClient()
  const [selectedAction, setSelectedAction] = useState<WorkflowTransitionAction | null>(null)
  const [showHistory, setShowHistory] = useState(showHistoryByDefault)

  const { data: actions = [], isLoading, refetch } = useQuery({
    queryKey: ['case-workflow-actions', caseId],
    queryFn: () => getAvailableWorkflowActions(caseId),
    enabled: Boolean(caseId),
  })

  const handleActionSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['case-workflow-actions', caseId] })
    queryClient.invalidateQueries({ queryKey: ['case-workflow-history', caseId] })
    queryClient.invalidateQueries({ queryKey: ['case-detail', caseId] })
    queryClient.invalidateQueries({ queryKey: ['case-registry'] })
    refetch()
    if (onTransitionCompleted) onTransitionCompleted()
  }

  // Derive current stage from available actions or passed prop
  const activeStage =
    currentStageName ||
    (actions.length > 0 ? actions[0].fromStageName || actions[0].fromStageCode : 'Intake')

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden transition-all">
      {/* 1. Command Bar: Current Stage & Available Action Buttons */}
      <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-50/80 via-white to-slate-50/50 border-b border-slate-100">
        {/* Left: Current Workflow Stage indicator */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cbe-purple/10 text-cbe-purple flex items-center justify-center shrink-0 border border-cbe-purple/20">
            <Layers className="w-5 h-5 text-cbe-purple" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400">
                Active Workflow Stage
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>{activeStage}</span>
            </h3>
          </div>
        </div>

        {/* Right: Dynamic Action Buttons & History Toggle */}
        <div className="flex flex-wrap items-center gap-2">
          {isLoading ? (
            <div className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-400">
              <Spinner size="sm" />
              <span>Checking permitted workflow actions...</span>
            </div>
          ) : actions.length > 0 ? (
            actions.map((act) => {
              const isAdvance =
                act.actionCode.includes('FULL') ||
                act.actionCode.includes('AUTHORIZE') ||
                act.actionCode.includes('APPROVE') ||
                act.actionCode.includes('PROCEED') ||
                act.actionCode.includes('START') ||
                act.actionCode.includes('SECURE') ||
                act.actionCode.includes('RECEIVE') ||
                act.actionCode.includes('APPOINT')

              const isDismiss =
                act.actionCode.includes('DISMISS') ||
                act.actionCode.includes('CLOSE') ||
                act.actionCode.includes('REJECT')

              const isReferral = act.actionCode.includes('REFER')

              let btnClass = 'bg-cbe-purple hover:bg-cbe-purple-700 text-white'
              if (isDismiss) {
                btnClass = 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
              } else if (isReferral) {
                btnClass = 'bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200'
              } else if (!isAdvance) {
                btnClass = 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
              }

              return (
                <button
                  key={act.transitionId || act.actionCode}
                  type="button"
                  onClick={() => setSelectedAction(act)}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold shadow-2xs transition-all hover:-translate-y-0.5 cursor-pointer ${btnClass}`}
                  title={act.description || act.actionName}
                >
                  <span>{act.actionName}</span>
                  {act.slaHours && act.slaHours > 0 && (
                    <span className="text-[10px] font-normal px-1.5 py-0.2 rounded bg-black/10 flex items-center gap-0.5">
                      <Clock className="w-2.5 h-2.5" />
                      {act.slaHours}h
                    </span>
                  )}
                  <ArrowRight className="w-3.5 h-3.5 opacity-80" />
                </button>
              )
            })
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-500 text-xs font-medium border border-slate-200">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
              <span>No pending transitions for current role</span>
            </div>
          )}

          {/* Toggle Workflow History */}
          <button
            type="button"
            onClick={() => setShowHistory((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition cursor-pointer border ${
              showHistory
                ? 'bg-cbe-purple-50 text-cbe-purple border-cbe-purple-200'
                : 'bg-white text-slate-600 hover:text-slate-900 border-slate-200 hover:bg-slate-50'
            }`}
            title="Toggle Workflow Transition History"
          >
            <History className="w-3.5 h-3.5" />
            <span>Audit Trail</span>
            {showHistory ? (
              <ChevronUp className="w-3 h-3 text-slate-400" />
            ) : (
              <ChevronDown className="w-3 h-3 text-slate-400" />
            )}
          </button>
        </div>
      </div>

      {/* 2. Expandable Workflow Audit Trail */}
      {showHistory && (
        <div className="p-5 bg-slate-50/60 border-t border-slate-100 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Case Workflow Execution History
              </h4>
              <p className="text-[11px] text-slate-500">
                Tamper-evident record of all stage advances, approvals, and decisions.
              </p>
            </div>
            <button
              onClick={() => setShowHistory(false)}
              className="text-xs text-slate-500 hover:text-slate-800 underline font-medium cursor-pointer"
            >
              Hide
            </button>
          </div>
          <CaseWorkflowHistoryTimeline caseId={caseId} />
        </div>
      )}

      {/* 3. Transition Modal */}
      <WorkflowTransitionModal
        isOpen={Boolean(selectedAction)}
        onClose={() => setSelectedAction(null)}
        action={selectedAction}
        caseId={caseId}
        caseReferenceKey={caseReferenceKey}
        onSuccess={handleActionSuccess}
      />
    </div>
  )
}
