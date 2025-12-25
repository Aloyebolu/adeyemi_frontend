import { useState } from 'react'
import {
  CheckCircle,
  Eye,
  AlertTriangle,
  Loader2,
  XCircle
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/ui/Card'

interface StartComputationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (type: 'final' | 'preview') => Promise<void>
  isLoading: boolean
}

export default function StartComputationModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading
}: StartComputationModalProps) {
  const [computationType, setComputationType] = useState<'final' | 'preview'>('preview')

  if (!isOpen) return null

  const handleSubmit = async () => {
    await onConfirm(computationType)
  }

  return (
    <div className="fixed inset-0 bg-background  flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Start New Computation</CardTitle>
              <CardDescription>
                Process results for all departments with active semesters
              </CardDescription>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">
                  Computation Type
                </label>
                <span className={`px-2 py-1 text-xs font-medium rounded ${computationType === 'final'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-blue-100 text-blue-800'
                  }`}>
                  {computationType === 'final' ? 'Live' : 'Preview'}
                </span>
              </div>
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">

                <button
                  type="button"
                  onClick={() => setComputationType('preview')}
                  className={`flex-1 py-2.5 text-center font-medium ${computationType === 'preview'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Eye className="w-4 h-4" />
                    Preview/Mastersheet
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setComputationType('final')}
                  className={`flex-1 py-2.5 text-center font-medium ${computationType === 'final'
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Final Computation
                  </div>
                </button>
              </div>
            </div>

            {computationType === 'final' ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-800">Important Notice</p>
                    <p className="text-yellow-700 text-sm mt-1">
                      This will FINALIZE results for all departments with active semesters.
                      Student records will be updated, notifications will be sent, and semesters will be locked.
                      This process cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Eye className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-800">Preview Mode</p>
                    <p className="text-blue-700 text-sm mt-1">
                      This will generate mastersheets and statistics WITHOUT modifying student records.
                      No notifications will be sent, and semesters will remain unlocked.
                      Perfect for HOD/Admin review before final computation.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Mode:</span>
                <span className={`font-medium ${computationType === 'final' ? 'text-green-600' : 'text-blue-600'
                  }`}>
                  {computationType === 'final' ? 'Final (Live)' : 'Preview (Mastersheet Only)'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Departments to Process:</span>
                <span className="font-medium">All active departments</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Estimated Time:</span>
                <span className="font-medium">
                  {computationType === 'final' ? '5-15 minutes' : '2-5 minutes'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Student Impact:</span>
                <span className={`font-medium ${computationType === 'final' ? 'text-green-600' : 'text-blue-600'
                  }`}>
                  {computationType === 'final' ? 'Records Updated' : 'No Changes'}
                </span>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end gap-3">
          <Button onClick={onClose} variant="outline" disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className={
              computationType === 'final'
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-blue-600 hover:bg-blue-700'
            }
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                Starting...
              </>
            ) : (
              <>
                {computationType === 'final' ? (
                  <>
                    <CheckCircle className="w-4 h-4 inline mr-2" />
                    Start Final Computation
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 inline mr-2" />
                    Generate Mastersheet
                  </>
                )}
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}