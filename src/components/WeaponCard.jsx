import { useState } from 'react'
import CamoSection from './CamoSection.jsx'
import ProgressRing from './ProgressRing.jsx'
import ConfirmModal from './ConfirmModal.jsx'
import WeaponIcon from './WeaponIcon.jsx'
import { computeArmeProgress, getPrestigeDefiId, isPrestigeAchieved } from '../lib/weaponsUtils.js'

export default function WeaponCard({ arme, categorieId, progressionMap, onDefiChange, onResetArme, editing }) {
  const [open, setOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const progress = computeArmeProgress(arme, progressionMap)

  function handlePrestigeClick(e, level) {
    e.stopPropagation()
    const achieved = isPrestigeAchieved(arme.id, level, progressionMap)
    onDefiChange(getPrestigeDefiId(arme.id, level), 1, achieved ? 0 : 1, {
      armeNom: arme.nom,
      camoNom: `Prestige ${level}`,
    })
  }

  return (
    <div
      className={`bg-cod-panel border rounded-lg overflow-hidden transition-colors ${
        open ? 'border-cod-accent/50' : 'border-cod-border hover:border-cod-accent/30'
      }`}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') setOpen((v) => !v)
        }}
        className="w-full flex items-center gap-3 px-3 py-3 text-left cursor-pointer"
      >
        <div className="w-11 h-11 shrink-0 rounded-lg bg-cod-panel2 border border-cod-border flex items-center justify-center text-gray-400">
          <WeaponIcon categorieId={categorieId} className="w-7 h-7" />
        </div>

        <div className="flex-1 min-w-0">
          <span className="font-semibold text-gray-100 truncate block leading-tight">{arme.nom}</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">
              {progress.debloques}/{progress.total} camouflages
            </span>
            <span className="flex items-center gap-0.5">
              {[1, 2].map((level) => {
                const achieved = isPrestigeAchieved(arme.id, level, progressionMap)
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={(e) => handlePrestigeClick(e, level)}
                    className={`text-sm leading-none transition-transform active:scale-90 ${
                      achieved ? 'text-cod-gold' : 'text-gray-600 hover:text-gray-400'
                    }`}
                    title={`Prestige ${level}${achieved ? ' (obtenu)' : ''}`}
                    aria-label={`Prestige ${level}${achieved ? ' obtenu' : ' non obtenu'}`}
                  >
                    ★
                  </button>
                )
              })}
            </span>
          </div>
        </div>

        <ProgressRing pourcentage={progress.pourcentage} />

        <span className={`text-gray-500 transition-transform shrink-0 ${open ? 'rotate-180' : ''}`}>
          ▾
        </span>
      </div>

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
        message="Toute la progression de cette arme (tous les camouflages et les prestiges) sera remise à zéro sur tous vos appareils."
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          onResetArme(arme.id)
          setConfirmOpen(false)
        }}
      />
    </div>
  )
}
