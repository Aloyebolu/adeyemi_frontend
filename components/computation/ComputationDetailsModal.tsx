import { format } from 'date-fns'
import { XCircle, Loader2, Calendar } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { MasterComputation, ComputationSummary } from '@/types/computation'
import { 
  getStatusColor, 
  getStatusIcon,
  formatDuration 
} from '@/utils/computationHelpers'

interface ComputationDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  computation: MasterComputation
  loading: boolean
}

export default function ComputationDetailsModal({
  isOpen,
  onClose,
  computation,
  loading
}: ComputationDetailsModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Computation Details</CardTitle>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>
        </CardHeader>

        <CardContent className="overflow-y-auto max-h-[calc(90vh-120px)]">
          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-gray-600">Loading details...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <p className="text-sm text-primary font-medium mb-2">Departments Processed</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {computation.departmentsProcessed}/{computation.totalDepartments}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <p className="text-sm text-green-600 font-medium mb-2">Overall GPA</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {computation.overallAverageGPA?.toFixed(2) || 'N/A'}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <p className="text-sm text-orange-600 font-medium mb-2">Carryover Courses</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {computation.totalCarryovers || 0}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Department Details */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Department Summaries</h4>
                <div className="space-y-4">
                  {computation.departmentSummaries?.map((summary, index) => (
                    <DepartmentSummaryCard key={summary._id || index} summary={summary} />
                  ))}
                </div>
              </div>

              {/* Failed Students */}
              {computation.totalFailedStudents && computation.totalFailedStudents > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Failed Students Summary</h4>
                  <Card className="bg-red-50 border border-red-200">
                    <CardContent className="p-4">
                      <div className="text-sm text-red-700">
                        <div className="font-medium mb-2">
                          {computation.totalFailedStudents} students failed computation
                        </div>
                        <p>
                          These students encountered errors during processing. Check individual department logs for details.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Timing Information */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Timing Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TimingCard computation={computation} />
                  <UserCard computation={computation} />
                </div>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-end">
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

function DepartmentSummaryCard({ summary }: { summary: ComputationSummary }) {
  return (
    <Card className="hover:bg-gray-50 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="font-medium text-gray-900">
              {summary.department?.name || 'Unknown Department'}
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
            <span className="font-medium ml-2">
              {summary.duration ? formatDuration(summary.duration) : 'N/A'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function TimingCard({ computation }: { computation: MasterComputation }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Started:</span>
            <span className="font-medium">
              {format(new Date(computation.startedAt), 'MMM d, yyyy HH:mm:ss')}
            </span>
          </div>
          {computation.completedAt && (
            <div className="flex justify-between">
              <span className="text-gray-600">Completed:</span>
              <span className="font-medium">
                {format(new Date(computation.completedAt), 'MMM d, yyyy HH:mm:ss')}
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-600">Duration:</span>
            <span className="font-medium">
              {computation.duration ? formatDuration(computation.duration) : 'Running...'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function UserCard({ computation }: { computation: MasterComputation }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Computed By:</span>
            <span className="font-medium">
              {computation.computedBy.name}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Status:</span>
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-sm font-medium ${getStatusColor(computation.status)}`}>
              {getStatusIcon(computation.status)}
              {computation.status.replace('_', ' ')}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}