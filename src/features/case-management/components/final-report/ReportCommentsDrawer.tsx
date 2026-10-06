import React from 'react'
import { MessageSquare, X, Send } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface Props {
  activeSection: string | null
  comments: Record<string, { author: string; text: string; time: string }[]>
  newComment: string
  onCommentChange: (val: string) => void
  onAddComment: () => void
  onClose: () => void
}

export const ReportCommentsDrawer: React.FC<Props> = ({
  activeSection,
  comments,
  newComment,
  onCommentChange,
  onAddComment,
  onClose,
}) => {
  if (!activeSection) return null

  const sectionComments = comments[activeSection] || []

  return (
    <div className="fixed inset-y-0 right-0 w-84 bg-white border-l border-slate-200 shadow-2xl z-50 flex flex-col print:hidden animate-in slide-in-from-right-5 duration-200">
      <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-cbe-purple" />
          <h3 className="font-bold text-sm text-slate-900">Reviewer Observations</h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1 text-slate-400 hover:bg-slate-200 rounded transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="px-4 py-2.5 bg-amber-50 border-b border-amber-200 text-xs text-amber-800 font-medium">
        Section: <span className="font-bold">{activeSection}</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        {sectionComments.length === 0 ? (
          <div className="text-center text-slate-400 text-xs py-8">
            No observations posted for this section yet.
          </div>
        ) : (
          sectionComments.map((c, i) => (
            <div key={i} className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900">{c.author}</span>
                <span className="text-[10px] text-slate-400">{c.time}</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">{c.text}</p>
            </div>
          ))
        )}
      </div>

      <div className="p-4 border-t border-slate-200 bg-slate-50">
        <textarea
          value={newComment}
          onChange={(e) => onCommentChange(e.target.value)}
          placeholder="Add observation or review feedback..."
          className="w-full text-xs p-3 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-cbe-purple resize-none bg-white mb-2"
          rows={3}
        />
        <Button
          onClick={onAddComment}
          disabled={!newComment.trim()}
          className="w-full bg-cbe-purple hover:bg-cbe-purple-700 text-white text-xs h-8 flex items-center justify-center gap-1.5 shadow-2xs"
        >
          <Send className="w-3 h-3" />
          <span>Post Observation</span>
        </Button>
      </div>
    </div>
  )
}
