import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Clock, User, ArrowRight, Shield } from 'lucide-react'
import { getCaseWorkflowHistory } from '../api/workflowExecutionApi'
import { Spinner } from '@/components/feedback/Spinner'

interface CaseWorkflowHistoryTimelineProps {
  caseId: string
}

export const CaseWorkflowHistoryTimeline: React.FC<CaseWorkflowHistoryTimelineProps> = ({
  caseId,
}) => {
  const { data: history = [], isLoading } = useQuery({
    queryKey: ['case-workflow-history', caseId],
    queryFn: () => getCaseWorkflowHistory(caseId),
    enabled: Boolean(caseId),
  })

  if (isLoading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center gap-2 text-slate-400">
        <Spinner size="md" />
        <span className="text-xs">Loading workflow transition history...</span>
      </div>
    )
  }

  if (history.length === 0) {
    return (
      <div className="p-6 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 space-y-1">
        <Shield className="w-5 h-5 text-slate-400 mx-auto" />
        <p className="text-xs font-semibold text-slate-700">Initial Stage Active</p>
        <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
          No workflow transitions have been recorded yet. The case is currently residing in its initial intake stage.
        </p>
      </div>
    )
  }

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
      {history.map((item, idx) => {
        const dateFormatted = new Date(item.performedAt).toLocaleString(undefined, {
          dateStyle: 'medium',
          timeStyle: 'short',
        })

        return (
          <div key={item.id || idx} className="relative group">
            {/* Timeline bullet */}
            <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-white border-2 border-cbe-purple text-cbe-purple flex items-center justify-center shadow-xs">
              <div className="w-1.5 h-1.5 rounded-full bg-cbe-purple" />
            </div>

            {/* Timeline item card */}
            <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-2xs space-y-2 hover:border-cbe-purple/40 transition">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">
                    {item.actionName || item.actionCode}
                  </span>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                    {item.actionCode}
                  </span>
                </div>
                <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {dateFormatted}
                </span>
              </div>

              {/* Stage Transition info */}
              <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
                <span className="font-medium text-slate-700">
                  {item.fromStageName || item.fromStageCode || 'Intake'}
                </span>
                <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="font-bold text-cbe-purple">
                  {item.toStageName || item.toStageCode}
                </span>
              </div>

              {/* Performer & Comment */}
              <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-0.5">
                <div className="flex items-center gap-1 truncate">
                  <User className="w-3 h-3 text-slate-400 shrink-0" />
                  <span>
                    Executed by:{' '}
                    <strong className="text-slate-700 font-semibold">
                      {item.performedByUserName || 'System Officer'}
                    </strong>
                  </span>
                </div>
              </div>

              {item.comment && (
                <div className="mt-1 text-xs text-slate-700 bg-slate-50/80 p-2.5 rounded-lg border border-slate-200/60 leading-relaxed italic">
                  &ldquo;{item.comment}&rdquo;
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
