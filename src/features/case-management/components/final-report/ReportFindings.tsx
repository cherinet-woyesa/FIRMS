import React from 'react'
import { MessageSquare, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import type { FinalInvestigationReport, FindingItem } from '../../types/investigation.types'

interface Props {
  report: FinalInvestigationReport
  isEditable: boolean
  onOpenComments: (section: string) => void
  onAddFinding: () => void
  onUpdateFinding: (index: number, key: keyof FindingItem, value: string) => void
  onRemoveFinding: (index: number) => void
}

export const ReportFindings: React.FC<Props> = ({
  report,
  isEditable,
  onOpenComments,
  onAddFinding,
  onUpdateFinding,
  onRemoveFinding,
}) => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 space-y-5 shadow-2xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-3">
          <h3 className="text-base font-bold text-slate-900">4. Factual Findings (Evidence-Based)</h3>
          <button
            type="button"
            onClick={() => onOpenComments('4. Factual Findings')}
            className="text-slate-400 hover:text-cbe-purple transition cursor-pointer"
            title="Add Section Comment"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {report.findings.length === 0 ? (
          <div className="p-6 text-center rounded-xl border border-dashed border-slate-200 text-xs text-slate-400">
            No findings added yet. Click &quot;Add Finding&quot; below to record substantiated facts.
          </div>
        ) : (
          report.findings.map((finding, idx) => (
            <div
              key={finding.id || idx}
              className="p-5 rounded-xl border border-slate-200 bg-white space-y-4 shadow-2xs relative"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900">
                  Finding {finding.findingNumber || `4.${idx + 1}`}
                </span>
                {isEditable && (
                  <button
                    type="button"
                    onClick={() => onRemoveFinding(idx)}
                    className="text-slate-400 hover:text-rose-600 p-1 rounded transition cursor-pointer"
                    title="Remove Finding"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                  Fact
                </label>
                <textarea
                  value={finding.fact || ''}
                  onChange={(e) => onUpdateFinding(idx, 'fact', e.target.value)}
                  disabled={!isEditable}
                  rows={3}
                  className="w-full text-sm p-3 rounded-lg border border-slate-200 focus:outline-hidden focus:border-cbe-purple focus:ring-1 focus:ring-cbe-purple resize-y bg-white transition disabled:bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                  Evidence
                </label>
                <textarea
                  value={finding.evidence || ''}
                  onChange={(e) => onUpdateFinding(idx, 'evidence', e.target.value)}
                  disabled={!isEditable}
                  rows={3}
                  className="w-full text-sm p-3 rounded-lg border border-slate-200 focus:outline-hidden focus:border-cbe-purple focus:ring-1 focus:ring-cbe-purple resize-y bg-white transition disabled:bg-slate-50"
                />
              </div>
            </div>
          ))
        )}

        {isEditable && (
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onAddFinding}
              className="border-purple-200 text-cbe-purple hover:bg-purple-50 text-xs font-semibold flex items-center gap-1.5 h-8.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Finding</span>
            </Button>
            <span className="text-xs text-slate-500">
              Add a separate entry for each additional finding.
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
