import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { MasterComputation } from '@/types/computation'
import { getFailedDepartments } from '@/utils/computationHelpers'

interface RetryComputationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  computation: MasterComputation
  selectedDepartments: string[]
  onDepartmentSelectionChange: (departments: string[]) => void
}

export default function RetryComputationModal({
  isOpen,
  onClose,
  onConfirm,
  computation,
  selectedDepartments,
  onDepartmentSelectionChange
}: RetryComputationModalProps) {
  if (!isOpen) return null

  const failedDepartments = getFailedDepartments(computation)

  const toggleDepartment = (departmentId: string) => {
    if (selectedDepartments.includes(departmentId)) {
      onDepartmentSelectionChange(selectedDepartments.filter(id => id !== departmentId))
    } else {
      onDepartmentSelectionChange([...selectedDepartments, departmentId])
    }
  }

  const toggleAllDepartments = () => {
    if (selectedDepartments.length === failedDepartments.length) {
      onDepartmentSelectionChange([])
    } else {
      onDepartmentSelectionChange(failedDepartments.map(dept => dept._id))
    }
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader>
          <CardTitle>Retry Failed Departments</CardTitle>
          <CardDescription>
            Select departments to retry computation
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <div className="text-sm text-gray-600">
              Select departments that failed during the last computation attempt:
            </div>

            {failedDepartments.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                No failed departments found
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    checked={selectedDepartments.length === failedDepartments.length}
                    onChange={toggleAllDepartments}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label className="text-sm font-medium text-gray-700">
                    Select All ({failedDepartments.length} departments)
                  </label>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {failedDepartments.map((summary, index) => (
                    <div
                      key={summary._id}
                      className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedDepartments.includes(summary._id)}
                          onChange={() => toggleDepartment(summary._id)}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">
                            {summary.department?.name || `Department ${index + 1}`}
                          </div>
                          <div className="text-sm text-gray-600">
                            {summary.semester?.name} • {summary.failedStudents?.length || 0} failed students
                          </div>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              </>
            )}

            {selectedDepartments.length === 0 && failedDepartments.length > 0 && (
              <div className="text-center py-2 text-gray-500 text-sm">
                Select at least one department to retry
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-end gap-3">
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={selectedDepartments.length === 0}
          >
            Retry Selected ({selectedDepartments.length})
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}