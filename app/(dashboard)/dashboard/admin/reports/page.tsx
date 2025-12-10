"use client"

import { useState, useEffect, useCallback } from 'react'
import {
  Cpu,
  HardDrive,
  Activity,
  Wifi,
  Server,
  Clock,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Database,
  Network,
  MemoryStick,
  Thermometer,
  Zap,
  Shield,
  Users,
  Loader2,
  XCircle,
  Circle
} from 'lucide-react'
import { useDataFetcher } from '@/lib/dataFetcher'

interface QueueStats {
  waiting: number
  active: number
  completed: number
  failed: number
  delayed: number
  processingRate: number
  averageProcessingTime: number
}

interface SystemMetrics {
  cpu: {
    usage: number
    cores: number
    temperature: number
    loadAverage: [number, number, number]
  }
  memory: {
    total: number
    used: number
    free: number
    cache: number
    swap: {
      total: number
      used: number
      free: number
    }
  }
  disk: {
    total: number
    used: number
    free: number
    iops: number
    readSpeed: number
    writeSpeed: number
  }
  network: {
    interfaces: Array<{
      name: string
      received: number
      transmitted: number
      packets: number
      errors: number
    }>
    totalReceived: number
    totalTransmitted: number
  }
  uptime: number
  timestamp: string
}

interface ServiceStatus {
  name: string
  status: 'running' | 'stopped' | 'degraded' | 'failed'
  uptime: number
  cpu: number
  memory: number
  lastRestart: string
}

interface LogEntry {
  timestamp: string
  level: 'info' | 'warning' | 'error' | 'critical'
  service: string
  message: string
  details?: Record<string, any>
}

