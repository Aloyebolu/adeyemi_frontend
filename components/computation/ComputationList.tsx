import { useMemo } from 'react'
import ComputationFilters from './ComputationFilters'
import ComputationTable from './ComputationTable'
import { MasterComputation } from '@/types/computation'

interface ComputationListProps {
  masterComputations: MasterComputation[]
  loading: boolean
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  filter: {
    status: string
    startDate: string
    endDate: string
    search: string
  }
  onFilterChange: (filter: any) => void
  onPageChange: (page: number) => void
  onViewDetails: (computation: MasterComputation) => void
  onCancel: (computationId: string) => void
  onRetry: (computation: MasterComputation) => void
  onRefresh: () => void
}

export default function ComputationList({
  masterComputations,
  loading,
  pagination,
  filter,
  onFilterChange,
  onPageChange,
  onViewDetails,
  onCancel,
  onRetry,
  onRefresh
}: ComputationListProps) {
  const filteredComputations = useMemo(() => {
    let filtered = [...masterComputations]

    if (filter.status) {
      filtered = filtered.filter(c => c.status === filter.status)
    }

    if (filter.startDate) {
      const startDate = new Date(filter.startDate)
      filtered = filtered.filter(c => new Date(c.startedAt) >= startDate)
    }

    if (filter.endDate) {
      const endDate = new Date(filter.endDate)
      endDate.setHours(23, 59, 59, 999)
      filtered = filtered.filter(c => new Date(c.startedAt) <= endDate)
    }

    if (filter.search) {
      const searchLower = filter.search.toLowerCase()
      filtered = filtered.filter(c =>
        c.computedBy.name.toLowerCase().includes(searchLower) ||
        c.metadata?.departments?.some(dept =>
          dept.departmentName.toLowerCase().includes(searchLower) ||
          dept.semesterName.toLowerCase().includes(searchLower)
        ) ||
        c.status.toLowerCase().includes(searchLower)
      )
    }

    return filtered
  }, [masterComputations, filter])

  return (
    <div className="space-y-6">
      <ComputationFilters
        filter={filter}
        onFilterChange={onFilterChange}
        onApplyFilters={onRefresh}
      />

      <ComputationTable
        computations={filteredComputations}
        loading={loading}
        pagination={pagination}
        onViewDetails={onViewDetails}
        onCancel={onCancel}
        onRetry={onRetry}
        onPageChange={onPageChange}
      />
    </div>
  )
}