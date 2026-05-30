import useAppStore from '../store/useAppStore'
import { overallTotals, topGivers } from '../utils/balance'
import { formatINR } from '../utils/formatters'
import { BarChart2 } from 'lucide-react'

export default function Balance() {
  const { gifts, people } = useAppStore()
  const { totalReceived, totalGiven, net } = overallTotals(gifts)
  const givers = topGivers(gifts, people)

  const owesUs = net > 0

  return (
    <div className="page" id="balance-page">
      <div className="page-header">
        <h1 className="page-title">Balance</h1>
      </div>

      {/* Overall net */}
      <div className="net-balance" id="balance-net" style={{ marginBottom: 16 }}>
        <div className="net-balance-label">Overall Net Position</div>
        <div className="net-balance-value" style={{ color: net === 0 ? '#888' : owesUs ? '#1D9E75' : '#e53e3e' }}>
          {net === 0
            ? 'All Settled'
            : `${owesUs ? '+' : '−'}${formatINR(Math.abs(net))}`}
        </div>
        <div style={{ fontSize: 12, color: '#999', marginTop: 4 }}>
          {net > 0 ? 'net balance in your favour' : net < 0 ? 'you owe more than you received' : 'perfectly balanced'}
        </div>
      </div>

      {/* Received vs Given */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-label">Total Received</div>
          <div className="stat-value green">{formatINR(totalReceived)}</div>
          <div style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>
            {gifts.filter(g => g.direction === 'received').length} gifts
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Given</div>
          <div className="stat-value red">{formatINR(totalGiven)}</div>
          <div style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>
            {gifts.filter(g => g.direction === 'given').length} gifts
          </div>
        </div>
      </div>

      {/* Progress bar — given vs received */}
      {(totalReceived + totalGiven) > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#888', marginBottom: 6 }}>
            <span>Received</span>
            <span>Given</span>
          </div>
          <div style={{ height: 8, background: '#f0f0f0', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${Math.min((totalReceived / (totalReceived + totalGiven)) * 100, 100)}%`,
              background: '#1D9E75',
              borderRadius: 99,
              transition: 'width 0.3s'
            }} />
          </div>
        </div>
      )}

      {/* Top givers */}
      {givers.length > 0 && (
        <>
          <div className="section-title">Top Givers</div>
          {givers.map(({ person, amount }, i) => (
            <div key={person.id} className="row-card" style={{ cursor: 'default' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: i === 0 ? '#1D9E75' : '#eee',
                  color: i === 0 ? '#fff' : '#666',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700, flexShrink: 0
                }}>{i + 1}</div>
                <div>
                  <div className="row-title">{person.name}</div>
                  {person.relationship && <div className="row-subtitle">{person.relationship}</div>}
                </div>
              </div>
              <div className="row-amount received">{formatINR(amount)}</div>
            </div>
          ))}
        </>
      )}

      {gifts.length === 0 && (
        <div className="empty-state">
          <BarChart2 size={40} />
          <div style={{ fontWeight: 600, marginBottom: 6 }}>No data yet</div>
          <div style={{ fontSize: 13 }}>Add gifts to see your balance summary</div>
        </div>
      )}
    </div>
  )
}
