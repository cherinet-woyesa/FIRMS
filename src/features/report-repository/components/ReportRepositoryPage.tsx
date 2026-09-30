import React, { useState, useMemo } from 'react'
import {
  Search,
  Upload,
  Calendar,
  RotateCcw,
  CheckCircle2,
  DollarSign,
  Database,
  Archive,
  Layers,
  LayoutGrid,
  Table as TableIcon,
  Eye,
  Check,
  Copy,
} from 'lucide-react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import type { HistoricalReportDossier, RepositoryFilterState } from '../types/repository.types'
import { fetchRepositoryDossiers, calculateRepositoryStats } from '../api/repositoryApi'
import { ReportDocumentViewerModal } from './ReportDocumentViewerModal'
import { UploadHistoricalReportModal } from './UploadHistoricalReportModal'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/feedback/Spinner'

export const ReportRepositoryPage: React.FC = () => {
  const queryClient = useQueryClient()

  // Filter state
  const [filters, setFilters] = useState<RepositoryFilterState>({
    searchQuery: '',
    incidentYear: 'all',
    sourceType: 'all',
    category: 'all',
    district: 'all',
    disposition: 'all',
    sortBy: 'date-desc',
  })

  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table')
  const [selectedDossier, setSelectedDossier] = useState<HistoricalReportDossier | null>(null)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [copiedAcc, setCopiedAcc] = useState<string | null>(null)

  // Fetch dossiers with current filters
  const { data: dossiers = [], isLoading, refetch } = useQuery({
    queryKey: ['report-repository', filters],
    queryFn: () => fetchRepositoryDossiers(filters),
  })

  // Calculate statistics across all available dossiers
  const stats = useMemo(() => calculateRepositoryStats(dossiers), [dossiers])

  const hasActiveFilters =
    filters.searchQuery.trim().length > 0 ||
    filters.incidentYear !== 'all' ||
    filters.sourceType !== 'all' ||
    filters.category !== 'all' ||
    filters.district !== 'all' ||
    filters.disposition !== 'all'

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      incidentYear: 'all',
      sourceType: 'all',
      category: 'all',
      district: 'all',
      disposition: 'all',
      sortBy: 'date-desc',
    })
  }

  const handleCopy = (acc: string, e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(acc)
    setCopiedAcc(acc)
    setTimeout(() => setCopiedAcc(null), 1800)
  }

  const formatETB = (amount: number) => {
    return new Intl.NumberFormat('en-ET', {
      style: 'currency',
      currency: 'ETB',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 select-none">
      {/* 1. Page Header & Key Actions */}
      <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cbe-purple shrink-0" />
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Report Repository
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
          <Button
            onClick={() => setIsUploadModalOpen(true)}
            className="w-full sm:w-auto bg-cbe-purple hover:bg-cbe-purple-700 text-white font-medium text-xs flex items-center justify-center gap-2 px-4 shadow-2xs"
          >
            <Upload className="w-3.5 h-3.5 shrink-0" />
            <span>Register Report</span>
          </Button>
        </div>
      </div>

      {/* 2. Key Metrics & Index Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Dossiers */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Total Dossiers
            </span>
            <span className="text-xl font-black text-slate-900 mt-0.5 block">
              {stats.totalReports}
            </span>
          </div>
          <div className="w-9 h-9 rounded-lg bg-purple-50 text-cbe-purple flex items-center justify-center shrink-0">
            <Database className="w-4 h-4" />
          </div>
        </div>

        {/* Total Financial Loss Traced */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Losses Traced
            </span>
            <span className="text-base font-black text-slate-900 mt-0.5 block truncate">
              {formatETB(stats.totalAmountETB)}
            </span>
          </div>
          <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>

        {/* Restitution Recovered */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Restitution Secured
            </span>
            <span className="text-base font-black text-emerald-700 mt-0.5 block truncate">
              {formatETB(stats.restitutionRecoveredETB)}
            </span>
          </div>
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        {/* Time Horizon Covered */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Archival Horizon
            </span>
            <span className="text-base font-black text-slate-900 mt-0.5 block">
              2022 – 2026
            </span>
          </div>
          <div className="w-9 h-9 rounded-lg bg-amber-50 text-cbe-gold flex items-center justify-center shrink-0">
            <Archive className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* 3. Search & Multi-Facet Filtering Controls (FR 3.9.3) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
            placeholder="Search..."
            className="w-full pl-10 pr-24 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:ring-1 focus:ring-cbe-purple transition"
          />
          {filters.searchQuery && (
            <button
              onClick={() => setFilters({ ...filters, searchQuery: '' })}
              className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Pills / Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs">
          {/* Year Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[11px] font-semibold text-slate-500">Year:</span>
            <select
              value={filters.incidentYear}
              onChange={(e) => setFilters({ ...filters, incidentYear: e.target.value })}
              className="bg-transparent font-bold text-slate-800 focus:outline-hidden cursor-pointer"
            >
              <option value="all">All Years</option>
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
            </select>
          </div>

          {/* Source Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[11px] font-semibold text-slate-500">Source:</span>
            <select
              value={filters.sourceType}
              onChange={(e) =>
                setFilters({ ...filters, sourceType: e.target.value as any })
              }
              className="bg-transparent font-bold text-slate-800 focus:outline-hidden cursor-pointer"
            >
              <option value="all">All</option>
              <option value="historical-archive">Historical</option>
              <option value="system-finalized">Finalized</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
            <span className="text-[11px] font-semibold text-slate-500">Category:</span>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="bg-transparent font-bold text-slate-800 focus:outline-hidden cursor-pointer max-w-[140px] truncate"
            >
              <option value="all">All</option>
              <option value="Embezzlement">Embezzlement</option>
              <option value="Accounting Fraud">Accounting</option>
              <option value="Credit & Loan">Credit &amp; Loan</option>
              <option value="Cash Operations">Cash &amp; Vault</option>
              <option value="Payroll">Payroll</option>
              <option value="Foreign Exchange">Forex / Treasury</option>
              <option value="Wire Transfer">Wire Transfer</option>
            </select>
          </div>

          {/* Disposition Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
            <span className="text-[11px] font-semibold text-slate-500">Outcome:</span>
            <select
              value={filters.disposition}
              onChange={(e) => setFilters({ ...filters, disposition: e.target.value })}
              className="bg-transparent font-bold text-slate-800 focus:outline-hidden cursor-pointer max-w-[130px] truncate"
            >
              <option value="all">All</option>
              <option value="Substantiated - Criminal Prosecution">Criminal Prosecution</option>
              <option value="Substantiated - Internal Recovery / Restitution">Restitution</option>
              <option value="Substantiated - Administrative Sanction">Sanction</option>
              <option value="Closed - Full Restitution Paid">Closed</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
            <span className="text-[11px] font-semibold text-slate-500">Sort:</span>
            <select
              value={filters.sortBy}
              onChange={(e) =>
                setFilters({ ...filters, sortBy: e.target.value as any })
              }
              className="bg-transparent font-bold text-slate-800 focus:outline-hidden cursor-pointer"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="amount-desc">Highest Amount</option>
              <option value="amount-asc">Lowest Amount</option>
              <option value="docket-asc">Docket Ref (A-Z)</option>
            </select>
          </div>

          {/* Reset Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition cursor-pointer font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}

          {/* View Mode Toggle */}
          <div className="ml-auto flex items-center border border-slate-200 rounded-lg overflow-hidden p-0.5 bg-slate-50">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded transition cursor-pointer ${viewMode === 'table' ? 'bg-white shadow-2xs text-cbe-purple' : 'text-slate-400 hover:text-slate-700'
                }`}
              title="Table View"
            >
              <TableIcon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded transition cursor-pointer ${viewMode === 'cards' ? 'bg-white shadow-2xs text-cbe-purple' : 'text-slate-400 hover:text-slate-700'
                }`}
              title="Card View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Results List / Table View */}
      {isLoading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-16 flex flex-col items-center justify-center gap-3 text-slate-500 shadow-2xs">
          <Spinner size="lg" />
        </div>
      ) : dossiers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center shadow-2xs space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">No Reports Found</h3>
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetFilters}
              className="text-xs border-slate-200 hover:bg-slate-50"
            >
              Clear All Filters
            </Button>
          )}
        </div>
      ) : viewMode === 'table' ? (
        /* DENSE TABLE VIEW */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                  <th className="py-3 px-4">Docket &amp; Year</th>
                  <th className="py-3 px-4">Report Title &amp; Category</th>
                  <th className="py-3 px-4">Victim / Target Entity</th>
                  <th className="py-3 px-4">Account Number(s)</th>
                  <th className="py-3 px-4">Branch &amp; District</th>
                  <th className="py-3 px-4 text-right">Amount (ETB)</th>
                  <th className="py-3 px-4">Disposition Status</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dossiers.map((dossier) => (
                  <tr
                    key={dossier.id}
                    onClick={() => setSelectedDossier(dossier)}
                    className="hover:bg-purple-50/30 transition cursor-pointer group"
                  >
                    {/* Docket & Year */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="font-mono font-bold text-slate-900 group-hover:text-cbe-purple transition">
                          {dossier.docketNumber}
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span
                            className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase ${dossier.sourceType === 'historical-archive'
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-purple-50 text-cbe-purple border border-purple-200'
                              }`}
                          >
                            {dossier.incidentYear}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {dossier.reportDate}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Title & Category */}
                    <td className="py-3 px-4 max-w-xs">
                      <p className="font-semibold text-slate-900 truncate" title={dossier.title}>
                        {dossier.title}
                      </p>
                      <span className="text-[10px] text-cbe-purple font-medium truncate block">
                        {dossier.category}
                      </span>
                    </td>

                    {/* Victim Name */}
                    <td className="py-3 px-4 max-w-[180px]">
                      <p className="text-slate-800 font-medium truncate" title={dossier.victimName}>
                        {dossier.victimName}
                      </p>
                      <span className="text-[10px] text-slate-400 truncate block">
                        Sub: {dossier.subjectNames}
                      </span>
                    </td>

                    {/* Account Number(s) */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
                          {dossier.accountNumbers[0]}
                        </span>
                        {dossier.accountNumbers.length > 1 && (
                          <span className="text-[10px] text-slate-400 font-bold">
                            +{dossier.accountNumbers.length - 1}
                          </span>
                        )}
                        <button
                          onClick={(e) => handleCopy(dossier.accountNumbers[0], e)}
                          title="Copy account"
                          className="text-slate-400 hover:text-cbe-purple transition cursor-pointer"
                        >
                          {copiedAcc === dossier.accountNumbers[0] ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Branch & District */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <p className="text-slate-800 font-medium">{dossier.branch}</p>
                      <span className="text-[10px] text-slate-400">{dossier.district}</span>
                    </td>

                    {/* Amount */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <span className="font-mono font-bold text-slate-900 block">
                        {formatETB(dossier.amountETB)}
                      </span>
                      {dossier.isRestitutionSecured && (
                        <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded border border-emerald-100">
                          Restitution
                        </span>
                      )}
                    </td>

                    {/* Disposition Status */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {dossier.disposition.split('-')[0].trim()}
                      </span>
                    </td>

                    {/* Action Button */}
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedDossier(dossier)
                        }}
                        className="text-xs h-7 px-2.5 border-slate-200 hover:border-cbe-purple hover:text-cbe-purple flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>View</span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* CARD / GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dossiers.map((dossier) => (
            <div
              key={dossier.id}
              onClick={() => setSelectedDossier(dossier)}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-md hover:border-cbe-purple/40 transition cursor-pointer flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-xs text-slate-900">
                      {dossier.docketNumber}
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-slate-100 text-slate-600">
                      {dossier.incidentYear}
                    </span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${dossier.sourceType === 'historical-archive'
                      ? 'bg-amber-50 text-amber-800 border border-amber-200'
                      : 'bg-purple-50 text-cbe-purple border border-purple-200'
                      }`}
                  >
                    {dossier.sourceType === 'historical-archive' ? 'Historical' : 'Finalized'}
                  </span>
                </div>

                {/* Title */}
                <div>
                  <h3 className="font-bold text-xs text-slate-900 line-clamp-2 leading-tight">
                    {dossier.title}
                  </h3>
                  <span className="text-[10px] text-cbe-purple font-semibold mt-1 block">
                    {dossier.category}
                  </span>
                </div>

                {/* Particulars Grid */}
                <div className="space-y-1.5 bg-slate-50/70 p-3 rounded-xl border border-slate-200/80 text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-semibold">Victim:</span>
                    <span className="font-bold text-slate-800 truncate max-w-[170px]" title={dossier.victimName}>
                      {dossier.victimName}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-semibold">Account:</span>
                    <span className="font-mono font-bold text-slate-900">
                      {dossier.accountNumbers[0]}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-semibold">Branch:</span>
                    <span className="font-medium text-slate-800 truncate max-w-[170px]">
                      {dossier.branch}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                    Quantified Loss
                  </span>
                  <span className="font-mono font-black text-slate-900 text-xs">
                    {formatETB(dossier.amountETB)}
                  </span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs h-7 px-3 border-slate-200 hover:border-cbe-purple hover:text-cbe-purple flex items-center gap-1"
                >
                  <Eye className="w-3 h-3" />
                  <span>Dossier</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 5. Modals */}
      {selectedDossier && (
        <ReportDocumentViewerModal
          dossier={selectedDossier}
          onClose={() => setSelectedDossier(null)}
        />
      )}

      {isUploadModalOpen && (
        <UploadHistoricalReportModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['report-repository'] })
            refetch()
          }}
        />
      )}
    </div>
  )
}
