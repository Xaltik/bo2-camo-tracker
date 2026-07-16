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

// Applique par-dessus les catégories les corrections personnelles (description / valeur cible)
// enregistrées par l'utilisateur, sans toucher au fichier weapons.json d'origine. Retourne une
// nouvelle structure (les catégories/armes/camos d'origine ne sont jamais mutées).
export function applyOverrides(categories, overridesMap) {
  if (!overridesMap || Object.keys(overridesMap).length === 0) return categories

  return categories.map((categorie) => ({
    ...categorie,
    armes: categorie.armes.map((arme) => ({
      ...arme,
      camouflages: arme.camouflages.map((camo) => ({
        ...camo,
        defis: camo.defis.map((defi) => {
          const override = overridesMap[defi.id]
          if (!override) return defi
          return {
            ...defi,
            description: override.description ?? defi.description,
            valeur_cible: override.valeur_cible ?? defi.valeur_cible,
          }
        }),
      })),
    })),
  }))
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

export function computeCategorieProgress(categorie, progressionMap) {
  let total = 0
  let debloques = 0
  for (const arme of categorie.armes) {
    total += arme.camouflages.length
    debloques += arme.camouflages.filter((c) => isCamoUnlocked(arme.id, c, progressionMap)).length
  }
  return { debloques, total, pourcentage: total === 0 ? 0 : Math.round((debloques / total) * 100) }
}

// Pour chaque arme, retrouve le prochain palier standard non débloqué le plus proche (par
// compteur partagé, ne garde que le seuil le plus bas non encore atteint), puis trie tous
// les paliers ainsi trouvés par "quantité restante" croissante — les plus proches du
// déblocage en premier.
export function computeNextMilestones(categories, progressionMap, limit = 5) {
  const candidates = []

  for (const categorie of categories) {
    for (const arme of categorie.armes) {
      const bestByCompteur = new Map()

      for (const camo of arme.camouflages) {
        if (camo.type !== 'standard') continue
        for (const defi of camo.defis) {
          const compteurId = getCompteurId(arme.id, defi)
          const actuelle = progressionMap[compteurId]?.valeur_actuelle ?? 0
          // Ignore les défis jamais commencés : on ne veut que les armes "en cours".
          if (actuelle <= 0) continue
          if (actuelle >= defi.valeur_cible) continue

          const existing = bestByCompteur.get(compteurId)
          if (!existing || defi.valeur_cible < existing.cible) {
            bestByCompteur.set(compteurId, {
              armeId: arme.id,
              armeNom: arme.nom,
              categorieNom: categorie.nom,
              camoNom: camo.nom,
              description: defi.description,
              actuelle,
              cible: defi.valeur_cible,
              restant: defi.valeur_cible - actuelle,
            })
          }
        }
      }

      candidates.push(...bestByCompteur.values())
    }
  }

  candidates.sort((a, b) => a.restant - b.restant)
  return candidates.slice(0, limit)
}

export function computeGlobalProgress(categories, progressionMap) {
  let total = 0
  let debloques = 0
  for (const categorie of categories) {
    for (const arme of categorie.armes) {
      total += arme.camouflages.length
      debloques += arme.camouflages.filter((c) => isCamoUnlocked(arme.id, c, progressionMap)).length
    }
  }
  return { debloques, total, pourcentage: total === 0 ? 0 : Math.round((debloques / total) * 100) }
}
