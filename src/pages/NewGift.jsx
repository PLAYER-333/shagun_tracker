import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { ArrowLeft, Plus } from 'lucide-react'
import useAppStore from '../store/useAppStore'

const GIFT_TYPES = [
  { value: 'cash', label: 'Cash' },
  { value: 'upi', label: 'UPI' },
  { value: 'gift_item', label: 'Gift Item' },
]

export default function NewGift() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const preselectedEvent = searchParams.get('event') || ''

  const { addGift, addPerson, events, people } = useAppStore()
  const [direction, setDirection] = useState('received')
  const [submitting, setSubmitting] = useState(false)
  const [showNewPerson, setShowNewPerson] = useState(false)
  const [newPersonName, setNewPersonName] = useState('')
  const [newPersonRel, setNewPersonRel] = useState('')
  const [addingPerson, setAddingPerson] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      event_id: preselectedEvent,
      gift_type: 'cash',
      gift_date: new Date().toISOString().split('T')[0],
    }
  })

  const handleAddPerson = async () => {
    if (!newPersonName.trim()) return
    setAddingPerson(true)
    await addPerson({ name: newPersonName.trim(), relationship: newPersonRel.trim() })
    setAddingPerson(false)
    setShowNewPerson(false)
    setNewPersonName('')
    setNewPersonRel('')
  }

  const onSubmit = async (data) => {
    if (!data.person_id) { alert('Please select a person'); return }
    if (!data.event_id) { alert('Please select an event'); return }
    setSubmitting(true)
    const { error } = await addGift({ ...data, direction, amount: Number(data.amount) })
    setSubmitting(false)
    if (!error) navigate(-1)
    else alert('Error saving gift: ' + error.message)
  }

  return (
    <div className="page" id="new-gift-page">
      <button className="back-btn" onClick={() => navigate(-1)} id="new-gift-back">
        <ArrowLeft size={16} /> Back
      </button>
      <h1 className="page-title" style={{ marginBottom: 24 }}>Add Gift</h1>

      <form onSubmit={handleSubmit(onSubmit)} id="new-gift-form">
        {/* Direction toggle */}
        <div className="form-group">
          <label className="form-label">Direction *</label>
          <div className="direction-toggle">
            <button
              type="button"
              id="direction-received"
              className={`direction-btn received${direction === 'received' ? ' active' : ''}`}
              onClick={() => setDirection('received')}
            >
              ↓ Received
            </button>
            <button
              type="button"
              id="direction-given"
              className={`direction-btn given${direction === 'given' ? ' active' : ''}`}
              onClick={() => setDirection('given')}
            >
              ↑ Given
            </button>
          </div>
          <div className="row-subtitle" style={{ marginTop: 6 }}>
            {direction === 'received' ? 'They gave money to us' : 'We gave money to them'}
          </div>
        </div>

        {/* Event */}
        <div className="form-group">
          <label className="form-label">Event *</label>
          <select id="new-gift-event" className="form-select" {...register('event_id', { required: true })}>
            <option value="">Select event…</option>
            {events.map(e => (
              <option key={e.id} value={e.id}>{e.title}</option>
            ))}
          </select>
        </div>

        {/* Person */}
        <div className="form-group">
          <label className="form-label">Person *</label>
          <select id="new-gift-person" className="form-select" {...register('person_id', { required: true })}>
            <option value="">Select person…</option>
            {people.map(p => (
              <option key={p.id} value={p.id}>{p.name} {p.relationship ? `(${p.relationship})` : ''}</option>
            ))}
          </select>
          <button
            type="button"
            id="new-gift-add-person-toggle"
            onClick={() => setShowNewPerson(v => !v)}
            style={{ fontSize: 13, color: '#1D9E75', background: 'none', border: 'none', cursor: 'pointer', marginTop: 6, padding: 0 }}
          >
            <Plus size={13} style={{ verticalAlign: 'middle' }} /> Add new person
          </button>
        </div>

        {/* Inline add person */}
        {showNewPerson && (
          <div style={{ background: '#f9f9f9', borderRadius: 10, padding: 14, marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>New Person</div>
            <input
              id="new-person-name"
              className="form-input"
              placeholder="Name *"
              value={newPersonName}
              onChange={e => setNewPersonName(e.target.value)}
              style={{ marginBottom: 8 }}
            />
            <input
              id="new-person-rel"
              className="form-input"
              placeholder="Relationship (e.g. mama, neighbour)"
              value={newPersonRel}
              onChange={e => setNewPersonRel(e.target.value)}
              style={{ marginBottom: 10 }}
            />
            <button
              type="button"
              id="new-person-save"
              className="btn-primary"
              style={{ fontSize: 13, padding: '8px 14px' }}
              onClick={handleAddPerson}
              disabled={addingPerson}
            >
              {addingPerson ? 'Adding…' : 'Add Person'}
            </button>
          </div>
        )}

        {/* Amount */}
        <div className="form-group">
          <label className="form-label">Amount (₹) *</label>
          <input
            id="new-gift-amount"
            type="number"
            className="form-input"
            placeholder="e.g. 1100"
            min="1"
            {...register('amount', { required: 'Amount is required', min: { value: 1, message: 'Must be > 0' } })}
          />
          {errors.amount && <div className="form-error">{errors.amount.message}</div>}
        </div>

        {/* Gift type */}
        <div className="form-group">
          <label className="form-label">Gift Type</label>
          <select id="new-gift-type" className="form-select" {...register('gift_type')}>
            {GIFT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>

        {/* Date */}
        <div className="form-group">
          <label className="form-label">Date</label>
          <input id="new-gift-date" type="date" className="form-input" {...register('gift_date')} />
        </div>

        {/* Notes */}
        <div className="form-group">
          <label className="form-label">Notes</label>
          <textarea
            id="new-gift-notes"
            className="form-textarea"
            rows={2}
            placeholder="Optional notes…"
            {...register('notes')}
          />
        </div>

        <button id="new-gift-submit" type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? 'Saving…' : 'Save Gift'}
        </button>
      </form>
    </div>
  )
}
