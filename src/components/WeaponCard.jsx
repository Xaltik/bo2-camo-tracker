import { useState } from 'react'
import CamoSection from './CamoSection.jsx'
import ProgressBar from './ProgressBar.jsx'
import ConfirmModal from './ConfirmModal.jsx'
import { computeArmeProgress } from '../lib/weaponsUtils.js'

export default function WeaponCard({ arme, progressionMap, onDefiChange, onResetArme }) {
  const [open, setOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const progress = computeArmeProgress(arme, progressionMap)

  return (
    <div className="bg-cod-panel border border-cod-border rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold text-gray-100 truncate">{arme.nom}</span>
            <span className="text-xs text-gray-400 shrink-0 ml-2">
              {progress.debloques}/{progress.total}
            </span>
          </div>
          <ProgressBar pourcentage={progress.pourcentage} />
        </div>
        <span className={`text-gray-500 transition-transform shrink-0 ${open ? 'rotate-180' : ''}`}>
          ▾
        </span>
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-2">
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
