import WeaponCard from './WeaponCard.jsx'
import ProgressBar from './ProgressBar.jsx'
import { computeCategorieProgress } from '../lib/weaponsUtils.js'

export default function CategoryList({ categories, progressionMap, onDefiChange, onResetArme }) {
  if (categories.length === 0) {
    return <p className="text-center text-gray-500 py-10">Aucune arme ne correspond à votre recherche.</p>
  }

  return (
    <div className="space-y-8">
      {categories.map((categorie) => {
        const progress = computeCategorieProgress(categorie, progressionMap)
        return (
        <section key={categorie.id}>
          <div className="flex items-center justify-between mb-1.5">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500">
              {categorie.nom}
            </h2>
            <span className="text-xs text-gray-500">
              {progress.debloques}/{progress.total} ({progress.pourcentage}%)
            </span>
          </div>
          <div className="mb-3">
            <ProgressBar pourcentage={progress.pourcentage} height="h-1.5" />
          </div>
          <div className="space-y-3">
            {categorie.armes.map((arme) => (
              <WeaponCard
                key={arme.id}
                arme={arme}
                progressionMap={progressionMap}
                onDefiChange={onDefiChange}
                onResetArme={onResetArme}
              />
            ))}
          </div>
        </section>
        )
      })}
    </div>
  )
}
