import { create } from 'zustand'

interface AdminStats {
  activeSemester: string
  totalStudents: number
  totalLecturers: number
  totalCourses: number
  chartData: { month: string; registrations: number; resultsPublished: number }[]
}

interface AdminStore {
  stats: AdminStats
  setStats: (stats: AdminStats) => void
}

export const useAdminStore = create<AdminStore>((set) => ({
  stats: {
    activeSemester: 'Loading...',
    totalStudents: 0,
    totalLecturers: 0,
    totalCourses: 0,
    chartData: [],
  },
  setStats: (stats) => set({ stats }),
}))
