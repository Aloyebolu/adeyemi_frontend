import { PlayCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'

interface HeaderProps {
  onStartComputation: () => void
  onRefresh: () => void
}

export default function Header({ onStartComputation, onRefresh }: HeaderProps) {
  return (
    <div className="">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="border-none shadow-none ">
          <CardHeader className="border-none p-0">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex-1">
                <CardTitle className="text-3xl">Results Computation</CardTitle>
                <CardDescription>
                  Manage and monitor result processing for all departments
                </CardDescription>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button onClick={onStartComputation}>
                  <PlayCircle className="w-4 h-4" />
                  Start New Computation
                </Button>

                <Button onClick={onRefresh} variant='outline'>
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}