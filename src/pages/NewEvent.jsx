import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { ArrowLeft } from 'lucide-react'
import useAppStore from '../store/useAppStore'
import PaywallModal from '../components/PaywallModal'

const EVENT_TYPES = [
  { value: 'wedding', label: 'Wedding' },
  { value: 'mundan', label: 'Mundan' },
  { value: 'griha_pravesh', label: 'Griha Pravesh' },
  { value: 'funeral', label: 'Funeral / Antim Sanskar' },
  { value: 'other', label: 'Other' },
]

export default function NewEvent() {
  const navigate = useNavigate()
  const { addEvent, events, profile } = useAppStore()
  const [showPaywall, setShowPaywall] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { event_type: 'wedding' }
  })

  const onSubmit = async (data) => {
    // Paywall gate: free plan max 3 events
    if (profile?.plan === 'free' && events.length >= 3) {
      setShowPaywall(true)
      return
    }
    setSubmitting(true)
    const { error } = await addEvent(data)
    setSubmitting(false)
    if (!error) navigate('/events')
    else alert('Error saving event: ' + error.message)
  }

  return (
    <div className="page" id="new-event-page">
      <button className="back-btn" onClick={() => navigate(-1)} id="new-event-back">
        <ArrowLeft size={16} /> Back
      </button>
      <h1 className="page-title" style={{ marginBottom: 24 }}>New Event</h1>

      <form onSubmit={handleSubmit(onSubmit)} id="new-event-form">
        <div className="form-group">
          <label className="form-label">Event Name *</label>
          <input
            id="new-event-title"
            className="form-input"
            placeholder="e.g. Riya's Wedding"
            {...register('title', { required: 'Event name is required' })}
          />
          {errors.title && <div className="form-error">{errors.title.message}</div>}
        </div>

        <div className="form-group">
          <label className="form-label">Event Type</label>
          <select id="new-event-type" className="form-select" {...register('event_type')}>
            {EVENT_TYPES.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Date</label>
          <input
            id="new-event-date"
            type="date"
            className="form-input"
            {...register('event_date')}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Notes</label>
          <textarea
            id="new-event-notes"
            className="form-textarea"
            rows={3}
            placeholder="Optional notes about this event…"
            {...register('notes')}
          />
        </div>

        {/* Paywall notice for free users nearing limit */}
        {profile?.plan === 'free' && events.length >= 2 && (
          <div style={{ background: '#fff8e1', border: '1px solid #ffe082', borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 13, color: '#7a5c00' }}>
            ⚠️ You have {3 - events.length} event{3 - events.length !== 1 ? 's' : ''} left on the free plan.
          </div>
        )}

        <button
          id="new-event-submit"
          type="submit"
          className="btn-primary"
          disabled={submitting}
        >
          {submitting ? 'Saving…' : 'Save Event'}
        </button>
      </form>

      {showPaywall && <PaywallModal onClose={() => setShowPaywall(false)} />}
    </div>
  )
}
