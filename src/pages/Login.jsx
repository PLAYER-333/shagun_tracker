import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import useAppStore from '../store/useAppStore'
import { Gift, Mail } from 'lucide-react'

export default function Login() {
  const navigate = useNavigate()
  const user = useAppStore(s => s.user)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) navigate('/home', { replace: true })
  }, [user, navigate])

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/home',
      },
    })
  }

  const handleMagicLink = async (e) => {
    e.preventDefault()
    if (!email) return alert('Enter your email first!')
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin + '/home',
      }
    })
    setLoading(false)
    if (error) alert('Error: ' + error.message)
    else alert('Success! Check your email for a magical login link.')
  }

  return (
    <div className="login-page">
      <div className="login-logo">
        <Gift size={36} color="#fff" />
      </div>

      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: '#111' }}>Shagun</h1>
      <p style={{ fontSize: 15, color: '#666', textAlign: 'center', marginBottom: 30, lineHeight: 1.5 }}>
        Track gift reciprocity for your family.
      </p>

      <button
        id="login-google-btn"
        onClick={handleGoogleLogin}
        className="btn-primary"
        style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', marginBottom: 24 }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M19.6 10.23c0-.68-.06-1.36-.18-2H10v3.77h5.39a4.6 4.6 0 01-2 3.02v2.5h3.23c1.9-1.74 2.98-4.31 2.98-7.29z" fill="#4285F4"/>
          <path d="M10 20c2.7 0 4.97-.9 6.62-2.43l-3.23-2.5c-.9.6-2.04.96-3.39.96-2.6 0-4.81-1.76-5.6-4.12H1.07v2.57A10 10 0 0010 20z" fill="#34A853"/>
          <path d="M4.4 11.91A6.02 6.02 0 014.08 10c0-.66.11-1.3.32-1.91V5.52H1.07A10 10 0 000 10c0 1.61.39 3.14 1.07 4.48l3.33-2.57z" fill="#FBBC05"/>
          <path d="M10 3.98c1.47 0 2.79.51 3.83 1.5l2.86-2.86C14.96.99 12.7 0 10 0A10 10 0 001.07 5.52l3.33 2.57C5.19 5.73 7.4 3.98 10 3.98z" fill="#EA4335"/>
        </svg>
        Sign in with Google
      </button>

      <div style={{ width: '100%', height: 1, background: '#eee', marginBottom: 24, position: 'relative' }}>
        <span style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', background: '#fff', padding: '0 10px', fontSize: 13, color: '#aaa' }}>OR</span>
      </div>

      <form onSubmit={handleMagicLink} style={{ width: '100%' }}>
        <input 
          type="email" 
          className="form-input" 
          placeholder="your@email.com" 
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ marginBottom: 10 }}
        />
        <button type="submit" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <Mail size={18} /> {loading ? 'Sending...' : 'Send Magic Link'}
        </button>
      </form>

      <p style={{ fontSize: 12, color: '#bbb', marginTop: 32, textAlign: 'center' }}>
        Your data is private and visible only to you.
      </p>
    </div>
  )
}
