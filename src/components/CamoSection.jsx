import { useEffect, useRef, useState } from 'react'
import ChallengeRow from './ChallengeRow.jsx'
import { isCamoUnlocked, getCompteurId } from '../lib/weaponsUtils.js'

const TYPE_STYLES = {
  standard: 'text-gray-300 border-cod-border',
  or: 'text-cod-gold border-cod-gold/60',
  diamant: 'text-cod-diamond border-cod-diamond/60',
}

const GLOW_CLASS = {
  standard: 'animate-unlock-glow-standard',
  or: 'animate-unlock-glow-or',
  diamant: 'animate-unlock-glow-diamant',
}

export default function CamoSection({ arme, camo, progressionMap, onDefiChange, editing }) {
  const unlocked = isCamoUnlocked(arme.id, camo, progressionMap)
  const style = TYPE_STYLES[camo.type] ?? TYPE_STYLES.standard
  const wasUnlocked = useRef(unlocked)
  const [celebrate, setCelebrate] = useState(false)

  useEffect(() => {
    const justUnlocked = unlocked && !wasUnlocked.current
    wasUnlocked.current = unlocked
    if (justUnlocked) {
      setCelebrate(true)
      const timer = setTimeout(() => setCelebrate(false), 1600)
      return () => clearTimeout(timer)
    }
  }, [unlocked])

  const glowClass = celebrate ? (GLOW_CLASS[camo.type] ?? GLOW_CLASS.standard) : ''

  return (
    <div
      className={`rounded-lg border ${style} bg-cod-panel2/40 p-3 ${glowClass} ${celebrate ? 'animate-unlock-pop' : ''}`}
    >
      <div className="flex items-center justify-between mb-2">
        <h4 className={`text-sm font-bold uppercase tracking-wide ${style.split(' ')[0]}`}>
          {camo.nom}
        </h4>
        {unlocked && (
          <span
            className={`text-xs font-semibold ${style.split(' ')[0]} ${celebrate ? 'animate-unlock-badge' : ''}`}
          >
            {celebrate ? 'Débloqué !' : 'Débloqué'}
          </span>
        )}
      </div>
      {camo.defis.some((d) => d.compteur) && (
        <p className="text-[11px] text-gray-500 mb-1.5 italic">
          Compteur partagé avec les autres paliers "{camo.defis.find((d) => d.compteur).compteur}"
          — incrémenter ici fait aussi progresser les autres.
        </p>
      )}
      <div className="space-y-1.5">
        {camo.defis.map((defi) => {
          const compteurId = getCompteurId(arme.id, defi)
          const p = progressionMap[compteurId]
          const valeurCible = defi.valeur_cible
          const valeurActuelle = p?.valeur_actuelle ?? 0
          return (
            <ChallengeRow
              key={defi.id}
              defi={defi}
              valeurActuelle={valeurActuelle}
              valeurCible={valeurCible}
              onChange={(nv) =>
                onDefiChange(compteurId, valeurCible, nv, {
                  armeNom: arme.nom,
                  camoNom: camo.nom,
                })
              }
              editing={editing}
            />
          )
        })}
      </div>
    </div>
  )
}
