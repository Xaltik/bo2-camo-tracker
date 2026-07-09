import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'

export default function ResetPassword() {
  const { updatePassword, authError } = useAuth()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [localError, setLocalError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setLocalError(null)
    if (password !== confirm) {
      setLocalError('Les deux mots de passe ne correspondent pas.')
      return
    }
    if (password.length < 6) {
      setLocalError('Le mot de passe doit faire au moins 6 caractères.')
      return
    }
    setSubmitting(true)
    try {
      await updatePassword(password)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cod-bg px-4">
      <div className="w-full max-w-sm bg-cod-panel border border-cod-border rounded-lg p-6 shadow-xl">
        <h1 className="text-xl font-bold tracking-wide text-cod-accent uppercase mb-1">
          Nouveau mot de passe
        </h1>
        <p className="text-sm text-gray-400 mb-6">
          Choisissez un nouveau mot de passe pour votre compte.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs uppercase tracking-wide text-gray-400 mb-1">
              Nouveau mot de passe
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-cod-panel2 border border-cod-border rounded px-3 py-2 text-sm focus:outline-none focus:border-cod-accent"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wide text-gray-400 mb-1">
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full bg-cod-panel2 border border-cod-border rounded px-3 py-2 text-sm focus:outline-none focus:border-cod-accent"
              placeholder="••••••••"
            />
          </div>

          {(localError || authError) && (
            <p className="text-sm text-red-400">{localError || authError}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-cod-accent text-black font-semibold uppercase tracking-wide text-sm py-2 rounded hover:brightness-110 disabled:opacity-50"
          >
            {submitting ? 'Patientez...' : 'Enregistrer le mot de passe'}
          </button>
        </form>
      </div>
    </div>
  )
}
