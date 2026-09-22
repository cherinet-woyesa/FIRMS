import { create } from 'zustand'

export interface ReportDraft {
  category: string
  incidentDate: string
  description: string
  isAnonymous: boolean
  accusedDepartment?: string
  contactEmail?: string
}

interface ReportStore {
  draft: ReportDraft
  currentStep: number
  setStep: (step: number) => void
  updateDraft: (fields: Partial<ReportDraft>) => void
  resetDraft: () => void
}

const initialDraft: ReportDraft = {
  category: 'Ethics & Compliance',
  incidentDate: '',
  description: '',
  isAnonymous: true,
  accusedDepartment: '',
  contactEmail: '',
}

export const useReportStore = create<ReportStore>((set) => ({
  draft: initialDraft,
  currentStep: 1,
  setStep: (step) => set({ currentStep: step }),
  updateDraft: (fields) =>
    set((state) => ({ draft: { ...state.draft, ...fields } })),
  resetDraft: () => set({ draft: initialDraft, currentStep: 1 }),
}))
