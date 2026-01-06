// utils/deviceCheck.js

// Mock performance tests with delays to create impressive animations
export async function runDeviceCheck() {
  // Start with initial state
  const results = {
    hasRunCheck: true,
    timestamp: Date.now(),
    deviceScores: {},
    recommendations: {},
    userPreferences: {},
    prefersReducedMotion: false,
    prefersReducedData: false,
    prefersContrast: false,
    prefersDarkMode: false,
    deviceTier: ''
  };

  // Run tests with simulated delays for visual effect
  const cpuScore = await runCPUTest();
  results.deviceScores.cpu = cpuScore;
  
  const memoryScore = await runMemoryTest();
  results.deviceScores.memory = memoryScore;
  
  const gpuScore = await runGPUWebGLTest();
  results.deviceScores.gpu = gpuScore;
  
  const networkScore = await runNetworkTest();
  results.deviceScores.network = networkScore;
  
  const batteryScore = await checkBatteryStatus();
  results.deviceScores.battery = batteryScore;
  
  // Analyze results and generate recommendations
  results.recommendations = generateRecommendations(results.deviceScores);
  
  // Get system preferences
  results.prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  results.prefersReducedData = window.matchMedia("(prefers-reduced-data: reduce)").matches;
  results.prefersContrast = window.matchMedia("(prefers-contrast: more)").matches;
  results.prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
  
  // Determine device tier
  results.deviceTier = determineDeviceTier(results.deviceScores);
  
  // Save to localStorage
  localStorage.setItem("performance_profile", JSON.stringify(results));
  
  return results;
}

// CPU Test with progress simulation
async function runCPUTest() {
  const testRounds = 3;
  let totalScore = 0;
  
  for (let round = 0; round < testRounds; round++) {
    const start = performance.now();
    
    // Lightweight but visible CPU work
    let result = 0;
    const iterations = 2_000_000 + (round * 1_000_000); // Increase each round
    
    for (let i = 0; i < iterations; i++) {
      result += Math.sqrt(i) * Math.sin(i); // More complex operation
    }
    
    const end = performance.now();
    const score = end - start;
    totalScore += score;
    
    // Simulate delay between rounds for visual effect
    if (round < testRounds - 1) {
      await sleep(100);
    }
  }
  
  return Math.round(totalScore / testRounds);
}

// Memory test simulation
async function runMemoryTest() {
  await sleep(300); // Simulate memory allocation time
  
  // Check available memory (approximate)
  const memory = performance.memory;
  if (memory) {
    // Chrome only
    const usedJSHeapSize = memory.usedJSHeapSize;
    const totalJSHeapSize = memory.totalJSHeapSize;
    return {
      used: Math.round(usedJSHeapSize / (1024 * 1024)), // MB
      total: Math.round(totalJSHeapSize / (1024 * 1024)), // MB
      percentage: Math.round((usedJSHeapSize / totalJSHeapSize) * 100)
    };
  }
  
  // Fallback for browsers without performance.memory
  const isLowMemory = navigator.deviceMemory || 4; // GB
  return {
    available: isLowMemory,
    status: isLowMemory < 4 ? 'low' : 'adequate'
  };
}

// GPU/WebGL test
async function runGPUWebGLTest() {
  await sleep(200);
  
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) {
      return { supported: false, score: 0 };
    }
    
    // Simple GPU benchmark
    const start = performance.now();
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    
    // Test with some data
    const vertices = new Float32Array(3000);
    for (let i = 0; i < vertices.length; i++) {
      vertices[i] = Math.random();
    }
    
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    const end = performance.now();
    
    // Cleanup
    gl.deleteBuffer(buffer);
    
    return {
      supported: true,
      renderer: gl.getParameter(gl.RENDERER),
      vendor: gl.getParameter(gl.VENDOR),
      score: Math.round(end - start)
    };
  } catch (error) {
    return { supported: false, error: error.message, score: 0 };
  }
}

