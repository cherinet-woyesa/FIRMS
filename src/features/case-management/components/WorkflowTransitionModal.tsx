import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  X,
  AlertTriangle,
  Clock,
  UserCheck,
  Send,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react'
import { toast } from 'sonner'
import type { WorkflowTransitionAction } from '../types/workflow.types'
import { executeWorkflowTransition } from '../api/workflowExecutionApi'
import { getUsers } from '@/features/user-management/api/getUsers'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/feedback/Spinner'

interface WorkflowTransitionModalProps {
  isOpen: boolean
  onClose: () => void
  action: WorkflowTransitionAction | null
  caseId: string
  caseReferenceKey?: string
  onSuccess?: () => void
}

export const WorkflowTransitionModal: React.FC<WorkflowTransitionModalProps> = ({
  isOpen,
  onClose,
  action,
  caseId,
  caseReferenceKey,
  onSuccess,
}) => {
  const [comment, setComment] = useState('')
  const [assignedUserId, setAssignedUserId] = useState<string>('')
  const [dueDate, setDueDate] = useState<string>('')
  const [approvedConfirm, setApprovedConfirm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)

  // Fetch users for assignment when requiresAssignment is true
  const { data: usersData, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['workflow-assignees'],
    queryFn: () => getUsers({ pageSize: 100, isActive: true }),
    enabled: isOpen && Boolean(action?.requiresAssignment),
  })

  const usersList = usersData?.data?.items || []

  if (!isOpen || !action) return null

  const isTerminalAction =
    action.actionCode.includes('CLOSE') ||
    action.actionCode.includes('DISMISS') ||
    action.actionCode.includes('DECIDE')

  const isReferralAction = action.actionCode.includes('REFER')

  const handleConfirmTransition = async () => {
    setValidationError(null)

    // 1. Validate mandatory comment
    if (action.requiresComment && !comment.trim()) {
      setValidationError('A comment or justification is strictly required for this workflow action.')
      return
    }

    // 2. Validate mandatory approval acknowledgment
    if (action.requiresApproval && !approvedConfirm) {
      setValidationError('You must certify approval confirmation before executing this transition.')
      return
    }

    // 3. Validate assignment if required
    if (action.requiresAssignment && !assignedUserId && usersList.length > 0) {
      // Optional: prompt if unassigned, but allow fallback
    }

    setIsSubmitting(true)
    try {
      const payload = {
        actionCode: action.actionCode,
        comment: comment.trim() || `Workflow action '${action.actionName}' executed.`,
        assignedUserId: assignedUserId || undefined,
        dueAt: dueDate ? new Date(dueDate).toISOString() : undefined,
      }

      const res = await executeWorkflowTransition(caseId, payload)

      if (res.success) {
        toast.success(
          res.actionName
            ? `Successfully executed: ${res.actionName}`
            : `Transition to ${action.toStageName || 'next stage'} completed.`
        )
        onClose()
        setComment('')
        setAssignedUserId('')
        setApprovedConfirm(false)
        if (onSuccess) onSuccess()
      } else {
        toast.error(res.error || 'Failed to execute workflow transition.')
        setValidationError(res.error || 'Workflow execution rejected by server.')
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Transition failed'
      toast.error(msg)
      setValidationError(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-cbe-purple bg-cbe-purple-50 px-2 py-0.5 rounded-md border border-cbe-purple-200">
                {caseReferenceKey || 'CASE'}
              </span>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Workflow Action
              </span>
            </div>
            <h2 className="text-base font-bold text-slate-900 leading-tight">
              {action.actionName}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Stage Flow Graphic */}
          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 flex items-center justify-between gap-3 text-xs">
            <div className="flex-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Current Stage
              </span>
              <span className="font-semibold text-slate-700 truncate block mt-0.5">
                {action.fromStageName || action.fromStageCode}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-cbe-purple px-2 py-1 bg-white rounded-md border border-slate-200 shadow-2xs font-mono text-[11px] font-bold">
              <span>{action.actionCode}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>

            <div className="flex-1 text-right">
              <span className="text-[10px] uppercase font-bold text-cbe-purple block tracking-wider">
                Target Stage
              </span>
              <span className="font-semibold text-cbe-purple-800 truncate block mt-0.5">
                {action.toStageName || action.toStageCode}
              </span>
            </div>
          </div>

          {/* Description & SLA Notice */}
          {action.description && (
            <p className="text-xs text-slate-600 leading-relaxed bg-blue-50/50 p-3 rounded-lg border border-blue-100">
              {action.description}
            </p>
          )}

          {action.slaHours && action.slaHours > 0 && (
            <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>
                Standard SLA Window: <strong className="text-slate-800">{action.slaHours} Hours</strong>
              </span>
            </div>
          )}

          {/* Mandatory Approval Certification */}
          {action.requiresApproval && (
            <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3.5 space-y-2">
              <div className="flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-amber-900">
                    Formal Approval Certification Required
                  </h4>
                  <p className="text-[11px] text-amber-800 leading-normal">
                    This action requires documented oversight authorization. By continuing, you affirm that this decision complies with CBE Ethics &amp; Compliance governance guidelines.
                  </p>
                </div>
              </div>
              <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-800 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={approvedConfirm}
                  onChange={(e) => setApprovedConfirm(e.target.checked)}
                  className="rounded border-slate-300 text-cbe-purple focus:ring-cbe-purple w-4 h-4"
                />
                <span>I formally authorize and certify this action</span>
              </label>
            </div>
          )}

          {/* Optional or Mandatory Comment */}
          <div className="space-y-1.5 text-left">
            <label className="block text-xs font-bold text-slate-800">
              {action.requiresComment ? (
                <span>
                  Investigation Rationale / Decision Notes <span className="text-rose-500">*</span>
                </span>
              ) : (
                <span>Transition Notes / Remarks (Optional)</span>
              )}
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={
                action.requiresComment
                  ? 'Provide explicit justification, findings summary, or audit instructions...'
                  : 'Add any relevant context or handover notes...'
              }
              className="w-full text-xs rounded-xl border border-slate-200 bg-white p-3 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cbe-purple/20 focus:border-cbe-purple transition resize-none"
            />
          </div>

          {/* Assignment Selection */}
          {action.requiresAssignment && (
            <div className="space-y-3 pt-1 border-t border-slate-100">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <UserCheck className="w-3.5 h-3.5 text-cbe-purple" />
                <span>Next Stage Assignment &amp; Target Due Date</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-600 block">
                    Assignee Officer
                  </label>
                  {isLoadingUsers ? (
                    <div className="h-9 flex items-center gap-2 text-xs text-slate-400">
                      <Spinner size="sm" />
                      <span>Loading team...</span>
                    </div>
                  ) : (
                    <select
                      value={assignedUserId}
                      onChange={(e) => setAssignedUserId(e.target.value)}
                      className="w-full text-xs rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-cbe-purple/20 focus:border-cbe-purple"
                    >
                      <option value="">-- Keep Current / Auto-route --</option>
                      {usersList.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.firstName} {u.lastName} ({u.userName})
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-600 block">
                    Target Due Date
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full text-xs rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-cbe-purple/20 focus:border-cbe-purple"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Validation Error Message */}
          {validationError && (
            <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{validationError}</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-2.5 bg-slate-50/70">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isSubmitting}
            className="text-xs border-slate-200 text-slate-700"
          >
            Cancel
          </Button>

          <Button
            size="sm"
            onClick={handleConfirmTransition}
            isLoading={isSubmitting}
            className={`text-xs font-semibold px-4 flex items-center gap-1.5 ${
              isTerminalAction
                ? 'bg-rose-600 hover:bg-rose-700 text-white'
                : isReferralAction
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                : 'bg-cbe-purple hover:bg-cbe-purple-700 text-white'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Confirm &amp; Execute</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
