import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus } from 'lucide-react'
import useAppStore from '../store/useAppStore'
import GiftRow from '../components/GiftRow'
import SuggestedAmount from '../components/SuggestedAmount'
import { netBalance } from '../utils/balance'
import { formatINR } from '../utils/formatters'

export default function PersonDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { people, gifts, events } = useAppStore()

  const person = people.find(p => p.id === id)
  const personGifts = gifts.filter(g => g.person_id === id)
  const net = netBalance(gifts, id)
  const owesUs = net > 0

  if (!person) {
    return (
      <div className="page">
        <button className="back-btn" onClick={() => navigate('/people')}><ArrowLeft size={16} /> Back</button>
        <p style={{ color: '#888' }}>Person not found.</p>
      </div>
    )
  }

  return (
    <div className="page" id="person-detail-page">
      <button className="back-btn" onClick={() => navigate('/people')} id="person-detail-back">
        <ArrowLeft size={16} /> People
      </button>

      <h1 className="page-title">{person.name}</h1>
      {person.relationship && (
        <div style={{ fontSize: 13, color: '#888', marginBottom: 16 }}>{person.relationship}</div>
      )}

      {/* Net balance */}
      <div className="net-balance" id="person-net-balance">
        <div className="net-balance-label">Net Balance</div>
        <div className="net-balance-value" style={{ color: net === 0 ? '#888' : owesUs ? '#1D9E75' : '#e53e3e' }}>
          {net === 0
            ? 'Settled'
            : `${owesUs ? '+' : '−'}${formatINR(Math.abs(net))}`}
        </div>
        <div style={{ fontSize: 12, color: '#999', marginTop: 4 }}>
          {net > 0 ? 'they owe us' : net < 0 ? 'we owe them' : 'all square'}
        </div>
      </div>

      {/* Suggested amount (Pro) */}
      <SuggestedAmount personId={id} />

      {/* Add gift button */}
      <button
        id="person-add-gift-btn"
        className="btn-primary"
        style={{ marginBottom: 20 }}
        onClick={() => navigate(`/gifts/new`)}
      >
        <Plus size={16} /> Add Gift
      </button>

      <div className="section-title">Gift History ({personGifts.length})</div>

      {personGifts.length === 0 ? (
        <div className="empty-state">
          <div style={{ fontWeight: 600, marginBottom: 6 }}>No gifts recorded</div>
          <div style={{ fontSize: 13 }}>Add a gift to start tracking</div>
        </div>
      ) : (
        personGifts.map(gift => {
          const event = events.find(e => e.id === gift.event_id)
          return (
            <GiftRow
              key={gift.id}
              gift={gift}
              eventTitle={event?.title}
            />
          )
        })
      )}
    </div>
  )
}
