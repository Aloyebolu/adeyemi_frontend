"use client";

import { useState, useEffect } from "react";
import { 
  Play, 
  Pause, 
  Users, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  CheckCircle,
  X,
  Download,
  BarChart3,
  QrCode,
  Wifi,
  WifiOff,
  Send,
  Bell,
  Shield,
  Zap,
  Eye,
  Calendar,
  TrendingUp,
  Activity,
  Flag,
  Cpu,
  Smartphone
} from "lucide-react";

const ClassSessionPage = ({ params }: { params: { id: string } }) => {
  const [session, setSession] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [sessionEnded, setSessionEnded] = useState(false);
  const [attendance, setAttendance] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [showQR, setShowQR] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    totalStudents: 45,
    present: 0,
    late: 0,
    absent: 0,
    averageArrivalTime: "00:00",
    sessionDuration: "0min",
    startTime: null,
    endTime: null
  });

  // Mock session data
  const mockSession = {
    id: params.id,
    courseCode: "CSC401",
    courseName: "Machine Learning",
    type: "lecture",
    date: "2024-03-18",
    scheduledTime: "08:00 - 10:00",
    venue: "LT 4",
    lecturer: "Dr. Adebayo",
    students: 45
  };

  // Enhanced mock attendance data with device tracking
  const mockAttendance = [
    {
      id: 1,
      studentId: "STU2024001",
      name: "John Doe",
      time: "08:02",
      status: "present",
      location: "University Campus",
      distance: "0.1km",
      device: "iPhone 13",
      deviceId: "device_001",
      connection: "WiFi",
      confidence: "high",
      photo: "/avatars/student1.jpg",
      ipAddress: "192.168.1.101"
    },
    {
      id: 2,
      studentId: "STU2024002", 
      name: "Jane Smith",
      time: "08:15",
      status: "late",
      location: "University Campus",
      distance: "0.2km",
      device: "Samsung Galaxy",
      deviceId: "device_002",
      connection: "Mobile Data", 
      confidence: "high",
      photo: "/avatars/student2.jpg",
      ipAddress: "192.168.1.102"
    },
    {
      id: 3,
      studentId: "STU2024003",
      name: "Mike Johnson", 
      time: "08:30",
      status: "present",
      location: "Lagos, Nigeria",
      distance: "500km",
      device: "Desktop",
      deviceId: "device_003",
      connection: "WiFi",
      confidence: "suspicious",
      photo: "/avatars/student3.jpg",
      ipAddress: "103.215.45.12"
    },
    {
      id: 4,
      studentId: "STU2024004",
      name: "Sarah Wilson",
      time: "08:05",
      status: "present", 
      device: "iPhone 13", // Same device as John Doe
      deviceId: "device_001", // Same device ID
      location: "University Campus",
      distance: "0.1km",
      connection: "WiFi",
      confidence: "suspicious",
      photo: "/avatars/student4.jpg",
      ipAddress: "192.168.1.101" // Same IP
    }
  ];

  // Enhanced alerts with device sharing detection
  const mockAlerts = [
    {
      id: 1,
      type: "suspicious_location",
      title: "Suspicious Location",
      message: "Mike Johnson marked attendance from 500km away",
      student: "Mike Johnson",
      time: "2 minutes ago",
      priority: "high"
    },
    {
      id: 2,
      type: "device_sharing",
      title: "Device Sharing Detected",
      message: "Same device used by John Doe and Sarah Wilson",
      student: "Multiple Students",
      time: "5 minutes ago", 
      priority: "high",
      details: {
        deviceId: "device_001",
        students: ["John Doe", "Sarah Wilson"],
        ipAddress: "192.168.1.101"
      }
    },
    {
      id: 3,
      type: "vpn",
      title: "VPN Detected",
      message: "David Brown is using a VPN service",
      student: "David Brown",
      time: "8 minutes ago", 
      priority: "medium"
    }
  ];

  useEffect(() => {
    // Simulate loading session data
    setSession(mockSession);
    setAttendance(mockAttendance);
    setAlerts(mockAlerts);
    
    // Calculate initial stats
    updateSessionStats(mockAttendance);
    
    // Check for device sharing
    detectDeviceSharing(mockAttendance);
  }, []);

  const updateSessionStats = (attendanceData) => {
    const present = attendanceData.filter(a => a.status === "present" || a.status === "late").length;
    const late = attendanceData.filter(a => a.status === "late").length;
    const absent = mockSession.students - present;
    
    setSessionStats(prev => ({
      ...prev,
      totalStudents: mockSession.students,
      present,
      late,
      absent,
      averageArrivalTime: "08:12"
    }));
  };

  const detectDeviceSharing = (attendanceData) => {
    const deviceMap = {};
    const sharedDevices = [];

    attendanceData.forEach(student => {
      if (!deviceMap[student.deviceId]) {
        deviceMap[student.deviceId] = [];
      }
      deviceMap[student.deviceId].push(student);
    });

    // Find devices used by multiple students
    Object.entries(deviceMap).forEach(([deviceId, students]) => {
      if (students.length > 1) {
        sharedDevices.push({
          deviceId,
          students: students.map(s => s.name),
          device: students[0].device,
          ipAddress: students[0].ipAddress
        });
      }
    });

    return sharedDevices;
  };

  const startSession = () => {
    const startTime = new Date();
    setIsActive(true);
    setSessionEnded(false);
    setSessionStats(prev => ({
      ...prev,
      startTime,
      sessionDuration: "0min"
    }));

    // Start session duration timer
    const timer = setInterval(() => {
      if (isActive && !sessionEnded) {
        const duration = Math.floor((new Date() - startTime) / 60000);
        setSessionStats(prev => ({
          ...prev,
          sessionDuration: `${duration}min`
        }));
      } else {
        clearInterval(timer);
      }
    }, 60000);
  };

  const endSession = () => {
    const endTime = new Date();
    setIsActive(false);
    setSessionEnded(true);
    setSessionStats(prev => ({
      ...prev,
      endTime
    }));

    // Final analytics calculation
    calculateSessionAnalytics();
  };

  const calculateSessionAnalytics = () => {
    // Enhanced analytics for ended session
    const presentStudents = attendance.filter(a => a.status === "present" || a.status === "late");
    const lateStudents = attendance.filter(a => a.status === "late");
    const deviceSharingCases = detectDeviceSharing(attendance);
    const suspiciousCases = attendance.filter(a => a.confidence === "suspicious").length;

    setSessionStats(prev => ({
      ...prev,
      deviceSharingCases: deviceSharingCases.length,
      suspiciousCases,
      onTimePercentage: Math.round((presentStudents.length - lateStudents.length) / presentStudents.length * 100),
      attendanceRate: Math.round((presentStudents.length / mockSession.students) * 100)
    }));
  };

  const markManualAttendance = (studentId) => {
    if (sessionEnded) return; // Prevent changes after session ended
    
    const updatedAttendance = attendance.map(student =>
      student.studentId === studentId 
        ? { ...student, status: "present", time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }
        : student
    );
    setAttendance(updatedAttendance);
    updateSessionStats(updatedAttendance);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "present": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "late": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "absent": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "suspicious": return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getConfidenceIcon = (confidence) => {
    switch (confidence) {
      case "high": return <Shield className="text-green-500" size={16} />;
      case "medium": return <AlertTriangle className="text-yellow-500" size={16} />;
      case "suspicious": return <AlertTriangle className="text-red-500" size={16} />;
      default: return <Shield className="text-gray-500" size={16} />;
    }
  };

  const SessionAnalytics = () => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-green-200 dark:border-green-800 p-6">
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="text-green-600 dark:text-green-400" size={24} />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Session Analytics</h3>
        <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm font-semibold">
          COMPLETED
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Attendance Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {sessionStats.attendanceRate}%
              </p>
            </div>
            <TrendingUp className="text-green-500" size={24} />
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">On Time</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {sessionStats.onTimePercentage}%
              </p>
            </div>
            <Clock className="text-blue-500" size={24} />
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Session Duration</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {sessionStats.sessionDuration}
              </p>
            </div>
            <Activity className="text-purple-500" size={24} />
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Security Issues</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {sessionStats.deviceSharingCases + sessionStats.suspiciousCases}
              </p>
            </div>
            <Flag className="text-red-500" size={24} />
          </div>
        </div>
      </div>

      {/* Device Sharing Details */}
      {sessionStats.deviceSharingCases > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Smartphone className="text-yellow-600 dark:text-yellow-400" size={20} />
            <h4 className="font-semibold text-yellow-900 dark:text-yellow-100">Device Sharing Detected</h4>
          </div>
          <p className="text-yellow-700 dark:text-yellow-300 text-sm">
            {sessionStats.deviceSharingCases} cases of device sharing were detected during this session.
            This may indicate attendance fraud.
          </p>
        </div>
      )}

      {/* Session Timeline */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Session Timeline</h4>
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600 dark:text-gray-400">Session Started</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {sessionStats.startTime?.toLocaleTimeString()}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600 dark:text-gray-400">Session Ended</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {sessionStats.endTime?.toLocaleTimeString()}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600 dark:text-gray-400">Total Duration</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {sessionStats.sessionDuration}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {session?.courseCode} - {session?.courseName}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {session?.type?.charAt(0).toUpperCase() + session?.type?.slice(1)} • {session?.venue} • {session?.date}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {sessionEnded ? (
                <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-4 py-2 rounded-lg font-semibold flex items-center gap-2">
                  <CheckCircle size={20} />
                  Session Completed
                </div>
              ) : isActive ? (
                <button
                  onClick={endSession}
                  className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <Pause size={20} />
                  End Session
                </button>
              ) : (
                <button
                  onClick={startSession}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <Play size={20} />
                  Start Session
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Show Analytics if session ended */}
            {sessionEnded && <SessionAnalytics />}

            {/* Session Status Card */}
            {!sessionEnded && (
              <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm border-2 ${
                isActive ? 'border-green-500' : 'border-gray-200 dark:border-gray-700'
              } p-6`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-4 h-4 rounded-full animate-pulse ${
                      isActive ? 'bg-green-500' : 'bg-gray-400'
                    }`}></div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                        {isActive ? 'Session Active' : 'Session Not Started'}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {isActive ? 'Students can mark attendance' : 'Start session to begin tracking'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {sessionStats.present}/{sessionStats.totalStudents}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Present</div>
                  </div>
                </div>

                {isActive && (
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                      onClick={() => setShowQR(true)}
                      className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors flex items-center gap-3"
                    >
                      <QrCode className="text-blue-600 dark:text-blue-400" size={24} />
                      <div className="text-left">
                        <div className="font-semibold text-blue-900 dark:text-blue-100">QR Code</div>
                        <div className="text-sm text-blue-700 dark:text-blue-300">Show attendance QR</div>
                      </div>
                    </button>

                    <button className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors flex items-center gap-3">
                      <Wifi className="text-green-600 dark:text-green-400" size={24} />
                      <div className="text-left">
                        <div className="font-semibold text-green-900 dark:text-green-100">WiFi Check</div>
                        <div className="text-sm text-green-700 dark:text-green-300">Validate campus network</div>
                      </div>
                    </button>

                    <button className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors flex items-center gap-3">
                      <BarChart3 className="text-purple-600 dark:text-purple-400" size={24} />
                      <div className="text-left">
                        <div className="font-semibold text-purple-900 dark:text-purple-100">Live Analytics</div>
                        <div className="text-sm text-purple-700 dark:text-purple-300">View real-time stats</div>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Enhanced Device Sharing Alerts */}
            {alerts.filter(alert => alert.type === 'device_sharing').map(alert => (
              <div key={alert.id} className="bg-orange-50 dark:bg-orange-900/20 rounded-2xl border border-orange-200 dark:border-orange-800 p-6">
                <div className="flex items-start gap-3">
                  <Cpu className="text-orange-600 dark:text-orange-400 mt-1" size={24} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-orange-900 dark:text-orange-100">{alert.title}</h4>
                      <span className="bg-orange-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        HIGH PRIORITY
                      </span>
                    </div>
                    <p className="text-orange-700 dark:text-orange-300 mb-3">{alert.message}</p>
                    <div className="bg-orange-100 dark:bg-orange-900/30 rounded-lg p-3">
                      <div className="text-sm text-orange-800 dark:text-orange-200">
                        <strong>Device:</strong> {alert.details.device} ({alert.details.deviceId})
                      </div>
                      <div className="text-sm text-orange-800 dark:text-orange-200">
                        <strong>IP Address:</strong> {alert.details.ipAddress}
                      </div>
                      <div className="text-sm text-orange-800 dark:text-orange-200">
                        <strong>Students Involved:</strong> {alert.details.students.join(', ')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Live Alerts */}
            {!sessionEnded && alerts.filter(alert => alert.type !== 'device_sharing').length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-red-200 dark:border-red-800 overflow-hidden">
                <div className="bg-red-50 dark:bg-red-900/20 px-6 py-4 border-b border-red-200 dark:border-red-800">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="text-red-600 dark:text-red-400" size={20} />
                    <h3 className="font-semibold text-red-900 dark:text-red-100">Attention Required</h3>
                    <span className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      {alerts.length} alerts
                    </span>
                  </div>
                </div>
                <div className="divide-y divide-red-100 dark:divide-red-900/30">
                  {alerts.filter(alert => alert.type !== 'device_sharing').map((alert) => (
                    <div key={alert.id} className="p-4 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              alert.priority === 'high' 
                                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            }`}>
                              {alert.priority.toUpperCase()}
                            </span>
                            <span className="font-semibold text-gray-900 dark:text-white">{alert.title}</span>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{alert.message}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                            <span>Student: {alert.student}</span>
                            <span>•</span>
                            <span>{alert.time}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors">
                            <Eye size={16} className="text-red-600 dark:text-red-400" />
                          </button>
                          <button className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors">
                            <X size={16} className="text-red-600 dark:text-red-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Attendance List */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {sessionEnded ? 'Final Attendance' : 'Live Attendance'}
                </h3>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    {sessionEnded ? 'Session Completed' : `Updated: ${new Date().toLocaleTimeString()}`}
                  </span>
                  <button className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2">
                    <Download size={14} />
                    Export
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Device
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Confidence
                      </th>
                      {!sessionEnded && (
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {attendance.map((student) => (
                      <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center text-xs font-semibold text-white mr-3">
                              {student.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">
                                {student.name}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {student.studentId}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(student.status)}`}>
                            {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {student.time}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">{student.device}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            {student.connection === 'WiFi' ? (
                              <Wifi size={12} className="text-green-500" />
                            ) : (
                              <WifiOff size={12} className="text-yellow-500" />
                            )}
                            {student.connection}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <MapPin size={14} className="text-gray-400" />
                            <div>
                              <div className="text-sm text-gray-900 dark:text-white">{student.location}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">{student.distance}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {getConfidenceIcon(student.confidence)}
                            <span className={`text-xs font-semibold ${
                              student.confidence === 'high' ? 'text-green-600' :
                              student.confidence === 'medium' ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {student.confidence.charAt(0).toUpperCase() + student.confidence.slice(1)}
                            </span>
                          </div>
                        </td>
                        {!sessionEnded && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {student.status === 'absent' && isActive && (
                              <button
                                onClick={() => markManualAttendance(student.studentId)}
                                className="bg-green-600 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-green-700 transition-colors"
                              >
                                Mark Present
                              </button>
                            )}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Session Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                {sessionEnded ? 'Final Statistics' : 'Session Statistics'}
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Total Students</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{sessionStats.totalStudents}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-green-600 dark:text-green-400">Present</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">{sessionStats.present}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-yellow-600 dark:text-yellow-400">Late</span>
                  <span className="font-semibold text-yellow-600 dark:text-yellow-400">{sessionStats.late}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-red-600 dark:text-red-400">Absent</span>
                  <span className="font-semibold text-red-600 dark:text-red-400">{sessionStats.absent}</span>
                </div>
                {sessionEnded && (
                  <>
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Device Sharing Cases</span>
                        <span className="font-semibold text-orange-600 dark:text-orange-400">{sessionStats.deviceSharingCases}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Suspicious Cases</span>
                      <span className="font-semibold text-red-600 dark:text-red-400">{sessionStats.suspiciousCases}</span>
                    </div>
                  </>
                )}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">
                      {sessionEnded ? 'Session Duration' : 'Current Duration'}
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">{sessionStats.sessionDuration}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Features */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-200 dark:border-blue-800 p-6">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2">
                <Shield size={18} />
                Security Features
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 text-blue-700 dark:text-blue-300">
                  <Zap size={14} className="flex-shrink-0" />
                  <span>Live geolocation tracking</span>
                </div>
                <div className="flex items-center gap-3 text-blue-700 dark:text-blue-300">
                  <Cpu size={14} className="flex-shrink-0" />
                  <span>Device fingerprinting</span>
                </div>
                <div className="flex items-center gap-3 text-blue-700 dark:text-blue-300">
                  <Wifi size={14} className="flex-shrink-0" />
                  <span>Campus network validation</span>
                </div>
                <div className="flex items-center gap-3 text-blue-700 dark:text-blue-300">
                  <Bell size={14} className="flex-shrink-0" />
                  <span>Device sharing detection</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            {!sessionEnded && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <button className="w-full text-left p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors flex items-center gap-3">
                    <Send size={16} className="text-gray-600 dark:text-gray-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Send Reminder</span>
                  </button>
                  <button className="w-full text-left p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors flex items-center gap-3">
                    <Download size={16} className="text-gray-600 dark:text-gray-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Export Report</span>
                  </button>
                  <button className="w-full text-left p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors flex items-center gap-3">
                    <BarChart3 size={16} className="text-gray-600 dark:text-gray-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">View Analytics</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQR && !sessionEnded && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Attendance QR Code</h3>
              <button onClick={() => setShowQR(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            
            <div className="bg-white p-8 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center mb-4">
              <div className="text-center">
                <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 mb-4">
                  <QrCode size={64} />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Scan to mark attendance
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Expires in 15 minutes
                </p>
              </div>
            </div>

            <div className="text-center">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Refresh QR Code
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassSessionPage;