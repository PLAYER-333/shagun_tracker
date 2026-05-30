import { Link } from 'react-router-dom'
import { formatDate, getEventTypeLabel } from '../utils/formatters'
import { ChevronRight } from 'lucide-react'

export default function EventRow({ event }) {
  return (
    <Link to={`/events/${event.id}`} className="row-card" id={`event-row-${event.id}`}>
      <div>
        <div className="row-title">{event.title}</div>
        <div className="row-subtitle">
          <span className="badge badge-event">{getEventTypeLabel(event.event_type)}</span>
          {' '}{formatDate(event.event_date)}
        </div>
      </div>
      <ChevronRight size={16} color="#ccc" />
    </Link>
  )
}
