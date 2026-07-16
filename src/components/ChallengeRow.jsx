import { useState } from 'react'

export default function ChallengeRow({ defi, valeurActuelle, valeurCible, onChange, editing }) {
  const complete = valeurActuelle >= valeurCible
  const [isEditing, setIsEditing] = useState(false)
  const [draftDescription, setDraftDescription] = useState(defi.description)
  const [draftCible, setDraftCible] = useState(valeurCible)

  const hasOverride = Boolean(editing?.overridesMap?.[defi.id])

  function handleInputChange(e) {
    const v = e.target.value === '' ? 0 : parseInt(e.target.value, 10)
    if (!Number.isNaN(v)) onChange(v)
  }

  function startEdit() {
    setDraftDescription(defi.description)
    setDraftCible(valeurCible)
    setIsEditing(true)
  }

  function handleSave() {
    const cible = parseInt(draftCible, 10)
    if (!draftDescription.trim() || Number.isNaN(cible) || cible <= 0) return
    editing.onSave(defi.id, { description: draftDescription.trim(), valeur_cible: cible })
    setIsEditing(false)
  }

  function handleReset() {
    editing.onReset(defi.id)
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div className="py-2 px-3 rounded bg-cod-bg/60 border border-cod-accent/40 space-y-2">
        <textarea
          value={draftDescription}
          onChange={(e) => setDraftDescription(e.target.value)}
          rows={2}
          className="w-full bg-cod-panel2 border border-cod-border rounded px-2 py-1 text-xs text-gray-200 focus:outline-none focus:border-cod-accent resize-none"
        />
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-400">Cible :</label>
          <input
            type="number"
            min="1"
            value={draftCible}
            onChange={(e) => setDraftCible(e.target.value)}
            className="w-20 bg-cod-panel2 border border-cod-border rounded px-2 py-1 text-xs text-center focus:outline-none focus:border-cod-accent"
          />
        </div>
        <div className="flex items-center gap-2 justify-end">
          {hasOverride && (
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-red-400 hover:text-red-300 underline mr-auto"
            >
              Réinitialiser
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="text-xs text-gray-400 hover:text-gray-200 px-2"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="text-xs bg-cod-accent text-black font-semibold px-3 py-1 rounded hover:brightness-110"
          >
            Enregistrer
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between gap-2 py-2 px-3 rounded bg-cod-bg/40">
      <p className={`text-sm flex-1 min-w-0 ${complete ? 'text-cod-accent' : 'text-gray-300'}`}>
        {defi.description}
        {complete && <span className="ml-2 text-xs">✓</span>}
        {hasOverride && <span className="ml-2 text-[10px] text-cod-accent/70 italic">(modifié)</span>}
      </p>
      {editing?.mode && (
        <button
          type="button"
          onClick={startEdit}
          className="shrink-0 w-7 h-7 flex items-center justify-center rounded bg-cod-panel2 border border-cod-border text-gray-400 hover:text-cod-accent hover:bg-cod-border"
          aria-label="Modifier ce défi"
          title="Modifier ce défi"
        >
          ✎
        </button>
      )}
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
