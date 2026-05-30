import { Link } from 'react-router-dom'
import { formatINR } from '../utils/formatters'
import { ChevronRight } from 'lucide-react'

export default function PersonRow({ person, net }) {
  const owesUs = net > 0
  const weOweThem = net < 0

  return (
    <Link to={`/people/${person.id}`} className="row-card" id={`person-row-${person.id}`}>
      <div>
        <div className="row-title">{person.name}</div>
        <div className="row-subtitle">{person.relationship || 'No relationship set'}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ textAlign: 'right' }}>
          {net === 0 ? (
            <div className="row-amount" style={{ color: '#888' }}>Settled</div>
          ) : (
            <>
              <div className={`row-amount ${owesUs ? 'received' : 'given'}`}>
                {owesUs ? '+' : '−'}{formatINR(Math.abs(net))}
              </div>
              <div className="row-subtitle">
                {owesUs ? 'they owe us' : 'we owe them'}
              </div>
            </>
          )}
        </div>
        <ChevronRight size={16} color="#ccc" />
      </div>
    </Link>
  )
}
