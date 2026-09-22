import React from 'react'
import type { CaseSummary } from '@/types/common.types'
import { CASE_STATUSES, CASE_PRIORITIES } from '@/constants/caseStatus'
import { Badge } from '@/components/ui/Badge'
import { Clock } from 'lucide-react'

interface CaseTableProps {
  cases: CaseSummary[]
}

export const CaseTable: React.FC<CaseTableProps> = ({ cases }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px] tracking-wider">
            <tr>
              <th className="px-6 py-3.5">Reference</th>
              <th className="px-6 py-3.5">Category</th>
              <th className="px-6 py-3.5">Priority</th>
              <th className="px-6 py-3.5">Status</th>
              <th className="px-6 py-3.5">Department</th>
              <th className="px-6 py-3.5">Assigned Investigator</th>
              <th className="px-6 py-3.5">Filed On</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {cases.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50/80 transition cursor-pointer">
                <td className="px-6 py-4 font-mono font-bold text-indigo-600">
                  {c.referenceKey}
                </td>
                <td className="px-6 py-4 font-medium text-slate-900 max-w-xs truncate">
                  {c.category}
                </td>
                <td className="px-6 py-4">
                  <Badge
                    variant={
                      c.priority === 'CRITICAL'
                        ? 'danger'
                        : c.priority === 'HIGH'
                        ? 'warning'
                        : 'neutral'
                    }
                  >
                    {CASE_PRIORITIES[c.priority]?.label || c.priority}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <Badge variant="default">
                    {CASE_STATUSES[c.status]?.label || c.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-slate-600 text-xs">
                  {c.targetDepartment || 'General'}
                </td>
                <td className="px-6 py-4 text-slate-700 text-xs">
                  {c.assignedTo || <span className="text-slate-400 italic">Unassigned</span>}
                </td>
                <td className="px-6 py-4 text-slate-500 text-xs whitespace-nowrap">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {new Date(c.submittedAt).toLocaleDateString()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
