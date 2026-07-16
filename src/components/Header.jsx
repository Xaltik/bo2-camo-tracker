import { useState } from 'react'
import ProgressBar from './ProgressBar.jsx'
import ConfirmModal from './ConfirmModal.jsx'

const STATUS_LABEL = {
  idle: 'En attente',
  syncing: 'Synchronisation...',
  synced: 'Synchronisé',
  error: 'Erreur de synchronisation',
}

const STATUS_DOT = {
  idle: 'bg-gray-500',
  syncing: 'bg-yellow-400 animate-pulse',
  synced: 'bg-cod-accent',
  error: 'bg-red-500',
}

export default function Header({
  search,
  onSearchChange,
  globalProgress,
  syncStatus,
  onResetGlobal,
  userEmail,
  onSignOut,
  editMode,
  onToggleEditMode,
}) {
  const [confirmOpen, setConfirmOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 bg-cod-bg/95 backdrop-blur border-b border-cod-border px-4 py-3">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div>
            <h1 className="text-lg font-bold uppercase tracking-wide text-cod-accent leading-tight">
              BO2 Camo Tracker
            </h1>
            <p className="text-xs text-gray-500 truncate max-w-[180px]">{userEmail}</p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <span className={`w-2 h-2 rounded-full ${STATUS_DOT[syncStatus] ?? STATUS_DOT.idle}`} />
              {STATUS_LABEL[syncStatus] ?? STATUS_LABEL.idle}
            </div>
            <button
              type="button"
              onClick={onSignOut}
              className="text-xs text-gray-400 hover:text-red-400 underline"
            >
              Déconnexion
            </button>
          </div>
        </div>

        <div className="mb-3">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>Progression globale</span>
            <span>
              {globalProgress.debloques}/{globalProgress.total} ({globalProgress.pourcentage}%)
            </span>
          </div>
          <ProgressBar pourcentage={globalProgress.pourcentage} height="h-2.5" />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Rechercher une arme..."
            className="flex-1 bg-cod-panel2 border border-cod-border rounded px-3 py-2 text-sm focus:outline-none focus:border-cod-accent"
          />
          <button
            type="button"
            onClick={onToggleEditMode}
            className={`text-xs rounded px-2 py-2 border whitespace-nowrap ${
              editMode
                ? 'bg-cod-accent text-black font-semibold border-cod-accent'
                : 'text-gray-400 border-cod-border hover:bg-cod-panel2'
            }`}
            title="Activer/désactiver l'édition des défis"
          >
            ✎ Édition
          </button>
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            className="text-xs text-red-400 hover:text-red-300 underline whitespace-nowrap px-1"
          >
            Reset global
          </button>
        </div>
      </div>

      <ConfirmModal
        open={confirmOpen}
        title="Réinitialiser toute la progression ?"
        message="Toutes les armes et tous les camouflages seront remis à zéro sur tous vos appareils. Cette action est irréversible."
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          onResetGlobal()
          setConfirmOpen(false)
        }}
      />
    </header>
  )
}
