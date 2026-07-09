import { useCallback, useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { getFlatDefis } from '../lib/weaponsUtils'

// status: 'idle' | 'syncing' | 'synced' | 'error'
export function useProgression(user) {
  const [progressionMap, setProgressionMap] = useState({}) // defi_id -> { valeur_actuelle, valeur_cible, mis_a_jour_le }
  const [status, setStatus] = useState('idle')
  const [loading, setLoading] = useState(true)
  const mapRef = useRef(progressionMap)
  mapRef.current = progressionMap

  const applyRow = useCallback((row) => {
    setProgressionMap((prev) => ({
      ...prev,
      [row.defi]: {
        valeur_actuelle: row.valeur_actuelle,
        valeur_cible: row.valeur_cible,
        mis_a_jour_le: row.mis_a_jour_le,
      },
    }))
  }, [])

  const removeRow = useCallback((defiId) => {
    setProgressionMap((prev) => {
      const next = { ...prev }
      delete next[defiId]
      return next
    })
  }, [])

  // Chargement initial + abonnement realtime
  useEffect(() => {
    if (!user) {
      setProgressionMap({})
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)

    supabase
      .from('progression')
      .select('defi, valeur_actuelle, valeur_cible, mis_a_jour_le')
      .eq('user_id', user.id)
      .then(({ data, error }) => {
        if (cancelled) return
        if (error) {
          console.error('Erreur chargement progression:', error.message)
        } else {
          const map = {}
          for (const row of data) {
            map[row.defi] = {
              valeur_actuelle: row.valeur_actuelle,
              valeur_cible: row.valeur_cible,
              mis_a_jour_le: row.mis_a_jour_le,
            }
          }
          setProgressionMap(map)
        }
        setLoading(false)
      })

    const channel = supabase
      .channel(`progression-${user.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'progression', filter: `user_id=eq.${user.id}` },
        (payload) => {
          if (payload.eventType === 'DELETE') {
            removeRow(payload.old.defi)
          } else {
            applyRow(payload.new)
          }
        },
      )
      .subscribe()

    return () => {
      cancelled = true
      supabase.removeChannel(channel)
    }
  }, [user, applyRow, removeRow])

  // Écrit immédiatement une valeur en base (upsert) + mise à jour optimiste locale.
  const setDefiValue = useCallback(
    async (defi, valeurCible, nouvelleValeur, contexte) => {
      if (!user) return
      const valeur = Math.max(0, Math.round(nouvelleValeur))

      setProgressionMap((prev) => ({
        ...prev,
        [defi]: {
          valeur_actuelle: valeur,
          valeur_cible: valeurCible,
          mis_a_jour_le: new Date().toISOString(),
        },
      }))
      setStatus('syncing')

      const { error } = await supabase.from('progression').upsert(
        {
          user_id: user.id,
          arme: contexte.armeNom,
          camouflage: contexte.camoNom,
          defi,
          valeur_actuelle: valeur,
          valeur_cible: valeurCible,
          mis_a_jour_le: new Date().toISOString(),
        },
        { onConflict: 'user_id,defi' },
      )

      setStatus(error ? 'error' : 'synced')
      if (error) console.error('Erreur sync défi:', error.message)
    },
    [user],
  )

  const resetDefis = useCallback(
    async (defiIds) => {
      if (!user || defiIds.length === 0) return
      setStatus('syncing')
      setProgressionMap((prev) => {
        const next = { ...prev }
        for (const id of defiIds) {
          if (next[id]) next[id] = { ...next[id], valeur_actuelle: 0 }
        }
        return next
      })

      const { error } = await supabase
        .from('progression')
        .delete()
        .eq('user_id', user.id)
        .in('defi', defiIds)

      setStatus(error ? 'error' : 'synced')
      if (error) console.error('Erreur reset:', error.message)
    },
    [user],
  )

  const resetArme = useCallback(
    (armeId) => {
      const defis = getFlatDefis().filter((d) => d.armeId === armeId)
      return resetDefis(defis.map((d) => d.id))
    },
    [resetDefis],
  )

  const resetGlobal = useCallback(() => {
    const defis = getFlatDefis()
    return resetDefis(defis.map((d) => d.id))
  }, [resetDefis])

  return { progressionMap, status, loading, setDefiValue, resetArme, resetGlobal }
}
