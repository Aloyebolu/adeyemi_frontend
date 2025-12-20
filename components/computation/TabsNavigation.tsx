import { FileText, ShieldAlert } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'

interface TabsNavigationProps {
  activeTab: 'computations' | 'carryovers'
  onTabChange: (tab: 'computations' | 'carryovers') => void
}

export default function TabsNavigation({ activeTab, onTabChange }: TabsNavigationProps) {
  return (
    <Card className="mb-8">
      <CardContent className="p-0">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => onTabChange('computations')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'computations'
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
              onClick={() => onTabChange('carryovers')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'carryovers'
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
      </CardContent>
    </Card>
  )
}