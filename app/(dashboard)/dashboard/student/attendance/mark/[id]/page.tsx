"use client";

import { useState, useEffect } from "react";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  MapPin, 
  Wifi, 
  Bluetooth, 
  Smartphone,
  Shield,
  AlertTriangle,
  Loader2
} from "lucide-react";

const MarkAttendancePage = ({ params }: { params: { id: string } }) => {
  const [attendanceStatus, setAttendanceStatus] = useState("checking");
  const [sessionInfo, setSessionInfo] = useState(null);
  const [verificationSteps, setVerificationSteps] = useState([]);
  const [locationStatus, setLocationStatus] = useState("checking");
  const [bluetoothStatus, setBluetoothStatus] = useState("checking");
  const [wifiStatus, setWifiStatus] = useState("checking");

  // Mock session data from QR code ID
  const mockSession = {
    id: params.id,
    courseCode: "CSC401",
    courseName: "Machine Learning",
    lecturer: "Dr. Adebayo",
    venue: "LT 4",
    time: "08:00 - 10:00",
    date: "2024-03-18",
    expiresIn: "15 minutes"
  };

  useEffect(() => {
    // Simulate loading session data
    setSessionInfo(mockSession);
    startVerificationProcess();
  }, []);

  const startVerificationProcess = async () => {
    const steps = [
      { id: 1, name: "Session Validation", status: "checking" },
      { id: 2, name: "Location Check", status: "pending" },
      { id: 3, name: "Bluetooth Proximity", status: "pending" },
      { id: 4, name: "Network Verification", status: "pending" },
      { id: 5, name: "Final Confirmation", status: "pending" }
    ];
    
    setVerificationSteps(steps);
    
    // Step 1: Validate session
    await validateSession();
    
    // Step 2: Check location
    steps[1].status = "checking";
    setVerificationSteps([...steps]);
    await checkLocation();
    
    // Step 3: Bluetooth proximity
    steps[2].status = "checking";
    setVerificationSteps([...steps]);
    await checkBluetoothProximity();
    
    // Step 4: Network verification
    steps[3].status = "checking";
    setVerificationSteps([...steps]);
    await checkNetwork();
    
    // Step 5: Final confirmation
    steps[4].status = "checking";
    setVerificationSteps([...steps]);
    await submitAttendance();
  };

  const validateSession = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    setVerificationSteps(prev => 
      prev.map(step => 
        step.id === 1 ? { ...step, status: "success" } : step
      )
    );
  };

  const checkLocation = async () => {
    try {
      // Try GPS first
      const position = await new Promise((resolve, reject) => {
        if (!navigator.geolocation) reject(new Error("Geolocation not supported"));
        
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
      });

      const { latitude, longitude, accuracy } = (position as any).coords;
      
      // Check if within campus bounds (mock coordinates)
      const isOnCampus = await verifyCampusLocation(latitude, longitude);
      
      setLocationStatus(isOnCampus ? "success" : "failed");
      setVerificationSteps(prev => 
        prev.map(step => 
          step.id === 2 ? { 
            ...step, 
            status: isOnCampus ? "success" : "failed",
            message: isOnCampus ? "On campus" : "Outside campus range"
          } : step
        )
      );

    } catch (error) {
      setLocationStatus("failed");
      setVerificationSteps(prev => 
        prev.map(step => 
          step.id === 2 ? { 
            ...step, 
            status: "failed",
            message: "Location access denied"
          } : step
        )
      );
    }
  };

  const verifyCampusLocation = async (lat: number, lng: number) => {
    // Mock campus boundaries
    const campusBounds = {
      minLat: 6.4300, maxLat: 6.4500,
      minLng: 3.4200, maxLng: 3.4400
    };
    
    return lat >= campusBounds.minLat && lat <= campusBounds.maxLat &&
           lng >= campusBounds.minLng && lng <= campusBounds.maxLng;
  };

