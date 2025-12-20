import { Filter, Search } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'

interface FilterState {
  status: string
  startDate: string
  endDate: string
  search: string
}

interface ComputationFiltersProps {
  filter: FilterState
  onFilterChange: (filter: Partial<FilterState>) => void
  onApplyFilters: () => void
}

export default function ComputationFilters({ 
  filter, 
  onFilterChange, 
  onApplyFilters 
}: ComputationFiltersProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search computations..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                value={filter.search}
                onChange={(e) => onFilterChange({ search: e.target.value })}
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <select
              className="px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
              value={filter.status}
              onChange={(e) => onFilterChange({ status: e.target.value })}
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
              onChange={(e) => onFilterChange({ startDate: e.target.value })}
            />

            <input
              type="date"
              className="px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
              value={filter.endDate}
              onChange={(e) => onFilterChange({ endDate: e.target.value })}
            />

            <Button onClick={onApplyFilters}>
              <Filter className="w-4 h-4" />
              Apply Filters
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}