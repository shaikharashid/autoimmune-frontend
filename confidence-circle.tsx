"use client"

interface ConfidenceCircleProps {
  percentage: number
  size?: number
  strokeWidth?: number
}

export function ConfidenceCircle({
  percentage,
  size = 180,
  strokeWidth = 8,
}: ConfidenceCircleProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Glow background */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, rgba(0,229,204,0.08) 0%, transparent 70%)`,
        }}
      />
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="animate-glow-pulse -rotate-90"
        aria-hidden="true"
      >
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(30, 48, 80, 0.5)"
          strokeWidth={strokeWidth}
        />
        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#cyanGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="animate-circle-fill transition-all duration-1000"
          style={{ filter: "drop-shadow(0 0 8px rgba(0,229,204,0.5))" }}
        />
        <defs>
          <linearGradient id="cyanGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00e5cc" />
            <stop offset="100%" stopColor="#00b8a3" />
          </linearGradient>
        </defs>
      </svg>
      {/* Center text */}
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-primary cyan-text-glow">
          {percentage}%
        </span>
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Confidence
        </span>
      </div>
    </div>
  )
}
