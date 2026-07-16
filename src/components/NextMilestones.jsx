import ProgressBar from './ProgressBar.jsx'

export default function NextMilestones({ milestones }) {
  if (milestones.length === 0) return null

  return (
    <section className="mb-6">
      <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">
        Prochains paliers
      </h2>
      <div className="space-y-2">
        {milestones.map((m) => (
          <div
            key={`${m.armeId}__${m.camoNom}__${m.description}`}
            className="bg-cod-panel border border-cod-border rounded-lg px-3 py-2"
          >
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-sm font-semibold text-gray-100 truncate">
                {m.armeNom} <span className="text-gray-500 font-normal">— {m.camoNom}</span>
              </span>
              <span className="text-xs text-cod-accent font-semibold shrink-0">
                encore {m.restant}
              </span>
            </div>
            <p className="text-xs text-gray-400 mb-1.5">{m.description}</p>
            <ProgressBar pourcentage={Math.round((m.actuelle / m.cible) * 100)} height="h-1.5" />
          </div>
        ))}
      </div>
    </section>
  )
}
