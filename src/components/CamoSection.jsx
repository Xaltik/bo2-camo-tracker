import ChallengeRow from './ChallengeRow.jsx'
import { isCamoUnlocked, getCompteurId } from '../lib/weaponsUtils.js'

const TYPE_STYLES = {
  standard: 'text-gray-300 border-cod-border',
  or: 'text-cod-gold border-cod-gold/60',
  diamant: 'text-cod-diamond border-cod-diamond/60',
}

export default function CamoSection({ arme, camo, progressionMap, onDefiChange }) {
  const unlocked = isCamoUnlocked(arme.id, camo, progressionMap)
  const style = TYPE_STYLES[camo.type] ?? TYPE_STYLES.standard

  return (
    <div className={`rounded-lg border ${style} bg-cod-panel2/40 p-3`}>
      <div className="flex items-center justify-between mb-2">
        <h4 className={`text-sm font-bold uppercase tracking-wide ${style.split(' ')[0]}`}>
          {camo.nom}
        </h4>
        {unlocked && (
          <span className={`text-xs font-semibold ${style.split(' ')[0]}`}>Débloqué</span>
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
            />
          )
        })}
      </div>
    </div>
  )
}
