// app/computations/page.tsx
'use client';
import { useDataFetcher } from '@/lib/dataFetcher';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  FileText, 
  Calendar,
  Users,
  BarChart3,
  CheckCircle,
  AlertCircle,
  Clock,
  XCircle,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import {Button} from '@/components/ui/Button'
import { usePage } from '@/hooks/usePage';
interface Computation {
  _id: string;
  department: {
    _id: string;
    name: string;
    code?: string;
  };
  semester: {
    _id: string;
    name: string;
    academicYear: string;
  };
  status: 'completed' | 'processing' | 'failed' | 'pending';
  purpose: 'final' | 'preview';
  computedBy?: {
    name: string;
    email: string;
  };
  totalStudents: number;
  studentsProcessed: number;
  createdAt: string;
  completedAt?: string;
  masterSheetGenerated: boolean;
  masterSheetDataByLevel: Record<string, any>;
}

interface FilterOptions {
  departments: Array<{ _id: string; name: string; code?: string }>;
  semesters: Array<{ _id: string; name: string; academicYear: string }>;
  statuses: string[];
  purposes: string[];
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export default function ComputationsPage() {
  const router = useRouter();
  const [computations, setComputations] = useState<Computation[]>([]);
  const [loading, setLoading] = useState(true);
  const {fetchData} = useDataFetcher()
  const {setPage} = usePage()
  const [filters, setFilters] = useState({
    status: '',
    purpose: '',
    semesterId: '',
    departmentId: '',
    search: ''
  });
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    pages: 1
  });
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    departments: [],
    semesters: [],
    statuses: [],
    purposes: []
  });
  const [showFilters, setShowFilters] = useState(false);

  // Fetch computations
  const fetchComputations = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...filters
      });

      const {data} = await fetchData(`/computation?${params}`);

        setComputations(data.computations);
        setPagination(data.pagination);
        setFilterOptions(data.filters);
     
    } catch (error) {
      console.error('Error fetching computations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComputations();
  }, [filters, pagination.page]);
 
  useEffect(() => {
    setPage("Computaions")
  });
  // Handle filter changes
  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  // Get status badge style
  const getStatusStyle = (status: Computation['status']) => {
    const styles = {
      completed: 'bg-surface-elevated text-success border-success',
      processing: 'bg-surface-elevated text-warning border-warning',
      pending: 'bg-surface-elevated text-text2 border-border',
      failed: 'bg-surface-elevated text-error border-error'
    };
    return styles[status] || styles.pending;
  };

  // Get purpose badge style
  const getPurposeStyle = (purpose: Computation['purpose']) => {
    return purpose === 'final' 
      ? 'bg-primary-10 text-primary border-primary-50'
      : 'bg-surface-elevated text-text2 border-border';
  };

  // Get status icon
  const getStatusIcon = (status: Computation['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'processing': return <Clock className="w-4 h-4" />;
      case 'failed': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get available levels
  const getAvailableLevels = (computation: Computation) => {
    if (!computation.masterSheetDataByLevel) return [];
    return Object.keys(computation.masterSheetDataByLevel).sort();
  };

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Computation Results
        </h1>
        <p className="text-text2">
          View and manage academic computation summaries
        </p>
      </div>

      {/* Filters Section */}
      <div className="mb-6 bg-surface rounded-lg border border-border p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text2 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by department or semester..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background2 border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-surface-elevated border border-border rounded-lg text-foreground hover:bg-background2 transition-colors"
          >
            <Filter className="w-5 h-5" />
            Filters
            {Object.values(filters).some(v => v) && (
              <span className="bg-primary text-on-brand text-xs px-2 py-0.5 rounded-full">
                {Object.values(filters).filter(v => v).length}
              </span>
            )}
          </button>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Department Filter */}
            <div>
              <label className="block text-sm font-medium text-text2 mb-2">
                Department
              </label>
              <select
                value={filters.departmentId}
                onChange={(e) => handleFilterChange('departmentId', e.target.value)}
                className="w-full px-3 py-2 bg-background2 border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">All Departments</option>
                {filterOptions.departments.map(dept => (
                  <option key={dept._id} value={dept._id}>
                    {dept.name} ({dept.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Semester Filter */}
            <div>
              <label className="block text-sm font-medium text-text2 mb-2">
                Semester
              </label>
              <select
                value={filters.semesterId}
                onChange={(e) => handleFilterChange('semesterId', e.target.value)}
                className="w-full px-3 py-2 bg-background2 border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">All Semesters</option>
                {filterOptions.semesters.map(sem => (
                  <option key={sem._id} value={sem._id}>
                    {sem.name} - {sem.academicYear}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-text2 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 bg-background2 border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">All Statuses</option>
                {filterOptions.statuses.map(status => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Purpose Filter */}
            <div>
              <label className="block text-sm font-medium text-text2 mb-2">
                Purpose
              </label>
              <select
                value={filters.purpose}
                onChange={(e) => handleFilterChange('purpose', e.target.value)}
                className="w-full px-3 py-2 bg-background2 border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">All Types</option>
                {filterOptions.purposes.map(purpose => (
                  <option key={purpose} value={purpose}>
                    {purpose.charAt(0).toUpperCase() + purpose.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Results Section */}
      <div className="bg-surface rounded-lg border border-border overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-border bg-background2 text-sm font-medium text-text2">
          <div className="col-span-3">Department & Semester</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-1">Type</div>
          <div className="col-span-2">Students</div>
          <div className="col-span-2">Created</div>
          <div className="col-span-2">Actions</div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-2 text-text2">Loading computations...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && computations.length === 0 && (
          <div className="p-8 text-center">
            <FileText className="w-12 h-12 text-text2 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              No computations found
            </h3>
            <p className="text-text2">
              Try adjusting your filters or create a new computation
            </p>
          </div>
        )}

        {/* Computation List */}
        {!loading && computations.length > 0 && (
          <div>
            {computations.map((computation) => (
              <div
                key={computation._id}
                className="grid grid-cols-12 gap-4 p-4 border-b border-border hover:bg-background2 transition-colors"
              >
                {/* Department & Semester */}
                <div className="col-span-3">
                  <div className="font-medium text-foreground">
                    {computation.department?.name || 'N/A'}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-text2 mt-1">
                    <Calendar className="w-4 h-4" />
                    {computation.semester?.name || 'N/A'}
                    {computation.semester?.academicYear && (
                      <span className="text-xs bg-surface-elevated px-2 py-0.5 rounded">
                        {computation.semester.academicYear}
                      </span>
                    )}
                  </div>
                </div>

                {/* Status */}
                <div className="col-span-2">
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusStyle(computation.status)}`}>
                    {getStatusIcon(computation.status)}
                    <span className="text-sm font-medium capitalize">
                      {computation.status}
                    </span>
                  </div>
                </div>

                {/* Purpose/Type */}
                <div className="col-span-1">
                  <div className={`inline-flex px-3 py-1 rounded-full border text-sm font-medium capitalize ${getPurposeStyle(computation.purpose)}`}>
                    {computation.purpose}
                  </div>
                </div>

                {/* Students */}
                <div className="col-span-2">
                  <div className="flex items-center gap-2 text-foreground">
                    <Users className="w-4 h-4" />
                    <div>
                      <div className="font-medium">{computation.totalStudents || 0}</div>
                      <div className="text-xs text-text2">
                        {computation.studentsProcessed || 0} processed
                      </div>
                    </div>
                  </div>
                </div>

                {/* Created */}
                <div className="col-span-2 text-sm text-text2">
                  {formatDate(computation.createdAt)}
                </div>

                {/* Actions */}
                <div className="col-span-2">
                  <div className="flex items-center gap-2">
                    {/* View Master Sheet */}
                    {computation.masterSheetGenerated && getAvailableLevels(computation).length > 0 && (
                      <div className="relative group">
                        <button className="flex items-center gap-2 px-3 py-1.5 bg-primary text-on-brand rounded-lg hover:bg-primary-hover transition-colors text-sm font-medium">
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                        <div className="absolute right-0 mt-1 w-48 bg-surface-elevated border border-border rounded-lg shadow-medium z-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
                          <div className="py-1">
                            <div className="px-3 py-2 text-xs text-text2 border-b border-border">
                              Select Level
                            </div>
                            {getAvailableLevels(computation).map(level => (
                              <a
                                key={level}
                                href={`/api/master-sheet/summary/${computation._id}/${level}`}
                                target="_blank"
                                className="block px-3 py-2 text-sm text-foreground hover:bg-background2 transition-colors"
                              >
                                Level {level} Master Sheet
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}



                    {/* View Details */}
                    <Button
                      onClick={() => {
                        router.push(`./computations/${computation._id}`);
                      }}
                      className="flex"
                      title="View Details"
                    >
                        View
                      <BarChart3 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-between px-4 py-4 border-t border-border">
            <div className="text-sm text-text2">
              Showing {computations.length} of {pagination.total} computations
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="p-2 text-text2 hover:text-foreground hover:bg-background2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                  let pageNum;
                  if (pagination.pages <= 5) {
                    pageNum = i + 1;
                  } else if (pagination.page <= 3) {
                    pageNum = i + 1;
                  } else if (pagination.page >= pagination.pages - 2) {
                    pageNum = pagination.pages - 4 + i;
                  } else {
                    pageNum = pagination.page - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                        pagination.page === pageNum
                          ? 'bg-primary text-on-brand'
                          : 'text-text2 hover:bg-background2 hover:text-foreground'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className="p-2 text-text2 hover:text-foreground hover:bg-background2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Stats Summary */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-surface-elevated border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text2">Total Computations</p>
              <p className="text-2xl font-bold text-foreground">{pagination.total}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-primary" />
          </div>
        </div>
        
        <div className="bg-surface-elevated border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text2">Completed</p>
              <p className="text-2xl font-bold text-success">
                {computations.filter(c => c.status === 'completed').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-success" />
          </div>
        </div>
        
        <div className="bg-surface-elevated border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text2">Processing</p>
              <p className="text-2xl font-bold text-warning">
                {computations.filter(c => c.status === 'processing').length}
              </p>
            </div>
            <Clock className="w-8 h-8 text-warning" />
          </div>
        </div>
        
        <div className="bg-surface-elevated border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text2">Failed</p>
              <p className="text-2xl font-bold text-error">
                {computations.filter(c => c.status === 'failed').length}
              </p>
            </div>
            <XCircle className="w-8 h-8 text-error" />
          </div>
        </div>
      </div>
    </div>
  );
}