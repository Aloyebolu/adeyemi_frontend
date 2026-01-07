"use client";
export default function MaintenancePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800 text-white">
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(5deg); }
        }
        @keyframes glow {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }
        @keyframes sparkle {
          0% { transform: scale(0.8) rotate(0deg); opacity: 0.5; }
          50% { transform: scale(1.2) rotate(180deg); opacity: 1; }
          100% { transform: scale(0.8) rotate(360deg); opacity: 0.5; }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes shimmer {
          0% { background-position: -200px 0; }
          100% { background-position: 200px 0; }
        }
        @keyframes subtle-float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-5px) scale(1.02); }
        }
      `}</style>
      
      <div className="text-center space-y-8 p-8 max-w-lg relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-4 h-4 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '0s'}}></div>
          <div className="absolute top-20 right-20 w-3 h-3 bg-pink-500 rounded-full animate-pulse" style={{animationDelay: '0.3s'}}></div>
          <div className="absolute bottom-20 left-20 w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.6s'}}></div>
          <div className="absolute bottom-10 right-10 w-5 h-5 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '0.9s'}}></div>
        </div>

        {/* Logo Container */}
        <div className="relative mb-4">
          <div className="relative w-40 h-40 mx-auto mb-4 animate-subtle-float">
            {/* Glowing background ring */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 to-pink-500/30 rounded-full animate-pulse blur-xl"></div>
            
            {/* Logo frame */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-32 h-32 rounded-2xl overflow-hidden border-4 border-transparent bg-gradient-to-br from-purple-600 to-pink-500 p-0.5">
                {/* Actual Image Logo - Replace with your image */}
                <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl flex items-center justify-center">
                  {/* Fallback image URL - Replace this with your actual image URL */}
                  <div 
                    className="w-full h-full rounded-xl bg-cover bg-center"
                    style={{
                      backgroundImage: `url("/logo.png")`
                    }}
                  >
                    {/* You can replace the above data URL with an actual image:
                        style={{ backgroundImage: 'url("/path/to/your/logo.png")' }}
                    */}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Orbiting dots */}
            <div className="absolute -top-2 left-1/2 w-3 h-3 bg-pink-400 rounded-full animate-bounce"></div>
            <div className="absolute top-1/2 -right-2 w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
            <div className="absolute -bottom-2 left-1/2 w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
            <div className="absolute top-1/2 -left-2 w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '1.5s'}}></div>
          </div>
          
          {/* System name below logo */}
          <div className="mt-6">
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
              AFUED System
            </div>
            <div className="text-sm text-gray-400 mt-1">Advanced System for University Users</div>
          </div>
          
          {/* Sparkles around logo */}
          <div className="absolute top-6 right-6 text-2xl animate-spin" style={{animationDuration: '3s'}}>✨</div>
          <div className="absolute top-6 left-6 text-2xl animate-spin" style={{animationDuration: '4s', animationDirection: 'reverse'}}>⭐</div>
          <div className="absolute bottom-6 right-6 text-2xl animate-spin" style={{animationDuration: '5s'}}>🌟</div>
          <div className="absolute bottom-6 left-6 text-2xl animate-spin" style={{animationDuration: '6s', animationDirection: 'reverse'}}>💫</div>
        </div>

        {/* Main Content */}
        <div className="space-y-6 relative z-10">
          <h1 className="text-5xl font-bold">
            <span className="bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 bg-clip-text text-transparent bg-size-200 animate-shimmer"
                   style={{
                     backgroundSize: '200% 100%',
                     animation: 'shimmer 3s infinite linear'
                   }}>
              We're Working Magic!
            </span>
          </h1>
          
          <p className="text-xl opacity-90 leading-relaxed">
            AFUED system is getting a 
            <span className="inline-block mx-2 animate-float">✨</span>
            magical makeover!
            <br />
            <span className="text-pink-300 font-medium block mt-2">
              Our Developers are busy at work! 🧚
            </span>
          </p>

          {/* Animated progress indicator */}
          <div className="mt-8 space-y-4">
            <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full w-2/3 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-full animate-pulse"
                   style={{
                     animation: 'pulse 1.5s infinite ease-in-out, shimmer 2s infinite linear',
                     backgroundSize: '200% 100%'
                   }}>
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-purple-300">Loading cuteness...</span>
              <span className="text-pink-300">67%</span>
            </div>
          </div>

          {/* Fun message */}
          <div className="mt-8 p-4 bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-2xl border border-purple-700/30 backdrop-blur-sm">
            <p className="text-lg">
              <span className="inline-block animate-bounce mr-2">👀</span>
              Don't peek! The buttons are taking a nap...
            </p>
          </div>

          {/* Status indicator */}
          <div className="pt-6 mt-8 border-t border-purple-700/50">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-gray-800/50 rounded-full">
              <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-pulse"></div>
              <p className="text-sm opacity-80">
                <span className="text-purple-300 font-medium">AFUED System</span> - Maintenance Mode Active
              </p>
              <span className="animate-float" style={{animationDelay: '0.7s'}}>🔧</span>
            </div>
          </div>
        </div>

        {/* Floating decorative elements */}
        <div className="absolute -bottom-4 -left-4 text-4xl opacity-20 animate-float" style={{animationDelay: '0.2s'}}>🐇</div>
        <div className="absolute -top-4 -right-4 text-4xl opacity-20 animate-float" style={{animationDelay: '0.4s'}}>🦊</div>
        <div className="absolute top-10 -left-6 text-3xl opacity-15 animate-float" style={{animationDelay: '0.6s', animationDuration: '4s'}}>🐾</div>
        <div className="absolute bottom-10 -right-6 text-3xl opacity-15 animate-float" style={{animationDelay: '0.8s', animationDuration: '4s'}}>🌸</div>
      </div>
    </div>
  );
}