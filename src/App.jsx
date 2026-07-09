import { useMemo, useState } from 'react'
import { useAuth } from './context/AuthContext.jsx'
import { useProgression } from './hooks/useProgression.js'
import { getCategories, computeGlobalProgress } from './lib/weaponsUtils.js'
import Login from './components/Login.jsx'
import Header from './components/Header.jsx'
import CategoryList from './components/CategoryList.jsx'

export default function App() {
  const { user, loading: authLoading, signOut } = useAuth()

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cod-bg text-gray-400">
        Chargement...
      </div>
    )
  }

  if (!user) {
    return <Login />
  }

  return <Dashboard user={user} onSignOut={signOut} />
}

function Dashboard({ user, onSignOut }) {
  const { progressionMap, status, loading, setDefiValue, resetArme, resetGlobal } = useProgression(user)
  const [search, setSearch] = useState('')

  const categories = useMemo(() => getCategories(), [])
  const globalProgress = useMemo(() => computeGlobalProgress(progressionMap), [progressionMap])

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

  return (
    <div className="min-h-screen bg-cod-bg pb-16">
      <Header
        search={search}
        onSearchChange={setSearch}
        globalProgress={globalProgress}
        syncStatus={loading ? 'syncing' : status}
        onResetGlobal={resetGlobal}
        userEmail={user.email}
        onSignOut={onSignOut}
      />

      <main className="max-w-3xl mx-auto px-4 pt-5">
        {loading ? (
          <p className="text-center text-gray-500 py-10">Chargement de votre progression...</p>
        ) : (
          <CategoryList
            categories={filteredCategories}
            progressionMap={progressionMap}
            onDefiChange={handleDefiChange}
            onResetArme={resetArme}
          />
        )}
      </main>
    </div>
  )
}
