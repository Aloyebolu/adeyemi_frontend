import { useState, useCallback, useMemo } from 'react'
import { useDataFetcher } from '@/lib/dataFetcher'
import { useNotifications } from '@/hooks/useNotification'
import { usePage } from '@/hooks/usePage'
import { MasterComputation } from '@/types/computation'

interface PaginationState {
  page: number
  limit: number
  total: number
  totalPages: number
}

interface FilterState {
  status: string
  startDate: string
  endDate: string
  search: string
}

interface LoadingState {
  computations: boolean
  details: boolean
  stats: boolean
}

export const useComputationData = () => {
  const [masterComputations, setMasterComputations] = useState<MasterComputation[]>([])
  const [loading, setLoading] = useState<LoadingState>({
    computations: true,
    details: false,
    stats: false
  })
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  })
  const [filter, setFilter] = useState<FilterState>({
    status: '',
    startDate: '',
    endDate: '',
    search: ''
  })

  const { fetchData } = useDataFetcher()
  const { addNotification } = useNotifications()
  const { setPage } = usePage()

  useState(() => {
    setPage("Result Computation")
  })

  const fetchMasterComputations = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, computations: true }))
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(filter.status && { status: filter.status }),
        ...(filter.startDate && { startDate: filter.startDate }),
        ...(filter.endDate && { endDate: filter.endDate })
      })

      const response = await fetchData(`/computation/history?${params}`)
      const data = await response

      setMasterComputations(data.data.computations)
      setPagination(prev => ({
        ...prev,
        total: data.data.pagination.totalItems,
        totalPages: data.data.pagination.totalPages
      }))
    } catch (error) {
      console.error('Failed to fetch computations:', error)
      addNotification.error('Failed to fetch computations')
    } finally {
      setLoading(prev => ({ ...prev, computations: false }))
    }
  }, [pagination.page, pagination.limit, filter, fetchData, addNotification])

  const fetchComputationDetails = useCallback(async (computationId: string) => {
    try {
      setLoading(prev => ({ ...prev, details: true }))
      const response = await fetchData(`/computation/status/${computationId}`)
      const data = response
      return data.data.masterComputation
    } catch (error) {
      console.error('Failed to fetch computation details:', error)
      addNotification.error('Failed to fetch computation details')
      return null
    } finally {
      setLoading(prev => ({ ...prev, details: false }))
    }
  }, [fetchData, addNotification])

  const startComputation = async (isFinal: boolean, purpose: 'final' | 'preview') => {
    try {
      setLoading(prev => ({ ...prev, computations: true }))
      await fetchData('/computation/compute-all', "POST", {
        isFinal,
        purpose
      })
      
      fetchMasterComputations()

      addNotification.success(
        `${isFinal ? 'Final' : 'Preview'} computation started!`,
        `Results computation has been queued. Check status using the computation ID.${!isFinal ? ' (Preview Mode - No student data will be modified)' : ''}`
      )
    } catch (error: any) {
      console.error('Failed to start computation:', error)
      addNotification.error(error.message || 'Failed to start computation')
    } finally {
      setLoading(prev => ({ ...prev, computations: false }))
    }
  }

  const cancelComputation = async (computationId: string) => {
    if (!confirm('Are you sure you want to cancel this computation?')) return

    try {
      await fetchData(`/computation/cancel/${computationId}`, "POST")
      fetchMasterComputations()
      addNotification.success('Computation cancelled successfully!')
    } catch (error: any) {
      console.error('Failed to cancel computation:', error)
      addNotification.error(error.message || 'Failed to cancel computation')
    }
  }

  const retryFailedDepartments = async (computationId: string, departmentIds: string[]) => {
    try {
      await fetchData(`/computation/retry/${computationId}`, "POST", { 
        departmentIds 
      })
      fetchMasterComputations()
      addNotification.success('Failed departments queued for retry!')
    } catch (error: any) {
      console.error('Failed to retry departments:', error)
      addNotification.error(error.message || 'Failed to retry departments')
    }
  }

  const handleFilterChange = useCallback((newFilter: Partial<FilterState>) => {
    setFilter(prev => ({ ...prev, ...newFilter }))
  }, [])

  const handlePageChange = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, page }))
  }, [])

  const filteredComputations = useMemo(() => {
    if (!filter.search) return masterComputations
    
    const searchLower = filter.search.toLowerCase()
    return masterComputations.filter(computation => 
      computation.computedBy.name.toLowerCase().includes(searchLower) ||
      computation.metadata?.departments?.some(dept => 
        dept.departmentName.toLowerCase().includes(searchLower) ||
        dept.semesterName.toLowerCase().includes(searchLower)
      ) ||
      computation.status.toLowerCase().includes(searchLower)
    )
  }, [masterComputations, filter.search])

  return {
    masterComputations: filteredComputations,
    loading,
    pagination,
    filter,
    fetchMasterComputations,
    fetchComputationDetails,
    startComputation,
    cancelComputation,
    retryFailedDepartments,
    handleFilterChange,
    handlePageChange
  }
}