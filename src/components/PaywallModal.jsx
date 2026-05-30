import { useNavigate } from 'react-router-dom'
import { X, Lock } from 'lucide-react'

export default function PaywallModal({ onClose }) {
  const navigate = useNavigate()

  return (
    <div className="modal-overlay" onClick={onClose} id="paywall-modal">
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />

        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14,
            background: '#e8f7f2', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 12px'
          }}>
            <Lock size={24} color="#1D9E75" />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Free plan limit reached</h2>
          <p style={{ fontSize: 14, color: '#666', lineHeight: 1.5 }}>
            You've used all 3 free events. Upgrade to Pro or Lifetime to track unlimited events.
          </p>
        </div>

        <div style={{ background: '#f9f9f9', borderRadius: 10, padding: 16, marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#333', marginBottom: 8 }}>What you get with Pro:</div>
          <ul style={{ listStyle: 'none', fontSize: 13, color: '#555' }}>
            <li style={{ padding: '3px 0' }}>✓ Unlimited events</li>
            <li style={{ padding: '3px 0' }}>✓ Export to PDF & Excel</li>
            <li style={{ padding: '3px 0' }}>✓ Payment reminders</li>
            <li style={{ padding: '3px 0' }}>✓ Suggested gift amounts</li>
          </ul>
        </div>

        <button
          id="paywall-upgrade-btn"
          className="btn-primary"
          style={{ marginBottom: 10 }}
          onClick={() => { onClose(); navigate('/upgrade') }}
        >
          Upgrade Now — ₹199/year
        </button>
        <button className="btn-secondary" onClick={onClose} id="paywall-close-btn">
          Maybe Later
        </button>
      </div>
    </div>
  )
}
