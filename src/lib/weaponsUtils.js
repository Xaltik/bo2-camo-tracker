import weaponsData from '../data/weapons.json'

// Aplatit le JSON en une liste de défis, chacun rattaché à sa catégorie/arme/camouflage.
export function getFlatDefis() {
  const defis = []
  for (const categorie of weaponsData.categories) {
    for (const arme of categorie.armes) {
      for (const camo of arme.camouflages) {
        for (const defi of camo.defis) {
          defis.push({
            id: defi.id,
            description: defi.description,
            valeurCibleDefaut: defi.valeur_cible,
            categorieId: categorie.id,
            categorieNom: categorie.nom,
            armeId: arme.id,
            armeNom: arme.nom,
            camoId: camo.id,
            camoNom: camo.nom,
            camoType: camo.type,
            camoOrdre: camo.ordre,
          })
        }
      }
    }
  }
  return defis
}

export function getCategories() {
  return weaponsData.categories
}

// Est-ce qu'un camouflage est débloqué : tous ses défis atteignent leur valeur cible.
export function isCamoUnlocked(camo, progressionMap) {
  return camo.defis.every((defi) => {
    const p = progressionMap[defi.id]
    const actuelle = p?.valeur_actuelle ?? 0
    const cible = p?.valeur_cible ?? defi.valeur_cible
    return actuelle >= cible
  })
}

export function computeArmeProgress(arme, progressionMap) {
  const total = arme.camouflages.length
  const debloques = arme.camouflages.filter((c) => isCamoUnlocked(c, progressionMap)).length
  return { debloques, total, pourcentage: total === 0 ? 0 : Math.round((debloques / total) * 100) }
}

export function computeGlobalProgress(progressionMap) {
  let total = 0
  let debloques = 0
  for (const categorie of weaponsData.categories) {
    for (const arme of categorie.armes) {
      total += arme.camouflages.length
      debloques += arme.camouflages.filter((c) => isCamoUnlocked(c, progressionMap)).length
    }
  }
  return { debloques, total, pourcentage: total === 0 ? 0 : Math.round((debloques / total) * 100) }
}
