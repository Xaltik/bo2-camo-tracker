import { useState } from 'react'
import CamoSection from './CamoSection.jsx'
import ProgressRing from './ProgressRing.jsx'
import ConfirmModal from './ConfirmModal.jsx'
import WeaponIcon from './WeaponIcon.jsx'
import { computeArmeProgress } from '../lib/weaponsUtils.js'

export default function WeaponCard({ arme, categorieId, progressionMap, onDefiChange, onResetArme, editing }) {
  const [open, setOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const progress = computeArmeProgress(arme, progressionMap)

  return (
    <div
      className={`bg-cod-panel border rounded-lg overflow-hidden transition-colors ${
        open ? 'border-cod-accent/50' : 'border-cod-border hover:border-cod-accent/30'
      }`}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-3 py-3 text-left"
      >
        <div className="w-11 h-11 shrink-0 rounded-lg bg-cod-panel2 border border-cod-border flex items-center justify-center text-gray-400">
          <WeaponIcon categorieId={categorieId} className="w-7 h-7" />
        </div>

        <div className="flex-1 min-w-0">
          <span className="font-semibold text-gray-100 truncate block leading-tight">{arme.nom}</span>
          <span className="text-xs text-gray-500">
            {progress.debloques}/{progress.total} camouflages
          </span>
        </div>

        <ProgressRing pourcentage={progress.pourcentage} />

        <span className={`text-gray-500 transition-transform shrink-0 ${open ? 'rotate-180' : ''}`}>
          ▾
        </span>
      </button>

      {open && (
        <div className="px-3 pb-4 space-y-2 border-t border-cod-border pt-3">
          {arme.camouflages
            .slice()
            .sort((a, b) => a.ordre - b.ordre)
            .map((camo) => (
              <CamoSection
                key={camo.id}
                arme={arme}
                camo={camo}
                progressionMap={progressionMap}
                onDefiChange={onDefiChange}
                editing={editing}
              />
            ))}

          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            className="mt-2 text-xs text-red-400 hover:text-red-300 underline"
          >
            Réinitialiser cette arme
          </button>
        </div>
      )}

      <ConfirmModal
        open={confirmOpen}
        title={`Réinitialiser ${arme.nom} ?`}
        message="Toute la progression de cette arme (tous les camouflages) sera remise à zéro sur tous vos appareils."
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          onResetArme(arme.id)
          setConfirmOpen(false)
        }}
      />
    </div>
  )
}
