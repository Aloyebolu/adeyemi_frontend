"use client"

import { useState, useEffect, useCallback } from 'react'
import {
  PlayCircle,
  RefreshCw,
  Eye,
  XCircle,
  FileText,
  ShieldAlert,
  CheckCircle,
  AlertTriangle,
  Clock,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  Download,
  BarChart3,
  TrendingUp,
  Users,
  BookOpen,
  Loader2,
  Calendar,
  MoreVertical
} from 'lucide-react'
import { format } from 'date-fns'
import { useDataFetcher } from '@/lib/dataFetcher'
import { useNotifications } from '@/hooks/useNotification'

interface ComputationSummary {
  _id: string
  department: {
    name: string
    code: string
  }
  semester: {
    name: string
    academicYear: string
    isActive: boolean
    isLocked: boolean
  }
  status: 'processing' | 'completed' | 'completed_with_errors' | 'failed' | 'cancelled'
  totalStudents: number
  studentsWithResults: number
  averageGPA: number
  highestGPA: number
  lowestGPA: number
  gradeDistribution: {
    firstClass: number
    secondClassUpper: number
    secondClassLower: number
    thirdClass: number
    fail: number
  }
  carryoverStats: {
    totalCarryovers: number
    affectedStudents: number
  }
  failedStudents: Array<{
    studentId: string
    matricNumber: string
    name: string
    error: string
  }>
  startedAt: string
  completedAt?: string
  duration: number
  computedBy: {
    name: string
    email: string
  }
}

interface MasterComputation {
  _id: string
  totalDepartments: number
  departmentsProcessed: number
  status: 'processing' | 'completed' | 'completed_with_errors' | 'cancelled' | 'failed'
  overallAverageGPA?: number
  totalStudents?: number
  totalFailedStudents?: number
  totalCarryovers?: number
  departmentsLocked?: number
  computedBy: {
    name: string
    email: string
  }
  startedAt: string
  completedAt?: string
  duration?: number
  departmentSummaries: ComputationSummary[]
  metadata?: {
    departments: Array<{
      departmentId: string
      departmentName: string
      semesterId: string
      semesterName: string
    }>
  }
}

interface Department {
  _id: string
  name: string
  code: string
}

interface CarryoverStats {
  department: Department
  semester: {
    _id: string
    name: string
    academicYear: string
  }
  totalCarryoverCourses: number
  totalStudentsWithCarryovers: number
  courseBreakdown: Array<{
    courseCode: string
    courseTitle: string
    courseUnit: number
    totalStudents: number
    students: string[]
  }>
}

