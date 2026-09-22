import React from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, Copy, AlertTriangle, Search } from 'lucide-react'
import type { ReportSubmissionResult } from '../types/report.types'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ROUTES } from '@/config/routes'

interface ReportReceiptProps {
  result: ReportSubmissionResult
  onReset: () => void
}

export const ReportReceipt: React.FC<ReportReceiptProps> = ({ result, onReset }) => {
  const [copied, setCopied] = React.useState(false)

  const copyKey = () => {
    navigator.clipboard.writeText(result.caseReferenceKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="max-w-2xl mx-auto text-center p-8 space-y-6">
      <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
        <CheckCircle2 className="w-9 h-9" />
      </div>

      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Report Transmitted Securely
        </h2>
        <p className="text-sm text-slate-600">
          Your disclosure has been encrypted and assigned to the Compliance Review Committee.
        </p>
      </div>

      {/* Secret Case Access Token / Reference Key */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-left space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase font-semibold text-slate-500 tracking-wider">
            Your Anonymous Case Key
          </span>
          <button
            onClick={copyKey}
            type="button"
            className="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copied ? 'Copied!' : 'Copy Key'}</span>
          </button>
        </div>

        <div className="text-2xl sm:text-3xl font-mono font-bold text-indigo-600 select-all tracking-wider py-1">
          {result.caseReferenceKey}
        </div>

        <div className="flex items-start gap-2 pt-2 border-t border-slate-200 text-xs text-amber-800 bg-amber-50/50 p-2.5 rounded-lg">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>
            <strong>Crucial:</strong> Write down or copy this key. Because this system is zero-knowledge and retains no personal identity records, lost keys cannot be recovered by anyone.
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Link to={`${ROUTES.TRACK}?case=${result.caseReferenceKey}`}>
          <Button variant="primary">
            <Search className="w-4 h-4" />
            <span>Track Case Status Now</span>
          </Button>
        </Link>
        <Button variant="outline" onClick={onReset}>
          Submit Another Report
        </Button>
      </div>
    </Card>
  )
}
