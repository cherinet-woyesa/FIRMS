import { apiClient } from '@/lib/apiClient'

export interface FraudCategoryLookup {
  id: string
  name: string
}

export interface FraudTypeLookup {
  id: string
  name: string
  definition?: string
  fraudCategoryId: string
  fraudCategoryName?: string
}

export interface IntakeChannelLookup {
  id: string
  code: string
  name: string
  description?: string
  isActive?: boolean
}

export async function fetchFraudCategories(): Promise<FraudCategoryLookup[]> {
  try {
    const res = await apiClient.get<{ success: boolean; data: FraudCategoryLookup[] }>(
      '/api/fraud-categories'
    )
    if (res.data?.success && Array.isArray(res.data.data)) {
      return res.data.data
    }
    return []
  } catch (error) {
    console.error('Failed to fetch fraud categories:', error)
    return []
  }
}

export async function fetchFraudTypes(): Promise<FraudTypeLookup[]> {
  try {
    const res = await apiClient.get<{ success: boolean; data: FraudTypeLookup[] }>(
      '/api/fraud-types'
    )
    if (res.data?.success && Array.isArray(res.data.data)) {
      return res.data.data
    }
    return []
  } catch (error) {
    console.error('Failed to fetch fraud types:', error)
    return []
  }
}

export async function fetchIntakeChannels(): Promise<IntakeChannelLookup[]> {
  try {
    const res = await apiClient.get<{ success: boolean; data: IntakeChannelLookup[] }>(
      '/api/intake-channels'
    )
    if (res.data?.success && Array.isArray(res.data.data)) {
      return res.data.data
    }
    return []
  } catch (error) {
    console.error('Failed to fetch intake channels:', error)
    return []
  }
}

export interface CaseTypeLookup {
  id: string
  code: string
  name: string
  description?: string
  isActive?: boolean
}

export async function fetchCaseTypes(): Promise<CaseTypeLookup[]> {
  try {
    const res = await apiClient.get<{ success: boolean; data: CaseTypeLookup[] }>(
      '/api/case-types'
    )
    if (res.data?.success && Array.isArray(res.data.data)) {
      return res.data.data
    }
    return []
  } catch (error) {
    console.error('Failed to fetch case types:', error)
    return []
  }
}

export interface AllegationSubjectTypeLookup {
  id: number
  name: string
  label: string
  routingDescription: string
  targetRecipient: string
}

const SUBJECT_METADATA: Record<string, { label: string; routingDescription: string; targetRecipient: string }> = {
  Other: {
    label: 'Standard Employee / Branch / Department',
    routingDescription: 'Standard intake handling (Routes to Ethics & Compliance Division / RMCD)',
    targetRecipient: 'Risk Management & Compliance Division',
  },
  RMCDEmployee: {
    label: 'Risk Management & Compliance Official',
    routingDescription: 'Bypasses Division (Directly routes to President\'s Office)',
    targetRecipient: 'President',
  },
  President: {
    label: 'Executive Leadership / President',
    routingDescription: 'Bypasses Management (Directly routes to Board Audit Committee)',
    targetRecipient: 'Board Audit Committee',
  },
}

export async function fetchAllegationSubjectTypes(): Promise<AllegationSubjectTypeLookup[]> {
  try {
    const res = await apiClient.get<any>('/api/SubjectTypes')
    const list: Array<{ id: number; name: string }> = Array.isArray(res.data)
      ? res.data
      : Array.isArray(res.data?.data)
      ? res.data.data
      : []

    if (list.length > 0) {
      return list.map((item) => {
        const meta = SUBJECT_METADATA[item.name] || {
          label: item.name,
          routingDescription: `Routes according to ${item.name}`,
          targetRecipient: item.name,
        }
        return {
          id: item.id,
          name: item.name,
          label: meta.label,
          routingDescription: meta.routingDescription,
          targetRecipient: meta.targetRecipient,
        }
      })
    }
    return []
  } catch (error) {
    console.error('Failed to fetch allegation subject types from /api/SubjectTypes:', error)
    return []
  }
}

