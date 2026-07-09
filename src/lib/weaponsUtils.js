import weaponsData from '../data/weapons.json'

// Identifiant de stockage d'un défi : si plusieurs défis d'une même arme partagent un
// "compteur" (ex: tous les paliers de tirs à la tête de la MP7), ils pointent vers la même
// valeur en base — incrémenter une fois fait progresser tous les paliers concernés d'un coup,
// au lieu de devoir recompter depuis 0 à chaque palier.
export function getCompteurId(armeId, defi) {
  return defi.compteur ? `${armeId}__c__${defi.compteur}` : defi.id
}

// Aplatit le JSON en une liste de défis, chacun rattaché à sa catégorie/arme/camouflage.
export function getFlatDefis() {
  const defis = []
  for (const categorie of weaponsData.categories) {
    for (const arme of categorie.armes) {
      for (const camo of arme.camouflages) {
        for (const defi of camo.defis) {
          defis.push({
            id: defi.id,
            compteurId: getCompteurId(arme.id, defi),
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
// La cible vient toujours du JSON (defi.valeur_cible) : la valeur en base n'est que le
// compteur actuel, qui peut être partagé entre plusieurs paliers.
export function isCamoUnlocked(armeId, camo, progressionMap) {
  return camo.defis.every((defi) => {
    const p = progressionMap[getCompteurId(armeId, defi)]
    const actuelle = p?.valeur_actuelle ?? 0
    return actuelle >= defi.valeur_cible
  })
}

export function computeArmeProgress(arme, progressionMap) {
  const total = arme.camouflages.length
  const debloques = arme.camouflages.filter((c) => isCamoUnlocked(arme.id, c, progressionMap)).length
  return { debloques, total, pourcentage: total === 0 ? 0 : Math.round((debloques / total) * 100) }
}

export function computeGlobalProgress(progressionMap) {
  let total = 0
  let debloques = 0
  for (const categorie of weaponsData.categories) {
    for (const arme of categorie.armes) {
      total += arme.camouflages.length
      debloques += arme.camouflages.filter((c) => isCamoUnlocked(arme.id, c, progressionMap)).length
    }
  }
  return { debloques, total, pourcentage: total === 0 ? 0 : Math.round((debloques / total) * 100) }
}
