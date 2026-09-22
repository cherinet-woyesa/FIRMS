import { create } from 'zustand'

interface UIState {
  isSidebarOpen: boolean
  activeModal: string | null
  toggleSidebar: () => void
  openModal: (modalId: string) => void
  closeModal: () => void
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: true,
  activeModal: null,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  openModal: (modalId) => set({ activeModal: modalId }),
  closeModal: () => set({ activeModal: null }),
}))
