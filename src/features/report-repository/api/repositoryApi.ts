import { apiClient } from '@/lib/apiClient'
import type {
  HistoricalReportDossier,
  NewHistoricalReportInput,
  RepositoryFilterState,
  RepositoryStats,
} from '../types/repository.types'

export async function fetchRepositoryDossiers(
  filters?: Partial<RepositoryFilterState>
): Promise<HistoricalReportDossier[]> {
  try {
    // Convert filters to query string
    const params = new URLSearchParams()
    if (filters) {
      if (filters.searchQuery) params.append('search', filters.searchQuery)
      if (filters.category) params.append('category', filters.category)
      if (filters.disposition) params.append('disposition', filters.disposition)
      if (filters.district) params.append('district', filters.district)
      if (filters.auditor) params.append('auditor', filters.auditor)
    }

    const response = await apiClient.get<{ success: boolean; data: HistoricalReportDossier[] }>(`/api/Reports?${params.toString()}`)
    if (response.data.success) {
      return response.data.data
    }
    return []
  } catch (error) {
    console.error('Error fetching dossiers from backend:', error)
    return []
  }
}

export async function fetchDossierById(id: string): Promise<HistoricalReportDossier | null> {
  try {
    const response = await apiClient.get<{ success: boolean; data: HistoricalReportDossier }>(`/api/Reports/${id}`)
    if (response.data.success) {
      return response.data.data
    }
    return null
  } catch (error) {
    console.error(`Error fetching dossier ${id}:`, error)
    return null
  }
}

export async function registerHistoricalReport(
  input: NewHistoricalReportInput
): Promise<HistoricalReportDossier> {
  try {
    const response = await apiClient.post<{ success: boolean; data: HistoricalReportDossier }>('/api/Reports', input)
    if (!response.data.success) {
      throw new Error('Failed to register historical report')
    }
    return response.data.data
  } catch (error) {
    console.error('Error registering report:', error)
    throw error
  }
}

export function getRepositoryStats(data: HistoricalReportDossier[]): RepositoryStats {
  const stats: RepositoryStats = {
    totalReports: data.length,
    totalAmountETB: 0,
    historicalCount: 0,
    finalizedCount: 0,
    restitutionRecoveredETB: 0,
    oldestYear: new Date().getFullYear(),
    newestYear: 1900,
  }

  data.forEach((d) => {
    stats.totalAmountETB += d.amountETB || 0
    if (d.restitutionAmountETB) {
      stats.restitutionRecoveredETB += d.restitutionAmountETB
    }
    if (d.sourceType === 'historical-archive') {
      stats.historicalCount++
    } else {
      stats.finalizedCount++
    }
    if (d.incidentYear && d.incidentYear < stats.oldestYear) {
      stats.oldestYear = d.incidentYear
    }
    if (d.incidentYear && d.incidentYear > stats.newestYear) {
      stats.newestYear = d.incidentYear
    }
  })

  return stats
}
