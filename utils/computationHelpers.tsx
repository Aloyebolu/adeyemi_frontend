import { 
  CheckCircle, 
  Loader2, 
  AlertTriangle, 
  XCircle, 
  Clock,
  Eye
} from 'lucide-react'
import { format } from 'date-fns'
import { MasterComputation, ComputationSummary } from '@/types/computation'

export const formatDuration = (ms: number): string => {
  const minutes = Math.floor(ms / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  return `${minutes}m ${seconds}s`
}

export const getStatusColor = (status: string): string => {
  const colors = {
    completed: 'bg-green-100 text-green-800 border border-green-200',
    processing: 'bg-blue-100 text-blue-800 border border-blue-200',
    completed_with_errors: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    failed: 'bg-red-100 text-red-800 border border-red-200',
    cancelled: 'bg-gray-100 text-gray-800 border border-gray-200'
  }
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800 border border-gray-200'
}

export const getStatusIcon = (status: string) => {
  const icons = {
    completed: <CheckCircle className="w-4 h-4" />,
    processing: <Loader2 className="w-4 h-4 animate-spin" />,
    completed_with_errors: <AlertTriangle className="w-4 h-4" />,
    failed: <XCircle className="w-4 h-4" />,
    cancelled: <XCircle className="w-4 h-4" />
  }
  return icons[status as keyof typeof icons] || <Clock className="w-4 h-4" />
}

export const getProgressPercentage = (computation: MasterComputation): number => {
  if (computation.totalDepartments === 0) return 0
  return Math.round((computation.departmentsProcessed / computation.totalDepartments) * 100)
}

export const formatComputationDate = (dateString: string): { date: string, time: string } => {
  const date = new Date(dateString)
  return {
    date: format(date, 'MMM d, yyyy'),
    time: format(date, 'HH:mm:ss')
  }
}

export const getFailedDepartments = (computation: MasterComputation): ComputationSummary[] => {
  return computation.departmentSummaries?.filter(
    s => s.status === 'failed' || s.status === 'completed_with_errors'
  ) || []
}

export const calculateCarryoverRate = (computation: MasterComputation): number => {
  if (!computation.totalCarryovers || !computation.totalStudents) return 0
  return (computation.totalCarryovers / computation.totalStudents) * 100
}