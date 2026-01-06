"use client";

import { useState, useEffect } from 'react';
import { runDeviceCheck, loadPerformanceProfile, updateUserPreference } from '@/utils/deviceCheck';
import { usePerformance } from '@/context/PerformanceContext';
import { 
  Cpu, 
  MemoryStick, 
  Wifi, 
  Battery, 
  Gauge, 
  Check, 
  X,
  Zap,
  Sparkles,
  Settings,
  Monitor,
  Smartphone,
  Tablet,
  AlertCircle
} from 'lucide-react';

export default function PerformanceCheckModal({ onClose }: { onClose: () => void }) {
  const { setProfile } = usePerformance();
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTest, setCurrentTest] = useState('');
  const [results, setResults] = useState(null);
  const [userPreferences, setUserPreferences] = useState({});
  
  const tests = [
    { name: 'CPU', icon: Cpu, color: 'text-blue-500' },
    { name: 'Memory', icon: MemoryStick, color: 'text-green-500' },
    { name: 'GPU', icon: Monitor, color: 'text-purple-500' },
    { name: 'Network', icon: Wifi, color: 'text-orange-500' },
    { name: 'Battery', icon: Battery, color: 'text-red-500' },
  ];

  const handleRunCheck = async () => {
    setIsRunning(true);
    setProgress(0);
    
    // Simulate test progression with delays
    for (let i = 0; i < tests.length; i++) {
      setCurrentTest(tests[i].name);
      setProgress(((i + 1) / tests.length) * 100);
      
      // Simulate test duration
      await new Promise(resolve => setTimeout(resolve, 800));
    }
    
    // Actually run the tests (this also has internal delays)
    const result = await runDeviceCheck();
    setResults(result);
    setProfile(result);
    
    // Load any existing user preferences
    const existing = loadPerformanceProfile();
    setUserPreferences(existing.userPreferences || {});
    
    setIsRunning(false);
  };

  const handleTogglePreference = (key, value) => {
    const newPreferences = {
      ...userPreferences,
      [key]: value
    };
    setUserPreferences(newPreferences);
    updateUserPreference(key, value);
  };

  const handleApply = () => {
    // Save all preferences
    Object.entries(userPreferences).forEach(([key, value]) => {
      updateUserPreference(key, value);
    });
    
    // Reload and close
    const updatedProfile = loadPerformanceProfile();
    setProfile(updatedProfile);
    onClose();
  };

  const getAnimationLabel = (level) => {
    switch(level) {
      case 'full': return 'Full Animations';
      case 'moderate': return 'Reduced Animations';
      case 'minimal': return 'Minimal Animations';
      default: return 'Custom';
    }
  };

  const getImageQualityLabel = (level) => {
    switch(level) {
      case 'high': return 'High Quality';
      case 'medium': return 'Medium Quality';
      case 'low': return 'Data Saver';
      default: return 'Custom';
    }
  };

  if (isRunning) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl w-full max-w-md shadow-2xl">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4">
              <Zap className="w-8 h-8 text-white" />
            </div>
            
            <h2 className="text-xl font-bold mb-2">Optimizing Your Experience</h2>
            <p className="text-sm opacity-80 mb-6">
              Analyzing your device performance for the best experience
            </p>
            
            {/* Progress bar */}
            <div className="w-full bg-gray-200 dark:bg-zinc-800 rounded-full h-2 mb-6 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            
            {/* Current test indicator */}
            <div className="flex items-center justify-center space-x-3 mb-4">
              {tests.map((test, index) => (
                <div 
                  key={test.name}
                  className={`transition-all duration-300 ${currentTest === test.name ? 'scale-110' : 'opacity-50'}`}
                >
                  <test.icon className={`w-6 h-6 ${test.color} ${progress >= ((index + 1) / tests.length) * 100 ? 'opacity-100' : 'opacity-30'}`} />
                </div>
              ))}
            </div>
            
            {currentTest && (
              <div className="animate-pulse">
                <p className="text-sm font-medium">
                  Testing {currentTest}...
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (results) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-500" />
                Optimization Results
              </h2>
              <p className="text-sm opacity-80 mt-1">
                Device tier: <span className="font-semibold capitalize">{results.deviceTier}</span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Device Score Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Cpu className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-medium">CPU</span>
              </div>
              <div className="text-2xl font-bold">
                {results.deviceScores.cpu?.toFixed(0)}ms
              </div>
              <div className="text-xs opacity-70">
                {results.deviceScores.cpu > 200 ? 'Slow' : results.deviceScores.cpu > 100 ? 'Average' : 'Fast'}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <MemoryStick className="w-4 h-4 text-green-500" />
                <span className="text-xs font-medium">Memory</span>
              </div>
              <div className="text-2xl font-bold">
                {typeof results.deviceScores.memory === 'object' 
                  ? `${results.deviceScores.memory.available || 'N/A'}GB`
                  : 'Adequate'}
              </div>
              <div className="text-xs opacity-70">Available</div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Wifi className="w-4 h-4 text-purple-500" />
                <span className="text-xs font-medium">Network</span>
              </div>
              <div className="text-2xl font-bold">
                {results.deviceScores.network?.effectiveType?.toUpperCase() || 'Good'}
              </div>
              <div className="text-xs opacity-70">Connection</div>
            </div>
          </div>
          
          {/* Recommendations Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Recommended Settings
            </h3>
            
            <div className="space-y-4">
              {/* Animations Setting */}
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                <div>
                  <p className="font-medium">Animations</p>
                  <p className="text-sm opacity-70">
                    {results.recommendations.animations === 'full' 
                      ? 'Smooth transitions and effects'
                      : results.recommendations.animations === 'moderate'
                      ? 'Essential animations only'
                      : 'Minimal visual effects'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <select 
                    value={userPreferences.animations || results.recommendations.animations}
                    onChange={(e) => handleTogglePreference('animations', e.target.value)}
                    className="bg-white dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 rounded-lg px-3 py-1 text-sm"
                  >
                    <option value="full">Full</option>
                    <option value="moderate">Reduced</option>
                    <option value="minimal">Minimal</option>
                  </select>
                </div>
              </div>
              
              {/* Image Quality */}
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                <div>
                  <p className="font-medium">Image Quality</p>
                  <p className="text-sm opacity-70">
                    {results.recommendations.imageQuality === 'high'
                      ? 'High resolution images'
                      : results.recommendations.imageQuality === 'medium'
                      ? 'Balanced quality'
                      : 'Optimized for data saving'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <select 
                    value={userPreferences.imageQuality || results.recommendations.imageQuality}
                    onChange={(e) => handleTogglePreference('imageQuality', e.target.value)}
                    className="bg-white dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 rounded-lg px-3 py-1 text-sm"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>
              
              {/* Additional Settings */}
              {[
                { key: 'prefetchData', label: 'Prefetch Data', desc: 'Load pages in background' },
                { key: 'realTimeUpdates', label: 'Real-time Updates', desc: 'Live notifications and updates' },
                { key: 'backgroundSync', label: 'Background Sync', desc: 'Sync data when idle' },
              ].map((setting) => (
                <div key={setting.key} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                  <div>
                    <p className="font-medium">{setting.label}</p>
                    <p className="text-sm opacity-70">{setting.desc}</p>
                  </div>
                  <button
                    onClick={() => handleTogglePreference(
                      setting.key, 
                      !(userPreferences[setting.key] ?? results.recommendations[setting.key])
                    )}
                    className={`w-12 h-6 rounded-full transition-colors ${(userPreferences[setting.key] ?? results.recommendations[setting.key]) 
                      ? 'bg-green-500 justify-end' 
                      : 'bg-gray-300 dark:bg-zinc-700 justify-start'} flex items-center p-1`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${(userPreferences[setting.key] ?? results.recommendations[setting.key]) ? 'translate-x-6' : ''}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          {/* Tips */}
          {results.deviceTier === 'low' && (
            <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-800 dark:text-yellow-300">Performance Tip</p>
                  <p className="text-sm opacity-90 mt-1">
                    Your device may benefit from reduced animations and lower image quality for smoother performance.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-gray-300 dark:border-zinc-700 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleApply}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              Apply Settings
            </button>
          </div>
          
          <p className="text-xs text-center opacity-60 mt-4">
            Settings are saved locally and can be changed anytime in Settings
          </p>
        </div>
      </div>
    );
  }

  // Initial modal
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl w-full max-w-md shadow-2xl">
        {/* Animated header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 animate-pulse">
            <Zap className="w-10 h-10 text-white" />
          </div>
          
          <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Optimize Your Experience
          </h2>
          
          <p className="text-sm opacity-80 mb-2">
            We'll analyze your device to provide the best performance settings
          </p>
          
          <div className="flex items-center justify-center gap-4 mt-4">
            {[Monitor, Smartphone, Tablet].map((Icon, i) => (
              <Icon 
                key={i} 
                className="w-6 h-6 opacity-30 animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
        
        {/* Test preview */}
        <div className="mb-6">
          <p className="text-sm font-medium mb-3 flex items-center gap-2">
            <Gauge className="w-4 h-4" />
            What we'll check:
          </p>
          <div className="grid grid-cols-2 gap-2">
            {tests.map((test, index) => (
              <div 
                key={test.name}
                className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-zinc-800 rounded-lg opacity-80 hover:opacity-100 transition-opacity"
              >
                <test.icon className={`w-4 h-4 ${test.color}`} />
                <span className="text-sm">{test.name}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="space-y-3">
          <button
            onClick={handleRunCheck}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 font-medium"
          >
            <Sparkles className="w-4 h-4" />
            Run Device Check
          </button>
          
          <button
            onClick={onClose}
            className="w-full py-3 px-4 border border-gray-300 dark:border-zinc-700 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
          >
            Skip for now
          </button>
        </div>
        
        <p className="text-xs text-center opacity-60 mt-4">
          Takes about 5 seconds • No personal data collected
        </p>
      </div>
    </div>
  );
}