// Network test simulation
async function runNetworkTest() {
  await sleep(150);
  
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  
  if (connection) {
    return {
      effectiveType: connection.effectiveType,
      downlink: connection.downlink,
      rtt: connection.rtt,
      saveData: connection.saveData
    };
  }
  
  // Fallback test
  const start = performance.now();
  try {
    // Try to fetch a small resource to test network
    await fetch('/favicon.ico', { method: 'HEAD', cache: 'no-store' });
    const end = performance.now();
    
    return {
      latency: Math.round(end - start),
      type: 'unknown',
      score: end - start < 100 ? 'good' : end - start < 300 ? 'average' : 'slow'
    };
  } catch {
    return {
      latency: -1,
      type: 'offline',
      score: 'offline'
    };
  }
}

// Battery status check
async function checkBatteryStatus() {
  await sleep(100);
  
  if ('getBattery' in navigator) {
    try {
      const battery = await navigator.getBattery();
      return {
        charging: battery.charging,
        level: Math.round(battery.level * 100),
        chargingTime: battery.chargingTime,
        dischargingTime: battery.dischargingTime
      };
    } catch {
      return { supported: false };
    }
  }
  
  return { supported: false };
}

// Generate recommendations based on test results
function generateRecommendations(scores) {
  const recommendations = {
    animations: 'full',
    imageQuality: 'high',
    prefetchData: true,
    realTimeUpdates: true,
    backgroundSync: false,
    cacheStrategy: 'aggressive'
  };
  
  // CPU-based recommendations
  if (scores.cpu > 200) {
    recommendations.animations = 'reduced';
    recommendations.realTimeUpdates = false;
  } else if (scores.cpu > 100) {
    recommendations.animations = 'moderate';
  }
  
  // Memory-based recommendations
  if (scores.memory?.status === 'low' || scores.memory?.available < 4) {
    recommendations.imageQuality = 'medium';
    recommendations.prefetchData = false;
    recommendations.cacheStrategy = 'conservative';
  }
  
  // Network-based recommendations
  if (scores.network?.effectiveType === 'slow-2g' || 
      scores.network?.effectiveType === '2g' ||
      scores.network?.saveData === true) {
    recommendations.imageQuality = 'low';
    recommendations.prefetchData = false;
    recommendations.backgroundSync = false;
    recommendations.cacheStrategy = 'aggressive';
  } else if (scores.network?.effectiveType === '3g') {
    recommendations.imageQuality = 'medium';
  }
  
  // Battery-based recommendations
  if (scores.battery?.level < 20 && !scores.battery?.charging) {
    recommendations.animations = 'minimal';
    recommendations.backgroundSync = false;
  }
  
  return recommendations;
}

// Determine device tier
function determineDeviceTier(scores) {
  const totalScore = (scores.cpu || 100) + 
                     (scores.gpu?.score || 50) + 
                     (scores.network?.latency || 100);
  
  if (totalScore > 400) return 'low';
  if (totalScore > 250) return 'mid';
  return 'high';
}

// Helper function
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Load existing profile or create default
export function loadPerformanceProfile() {
  const saved = localStorage.getItem("performance_profile");
  if (saved) {
    return JSON.parse(saved);
  }
  
  // Default profile
  return {
    hasRunCheck: false,
    deviceTier: 'unknown',
    recommendations: {
      animations: 'full',
      imageQuality: 'high',
      prefetchData: true,
      realTimeUpdates: true
    },
    userPreferences: {} // User overrides go here
  };
}

// Update user preferences
export function updateUserPreference(key, value) {
  const profile = loadPerformanceProfile();
  
  if (!profile.userPreferences) {
    profile.userPreferences = {};
  }
  
  profile.userPreferences[key] = value;
  localStorage.setItem("performance_profile", JSON.stringify(profile));
  
  return profile;
}

// Get final settings (combines recommendations with user preferences)
export function getPerformanceSettings() {
  const profile = loadPerformanceProfile();
  
  // Start with system recommendations
  const settings = { ...profile.recommendations };
  
  // Apply user preferences (overrides)
  if (profile.userPreferences) {
    Object.assign(settings, profile.userPreferences);
  }
  
  return settings;
}