const checkBluetoothProximity = async () => {
  try {
    // Check if Bluetooth is available
    if (!navigator.bluetooth) {
      throw new Error("Bluetooth not supported");
    }

    // Create a button to trigger Bluetooth permission
    setVerificationSteps(prev => 
      prev.map(step => 
        step.id === 3 ? { 
          ...step, 
          status: "pending",
          message: "Tap to enable Bluetooth scanning",
          requiresAction: true
        } : step
      )
    );

  } catch (error) {
    setBluetoothStatus("failed");
    setVerificationSteps(prev => 
      prev.map(step => 
        step.id === 3 ? { 
          ...step, 
          status: "failed",
          message: "Bluetooth unavailable"
        } : step
      )
    );
  }
};

const startBluetoothScan = async () => {
  try {
    setVerificationSteps(prev => 
      prev.map(step => 
        step.id === 3 ? { 
          ...step, 
          status: "checking",
          message: "Scanning for class devices...",
          requiresAction: false
        } : step
      )
    );

    // Request Bluetooth device with user gesture
    const device = await navigator.bluetooth.requestDevice({
      filters: [
        { name: `CLASS_${params.id}` },
        { services: ['class-attendance'] }
      ],
      optionalServices: ['battery_service'] // Required for some devices
    });

    // If we get here, Bluetooth permission granted and device found
    console.log('Found device:', device.name);
    
    setBluetoothStatus("success");
    setVerificationSteps(prev => 
      prev.map(step => 
        step.id === 3 ? { 
          ...step, 
          status: "success",
          message: "Class device detected"
        } : step
      )
    );

  } catch (error) {
    console.log('Bluetooth error:', error);
    setBluetoothStatus("failed");
    setVerificationSteps(prev => 
      prev.map(step => 
        step.id === 3 ? { 
          ...step, 
          status: "failed",
          message: "Bluetooth access denied or no devices found"
        } : step
      )
    );
  }
};

  const scanForClassBeacons = async (): Promise<boolean> => {
    // Mock Bluetooth scanning
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate 80% chance of finding class beacons
    return Math.random() > 0.2;
  };

  const checkNetwork = async () => {
    try {
      const connection = (navigator as any).connection;
      if (!connection) {
        throw new Error("Network info not available");
      }

      const isCampusWifi = await verifyCampusNetwork(connection);
      
      setWifiStatus(isCampusWifi ? "success" : "warning");
      setVerificationSteps(prev => 
        prev.map(step => 
          step.id === 4 ? { 
            ...step, 
            status: isCampusWifi ? "success" : "warning",
            message: isCampusWifi ? "Campus WiFi" : "Off-campus network"
          } : step
        )
      );

    } catch (error) {
      setWifiStatus("failed");
      setVerificationSteps(prev => 
        prev.map(step => 
          step.id === 4 ? { 
            ...step, 
            status: "failed",
            message: "Network check failed"
          } : step
        )
      );
    }
  };

  const verifyCampusNetwork = async (connection: any): Promise<boolean> => {
    // Check if on WiFi and has good speed (typical campus WiFi)
    return connection.type === 'wifi' && connection.downlink > 10;
  };

  const submitAttendance = async () => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Determine overall success based on verification steps
    const failedSteps = verificationSteps.filter(step => step.status === "failed");
    const success = failedSteps.length === 0;
    
    if (success) {
      setAttendanceStatus("success");
      setVerificationSteps(prev => 
        prev.map(step => 
          step.id === 5 ? { ...step, status: "success" } : step
        )
      );
      
      // In real app, send attendance data to server
      console.log("Attendance marked successfully!");
    } else {
      setAttendanceStatus("failed");
      setVerificationSteps(prev => 
        prev.map(step => 
          step.id === 5 ? { ...step, status: "failed" } : step
        )
      );
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="text-green-500" size={20} />;
      case "failed":
        return <XCircle className="text-red-500" size={20} />;
      case "warning":
        return <AlertTriangle className="text-yellow-500" size={20} />;
      default:
        return <Loader2 className="text-blue-500 animate-spin" size={20} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success": return "text-green-600 bg-green-50 border-green-200";
      case "failed": return "text-red-600 bg-red-50 border-red-200";
      case "warning": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      default: return "text-blue-600 bg-blue-50 border-blue-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-blue-900/20 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Mark Attendance
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Verifying your presence for the class
          </p>
        </div>

        {/* Session Info Card */}
        {sessionInfo && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <div className="text-center mb-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {sessionInfo.courseCode}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {sessionInfo.courseName}
              </p>
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Lecturer:</span>
                <span className="font-medium text-gray-900 dark:text-white">{sessionInfo.lecturer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Venue:</span>
                <span className="font-medium text-gray-900 dark:text-white">{sessionInfo.venue}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Time:</span>
                <span className="font-medium text-gray-900 dark:text-white">{sessionInfo.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Expires:</span>
                <span className="font-medium text-yellow-600 dark:text-yellow-400">{sessionInfo.expiresIn}</span>
              </div>
            </div>
          </div>
        )}

        {/* Verification Steps */}
<div className="space-y-3">
  {verificationSteps.map((step) => (
    <div
      key={step.id}
      className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all duration-300 ${
        getStatusColor(step.status)
      }`}
    >
      <div className="flex items-center gap-3">
        {getStatusIcon(step.status)}
        <div>
          <div className="font-medium text-current">{step.name}</div>
          {step.message && (
            <div className="text-xs opacity-75">{step.message}</div>
          )}
        </div>
      </div>
      
      {step.status === "checking" && (
        <div className="text-sm text-blue-600">Checking...</div>
      )}
      
      {step.requiresAction && (
        <button
          onClick={startBluetoothScan}
          className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Bluetooth size={14} />
          Enable
        </button>
      )}
    </div>
  ))}
</div>

        {/* Status Display */}
        {attendanceStatus === "success" && (
          <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-2xl p-6 text-center">
            <CheckCircle className="text-green-500 mx-auto mb-3" size={48} />
            <h3 className="text-lg font-bold text-green-900 dark:text-green-100 mb-2">
              Attendance Marked Successfully!
            </h3>
            <p className="text-green-700 dark:text-green-300 text-sm">
              Your attendance has been recorded for {sessionInfo?.courseCode}
            </p>
          </div>
        )}

        {attendanceStatus === "failed" && (
          <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-2xl p-6 text-center">
            <XCircle className="text-red-500 mx-auto mb-3" size={48} />
            <h3 className="text-lg font-bold text-red-900 dark:text-red-100 mb-2">
              Attendance Failed
            </h3>
            <p className="text-red-700 dark:text-red-300 text-sm mb-4">
              Could not verify your presence in the classroom
            </p>
            <button 
              onClick={startVerificationProcess}
              className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Security Features Info */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-200 dark:border-blue-800 p-4 mt-6">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="text-blue-600 dark:text-blue-400" size={18} />
            <span className="font-semibold text-blue-900 dark:text-blue-100 text-sm">
              Security Features Active
            </span>
          </div>
          <div className="grid grid-cols-3 gap-4 text-xs">
            <div className="text-center">
              <MapPin className="text-blue-500 mx-auto mb-1" size={16} />
              <span className="text-blue-700 dark:text-blue-300">Location</span>
            </div>
            <div className="text-center">
              <Bluetooth className="text-blue-500 mx-auto mb-1" size={16} />
              <span className="text-blue-700 dark:text-blue-300">Proximity</span>
            </div>
            <div className="text-center">
              <Wifi className="text-blue-500 mx-auto mb-1" size={16} />
              <span className="text-blue-700 dark:text-blue-300">Network</span>
            </div>
          </div>
        </div>

        {/* Help Text */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Ensure Bluetooth and Location are enabled for accurate verification
          </p>
        </div>
      </div>
    </div>
  );
};

export default MarkAttendancePage;