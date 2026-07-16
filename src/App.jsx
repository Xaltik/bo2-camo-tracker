import { useMemo, useState } from 'react'
import { useAuth } from './context/AuthContext.jsx'
import { useProgression } from './hooks/useProgression.js'
import { useDefiOverrides } from './hooks/useDefiOverrides.js'
import {
  getCategories,
  applyOverrides,
  computeGlobalProgress,
  computeNextMilestones,
} from './lib/weaponsUtils.js'
import Login from './components/Login.jsx'
import ResetPassword from './components/ResetPassword.jsx'
import Header from './components/Header.jsx'
import CategoryList from './components/CategoryList.jsx'
import NextMilestones from './components/NextMilestones.jsx'

export default function App() {
  const { user, loading: authLoading, passwordRecovery, signOut } = useAuth()

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cod-bg text-gray-400">
        Chargement...
      </div>
    )
  }

  if (passwordRecovery) {
    return <ResetPassword />
  }

  if (!user) {
    return <Login />
  }

  return <Dashboard user={user} onSignOut={signOut} />
}

function Dashboard({ user, onSignOut }) {
  const { progressionMap, status, loading, setDefiValue, resetArme, resetGlobal } = useProgression(user)
  const {
    overridesMap,
    loading: overridesLoading,
    saveOverride,
    resetOverride,
  } = useDefiOverrides(user)
  const [search, setSearch] = useState('')
  const [editMode, setEditMode] = useState(false)

  const categories = useMemo(
    () => applyOverrides(getCategories(), overridesMap),
    [overridesMap],
  )
  const globalProgress = useMemo(
    () => computeGlobalProgress(categories, progressionMap),
    [categories, progressionMap],
  )
  const nextMilestones = useMemo(
    () => computeNextMilestones(categories, progressionMap, 5),
    [categories, progressionMap],
  )

  const filteredCategories = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return categories
    return categories
      .map((categorie) => ({
        ...categorie,
        armes: categorie.armes.filter((arme) => arme.nom.toLowerCase().includes(term)),
      }))
      .filter((categorie) => categorie.armes.length > 0)
  }, [categories, search])

  function handleDefiChange(defiId, valeurCible, nouvelleValeur, contexte) {
    setDefiValue(defiId, valeurCible, nouvelleValeur, contexte)
  }

  const editing = {
    mode: editMode,
    overridesMap,
    onSave: saveOverride,
    onReset: resetOverride,
  }

  const isLoading = loading || overridesLoading

  return (
    <div className="min-h-screen bg-cod-bg pb-16">
      <Header
        search={search}
        onSearchChange={setSearch}
        globalProgress={globalProgress}
        syncStatus={isLoading ? 'syncing' : status}
        onResetGlobal={resetGlobal}
        userEmail={user.email}
        onSignOut={onSignOut}
        editMode={editMode}
        onToggleEditMode={() => setEditMode((v) => !v)}
      />

      <main className="max-w-3xl mx-auto px-4 pt-5">
        {isLoading ? (
          <p className="text-center text-gray-500 py-10">Chargement de votre progression...</p>
        ) : (
          <>
            <NextMilestones milestones={nextMilestones} />
            <CategoryList
              categories={filteredCategories}
              progressionMap={progressionMap}
              onDefiChange={handleDefiChange}
              onResetArme={resetArme}
              editing={editing}
            />
          </>
        )}
      </main>
    </div>
  )
}
