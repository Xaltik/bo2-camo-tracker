import WeaponCard from './WeaponCard.jsx'

export default function CategoryList({ categories, progressionMap, onDefiChange, onResetArme }) {
  if (categories.length === 0) {
    return <p className="text-center text-gray-500 py-10">Aucune arme ne correspond à votre recherche.</p>
  }

  return (
    <div className="space-y-8">
      {categories.map((categorie) => (
        <section key={categorie.id}>
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">
            {categorie.nom}
          </h2>
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
      ))}
    </div>
  )
}
