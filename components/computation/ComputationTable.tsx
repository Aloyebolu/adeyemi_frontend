import { 
  Eye, 
  XCircle, 
  RefreshCw, 
  ChevronLeft, 
  ChevronRight,
  Calendar,
  Loader2 
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardFooter } from '@/components/ui/Card'
import { formatSemesterName } from '@/utils/semesterNameFormatter'
import { 
  getStatusColor, 
  getStatusIcon, 
  getProgressPercentage,
  formatComputationDate 
} from '@/utils/computationHelpers'
import { MasterComputation } from '@/types/computation'

interface ComputationTableProps {
  computations: MasterComputation[]
  loading: boolean
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  onViewDetails: (computation: MasterComputation) => void
  onCancel: (computationId: string) => void
  onRetry: (computation: MasterComputation) => void
  onPageChange: (page: number) => void
}

export default function ComputationTable({
  computations,
  loading,
  pagination,
  onViewDetails,
  onCancel,
  onRetry,
  onPageChange
}: ComputationTableProps) {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Loading computations...</p>
        </CardContent>
      </Card>
    )
  }

  if (computations.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="w-16 h-16 text-gray-300 mx-auto mb-4">
            <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No computations found</h3>
          <p className="text-gray-600">Start a new computation to begin processing results</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-0">
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
              {computations.map((computation) => {
                const { date, time } = formatComputationDate(computation.startedAt)
                const progress = getProgressPercentage(computation)
                
                return (
                  <tr key={computation._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{date}</div>
                      <div className="text-sm text-gray-600">{time}</div>
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
                          <span>{progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900">
                        {computation.totalDepartments} departments
                      </div>
                      {computation.metadata?.departments?.[0]?.semesterName && (
                        <div className="text-sm text-gray-600 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatSemesterName(computation.metadata.departments[0].semesterName, "1Aa")}
                        </div>
                      )}
                      {computation.overallAverageGPA && (
                        <div className="text-sm text-gray-600">
                          GPA: {computation.overallAverageGPA.toFixed(2)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900">
                        {computation.duration ? `${Math.floor(computation.duration / 60000)}m ${Math.floor((computation.duration % 60000) / 1000)}s` : 'Running...'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => onViewDetails(computation)}
                          variant="outline"
                          size="sm"
                        >
                          <Eye className="w-4 h-4" />
                          Details
                        </Button>

                        {computation.status === 'processing' && (
                          <Button
                            onClick={() => onCancel(computation._id)}
                            variant="destructive"
                            size="sm"
                          >
                            <XCircle className="w-4 h-4" />
                            Cancel
                          </Button>
                        )}

                        {(computation.status === 'completed_with_errors' || computation.status === 'failed') && (
                          <Button
                            onClick={() => onRetry(computation)}
                            variant="outline"
                            size="sm"
                          >
                            <RefreshCw className="w-4 h-4" />
                            Retry
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </CardContent>

      {computations.length > 0 && (
        <CardFooter className="border-t border-gray-200 px-6 py-4">
          <div className="flex w-full items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
              {pagination.total} results
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => onPageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                variant="outline"
                size="sm"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="px-3 py-1.5 text-sm text-gray-700">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <Button
                onClick={() => onPageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                variant="outline"
                size="sm"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  )
}