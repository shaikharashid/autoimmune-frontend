interface ImpactBarProps {
  label: string
  impact: number
  /** 0-100 representing the filled portion */
  fillPercent: number
  variant?: "positive" | "negative"
}

export function ImpactBar({
  label,
  impact,
  fillPercent,
  variant = "positive",
}: ImpactBarProps) {
  const isPositive = variant === "positive"
  const impactStr = `${isPositive ? "+" : ""}${impact.toFixed(2)}`

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wide text-foreground">
          {label}
        </span>
        <span
          className={`text-xs font-bold ${
            isPositive ? "text-primary" : "text-chart-2"
          }`}
        >
          {impactStr}
          <span className="ml-0.5 text-[10px] opacity-80">IMPACT</span>
        </span>
      </div>
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
        {isPositive ? (
          <div
            className="absolute left-0 top-0 h-full rounded-full bg-primary transition-all duration-700"
            style={{ width: `${fillPercent}%` }}
          />
        ) : (
          <div
            className="absolute right-0 top-0 h-full rounded-full bg-chart-2 transition-all duration-700"
            style={{ width: `${fillPercent}%` }}
          />
        )}
      </div>
    </div>
  )
}
