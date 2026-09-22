import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, Filter, AlertTriangle, ShieldCheck, Clock, FileSpreadsheet } from 'lucide-react'
import { fetchCaseRegistry } from '../api/getCases'
import { CaseTable } from './CaseTable'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/feedback/Spinner'

export const CaseManagementPage: React.FC = () => {
  const { data: cases = [], isLoading } = useQuery({
    queryKey: ['case-registry'],
    queryFn: fetchCaseRegistry,
  })

  const criticalCount = cases.filter((c) => c.priority === 'CRITICAL').length
  const activeCount = cases.filter((c) => c.status === 'INVESTIGATION_ACTIVE').length
  const reviewCount = cases.filter((c) => c.status === 'UNDER_REVIEW' || c.status === 'SUBMITTED').length

  return (
    <div className="space-y-6">
      {/* Top Header & Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Case Oversight & Triage Registry
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Real-time compliance monitoring, risk triage, and investigative assignments.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="outline" size="sm">
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export Audit Log</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Triage</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{reviewCount}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Inquiries</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{activeCount}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Critical Escalations</p>
            <p className="text-2xl font-bold text-rose-600 mt-1">{criticalCount}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by case key, category, department..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter Priority</span>
          </Button>
        </div>
      </div>

      {/* Main Table */}
      {isLoading ? (
        <div className="p-16 flex flex-col items-center justify-center gap-3 text-slate-500">
          <Spinner size="lg" />
          <p className="text-xs">Loading encrypted case registry...</p>
        </div>
      ) : (
        <CaseTable cases={cases} />
      )}
    </div>
  )
}
