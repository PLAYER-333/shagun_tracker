import { useNavigate } from 'react-router-dom'
import { Plus, CalendarDays, Settings } from 'lucide-react'
import useAppStore from '../store/useAppStore'
import StatCard from '../components/StatCard'
import EventRow from '../components/EventRow'
import { overallTotals } from '../utils/balance'

export default function Home() {
  const { profile, events, gifts } = useAppStore()
  const navigate = useNavigate()
  const { totalReceived, totalGiven, net } = overallTotals(gifts)
  const recentEvents = events.slice(0, 5)

  return (
    <div className="page" id="home-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <div style={{ fontSize: 13, color: '#888' }}>Welcome back</div>
          <h1 className="page-title">{profile?.full_name || 'Your Family'}</h1>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            id="home-settings-btn"
            onClick={() => navigate('/settings')}
            style={{ background: 'none', border: '1px solid #eee', borderRadius: 8, padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <Settings size={18} color="#666" />
          </button>
          <button
            id="home-add-event-btn"
            className="btn-primary"
            style={{ width: 'auto', padding: '8px 14px', fontSize: 13 }}
            onClick={() => navigate('/events/new')}
          >
            <Plus size={16} /> Add Event
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
        <StatCard id="stat-received" label="Total Received" amount={totalReceived} color="green" />
        <StatCard id="stat-given" label="Total Given" amount={totalGiven} color="red" />
      </div>

      {/* Net */}
      <div className="net-balance" id="stat-net">
        <div className="net-balance-label">Net Balance</div>
        <div className={`net-balance-value ${net >= 0 ? 'green' : 'red'}`} style={{ color: net >= 0 ? '#1D9E75' : '#e53e3e' }}>
          {net >= 0 ? '+' : '−'}{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Math.abs(net))}
        </div>
        <div style={{ fontSize: 12, color: '#999', marginTop: 4 }}>
          {net > 0 ? 'net balance in your favour' : net < 0 ? 'you owe more than received' : 'all settled up'}
        </div>
      </div>

      {/* Recent events */}
      <div className="section-title">Recent Events</div>

      {recentEvents.length === 0 ? (
        <div className="empty-state">
          <CalendarDays size={40} />
          <div style={{ fontWeight: 600, marginBottom: 6 }}>No events yet</div>
          <div style={{ fontSize: 13 }}>Add your first event to get started</div>
          <button
            id="home-first-event-btn"
            className="btn-primary"
            style={{ marginTop: 16, width: 'auto', padding: '10px 20px' }}
            onClick={() => navigate('/events/new')}
          >
            <Plus size={16} /> Add Event
          </button>
        </div>
      ) : (
        <>
          {recentEvents.map(event => (
            <EventRow key={event.id} event={event} />
          ))}
          {events.length > 5 && (
            <button
              className="btn-secondary"
              style={{ marginTop: 4 }}
              onClick={() => navigate('/events')}
              id="home-view-all-events"
            >
              View all {events.length} events
            </button>
          )}
        </>
      )}
    </div>
  )
}
