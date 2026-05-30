import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, Crown } from 'lucide-react'
import useAppStore from '../store/useAppStore'

export default function Settings() {
  const navigate = useNavigate()
  const { profile, updateProfile, signOut } = useAppStore()
  const [fullName, setFullName] = useState(profile?.full_name || '')
  const [familyName, setFamilyName] = useState(profile?.family_name || '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    await updateProfile({ full_name: fullName, family_name: familyName })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/login', { replace: true })
  }

  const planLabel = {
    free: 'Free Plan',
    pro: 'Pro Plan',
    lifetime: 'Lifetime Plan',
  }[profile?.plan || 'free']

  const isPro = profile?.plan === 'pro' || profile?.plan === 'lifetime'

  return (
    <div className="page" id="settings-page">
      <h1 className="page-title" style={{ marginBottom: 24 }}>Settings</h1>

      {/* Plan badge */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: isPro ? '#e8f7f2' : '#f9f9f9',
        borderRadius: 10, padding: '12px 14px', marginBottom: 24,
        border: isPro ? '1px solid #b2dfd0' : '1px solid #eee'
      }} id="settings-plan-info">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {isPro && <Crown size={16} color="#1D9E75" />}
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: isPro ? '#1D9E75' : '#333' }}>{planLabel}</div>
            {profile?.plan_expires_at && (
              <div style={{ fontSize: 12, color: '#888' }}>
                Expires {new Date(profile.plan_expires_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </div>
            )}
          </div>
        </div>
        {!isPro && (
          <button
            id="settings-upgrade-btn"
            className="btn-outline"
            style={{ width: 'auto', padding: '6px 12px', fontSize: 13 }}
            onClick={() => navigate('/upgrade')}
          >
            Upgrade
          </button>
        )}
      </div>

      {/* Profile form */}
      <div className="section-title" style={{ marginTop: 0 }}>Profile</div>

      <div className="form-group">
        <label className="form-label">Your Name</label>
        <input
          id="settings-full-name"
          className="form-input"
          placeholder="e.g. Ramesh Sharma"
          value={fullName}
          onChange={e => setFullName(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Family Name</label>
        <input
          id="settings-family-name"
          className="form-input"
          placeholder="e.g. Sharma family"
          value={familyName}
          onChange={e => setFamilyName(e.target.value)}
        />
      </div>

      <button
        id="settings-save-btn"
        className="btn-primary"
        onClick={handleSave}
        disabled={saving}
        style={{ marginBottom: 32 }}
      >
        {saving ? 'Saving…' : saved ? '✓ Saved!' : 'Save Changes'}
      </button>

      {/* Sign out */}
      <div className="section-title">Account</div>
      <button
        id="settings-signout-btn"
        className="btn-secondary"
        onClick={handleSignOut}
        style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#e53e3e' }}
      >
        <LogOut size={16} /> Sign Out
      </button>

      <div style={{ fontSize: 12, color: '#ccc', textAlign: 'center', marginTop: 40 }}>
        Shagun v1.0 · Built with ❤️ for Indian families
      </div>
    </div>
  )
}
