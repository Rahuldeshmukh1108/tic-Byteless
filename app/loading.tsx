import { cn } from "@/lib/utils"

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-50 via-cyan-50/80 to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0">
        {/* Animated water droplets - more dynamic */}
        {[...Array(8)].map((_, i) => (
          <div
            key={`droplet-${i}`}
            className={cn(
              "absolute rounded-full bg-gradient-to-b from-cyan-400/40 to-blue-500/40 animate-bounce blur-sm"
            )}
            style={{
              left: `${10 + i * 12}%`,
              top: `${15 + (i % 4) * 18}%`,
              width: `${6 + (i % 4) * 3}px`,
              height: `${10 + (i % 4) * 5}px`,
              animationDelay: `${i * 0.15}s`,
              animationDuration: `${1.8 + (i % 3) * 0.5}s`
            }}
          />
        ))}

        {/* Floating nutrient particles */}
        {[...Array(12)].map((_, i) => (
          <div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-gradient-to-r from-green-400/60 to-cyan-400/60 rounded-full animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}

        {/* Growing root system - enhanced */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
          <div className="relative">
            {/* Main root with pulsing effect */}
            <div className="w-2 h-24 bg-gradient-to-t from-green-700 via-green-600 to-green-400 rounded-full animate-pulse shadow-lg" />

            {/* Enhanced branching roots */}
            {[...Array(5)].map((_, i) => (
              <div
                key={`branch-${i}`}
                className={cn(
                  "absolute w-1 h-10 bg-gradient-to-t from-green-600 to-green-300 rounded-full animate-pulse shadow-md",
                  i === 0 && "-rotate-45 -left-6 top-4",
                  i === 1 && "rotate-45 -right-6 top-6",
                  i === 2 && "-rotate-30 -left-10 top-8",
                  i === 3 && "rotate-30 -right-10 top-10",
                  i === 4 && "-rotate-60 -left-12 top-12"
                )}
                style={{
                  animationDelay: `${0.3 + i * 0.25}s`,
                  animationDuration: '2.5s'
                }}
              />
            ))}

            {/* Root tips with glow */}
            {[...Array(3)].map((_, i) => (
              <div
                key={`tip-${i}`}
                className="absolute w-1.5 h-1.5 bg-yellow-400 rounded-full animate-ping"
                style={{
                  left: i === 0 ? '-24px' : i === 1 ? '20px' : '-36px',
                  top: i === 0 ? '16px' : i === 1 ? '20px' : '28px',
                  animationDelay: `${1 + i * 0.5}s`
                }}
              />
            ))}
          </div>
        </div>

        {/* Flowing water streams */}
        <div className="absolute top-0 left-0 w-full h-full">
          {[...Array(3)].map((_, i) => (
            <div
              key={`stream-${i}`}
              className="absolute w-px bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent animate-pulse"
              style={{
                left: `${20 + i * 30}%`,
                top: '10%',
                height: '80%',
                animationDelay: `${i * 0.8}s`,
                animationDuration: '3s'
              }}
            />
          ))}
        </div>
      </div>

      {/* Enhanced Main Loading Container */}
      <div className="relative z-10 flex flex-col items-center space-y-8">
        {/* Logo and Brand with enhanced effects */}
        <div className="flex items-center gap-6 mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/30 to-blue-500/30 rounded-full blur-xl animate-pulse scale-150" />
            <img
              src="/logo.png"
              alt="HydroSync Logo"
              className="relative w-16 h-16 animate-pulse drop-shadow-2xl"
            />
            {/* Multiple pulsing rings */}
            <div className="absolute inset-0 rounded-full border-2 border-cyan-400/60 animate-ping" />
            <div className="absolute inset-2 rounded-full border border-blue-400/40 animate-ping" style={{ animationDelay: '0.5s' }} />
            <div className="absolute inset-4 rounded-full border border-green-400/30 animate-ping" style={{ animationDelay: '1s' }} />
          </div>
          <div className="text-3xl font-bold gradient-text animate-pulse drop-shadow-lg">
            HydroSync
          </div>
        </div>

        {/* Advanced Hydroponic Ecosystem Animation */}
        <div className="relative w-80 h-48">
          {/* Main Hydroponic System */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-64 h-32">
            {/* Water reservoir with enhanced effects */}
            <div className="relative w-full h-20 bg-gradient-to-b from-blue-200/60 via-blue-300/60 to-blue-400/60 dark:from-blue-900/60 dark:via-blue-800/60 dark:to-blue-700/60 rounded-xl border-2 border-blue-300/40 dark:border-blue-600/40 shadow-2xl overflow-hidden">
              {/* Water surface with waves */}
              <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent animate-pulse" />

              {/* Water level with shimmer */}
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-blue-500/70 via-cyan-400/50 to-blue-300/30 rounded-b-xl animate-pulse" />

              {/* Enhanced bubbles */}
              {[...Array(8)].map((_, i) => (
                <div
                  key={`bubble-${i}`}
                  className="absolute w-1.5 h-1.5 bg-white/80 rounded-full animate-bounce shadow-sm"
                  style={{
                    left: `${15 + i * 10}%`,
                    bottom: `${20 + (i % 3) * 15}%`,
                    animationDelay: `${i * 0.15}s`,
                    animationDuration: `${1.2 + (i % 2) * 0.3}s`
                  }}
                />
              ))}

              {/* Nutrient indicators */}
              <div className="absolute top-2 right-2 w-2 h-2 bg-green-400 rounded-full animate-ping" />
              <div className="absolute top-4 right-4 w-1.5 h-1.5 bg-yellow-400 rounded-full animate-ping" style={{ animationDelay: '0.7s' }} />
            </div>

            {/* Growing plants with enhanced details */}
            {[...Array(3)].map((_, plantIndex) => (
              <div
                key={`plant-${plantIndex}`}
                className="absolute bottom-20"
                style={{
                  left: `${20 + plantIndex * 25}%`,
                  transform: 'translateX(-50%)'
                }}
              >
                {/* Main stem with growth animation */}
                <div className="relative">
                  <div className="w-1.5 h-16 bg-gradient-to-t from-green-600 via-green-500 to-green-300 rounded-full animate-pulse shadow-md" />

                  {/* Leaves with flutter animation */}
                  {[...Array(6)].map((_, leafIndex) => (
                    <div
                      key={`leaf-${plantIndex}-${leafIndex}`}
                      className={cn(
                        "absolute w-8 h-4 bg-gradient-to-r from-green-400 via-green-300 to-green-200 rounded-full shadow-sm animate-pulse",
                        leafIndex % 2 === 0 ? "-rotate-45" : "rotate-45"
                      )}
                      style={{
                        left: leafIndex % 2 === 0 ? '-16px' : '8px',
                        top: `${4 + leafIndex * 6}px`,
                        animationDelay: `${0.2 + leafIndex * 0.15}s`,
                        animationDuration: '2s'
                      }}
                    />
                  ))}

                  {/* Flower buds */}
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="w-3 h-3 bg-gradient-to-br from-yellow-400 via-orange-400 to-pink-400 rounded-full animate-pulse shadow-lg" />
                    <div className="absolute inset-0 bg-white/30 rounded-full animate-ping" />
                  </div>
                </div>
              </div>
            ))}

            {/* pH and nutrient monitoring indicators */}
            <div className="absolute top-2 left-2 flex gap-1">
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" title="pH Level" />
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} title="Nutrient Level" />
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }} title="Growth Rate" />
            </div>
          </div>

          {/* Environmental indicators */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
              <span>Water Temp: 22°C</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
              <span>pH: 6.2</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.8s' }} />
              <span>Humidity: 65%</span>
            </div>
          </div>
        </div>

        {/* Enhanced Loading Messages */}
        <div className="text-center space-y-3">
          <div className="text-xl font-bold text-slate-800 dark:text-slate-200 animate-pulse">
            🌱 Cultivating Your Experience...
          </div>
          <div className="text-base text-slate-600 dark:text-slate-400 animate-pulse" style={{ animationDelay: '0.5s' }}>
            Optimizing hydroponic systems for peak performance
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-500 animate-pulse" style={{ animationDelay: '1s' }}>
            Monitoring nutrients • Regulating pH • Ensuring growth
          </div>
        </div>

        {/* Advanced Progress Indicators */}
        <div className="flex flex-col items-center space-y-4">
          {/* Main progress bar */}
          <div className="w-64 h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden shadow-inner">
            <div className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-green-500 rounded-full animate-pulse shadow-sm" />
          </div>

          {/* Animated progress dots */}
          <div className="flex space-x-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="relative"
              >
                <div
                  className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-bounce shadow-lg"
                  style={{
                    animationDelay: `${i * 0.15}s`,
                    animationDuration: '1.5s'
                  }}
                />
                {/* Glow effect */}
                <div
                  className="absolute inset-0 w-3 h-3 bg-cyan-400/50 rounded-full blur-sm animate-pulse"
                  style={{
                    animationDelay: `${i * 0.15}s`
                  }}
                />
              </div>
            ))}
          </div>

          {/* Loading phases */}
          <div className="flex space-x-6 text-xs text-slate-500 dark:text-slate-400">
            <span className="animate-pulse">🌊 Water Flow</span>
            <span className="animate-pulse" style={{ animationDelay: '0.3s' }}>🧪 Nutrients</span>
            <span className="animate-pulse" style={{ animationDelay: '0.6s' }}>🌱 Growth</span>
            <span className="animate-pulse" style={{ animationDelay: '0.9s' }}>📊 Monitoring</span>
          </div>
        </div>
      </div>

      {/* Enhanced Background Patterns */}
      <div className="absolute inset-0 opacity-10">
        {/* Hydroponic grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(6,182,212,0.1)_25%,transparent_25%),linear-gradient(-45deg,rgba(6,182,212,0.1)_25%,transparent_25%),linear-gradient(45deg,transparent_75%,rgba(6,182,212,0.1)_75%),linear-gradient(-45deg,transparent_75%,rgba(6,182,212,0.1)_75%)] bg-[length:20px_20px] bg-[position:0_0,0_10px,10px_-10px,10px_0px]" />

        {/* Floating environmental elements */}
        <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-gradient-to-br from-cyan-500/20 via-blue-500/15 to-green-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-gradient-to-br from-blue-500/25 via-purple-500/15 to-cyan-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-gradient-to-br from-green-500/20 via-cyan-500/15 to-blue-500/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }} />

        {/* Subtle water flow lines */}
        <div className="absolute inset-0">
          {[...Array(4)].map((_, i) => (
            <div
              key={`flow-${i}`}
              className="absolute w-px bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent animate-pulse"
              style={{
                left: `${15 + i * 25}%`,
                top: '5%',
                height: '90%',
                animationDelay: `${i * 0.5}s`,
                animationDuration: '4s'
              }}
            />
          ))}
        </div>

        {/* Microscopic nutrient particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={`micro-${i}`}
            className="absolute w-0.5 h-0.5 bg-gradient-to-r from-green-400/40 to-cyan-400/40 rounded-full animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${1 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
    </div>
  )
}