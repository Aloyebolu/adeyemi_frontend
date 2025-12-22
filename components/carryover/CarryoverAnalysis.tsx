import { ShieldAlert, BookOpen, AlertTriangle, Users } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { format } from 'date-fns'
import { MasterComputation } from '@/types/computation'
import { calculateCarryoverRate } from '@/utils/computationHelpers'

interface CarryoverAnalysisProps {
  masterComputations: MasterComputation[]
}

export default function CarryoverAnalysis({ masterComputations }: CarryoverAnalysisProps) {
  const totalCarryovers = masterComputations
    .filter(c => c.totalCarryovers)
    .reduce((acc, c) => acc + (c.totalCarryovers || 0), 0)

  const highestFailureRate = masterComputations.reduce((max, comp) => {
    const rate = calculateCarryoverRate(comp)
    return Math.max(max, rate)
  }, 0)

  const departmentsWithCarryovers = new Set(
    masterComputations
      .filter(c => c.totalCarryovers && c.totalCarryovers > 0)
      .flatMap(c => c.metadata?.departments?.map(d => d.departmentId) || [])
  ).size

  const carryoverComputations = masterComputations
    .filter(c => c.totalCarryovers && c.totalCarryovers > 0)
    .slice(0, 5)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Carryover Analysis</CardTitle>
              <CardDescription>Analyze course failure patterns across departments</CardDescription>
            </div>
            <Button
              onClick={() => {
                alert('Feature to be implemented: Select department and semester for detailed analysis')
              }}
            >
              <ShieldAlert className="w-4 h-4" />
              Analyze Department
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-orange-600 font-medium">Total Carryover Courses</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      {totalCarryovers}
                    </p>
                  </div>
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <BookOpen className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-red-600 font-medium">Highest Failure Rate</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      {highestFailureRate.toFixed(1)}%
                    </p>
                  </div>
                  <div className="bg-red-100 p-3 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600 font-medium">Departments with Carryovers</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      {departmentsWithCarryovers}
                    </p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Carryover Data */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Recent Computation Carryovers</h4>
            <div className="space-y-4">
              {carryoverComputations.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No carryover data available
                </div>
              ) : (
                carryoverComputations.map((computation) => (
                  <Card key={computation._id} className="hover:bg-gray-50 transition-colors">
                    <CardContent className="p-4">
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
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}