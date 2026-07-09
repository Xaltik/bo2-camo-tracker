export default function ProgressBar({ pourcentage, colorClass = 'bg-cod-accent', height = 'h-2' }) {
  return (
    <div className={`w-full ${height} bg-cod-panel2 rounded-full overflow-hidden border border-cod-border`}>
      <div
        className={`h-full ${colorClass} transition-all duration-300`}
        style={{ width: `${Math.min(100, Math.max(0, pourcentage))}%` }}
      />
    </div>
  )
}
