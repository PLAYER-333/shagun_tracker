import { useNavigate } from 'react-router-dom'
import { Plus, CalendarDays } from 'lucide-react'
import useAppStore from '../store/useAppStore'
import EventRow from '../components/EventRow'

export default function Events() {
  const { events } = useAppStore()
  const navigate = useNavigate()

  return (
    <div className="page" id="events-page">
      <div className="page-header">
        <h1 className="page-title">Events</h1>
        <button
          id="events-add-btn"
          className="btn-primary"
          style={{ width: 'auto', padding: '8px 14px', fontSize: 13 }}
          onClick={() => navigate('/events/new')}
        >
          <Plus size={16} /> New
        </button>
      </div>

      {events.length === 0 ? (
        <div className="empty-state">
          <CalendarDays size={40} />
          <div style={{ fontWeight: 600, marginBottom: 6 }}>No events yet</div>
          <div style={{ fontSize: 13 }}>Track weddings, mundans, griha pravesh and more</div>
          <button
            id="events-first-btn"
            className="btn-primary"
            style={{ marginTop: 16, width: 'auto', padding: '10px 20px' }}
            onClick={() => navigate('/events/new')}
          >
            <Plus size={16} /> Add First Event
          </button>
        </div>
      ) : (
        events.map(event => <EventRow key={event.id} event={event} />)
      )}
    </div>
  )
}
