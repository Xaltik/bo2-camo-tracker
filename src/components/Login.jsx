import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const { signInWithPassword, signUpWithPassword, signInWithMagicLink, requestPasswordReset, authError } =
    useAuth()
  const [mode, setMode] = useState('password') // 'password' | 'magiclink'
  const [isSignUp, setIsSignUp] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [magicLinkSent, setMagicLinkSent] = useState(false)
  const [resetSent, setResetSent] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setMagicLinkSent(false)
    try {
      if (mode === 'magiclink') {
        const { error } = await signInWithMagicLink(email)
        if (!error) setMagicLinkSent(true)
      } else if (isSignUp) {
        await signUpWithPassword(email, password)
      } else {
        await signInWithPassword(email, password)
      }
    } finally {
      setSubmitting(false)
    }
  }

  async function handleForgotPassword(e) {
    e.preventDefault()
    setSubmitting(true)
    setResetSent(false)
    try {
      const { error } = await requestPasswordReset(email)
      if (!error) setResetSent(true)
    } finally {
      setSubmitting(false)
    }
  }

  if (showForgotPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cod-bg px-4">
        <div className="w-full max-w-sm bg-cod-panel border border-cod-border rounded-lg p-6 shadow-xl">
          <h1 className="text-xl font-bold tracking-wide text-cod-accent uppercase mb-1">
            Mot de passe oublié
          </h1>
          <p className="text-sm text-gray-400 mb-6">
            Recevez un email pour définir un nouveau mot de passe.
          </p>

          <form onSubmit={handleForgotPassword} className="space-y-3">
            <div>
              <label className="block text-xs uppercase tracking-wide text-gray-400 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-cod-panel2 border border-cod-border rounded px-3 py-2 text-sm focus:outline-none focus:border-cod-accent"
                placeholder="vous@exemple.com"
              />
            </div>

            {authError && <p className="text-sm text-red-400">{authError}</p>}
            {resetSent && (
              <p className="text-sm text-cod-accent">
                Email envoyé ! Suivez le lien reçu ({email}) pour définir un nouveau mot de passe.
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-cod-accent text-black font-semibold uppercase tracking-wide text-sm py-2 rounded hover:brightness-110 disabled:opacity-50"
            >
              {submitting ? 'Patientez...' : 'Envoyer le lien'}
            </button>
          </form>

          <button
            type="button"
            onClick={() => setShowForgotPassword(false)}
            className="mt-4 text-xs text-gray-400 hover:text-cod-accent underline"
          >
            Retour à la connexion
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cod-bg px-4">
      <div className="w-full max-w-sm bg-cod-panel border border-cod-border rounded-lg p-6 shadow-xl">
        <h1 className="text-xl font-bold tracking-wide text-cod-accent uppercase mb-1">
          BO2 Camo Tracker
        </h1>
        <p className="text-sm text-gray-400 mb-6">
          Connectez-vous pour synchroniser votre progression entre appareils.
        </p>

        <div className="flex mb-4 border border-cod-border rounded overflow-hidden text-sm">
          <button
            type="button"
            className={`flex-1 py-2 ${mode === 'password' ? 'bg-cod-accent text-black font-semibold' : 'bg-cod-panel2 text-gray-300'}`}
            onClick={() => setMode('password')}
          >
            Mot de passe
          </button>
          <button
            type="button"
            className={`flex-1 py-2 ${mode === 'magiclink' ? 'bg-cod-accent text-black font-semibold' : 'bg-cod-panel2 text-gray-300'}`}
            onClick={() => setMode('magiclink')}
          >
            Lien magique
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs uppercase tracking-wide text-gray-400 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-cod-panel2 border border-cod-border rounded px-3 py-2 text-sm focus:outline-none focus:border-cod-accent"
              placeholder="vous@exemple.com"
            />
          </div>

          {mode === 'password' && (
            <div>
              <label className="block text-xs uppercase tracking-wide text-gray-400 mb-1">
                Mot de passe
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-cod-panel2 border border-cod-border rounded px-3 py-2 text-sm focus:outline-none focus:border-cod-accent"
                placeholder="••••••••"
                minLength={6}
              />
            </div>
          )}

          {authError && <p className="text-sm text-red-400">{authError}</p>}
          {magicLinkSent && (
            <p className="text-sm text-cod-accent">
              Lien envoyé ! Vérifiez votre boîte mail ({email}).
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-cod-accent text-black font-semibold uppercase tracking-wide text-sm py-2 rounded hover:brightness-110 disabled:opacity-50"
          >
            {submitting
              ? 'Patientez...'
              : mode === 'magiclink'
                ? 'Recevoir le lien'
                : isSignUp
                  ? "Créer le compte"
                  : 'Se connecter'}
          </button>
        </form>

        {mode === 'password' && (
          <div className="mt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setIsSignUp((v) => !v)}
              className="text-xs text-gray-400 hover:text-cod-accent underline"
            >
              {isSignUp ? 'Déjà un compte ? Se connecter' : 'Pas de compte ? En créer un'}
            </button>
            {!isSignUp && (
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-xs text-gray-400 hover:text-cod-accent underline"
              >
                Mot de passe oublié ?
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
