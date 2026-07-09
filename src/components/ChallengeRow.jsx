export default function ChallengeRow({ defi, valeurActuelle, valeurCible, onChange }) {
  const complete = valeurActuelle >= valeurCible

  function handleInputChange(e) {
    const v = e.target.value === '' ? 0 : parseInt(e.target.value, 10)
    if (!Number.isNaN(v)) onChange(v)
  }

  return (
    <div className="flex items-center justify-between gap-3 py-2 px-3 rounded bg-cod-bg/40">
      <p className={`text-sm flex-1 ${complete ? 'text-cod-accent' : 'text-gray-300'}`}>
        {defi.description}
        {complete && <span className="ml-2 text-xs">✓</span>}
      </p>
      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={() => onChange(valeurActuelle - 1)}
          className="w-7 h-7 flex items-center justify-center rounded bg-cod-panel2 border border-cod-border text-gray-300 hover:bg-cod-border active:scale-95"
          aria-label="Diminuer"
        >
          −
        </button>
        <input
          type="number"
          inputMode="numeric"
          value={valeurActuelle}
          onChange={handleInputChange}
          className="w-14 text-center bg-cod-panel2 border border-cod-border rounded py-1 text-sm focus:outline-none focus:border-cod-accent"
        />
        <span className="text-xs text-gray-500 w-10">/ {valeurCible}</span>
        <button
          type="button"
          onClick={() => onChange(valeurActuelle + 1)}
          className="w-7 h-7 flex items-center justify-center rounded bg-cod-panel2 border border-cod-border text-gray-300 hover:bg-cod-border active:scale-95"
          aria-label="Augmenter"
        >
          +
        </button>
      </div>
    </div>
  )
}
