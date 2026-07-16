import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

// Charge et synchronise les corrections de défis (description / valeur cible) de l'utilisateur,
// stockées à part de la progression pour ne pas mélanger "ce que je grind" et "ce que dit le défi".
export function useDefiOverrides(user) {
  const [overridesMap, setOverridesMap] = useState({}) // defi_id -> { description, valeur_cible }
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setOverridesMap({})
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)

    supabase
      .from('defi_overrides')
      .select('defi_id, description, valeur_cible')
      .eq('user_id', user.id)
      .then(({ data, error }) => {
        if (cancelled) return
        if (error) {
          console.error('Erreur chargement des corrections:', error.message)
        } else {
          const map = {}
          for (const row of data) {
            map[row.defi_id] = { description: row.description, valeur_cible: row.valeur_cible }
          }
          setOverridesMap(map)
        }
        setLoading(false)
      })

    const channel = supabase
      .channel(`defi-overrides-${user.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'defi_overrides', filter: `user_id=eq.${user.id}` },
        (payload) => {
          if (payload.eventType === 'DELETE') {
            setOverridesMap((prev) => {
              const next = { ...prev }
              delete next[payload.old.defi_id]
              return next
            })
          } else {
            setOverridesMap((prev) => ({
              ...prev,
              [payload.new.defi_id]: {
                description: payload.new.description,
                valeur_cible: payload.new.valeur_cible,
              },
            }))
          }
        },
      )
      .subscribe()

    return () => {
      cancelled = true
      supabase.removeChannel(channel)
    }
  }, [user])

  const saveOverride = useCallback(
    async (defiId, { description, valeur_cible }) => {
      if (!user) return
      setOverridesMap((prev) => ({ ...prev, [defiId]: { description, valeur_cible } }))

      const { error } = await supabase.from('defi_overrides').upsert(
        {
          user_id: user.id,
          defi_id: defiId,
          description,
          valeur_cible,
          mis_a_jour_le: new Date().toISOString(),
        },
        { onConflict: 'user_id,defi_id' },
      )
      if (error) console.error('Erreur sauvegarde correction:', error.message)
    },
    [user],
  )

  const resetOverride = useCallback(
    async (defiId) => {
      if (!user) return
      setOverridesMap((prev) => {
        const next = { ...prev }
        delete next[defiId]
        return next
      })

      const { error } = await supabase
        .from('defi_overrides')
        .delete()
        .eq('user_id', user.id)
        .eq('defi_id', defiId)
      if (error) console.error('Erreur suppression correction:', error.message)
    },
    [user],
  )

  return { overridesMap, loading, saveOverride, resetOverride }
}
