import { BarChart3, TrendingUp, Users, AlertTriangle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { MasterComputation } from '@/types/computation'

interface ComputationStatsProps {
  masterComputations: MasterComputation[]
}

export default function ComputationStats({ masterComputations }: ComputationStatsProps) {
  const totalComputations = masterComputations.length
  const completedComputations = masterComputations.filter(c => c.status === 'completed').length
  
  const averageGPA = masterComputations
    .filter(c => c.overallAverageGPA)
    .reduce((acc, c) => acc + (c.overallAverageGPA || 0), 0) /
    Math.max(1, masterComputations.filter(c => c.overallAverageGPA).length)
  
  const totalStudents = masterComputations
    .filter(c => c.totalStudents)
    .reduce((acc, c) => acc + (c.totalStudents || 0), 0)
  
  const totalCarryovers = masterComputations
    .filter(c => c.totalCarryovers)
    .reduce((acc, c) => acc + (c.totalCarryovers || 0), 0)

  const stats = [
    {
      title: 'Total Computations',
      value: totalComputations,
      description: `${completedComputations} completed successfully`,
      icon: BarChart3,
      color: 'green'
    },
    {
      title: 'Avg. GPA',
      value: averageGPA.toFixed(2),
      description: 'Average GPA across all computations',
      icon: TrendingUp,
      color: 'purple'
    },
    {
      title: 'Total Students',
      value: totalStudents,
      description: 'Students processed across all departments',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Total Carryovers',
      value: totalCarryovers,
      description: 'Failed courses that require retakes',
      icon: AlertTriangle,
      color: 'orange'
    }
  ]

  const colorClasses = {
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    blue: 'bg-blue-50 text-blue-600',
    orange: 'bg-orange-50 text-orange-600'
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-xl ${colorClasses[stat.color as keyof typeof colorClasses]}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              {stat.description}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}