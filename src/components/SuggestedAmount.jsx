import { useNavigate } from 'react-router-dom'
import { formatINR } from '../utils/formatters'
import { suggestedAmount } from '../utils/balance'
import useAppStore from '../store/useAppStore'
import { Lock, TrendingUp } from 'lucide-react'

export default function SuggestedAmount({ personId }) {
  const { gifts, profile } = useAppStore()
  const navigate = useNavigate()
  const isPro = profile?.plan === 'pro' || profile?.plan === 'lifetime'
  const suggested = suggestedAmount(gifts, personId)

  if (!isPro) {
    return (
      <div className="suggested-box locked" id="suggested-amount-locked">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <Lock size={16} color="#999" />
          <span style={{ fontSize: 13, fontWeight: 700, color: '#999' }}>Suggested Gift Amount</span>
          <span className="badge" style={{ background: '#f0f0f0', color: '#999' }}>Pro</span>
        </div>
        <p style={{ fontSize: 13, color: '#aaa', marginBottom: 10 }}>
          Get AI-powered suggested amounts based on past gifts and inflation.
        </p>
        <button
          className="btn-outline"
          style={{ fontSize: 13, padding: '8px 14px', width: 'auto' }}
          onClick={() => navigate('/upgrade')}
          id="suggested-upgrade-btn"
        >
          Upgrade to Pro
        </button>
      </div>
    )
  }

  if (suggested === null) {
    return (
      <div className="suggested-box" id="suggested-amount-none">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <TrendingUp size={16} color="#1D9E75" />
          <span style={{ fontSize: 13, fontWeight: 700, color: '#1D9E75' }}>Suggested Gift Amount</span>
        </div>
        <p style={{ fontSize: 13, color: '#555', marginTop: 4 }}>
          No previous gifts recorded. Add a gift to get suggestions.
        </p>
      </div>
    )
  }

  return (
    <div className="suggested-box" id="suggested-amount-value">
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <TrendingUp size={16} color="#1D9E75" />
        <span style={{ fontSize: 13, fontWeight: 700, color: '#1D9E75' }}>Suggested Gift Amount</span>
      </div>
      <div style={{ fontSize: 24, fontWeight: 800, color: '#111' }}>{formatINR(suggested)}</div>
      <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>
        Based on last gift · 10% annual adjustment
      </div>
    </div>
  )
}