export default function SystemMonitor() {
  const [queueStats, setQueueStats] = useState<QueueStats>({
    waiting: 0,
    active: 0,
    completed: 0,
    failed: 0,
    delayed: 0,
    processingRate: 0,
    averageProcessingTime: 0
  })
  
  const { fetchData, postData } = useDataFetcher()
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics | null>(null)
  const [services, setServices] = useState<ServiceStatus[]>([])
  const [recentLogs, setRecentLogs] = useState<LogEntry[]>([])
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  
  const [loading, setLoading] = useState({
    queue: false,
    metrics: false,
    services: false,
    logs: false
  })
  
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout>()
  const [autoRefresh, setAutoRefresh] = useState(true)

  // Fetch queue statistics
  const fetchQueueStats = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, queue: true }))
      const response = await fetchData('/system/queue-stats')
      if ( response.data) {
        setQueueStats(response.data)
      }
    } catch (error) {
      console.error('Failed to fetch queue stats:', error)
    } finally {
      setLoading(prev => ({ ...prev, queue: false }))
    }
  }, [])

  // Fetch system metrics
  const fetchSystemMetrics = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, metrics: true }))
      const response = await fetchData('/system/metrics')
      if ( response.data) {
        setSystemMetrics(response.data)
      }
    } catch (error) {
      console.error('Failed to fetch system metrics:', error)
    } finally {
      setLoading(prev => ({ ...prev, metrics: false }))
    }
  }, [])

  // Fetch service status
  const fetchServiceStatus = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, services: true }))
      const response = await fetchData('/system/services')
      if ( response.data) {
        setServices(response.data)
      }
    } catch (error) {
      console.error('Failed to fetch service status:', error)
    } finally {
      setLoading(prev => ({ ...prev, services: false }))
    }
  }, [])

  // Fetch system logs
  const fetchSystemLogs = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, logs: true }))
      const response = await fetchData('/system/logs?limit=10')
      if ( response.data) {
        setRecentLogs(response.data)
      }
    } catch (error) {
      console.error('Failed to fetch system logs:', error)
    } finally {
      setLoading(prev => ({ ...prev, logs: false }))
    }
  }, [])

  // Fetch all stats at once
  const fetchAllStats = useCallback(async () => {
    try {
      const response = await fetchData('/system/stats')
      if ( response.data) {
        const { queueStats, systemMetrics, services, recentLogs } = response.data
        if (queueStats) setQueueStats(queueStats)
        if (systemMetrics) setSystemMetrics(systemMetrics)
        if (services) setServices(services)
        if (recentLogs) setRecentLogs(recentLogs)
      }
    } catch (error) {
      console.error('Failed to fetch all stats:', error)
    }
  }, [])

  // Clear queue cache action
  const handleClearCache = useCallback(async () => {
    try {
      setActionLoading('clear-cache')
      const response = await postData('/system/actions/clear-cache', {})
      if (response?.success) {
        // Refresh queue stats and services after clearing cache
        await Promise.all([fetchQueueStats(), fetchServiceStatus()])
        // Add success log
        setRecentLogs(prev => [{
          timestamp: new Date().toISOString(),
          level: 'info',
          service: 'Cache Server',
          message: 'Queue cache cleared successfully',
          details: response.data
        }, ...prev.slice(0, 9)])
      }
    } catch (error) {
      console.error('Failed to clear cache:', error)
    } finally {
      setActionLoading(null)
    }
  }, [postData, fetchQueueStats, fetchServiceStatus])

  // Run system check action
  const handleSystemCheck = useCallback(async () => {
    try {
      setActionLoading('system-check')
      const response = await postData('/system/actions/system-check', {})
      if (response?.success) {
        // Refresh all data after system check
        await fetchAllStats()
        // Add success log
        setRecentLogs(prev => [{
          timestamp: new Date().toISOString(),
          level: 'info',
          service: 'System Monitor',
          message: 'System check completed successfully',
          details: response.data
        }, ...prev.slice(0, 9)])
      }
    } catch (error) {
      console.error('Failed to run system check:', error)
    } finally {
      setActionLoading(null)
    }
  }, [postData, fetchAllStats])

  // Restart service action
  const handleRestartService = useCallback(async (serviceName: string) => {
    try {
      setActionLoading(`restart-${serviceName}`)
      const response = await postData(`/system/services/${encodeURIComponent(serviceName)}/restart`, {})
      if (response?.success) {
        // Refresh services after restart
        await fetchServiceStatus()
        // Add success log
        setRecentLogs(prev => [{
          timestamp: new Date().toISOString(),
          level: 'info',
          service: 'System Monitor',
          message: `Service '${serviceName}' restarted successfully`,
          details: response.data
        }, ...prev.slice(0, 9)])
      }
    } catch (error) {
      console.error(`Failed to restart service ${serviceName}:`, error)
    } finally {
      setActionLoading(null)
    }
  }, [postData, fetchServiceStatus])

  // Format bytes to human readable
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Format seconds to human readable
  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / (3600 * 24))
    const hours = Math.floor((seconds % (3600 * 24)) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    
    if (days > 0) return `${days}d ${hours}h`
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-green-100 text-green-800 border border-green-200'
      case 'degraded':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200'
      case 'failed':
        return 'bg-red-100 text-red-800 border border-red-200'
      case 'stopped':
        return 'bg-gray-100 text-gray-800 border border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200'
    }
  }

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'degraded':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />
      case 'stopped':
        return <Circle className="w-4 h-4 text-gray-600" />
      default:
        return <Circle className="w-4 h-4 text-gray-600" />
    }
  }

  // Get log level color
  const getLogLevelColor = (level: string) => {
    switch (level) {
      case 'info':
        return 'bg-blue-100 text-blue-800 border border-blue-200'
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200'
      case 'error':
        return 'bg-orange-100 text-orange-800 border border-orange-200'
      case 'critical':
        return 'bg-red-100 text-red-800 border border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200'
    }
  }

  // Format timestamp for display
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  // Load all data
  const loadAllData = useCallback(() => {
    fetchAllStats()
  }, [fetchAllStats])

  // Set up polling
  useEffect(() => {
    loadAllData()
    
    if (autoRefresh) {
      const interval = setInterval(loadAllData, 10000) // Poll every 10 seconds
      setPollingInterval(interval)
      
      return () => {
        if (interval) {
          clearInterval(interval)
        }
      }
    }
  }, [autoRefresh, loadAllData])

  // Toggle auto refresh
  const toggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh)
    if (!autoRefresh && pollingInterval) {
      clearInterval(pollingInterval)
    }
  }

  // Calculate overall system health
  const getSystemHealth = () => {
    if (!systemMetrics || services.length === 0) return 'unknown'
    
    const cpuHealth = systemMetrics.cpu.usage < 80 ? 'healthy' : systemMetrics.cpu.usage < 90 ? 'warning' : 'critical'
    const memoryHealth = (systemMetrics.memory.used / systemMetrics.memory.total) < 0.8 ? 'healthy' : (systemMetrics.memory.used / systemMetrics.memory.total) < 0.9 ? 'warning' : 'critical'
    const diskHealth = (systemMetrics.disk.used / systemMetrics.disk.total) < 0.8 ? 'healthy' : (systemMetrics.disk.used / systemMetrics.disk.total) < 0.9 ? 'warning' : 'critical'
    const serviceHealth = services.every(s => s.status === 'running') ? 'healthy' : services.some(s => s.status === 'failed') ? 'critical' : 'warning'
    
    if ([cpuHealth, memoryHealth, diskHealth, serviceHealth].includes('critical')) return 'critical'
    if ([cpuHealth, memoryHealth, diskHealth, serviceHealth].includes('warning')) return 'warning'
    return 'healthy'
  }

  const systemHealth = getSystemHealth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-dark shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white">System Monitor</h1>
              <p className="text-white/80 mt-1">Real-time system health and performance metrics</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={loadAllData}
                className="inline-flex items-center gap-2 bg-white text-primary hover:bg-gray-50 px-5 py-2.5 rounded-xl font-medium transition-all hover:scale-105"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh All
              </button>
              
              <button
                onClick={toggleAutoRefresh}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${autoRefresh ? 'bg-green-500/20 text-white border border-green-500/30' : 'bg-white/10 text-white/80 border border-white/20'}`}
              >
                <div className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                {autoRefresh ? 'Auto Refresh (10s)' : 'Auto Refresh Off'}
              </button>
              
              <div className={`px-4 py-2.5 rounded-xl border ${
                systemHealth === 'healthy' ? 'bg-green-500/20 text-green-100 border-green-500/30' :
                systemHealth === 'warning' ? 'bg-yellow-500/20 text-yellow-100 border-yellow-500/30' :
                'bg-red-500/20 text-red-100 border-red-500/30'
              }`}>
                <div className="flex items-center gap-2 text-sm">
                  <div className={`w-2 h-2 rounded-full ${
                    systemHealth === 'healthy' ? 'bg-green-500' :
                    systemHealth === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                  {systemHealth === 'healthy' ? 'All Systems Operational' :
                   systemHealth === 'warning' ? 'System Degraded' : 'System Issues Detected'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* System Health Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">CPU Usage</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {systemMetrics?.cpu.usage?.toFixed(1) || '0'}%
                </p>
              </div>
              <div className={`p-3 rounded-xl ${(systemMetrics?.cpu.usage || 0) > 80 ? 'bg-red-50' : 'bg-green-50'}`}>
                <Cpu className={`w-6 h-6 ${(systemMetrics?.cpu.usage || 0) > 80 ? 'text-red-600' : 'text-green-600'}`} />
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    (systemMetrics?.cpu.usage || 0) > 80 ? 'bg-red-500' :
                    (systemMetrics?.cpu.usage || 0) > 60 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${systemMetrics?.cpu.usage || 0}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>{systemMetrics?.cpu.cores || 0} cores</span>
                <span>{(systemMetrics?.cpu.temperature || 0).toFixed(1)}°C</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Memory Usage</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {((systemMetrics?.memory?.used || 0) / (systemMetrics?.memory?.total || 1) * 100).toFixed(1)}%
                </p>
              </div>
              <div className={`p-3 rounded-xl ${((systemMetrics?.memory?.used || 0) / (systemMetrics?.memory?.total || 1) * 100) > 85 ? 'bg-red-50' : 'bg-blue-50'}`}>
                <MemoryStick className={`w-6 h-6 ${((systemMetrics?.memory?.used || 0) / (systemMetrics?.memory?.total || 1) * 100) > 85 ? 'text-red-600' : 'text-blue-600'}`} />
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    ((systemMetrics?.memory?.used || 0) / (systemMetrics?.memory?.total || 1) * 100) > 85 ? 'bg-red-500' :
                    ((systemMetrics?.memory?.used || 0) / (systemMetrics?.memory?.total || 1) * 100) > 70 ? 'bg-yellow-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${(systemMetrics?.memory?.used || 0) / (systemMetrics?.memory?.total || 1) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>{formatBytes(systemMetrics?.memory?.used || 0)} used</span>
                <span>{formatBytes(systemMetrics?.memory?.total || 0)} total</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Disk Usage</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {((systemMetrics?.disk?.used || 0) / (systemMetrics?.disk?.total || 1) * 100).toFixed(1)}%
                </p>
              </div>
              <div className={`p-3 rounded-xl ${((systemMetrics?.disk?.used || 0) / (systemMetrics?.disk?.total || 1) * 100) > 90 ? 'bg-red-50' : 'bg-purple-50'}`}>
                <HardDrive className={`w-6 h-6 ${((systemMetrics?.disk?.used || 0) / (systemMetrics?.disk?.total || 1) * 100) > 90 ? 'text-red-600' : 'text-purple-600'}`} />
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    ((systemMetrics?.disk?.used || 0) / (systemMetrics?.disk?.total || 1) * 100) > 90 ? 'bg-red-500' :
                    ((systemMetrics?.disk?.used || 0) / (systemMetrics?.disk?.total || 1) * 100) > 75 ? 'bg-yellow-500' : 'bg-purple-500'
                  }`}
                  style={{ width: `${(systemMetrics?.disk?.used || 0) / (systemMetrics?.disk?.total || 1) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>{formatBytes(systemMetrics?.disk?.iops || 0)} IOPS</span>
                <span>{formatBytes((systemMetrics?.disk?.readSpeed || 0) + (systemMetrics?.disk?.writeSpeed || 0))}/s</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">System Uptime</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {systemMetrics?.uptime ? formatUptime(systemMetrics.uptime) : '0m'}
                </p>
              </div>
              <div className="bg-green-50 p-3 rounded-xl">
                <Server className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${
                    systemHealth === 'healthy' ? 'bg-green-500' :
                    systemHealth === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                  <span>
                    {systemHealth === 'healthy' ? 'All Systems Operational' :
                     systemHealth === 'warning' ? 'System Degraded' : 'System Issues Detected'}
                  </span>
                </div>
              </div>
              {systemMetrics?.cpu.loadAverage && (
                <div className="text-xs text-gray-500 mt-2">
                  Load: {systemMetrics.cpu.loadAverage[0]?.toFixed(2) || '0.00'}, {systemMetrics.cpu.loadAverage[1]?.toFixed(2) || '0.00'}, {systemMetrics.cpu.loadAverage[2]?.toFixed(2) || '0.00'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Queue Status */}
          <div className="lg:col-span-2 space-y-8">
            {/* Queue Statistics */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Queue Status</h3>
                  <button
                    onClick={fetchQueueStats}
                    disabled={loading.queue}
                    className="inline-flex items-center gap-1 text-primary hover:text-primary-dark text-sm font-medium"
                  >
                    {loading.queue ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4" />
                    )}
                    Refresh
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">{queueStats.waiting}</div>
                    <div className="text-sm text-gray-600 mt-1">Waiting</div>
                    <div className="text-xs text-yellow-600 mt-1">
                      {queueStats.waiting > 0 ? 'Jobs pending' : 'Queue clear'}
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">{queueStats.active}</div>
                    <div className="text-sm text-gray-600 mt-1">Active</div>
                    <div className="text-xs text-green-600 mt-1">
                      {queueStats.active > 0 ? 'Processing' : 'Idle'}
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">{queueStats.completed}</div>
                    <div className="text-sm text-gray-600 mt-1">Completed</div>
                    <div className="text-xs text-blue-600 mt-1">
                      Total processed
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">{queueStats.failed}</div>
                    <div className="text-sm text-gray-600 mt-1">Failed</div>
                    <div className={`text-xs ${queueStats.failed > 0 ? 'text-red-600' : 'text-gray-600'} mt-1`}>
                      {queueStats.failed > 0 ? 'Needs attention' : 'All successful'}
                    </div>
                  </div>
                </div>
                
                {/* Processing Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-blue-50 p-2 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Processing Rate</p>
                        <p className="text-sm text-gray-600">Jobs per minute</p>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{queueStats.processingRate.toFixed(1)}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        Average over last hour
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-purple-50 p-2 rounded-lg">
                        <Clock className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Avg. Processing Time</p>
                        <p className="text-sm text-gray-600">Per job</p>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{queueStats.averageProcessingTime.toFixed(1)}s</div>
                      <div className="text-sm text-gray-600 mt-1">
                        Total time to complete
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Queue Health Indicator */}
                <div className="mt-8">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">Queue Health</span>
                    <span className={`text-sm font-medium ${
                      queueStats.failed > queueStats.completed * 0.1 ? 'text-red-600' :
                      queueStats.waiting > 50 ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {queueStats.failed > queueStats.completed * 0.1 ? 'Unhealthy' :
                       queueStats.waiting > 50 ? 'Busy' : 'Healthy'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        queueStats.failed > queueStats.completed * 0.1 ? 'bg-red-500' :
                        queueStats.waiting > 50 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(100, (queueStats.completed / Math.max(1, queueStats.completed + queueStats.failed)) * 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-600 mt-1">
                    <span>Success Rate: {((queueStats.completed / Math.max(1, queueStats.completed + queueStats.failed)) * 100).toFixed(1)}%</span>
                    <span>Capacity: {((queueStats.waiting + queueStats.active) / 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Network Activity */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Network Activity</h3>
              </div>
              
              <div className="p-6">
                {systemMetrics?.network?.interfaces && systemMetrics.network.interfaces.length > 0 ? (
                  <div className="space-y-6">
                    {systemMetrics.network.interfaces.map((iface, index) => (
                      <div key={index} className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Network className="w-4 h-4 text-gray-500" />
                            <span className="font-medium text-gray-900">{iface.name}</span>
                          </div>
                          <div className="text-sm">
                            <span className="text-green-600">↓ {formatBytes(iface.received)}</span>
                            <span className="mx-2 text-gray-400">|</span>
                            <span className="text-blue-600">↑ {formatBytes(iface.transmitted)}</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Packets:</span>
                            <span className="font-medium ml-2">{iface.packets.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Errors:</span>
                            <span className={`font-medium ml-2 ${iface.errors > 0 ? 'text-red-600' : 'text-green-600'}`}>
                              {iface.errors}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-6">
                        <div className="text-center">
                          <p className="text-sm text-green-600 font-medium mb-2">Total Received</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {formatBytes(systemMetrics.network.totalReceived)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
                        <div className="text-center">
                          <p className="text-sm text-blue-600 font-medium mb-2">Total Transmitted</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {formatBytes(systemMetrics.network.totalTransmitted)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Wifi className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No network data available</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Services & Logs */}
          <div className="space-y-8">
            {/* Service Status */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Service Status</h3>
                  <button
                    onClick={fetchServiceStatus}
                    disabled={loading.services}
                    className="inline-flex items-center gap-1 text-primary hover:text-primary-dark text-sm font-medium"
                  >
                    {loading.services ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4" />
                    )}
                    Refresh
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {services.map((service, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div className={`p-1.5 rounded-lg ${
                            service.status === 'running' ? 'bg-green-100' :
                            service.status === 'degraded' ? 'bg-yellow-100' :
                            service.status === 'failed' ? 'bg-red-100' : 'bg-gray-100'
                          }`}>
                            {getStatusIcon(service.status)}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{service.name}</div>
                            <div className="text-xs text-gray-600">
                              Uptime: {formatUptime(service.uptime)}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            CPU: <span className={service.cpu > 80 ? 'text-red-600' : 'text-gray-700'}>{service.cpu.toFixed(1)}%</span>
                          </div>
                          <div className="text-xs text-gray-600">
                            Mem: {service.memory}MB
                          </div>
                        </div>
                        {service.status !== 'running' && (
                          <button
                            onClick={() => handleRestartService(service.name)}
                            disabled={actionLoading === `restart-${service.name}`}
                            className="px-3 py-1 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {actionLoading === `restart-${service.name}` ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              'Restart'
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Overall Health</p>
                      <p className="text-sm text-gray-600">
                        {services.filter(s => s.status === 'running').length} of {services.length} services running
                      </p>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                      services.every(s => s.status === 'running') ? 'bg-green-100 text-green-800 border border-green-200' :
                      services.some(s => s.status === 'failed') ? 'bg-red-100 text-red-800 border border-red-200' :
                      'bg-yellow-100 text-yellow-800 border border-yellow-200'
                    }`}>
                      {services.every(s => s.status === 'running') ? 'All Systems Go' :
                       services.some(s => s.status === 'failed') ? 'Critical Issues' : 'Partial Degradation'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Logs */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Recent System Logs</h3>
                  <button
                    onClick={fetchSystemLogs}
                    disabled={loading.logs}
                    className="inline-flex items-center gap-1 text-primary hover:text-primary-dark text-sm font-medium"
                  >
                    {loading.logs ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4" />
                    )}
                    Refresh
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {recentLogs.length > 0 ? (
                    recentLogs.map((log, index) => (
                      <div key={index} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-start gap-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getLogLevelColor(log.level)}`}>
                            {log.level.toUpperCase()}
                          </span>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{log.service}</div>
                            <p className="text-sm text-gray-600 mt-1">{log.message}</p>
                            <div className="text-xs text-gray-500 mt-1">
                              {formatTimestamp(log.timestamp)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No logs available</p>
                    </div>
                  )}
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-gray-600">Info</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span className="text-gray-600">Warning</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-gray-600">Error</span>
                      </div>
                    </div>
                    <button 
                      onClick={fetchSystemLogs}
                      className="text-primary hover:text-primary-dark font-medium"
                    >
                      View All Logs
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
              </div>
              
              <div className="p-6">
                <div className="space-y-3">
                  <button 
                    onClick={handleClearCache}
                    disabled={actionLoading === 'clear-cache'}
                    className="w-full flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <Database className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="font-medium text-gray-900">
                        {actionLoading === 'clear-cache' ? 'Clearing Cache...' : 'Clear Queue Cache'}
                      </span>
                    </div>
                    {actionLoading === 'clear-cache' ? (
                      <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
                    ) : (
                      <Zap className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                  
                  <button 
                    onClick={handleSystemCheck}
                    disabled={actionLoading === 'system-check'}
                    className="w-full flex items-center justify-between p-3 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <Shield className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="font-medium text-gray-900">
                        {actionLoading === 'system-check' ? 'Running System Check...' : 'Run System Check'}
                      </span>
                    </div>
                    {actionLoading === 'system-check' ? (
                      <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
                    ) : (
                      <Activity className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                  
                  <button 
                    onClick={fetchAllStats}
                    disabled={loading.metrics || loading.services || loading.queue}
                    className="w-full flex items-center justify-between p-3 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-100 p-2 rounded-lg">
                        <Thermometer className="w-4 h-4 text-purple-600" />
                      </div>
                      <span className="font-medium text-gray-900">Refresh All Metrics</span>
                    </div>
                    {(loading.metrics || loading.services || loading.queue) ? (
                      <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
                    ) : (
                      <BarChart3 className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}