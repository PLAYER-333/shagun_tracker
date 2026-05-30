import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import useAppStore from '../store/useAppStore'
import GiftRow from '../components/GiftRow'
import { formatDate, getEventTypeLabel } from '../utils/formatters'
import { formatINR } from '../utils/formatters'

export default function EventDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { events, gifts, people, deleteEvent } = useAppStore()

  const event = events.find(e => e.id === id)
  const eventGifts = gifts.filter(g => g.event_id === id)

  const totalReceived = eventGifts.filter(g => g.direction === 'received').reduce((s, g) => s + Number(g.amount), 0)
  const totalGiven = eventGifts.filter(g => g.direction === 'given').reduce((s, g) => s + Number(g.amount), 0)

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this event? All gifts recorded under it will also be deleted.')) {
      await deleteEvent(id)
      navigate('/events', { replace: true })
    }
  }

  if (!event) {
    return (
      <div className="page">
        <button className="back-btn" onClick={() => navigate('/events')}><ArrowLeft size={16} /> Back</button>
        <p style={{ color: '#888' }}>Event not found.</p>
      </div>
    )
  }

  return (
    <div className="page" id="event-detail-page">
      <button className="back-btn" onClick={() => navigate('/events')} id="event-detail-back">
        <ArrowLeft size={16} /> Events
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <h1 className="page-title" style={{ marginBottom: 4 }}>{event.title}</h1>
          <div>
            <span className="badge badge-event">{getEventTypeLabel(event.event_type)}</span>
            <span style={{ fontSize: 13, color: '#888', marginLeft: 8 }}>{formatDate(event.event_date)}</span>
          </div>
        </div>
        <button 
          onClick={handleDelete}
          style={{ background: '#ffeeee', border: 'none', color: '#e53e3e', padding: '8px', cursor: 'pointer', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          title="Delete Event"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Summary */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-label">Received</div>
          <div className="stat-value green">{formatINR(totalReceived)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Given</div>
          <div className="stat-value red">{formatINR(totalGiven)}</div>
        </div>
      </div>

      {/* Add gift button */}
      <button
        id="event-add-gift-btn"
        className="btn-primary"
        style={{ marginBottom: 20 }}
        onClick={() => navigate(`/gifts/new?event=${id}`)}
      >
        <Plus size={16} /> Add Gift
      </button>

      <div className="section-title">Gifts ({eventGifts.length})</div>

      {eventGifts.length === 0 ? (
        <div className="empty-state">
          <div style={{ fontWeight: 600, marginBottom: 6 }}>No gifts recorded</div>
          <div style={{ fontSize: 13 }}>Add the first gift for this event</div>
        </div>
      ) : (
        eventGifts.map(gift => {
          const person = people.find(p => p.id === gift.person_id)
          return (
            <GiftRow
              key={gift.id}
              gift={gift}
              personName={person?.name || 'Unknown'}
            />
          )
        })
      )}
    </div>
  )
}
