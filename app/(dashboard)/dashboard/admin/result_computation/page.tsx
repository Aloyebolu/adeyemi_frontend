"use client"

import { useState, useCallback, useEffect } from 'react'
import { useComputationData } from '@/hooks/useComputationData'
import Header from '@/components/computation/Header'
import ComputationStats from '@/components/computation/ComputationStats'
import TabsNavigation from '@/components/computation/TabsNavigation'
import ComputationList from '@/components/computation/ComputationList'
import CarryoverAnalysis from '@/components/carryover/CarryoverAnalysis'
import StartComputationModal from '@/components/computation/StartComputationModal'
import RetryComputationModal from '@/components/computation/RetryComputationModal'
import ComputationDetailsModal from '@/components/computation/ComputationDetailsModal'
import { MasterComputation } from '@/types/computation'

export default function ComputationDashboard() {
  const [activeTab, setActiveTab] = useState<'computations' | 'carryovers'>('computations')
  const [showStartComputation, setShowStartComputation] = useState(false)
  const [showRetryModal, setShowRetryModal] = useState(false)
  const [selectedComputation, setSelectedComputation] = useState<MasterComputation | null>(null)
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([])

  const {
    masterComputations,
    loading,
    pagination,
    filter,
    fetchMasterComputations,
    fetchComputationDetails,
    startComputation,
    cancelComputation,
    retryFailedDepartments,
    handleFilterChange,
    handlePageChange
  } = useComputationData()

  useEffect(()=>{
    fetchMasterComputations()
  }, [])
  const handleStartComputation = async (computationType: 'final' | 'preview') => {
    await startComputation(computationType === 'final', computationType)
    setShowStartComputation(false)
  }

  const handleRetry = async (computationId: string) => {
    await retryFailedDepartments(computationId, selectedDepartments)
    setShowRetryModal(false)
    setSelectedDepartments([])
  }

  const handleViewDetails = async (computation: MasterComputation) => {
    await fetchComputationDetails(computation._id)
    setSelectedComputation(computation)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onStartComputation={() => setShowStartComputation(true)}
        onRefresh={fetchMasterComputations}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ComputationStats masterComputations={masterComputations} />
        
        <TabsNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        
        {activeTab === 'computations' ? (
          <ComputationList
            masterComputations={masterComputations}
            loading={loading.computations}
            pagination={pagination}
            filter={filter}
            onFilterChange={handleFilterChange}
            onPageChange={handlePageChange}
            onViewDetails={handleViewDetails}
            onCancel={cancelComputation}
            onRetry={(computation) => {
              setSelectedComputation(computation)
              setShowRetryModal(true)
            }}
            onRefresh={fetchMasterComputations}
          />
        ) : (
          <CarryoverAnalysis masterComputations={masterComputations} />
        )}
      </div>

      {showStartComputation && (
        <StartComputationModal
          isOpen={showStartComputation}
          onClose={() => setShowStartComputation(false)}
          onConfirm={handleStartComputation}
          isLoading={loading.computations}
        />
      )}

      {showRetryModal && selectedComputation && (
        <RetryComputationModal
          isOpen={showRetryModal}
          onClose={() => {
            setShowRetryModal(false)
            setSelectedDepartments([])
          }}
          onConfirm={() => handleRetry(selectedComputation._id)}
          computation={selectedComputation}
          selectedDepartments={selectedDepartments}
          onDepartmentSelectionChange={setSelectedDepartments}
        />
      )}

      {selectedComputation && (
        <ComputationDetailsModal
          isOpen={!!selectedComputation}
          onClose={() => setSelectedComputation(null)}
          computation={selectedComputation}
          loading={loading.details}
        />
      )}
    </div>
  )
}