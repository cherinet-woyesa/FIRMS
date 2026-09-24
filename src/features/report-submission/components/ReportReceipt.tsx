import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, Copy, Search } from 'lucide-react'
import type { ReportSubmissionResult } from '../types/report.types'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ROUTES } from '@/config/routes'

interface ReportReceiptProps {
  result: ReportSubmissionResult
  onReset: () => void
}

export const ReportReceipt: React.FC<ReportReceiptProps> = ({ result, onReset }) => {
  const [copied, setCopied] = useState(false)

  const copyKey = () => {
    navigator.clipboard.writeText(result.caseReferenceKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="max-w-xl mx-auto text-center p-8 space-y-6 bg-white border border-slate-200 shadow-sm rounded-2xl">
      {/* Success Icon */}
      <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle2 className="w-8 h-8" />
      </div>

      {/* Heading */}
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Report Submitted
        </h2>
        <p className="text-sm text-slate-500">
          Save your tracking key to follow the progress of your report.
        </p>
      </div>

      {/* Tracking Key Box */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-left space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Tracking Key
          </span>
          <button
            onClick={copyKey}
            type="button"
            className="text-xs font-semibold text-cbe-purple hover:text-cbe-purple-700 flex items-center gap-1 cursor-pointer bg-white px-2.5 py-1 rounded border border-slate-200"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        <div className="text-2xl sm:text-3xl font-mono font-bold text-cbe-purple select-all tracking-wider">
          {result.caseReferenceKey}
        </div>

        {result.reportRecipient && (
          <div className="pt-2 border-t border-slate-200 text-xs text-slate-600 flex items-center justify-between">
            <span>Submitted To:</span>
            <span className="font-semibold text-slate-800">{result.reportRecipient}</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Link to={`${ROUTES.TRACK}?case=${result.caseReferenceKey}`}>
          <Button className="bg-cbe-purple hover:bg-cbe-purple-700 text-white font-medium flex items-center gap-2">
            <Search className="w-4 h-4" />
            <span>Track Status</span>
          </Button>
        </Link>
        <Button
          variant="outline"
          onClick={onReset}
          className="border-slate-300 text-slate-700 hover:bg-slate-50 font-medium"
        >
          Submit Another Report
        </Button>
      </div>
    </Card>
  )
}
