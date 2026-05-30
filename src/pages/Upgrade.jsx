import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Check } from 'lucide-react'
import useAppStore from '../store/useAppStore'

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: '₹0',
    period: 'forever',
    features: ['Up to 3 events', 'Unlimited people', 'Basic tracking'],
    disabled: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '₹199',
    period: '/year',
    features: ['Unlimited events', 'Unlimited people', 'PDF & Excel export', 'Payment reminders', 'Suggested gift amounts'],
    featured: true,
    razorpayAmount: 19900, // in paise
  },
  {
    id: 'lifetime',
    name: 'Lifetime',
    price: '₹499',
    period: 'one-time',
    features: ['Everything in Pro', 'Lifetime access', 'All future features', 'Priority support'],
    razorpayAmount: 49900,
  },
]

export default function Upgrade() {
  const navigate = useNavigate()
  const { profile } = useAppStore()
  const [loading, setLoading] = useState(null)

  const handleUpgrade = (plan) => {
    if (plan.disabled) return
    setLoading(plan.id)

    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID
    if (!razorpayKey || razorpayKey === 'rzp_test_your_key_here') {
      alert('Razorpay key not configured. Add VITE_RAZORPAY_KEY_ID to your .env file.')
      setLoading(null)
      return
    }

    const options = {
      key: razorpayKey,
      amount: plan.razorpayAmount,
      currency: 'INR',
      name: 'Shagun',
      description: `${plan.name} Plan`,
      handler: function (response) {
        // In production, verify on server and update profile.plan via webhook
        alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}\n\nYour plan will be activated shortly.`)
        setLoading(null)
      },
      prefill: {
        name: profile?.full_name || '',
      },
      theme: { color: '#1D9E75' },
      modal: {
        ondismiss: () => setLoading(null),
      },
    }

    if (window.Razorpay) {
      const rzp = new window.Razorpay(options)
      rzp.open()
    } else {
      // Load Razorpay script dynamically
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => {
        const rzp = new window.Razorpay(options)
        rzp.open()
      }
      script.onerror = () => {
        alert('Failed to load payment gateway. Check your internet connection.')
        setLoading(null)
      }
      document.body.appendChild(script)
    }
  }

  const currentPlan = profile?.plan || 'free'

  return (
    <div className="page" id="upgrade-page">
      <button className="back-btn" onClick={() => navigate(-1)} id="upgrade-back">
        <ArrowLeft size={16} /> Back
      </button>

      <h1 className="page-title">Upgrade Shagun</h1>
      <p style={{ fontSize: 14, color: '#666', marginBottom: 24 }}>
        Unlock unlimited events, exports, and more.
      </p>

      {PLANS.map(plan => (
        <div
          key={plan.id}
          className={`pricing-card${plan.featured ? ' featured' : ''}`}
          id={`plan-${plan.id}`}
        >
          {plan.featured && <div className="pricing-badge">Most Popular</div>}

          <div className="pricing-plan">{plan.name}</div>
          <div className="pricing-price">
            {plan.price} <span>{plan.period}</span>
          </div>

          <ul className="pricing-features">
            {plan.features.map(f => (
              <li key={f}>{f}</li>
            ))}
          </ul>

          {currentPlan === plan.id ? (
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 6, padding: '12px', background: '#e8f7f2',
              borderRadius: 10, fontSize: 14, fontWeight: 600, color: '#1D9E75'
            }}>
              <Check size={16} /> Current Plan
            </div>
          ) : plan.disabled ? (
            <div style={{ fontSize: 13, color: '#aaa', textAlign: 'center', padding: 8 }}>
              Your current plan
            </div>
          ) : (
            <button
              id={`upgrade-btn-${plan.id}`}
              className={plan.featured ? 'btn-primary' : 'btn-outline'}
              onClick={() => handleUpgrade(plan)}
              disabled={loading === plan.id}
            >
              {loading === plan.id ? 'Opening…' : `Get ${plan.name} — ${plan.price}`}
            </button>
          )}
        </div>
      ))}

      <p style={{ fontSize: 12, color: '#bbb', textAlign: 'center', marginTop: 16 }}>
        Payments processed securely via Razorpay. No refunds for digital products.
      </p>
    </div>
  )
}
