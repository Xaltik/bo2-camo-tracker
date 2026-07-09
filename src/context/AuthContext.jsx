import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(undefined) // undefined = chargement initial
  const [authError, setAuthError] = useState(null)
  const [passwordRecovery, setPasswordRecovery] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (event === 'PASSWORD_RECOVERY') setPasswordRecovery(true)
      setSession(newSession)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  async function signInWithPassword(email, password) {
    setAuthError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setAuthError(error.message)
    return { error }
  }

  async function signUpWithPassword(email, password) {
    setAuthError(null)
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) setAuthError(error.message)
    return { error }
  }

  async function signInWithMagicLink(email) {
    setAuthError(null)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    })
    if (error) setAuthError(error.message)
    return { error }
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  async function requestPasswordReset(email) {
    setAuthError(null)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    })
    if (error) setAuthError(error.message)
    return { error }
  }

  async function updatePassword(newPassword) {
    setAuthError(null)
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (!error) setPasswordRecovery(false)
    if (error) setAuthError(error.message)
    return { error }
  }

  const value = {
    session,
    user: session?.user ?? null,
    loading: session === undefined,
    authError,
    passwordRecovery,
    signInWithPassword,
    signUpWithPassword,
    signInWithMagicLink,
    signOut,
    requestPasswordReset,
    updatePassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth doit être utilisé dans AuthProvider')
  return ctx
}
