import React, { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { Search, Filter, AlertTriangle, ShieldCheck, Clock, FileSpreadsheet, UserCheck, Shield } from 'lucide-react'
import { fetchCaseRegistry } from '../api/getCases'
import { CaseTable } from './CaseTable'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/feedback/Spinner'

export const CaseManagementPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth)
  const userRoles = user?.roles || []

  const isLeadership = userRoles.some((r) =>
    ['President', 'VP', 'Director', 'Manager', 'Administrator', 'Admin'].some((lead) =>
      r.toLowerCase().includes(lead.toLowerCase())
    )
  )

  const isTeamMemberOnly =
    !isLeadership &&
    userRoles.some((r) =>
      ['Auditor', 'Investigator', 'Team Leader', 'FiAuditor'].some((m) =>
        r.toLowerCase().includes(m.toLowerCase())
      )
    )

  const [activeTab, setActiveTab] = useState<'all' | 'assigned'>(isTeamMemberOnly ? 'assigned' : 'all')
  const [searchTerm, setSearchTerm] = useState('')
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL')

  const { data: rawCases = [], isLoading } = useQuery({
    queryKey: ['case-registry', user?.userId, userRoles],
    queryFn: () => fetchCaseRegistry(user),
  })

  // Filter cases based on search, priority, and assigned tab
  const filteredCases = useMemo(() => {
    let result = rawCases

    // If assigned tab active and leadership user wants to view only their assignments
    if (activeTab === 'assigned' && isLeadership && user) {
      const userId = (user.userId || '').toLowerCase()
      const userName = (user.userName || '').toLowerCase()
      const userFullName = `${user.firstName || ''} ${user.lastName || ''}`.trim().toLowerCase()

      result = result.filter((c) => {
        if (c.currentAssigneeId && c.currentAssigneeId.toLowerCase() === userId) return true
        if (c.assignedTo) {
          const a = c.assignedTo.toLowerCase()
          if (a === userName || (userFullName && a === userFullName)) return true
        }
        return false
      })
    }

    if (priorityFilter !== 'ALL') {
      result = result.filter((c) => c.priority === priorityFilter)
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase()
      result = result.filter(
        (c) =>
          c.referenceKey.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q) ||
          (c.targetDepartment && c.targetDepartment.toLowerCase().includes(q)) ||
          (c.assignedTo && c.assignedTo.toLowerCase().includes(q))
      )
    }

    return result
  }, [rawCases, activeTab, isLeadership, user, priorityFilter, searchTerm])

  const criticalCount = filteredCases.filter((c) => c.priority === 'CRITICAL').length
  const activeCount = filteredCases.filter((c) => c.status === 'INVESTIGATION_ACTIVE').length
  const reviewCount = filteredCases.filter((c) => c.status === 'UNDER_REVIEW' || c.status === 'SUBMITTED').length

  return (
    <div className="space-y-6">
      {/* Top Header & Role Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {isTeamMemberOnly ? 'My Assigned Inquiries & Tasks' : 'Case Oversight & Triage Registry'}
            </h1>
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                isTeamMemberOnly
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-cbe-purple/10 text-cbe-purple border-cbe-purple/20'
              }`}
            >
              {isTeamMemberOnly ? (
                <>
                  <UserCheck className="w-3 h-3" />
                  Assigned Tasks Only
                </>
              ) : (
                <>
                  <Shield className="w-3 h-3" />
                  Division Oversight
                </>
              )}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {isTeamMemberOnly
              ? 'Displaying only investigation files, tasks, and inquiries specifically assigned to your workflow queue.'
              : 'Enterprise-wide compliance monitoring, risk triage, and investigative assignments.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="outline" size="sm">
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export Audit Log</span>
          </Button>
        </div>
      </div>

      {/* Leadership Filter Tabs: All vs Assigned */}
      {isLeadership && (
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition ${
              activeTab === 'all'
                ? 'bg-cbe-purple text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            All Division Cases ({rawCases.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('assigned')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition ${
              activeTab === 'assigned'
                ? 'bg-cbe-purple text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Assigned to Me
          </button>
        </div>
      )}

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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by case key, category, department..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-700">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-transparent border-none outline-none text-xs font-medium cursor-pointer"
            >
              <option value="ALL">All Priorities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table */}
      {isLoading ? (
        <div className="p-16 flex flex-col items-center justify-center gap-3 text-slate-500">
          <Spinner size="lg" />
          <p className="text-xs">Loading authorized case registry...</p>
        </div>
      ) : (
        <CaseTable cases={filteredCases} />
      )}
    </div>
  )
}