export default function ComputationDashboard() {
  const [masterComputations, setMasterComputations] = useState<MasterComputation[]>([])
  const [selectedComputation, setSelectedComputation] = useState<MasterComputation | null>(null)
  const [loading, setLoading] = useState({
    computations: true,
    details: false,
    stats: false
  })
  const [carryoverStats, setCarryoverStats] = useState<CarryoverStats | null>(null)
  const [activeTab, setActiveTab] = useState<'computations' | 'carryovers'>('computations')
  const [showStartComputation, setShowStartComputation] = useState(false)
  const [showRetryModal, setShowRetryModal] = useState(false)
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([])
  const {fetchData} = useDataFetcher()
  const {addNotification} = useNotifications()
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  })
  const [filter, setFilter] = useState({
    status: '',
    startDate: '',
    endDate: '',
    search: ''
  })

  // Fetch master computations
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
    } finally {
      setLoading(prev => ({ ...prev, computations: false }))
    }
  }, [pagination.page, pagination.limit, filter])

  // Fetch computation details
  const fetchComputationDetails = useCallback(async (computationId: string) => {
    try {
      setLoading(prev => ({ ...prev, details: true }))
      const response = await fetchData(`/computation/status/${computationId}`)
      const data = response

        setSelectedComputation(data.data.masterComputation)
    } catch (error) {
      console.error('Failed to fetch computation details:', error)
    } finally {
      setLoading(prev => ({ ...prev, details: false }))
    }
  }, [])

  // Start computation
  const startComputation = async () => {
    try {
      setLoading(prev => ({ ...prev, computations: true }))
      const response = await fetchData('/computation/compute-all', "POST")
      const data = response
        setShowStartComputation(false)
        fetchMasterComputations()
    } catch (error) {
      console.error('Failed to start computation:', error)
      addNotification.error('Failed to start computation')
    } finally {
      setLoading(prev => ({ ...prev, computations: false }))
    }
  }

  // Cancel computation
  const cancelComputation = async (computationId: string) => {
    if (!confirm('Are you sure you want to cancel this computation?')) return

    try {
      const response = await fetchData(`/computation/cancel/${computationId}`, "POST")
      const data = await response

        alert('Computation cancelled successfully!')
        fetchMasterComputations()
        if (selectedComputation?._id === computationId) {
          fetchComputationDetails(computationId)
      } else {
        addNotification.error(data.message || 'Failed to cancel computation')
      }
    } catch (error) {
      console.error('Failed to cancel computation:', error)
      alert('Failed to cancel computation')
    }
  }

  // Retry failed departments
  const retryFailedDepartments = async (computationId: string) => {
    try {
      const response = await fetchData(`/computation/retry/${computationId}`, "POST", { departmentIds: selectedDepartments})
      const data = response

        alert('Failed departments queued for retry!')
        setShowRetryModal(false)
        setSelectedDepartments([])
        fetchComputationDetails(computationId)

    } catch (error) {
      console.error('Failed to retry departments:', error)
      addNotification.error('Failed to retry departments')
    }
  }

  // Load initial data
  useEffect(() => {
    fetchMasterComputations()
  }, [fetchMasterComputations])

  // Format duration
  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}m ${seconds}s`
  }

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border border-green-200'
      case 'processing':
        return 'bg-blue-100 text-blue-800 border border-blue-200'
      case 'completed_with_errors':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200'
      case 'failed':
        return 'bg-red-100 text-red-800 border border-red-200'
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 border border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200'
    }
  }

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />
      case 'processing':
        return <Loader2 className="w-4 h-4 animate-spin" />
      case 'completed_with_errors':
        return <AlertTriangle className="w-4 h-4" />
      case 'failed':
        return <XCircle className="w-4 h-4" />
      case 'cancelled':
        return <XCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  // Calculate progress percentage
  const getProgressPercentage = (computation: MasterComputation) => {
    if (computation.totalDepartments === 0) return 0
    return Math.round((computation.departmentsProcessed / computation.totalDepartments) * 100)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-dark shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white">Results Computation</h1>
              <p className="text-white/80 mt-1">Manage and monitor result processing for all departments</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setShowStartComputation(true)}
                className="inline-flex items-center gap-2 bg-white text-primary hover:bg-gray-50 px-5 py-2.5 rounded-xl font-medium transition-all hover:scale-105"
              >
                <PlayCircle className="w-4 h-4" />
                Start New Computation
              </button>
              
              <button
                onClick={fetchMasterComputations}
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm px-5 py-2.5 rounded-xl font-medium transition-all hover:scale-105"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Computations</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {masterComputations.length}
                </p>
              </div>
              <div className="bg-green-50 p-3 rounded-xl">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              {masterComputations.filter(c => c.status === 'completed').length} completed successfully
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Avg. GPA</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {masterComputations
                    .filter(c => c.overallAverageGPA)
                    .reduce((acc, c) => acc + (c.overallAverageGPA || 0), 0) / 
                    Math.max(1, masterComputations.filter(c => c.overallAverageGPA).length)
                    .toFixed(2)}
                </p>
              </div>
              <div className="bg-purple-50 p-3 rounded-xl">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              Average GPA across all computations
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Students</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {masterComputations
                    .filter(c => c.totalStudents)
                    .reduce((acc, c) => acc + (c.totalStudents || 0), 0)}
                </p>
              </div>
              <div className="bg-blue-50 p-3 rounded-xl">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              Students processed across all departments
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Carryovers</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {masterComputations
                    .filter(c => c.totalCarryovers)
                    .reduce((acc, c) => acc + (c.totalCarryovers || 0), 0)}
                </p>
              </div>
              <div className="bg-orange-50 p-3 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              Failed courses that require retakes
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('computations')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'computations'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Computations
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab('carryovers')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'carryovers'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4" />
                  Carryover Analysis
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'computations' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search computations..."
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                      value={filter.search}
                      onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <select
                    className="px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={filter.status}
                    onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value }))}
                  >
                    <option value="">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="processing">Processing</option>
                    <option value="completed_with_errors">With Errors</option>
                    <option value="failed">Failed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  
                  <input
                    type="date"
                    className="px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={filter.startDate}
                    onChange={(e) => setFilter(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                  
                  <input
                    type="date"
                    className="px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={filter.endDate}
                    onChange={(e) => setFilter(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                  
                  <button
                    onClick={fetchMasterComputations}
                    className="inline-flex items-center gap-2 bg-primary text-white hover:bg-primary-dark px-5 py-2.5 rounded-xl font-medium transition-colors"
                  >
                    <Filter className="w-4 h-4" />
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Computations Table */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              {loading.computations ? (
                <div className="p-12 text-center">
                  <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                  <p className="text-gray-600">Loading computations...</p>
                </div>
              ) : masterComputations.length === 0 ? (
                <div className="p-12 text-center">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No computations found</h3>
                  <p className="text-gray-600">Start a new computation to begin processing results</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Started At
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Progress
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Departments
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Duration
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {masterComputations.map((computation) => (
                        <tr key={computation._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">
                              {format(new Date(computation.startedAt), 'MMM d, yyyy')}
                            </div>
                            <div className="text-sm text-gray-600">
                              {format(new Date(computation.startedAt), 'HH:mm:ss')}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(computation.status)}`}>
                              {getStatusIcon(computation.status)}
                              {computation.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="w-32">
                              <div className="flex justify-between text-sm text-gray-600 mb-1">
                                <span>{computation.departmentsProcessed}/{computation.totalDepartments}</span>
                                <span>{getProgressPercentage(computation)}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-primary h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${getProgressPercentage(computation)}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-gray-900">
                              {computation.totalDepartments} departments
                            </div>
                            {computation.overallAverageGPA && (
                              <div className="text-sm text-gray-600">
                                GPA: {computation.overallAverageGPA.toFixed(2)}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-gray-900">
                              {computation.duration ? formatDuration(computation.duration) : 'Running...'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => fetchComputationDetails(computation._id)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-lg text-sm font-medium transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                                Details
                              </button>
                              
                              {computation.status === 'processing' && (
                                <button
                                  onClick={() => cancelComputation(computation._id)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 rounded-lg text-sm font-medium transition-colors"
                                >
                                  <XCircle className="w-4 h-4" />
                                  Cancel
                                </button>
                              )}
                              
                              {(computation.status === 'completed_with_errors' || computation.status === 'failed') && (
                                <button
                                  onClick={() => {
                                    setSelectedComputation(computation)
                                    setShowRetryModal(true)
                                  }}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border border-yellow-200 rounded-lg text-sm font-medium transition-colors"
                                >
                                  <RefreshCw className="w-4 h-4" />
                                  Retry
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              
              {/* Pagination */}
              {masterComputations.length > 0 && (
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                    {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                    {pagination.total} results
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                      disabled={pagination.page === 1}
                      className="px-3 py-1.5 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="px-3 py-1.5 text-sm text-gray-700">
                      Page {pagination.page} of {pagination.totalPages}
                    </span>
                    <button
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                      disabled={pagination.page === pagination.totalPages}
                      className="px-3 py-1.5 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'carryovers' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Carryover Analysis</h3>
                  <p className="text-gray-600 mt-1">Analyze course failure patterns across departments</p>
                </div>
                <button
                  onClick={() => {
                    // This would open a modal to select department/semester for analysis
                    alert('Feature to be implemented: Select department and semester for detailed analysis')
                  }}
                  className="inline-flex items-center gap-2 bg-primary text-white hover:bg-primary-dark px-5 py-2.5 rounded-xl font-medium transition-colors"
                >
                  <ShieldAlert className="w-4 h-4" />
                  Analyze Department
                </button>
              </div>
              
              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-orange-600 font-medium">Total Carryover Courses</p>
                      <p className="text-2xl font-bold text-gray-900 mt-2">
                        {masterComputations
                          .filter(c => c.totalCarryovers)
                          .reduce((acc, c) => acc + (c.totalCarryovers || 0), 0)}
                      </p>
                    </div>
                    <div className="bg-orange-100 p-3 rounded-lg">
                      <BookOpen className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-red-600 font-medium">Highest Failure Rate</p>
                      <p className="text-2xl font-bold text-gray-900 mt-2">
                        {(() => {
                          const highest = masterComputations.reduce((max, comp) => {
                            const rate = comp.totalCarryovers && comp.totalStudents
                              ? (comp.totalCarryovers / comp.totalStudents) * 100
                              : 0
                            return Math.max(max, rate)
                          }, 0)
                          return `${highest.toFixed(1)}%`
                        })()}
                      </p>
                    </div>
                    <div className="bg-red-100 p-3 rounded-lg">
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-600 font-medium">Departments with Carryovers</p>
                      <p className="text-2xl font-bold text-gray-900 mt-2">
                        {new Set(
                          masterComputations
                            .filter(c => c.totalCarryovers && c.totalCarryovers > 0)
                            .flatMap(c => c.metadata?.departments?.map(d => d.departmentId) || [])
                        ).size}
                      </p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Recent Carryover Data */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Recent Computation Carryovers</h4>
                <div className="space-y-4">
                  {masterComputations
                    .filter(c => c.totalCarryovers && c.totalCarryovers > 0)
                    .slice(0, 5)
                    .map((computation) => (
                      <div key={computation._id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <div className="font-medium text-gray-900">
                              {format(new Date(computation.startedAt), 'MMM d, yyyy')}
                            </div>
                            <div className="text-sm text-gray-600">
                              {computation.totalDepartments} departments processed
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-red-600">
                              {computation.totalCarryovers}
                            </div>
                            <div className="text-sm text-gray-600">
                              carryover courses
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-700">
                          {computation.totalCarryovers} courses failed across {computation.totalDepartments} departments
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Start Computation Modal */}
        {showStartComputation && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900">Start New Computation</h3>
                <p className="text-gray-600 mt-1">Process results for all departments with active semesters</p>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-yellow-800">Important Notice</p>
                        <p className="text-yellow-700 text-sm mt-1">
                          This will start processing results for all departments with active semesters.
                          This process may take several minutes to complete.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Departments to Process:</span>
                      <span className="font-medium">All active departments</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Estimated Time:</span>
                      <span className="font-medium">5-15 minutes</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Current System Load:</span>
                      <span className="font-medium">Idle</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                <button
                  onClick={() => setShowStartComputation(false)}
                  className="px-5 py-2.5 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={startComputation}
                  disabled={loading.computations}
                  className="px-5 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading.computations ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                      Starting...
                    </>
                  ) : (
                    'Start Computation'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Retry Modal */}
        {showRetryModal && selectedComputation && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900">Retry Failed Departments</h3>
                <p className="text-gray-600 mt-1">Select departments to retry computation</p>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  <div className="text-sm text-gray-600">
                    Select departments that failed during the last computation attempt:
                  </div>
                  
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {selectedComputation.departmentSummaries
                      ?.filter(s => s.status === 'failed' || s.status === 'completed_with_errors')
                      .map((summary, index) => (
                        <label key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          <input
                            type="checkbox"
                            checked={selectedDepartments.includes(summary._id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedDepartments([...selectedDepartments, summary._id])
                              } else {
                                setSelectedDepartments(selectedDepartments.filter(id => id !== summary._id))
                              }
                            }}
                            className="rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <div>
                            <div className="font-medium text-gray-900">
                              {summary.department?.name || `Department ${index + 1}`}
                            </div>
                            <div className="text-sm text-gray-600">
                              {summary.failedStudents?.length || 0} failed students
                            </div>
                          </div>
                        </label>
                      ))}
                  </div>
                  
                  {selectedDepartments.length === 0 && (
                    <div className="text-center py-4 text-gray-500">
                      No departments selected for retry
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowRetryModal(false)
                    setSelectedDepartments([])
                  }}
                  className="px-5 py-2.5 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => retryFailedDepartments(selectedComputation._id)}
                  disabled={selectedDepartments.length === 0}
                  className="px-5 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Retry Selected ({selectedDepartments.length})
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Computation Details Modal */}
        {selectedComputation && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">Computation Details</h3>
                  <button
                    onClick={() => setSelectedComputation(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                {loading.details ? (
                  <div className="text-center py-12">
                    <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-gray-600">Loading details...</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Summary Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-xl p-6">
                        <div className="text-center">
                          <p className="text-sm text-primary font-medium mb-2">Departments Processed</p>
                          <p className="text-3xl font-bold text-gray-900">
                            {selectedComputation.departmentsProcessed}/{selectedComputation.totalDepartments}
                          </p>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-6">
                        <div className="text-center">
                          <p className="text-sm text-green-600 font-medium mb-2">Overall GPA</p>
                          <p className="text-3xl font-bold text-gray-900">
                            {selectedComputation.overallAverageGPA?.toFixed(2) || 'N/A'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-6">
                        <div className="text-center">
                          <p className="text-sm text-orange-600 font-medium mb-2">Carryover Courses</p>
                          <p className="text-3xl font-bold text-gray-900">
                            {selectedComputation.totalCarryovers || 0}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Department Details */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">Department Summaries</h4>
                      <div className="space-y-4">
                        {selectedComputation.departmentSummaries?.map((summary, index) => (
                          <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <div className="font-medium text-gray-900">
                                  {summary.department?.name || `Department ${index + 1}`}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {summary.semester?.name} • {summary.studentsWithResults}/{summary.totalStudents} students
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(summary.status)}`}>
                                  {getStatusIcon(summary.status)}
                                  {summary.status.replace('_', ' ')}
                                </span>
                                <span className="text-sm font-medium">
                                  GPA: {summary.averageGPA?.toFixed(2) || 'N/A'}
                                </span>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-gray-600">Carryovers:</span>
                                <span className="font-medium ml-2">{summary.carryoverStats?.totalCarryovers || 0}</span>
                              </div>
                              <div>
                                <span className="text-gray-600">Failed Students:</span>
                                <span className="font-medium ml-2">{summary.failedStudents?.length || 0}</span>
                              </div>
                              <div>
                                <span className="text-gray-600">Top Grade:</span>
                                <span className="font-medium ml-2">{summary.highestGPA?.toFixed(2) || 'N/A'}</span>
                              </div>
                              <div>
                                <span className="text-gray-600">Duration:</span>
                                <span className="font-medium ml-2">{summary.duration ? formatDuration(summary.duration) : 'N/A'}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Failed Students */}
                    {selectedComputation.totalFailedStudents && selectedComputation.totalFailedStudents > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-4">Failed Students Summary</h4>
                        <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                          <div className="text-sm text-red-700">
                            <div className="font-medium mb-2">
                              {selectedComputation.totalFailedStudents} students failed computation
                            </div>
                            <p>
                              These students encountered errors during processing. Check individual department logs for details.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Timing Information */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">Timing Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Started:</span>
                            <span className="font-medium">
                              {format(new Date(selectedComputation.startedAt), 'MMM d, yyyy HH:mm:ss')}
                            </span>
                          </div>
                          {selectedComputation.completedAt && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Completed:</span>
                              <span className="font-medium">
                                {format(new Date(selectedComputation.completedAt), 'MMM d, yyyy HH:mm:ss')}
                              </span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-gray-600">Duration:</span>
                            <span className="font-medium">
                              {selectedComputation.duration ? formatDuration(selectedComputation.duration) : 'Running...'}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Computed By:</span>
                            <span className="font-medium">
                              {selectedComputation.computedBy.name}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Status:</span>
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-sm font-medium ${getStatusColor(selectedComputation.status)}`}>
                              {getStatusIcon(selectedComputation.status)}
                              {selectedComputation.status.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                <button
                  onClick={() => setSelectedComputation(null)}
                  className="px-5 py-2.5 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}