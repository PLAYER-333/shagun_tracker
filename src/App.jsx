import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import useAppStore from './store/useAppStore'
import { isConfigured } from './supabaseClient'

import Login from './pages/Login'
import Home from './pages/Home'
import Events from './pages/Events'
import EventDetail from './pages/EventDetail'
import NewEvent from './pages/NewEvent'
import NewGift from './pages/NewGift'
import People from './pages/People'
import PersonDetail from './pages/PersonDetail'
import Balance from './pages/Balance'
import Upgrade from './pages/Upgrade'
import Settings from './pages/Settings'
import BottomNav from './components/BottomNav'

function ProtectedRoute({ children }) {
  const { user, initialized } = useAppStore()
  if (!initialized) {
    return (
      <div className="app-container" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#1D9E75', fontWeight: 600 }}>Loading…</div>
      </div>
    )
  }
  if (!user) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  const initAuth = useAppStore(s => s.initAuth)

  useEffect(() => {
    if (isConfigured) initAuth()
  }, [initAuth])

  // Show setup screen if .env is not filled in yet
  if (!isConfigured) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: 24, fontFamily: 'system-ui, sans-serif',
        background: '#fff', maxWidth: 420, margin: '0 auto'
      }}>
        <div style={{
          width: 64, height: 64, background: '#1D9E75', borderRadius: 16,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 32, marginBottom: 20
        }}>🎁</div>
        <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Shagun Setup</h1>
        <p style={{ fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 28, lineHeight: 1.6 }}>
          Your <strong>.env</strong> file needs Supabase keys before the app can run.
        </p>
        <div style={{ background: '#f5f5f5', borderRadius: 10, padding: 16, width: '100%', marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#555', marginBottom: 10 }}>📋 Steps to get started:</div>
          <ol style={{ fontSize: 13, color: '#444', lineHeight: 2, paddingLeft: 18 }}>
            <li>Create a project at <strong>supabase.com</strong></li>
            <li>Run <code style={{ background: '#eee', padding: '1px 5px', borderRadius: 4 }}>supabase/schema.sql</code> in SQL Editor</li>
            <li>Enable Google OAuth in Supabase Auth settings</li>
            <li>Open <code style={{ background: '#eee', padding: '1px 5px', borderRadius: 4 }}>.env</code> and fill in your keys</li>
            <li>Restart the dev server</li>
          </ol>
        </div>
        <div style={{ background: '#1a1a2e', borderRadius: 10, padding: 14, width: '100%', fontSize: 12, color: '#7fdbca', fontFamily: 'monospace', lineHeight: 1.8 }}>
          <div style={{ color: '#888', marginBottom: 4 }}># .env</div>
          <div>VITE_SUPABASE_URL=https://xxxx.supabase.co</div>
          <div>VITE_SUPABASE_ANON_KEY=eyJ...</div>
          <div>VITE_RAZORPAY_KEY_ID=rzp_test_xxxx</div>
        </div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <div className="app-container">
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />

          {/* Protected */}
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
          <Route path="/events/new" element={<ProtectedRoute><NewEvent /></ProtectedRoute>} />
          <Route path="/events/:id" element={<ProtectedRoute><EventDetail /></ProtectedRoute>} />
          <Route path="/gifts/new" element={<ProtectedRoute><NewGift /></ProtectedRoute>} />
          <Route path="/people" element={<ProtectedRoute><People /></ProtectedRoute>} />
          <Route path="/people/:id" element={<ProtectedRoute><PersonDetail /></ProtectedRoute>} />
          <Route path="/balance" element={<ProtectedRoute><Balance /></ProtectedRoute>} />
          <Route path="/upgrade" element={<ProtectedRoute><Upgrade /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>

        {/* Bottom nav shown on main tabs only */}
        <BottomNavConditional />
      </div>
    </BrowserRouter>
  )
}

function BottomNavConditional() {
  const { user } = useAppStore()
  if (!user) return null
  return <BottomNav />
}
